// app.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Web3 = require("web3");
const path = require("path");
const fs = require("fs");

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Web3 configuration
const web3Provider = process.env.ETHEREUM_PROVIDER || "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(web3Provider));

// Contract configuration
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = JSON.parse(fs.readFileSync("/shared/VotingABI.json"));
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

// Admin account (the account that deployed the contract)
let adminAccount;

// Initialize
async function init() {
  try {
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    adminAccount = accounts[0]; // First account is the admin

    console.log("Connected to Ethereum provider:", web3Provider);
    console.log("Admin account:", adminAccount);
    console.log("Contract address:", contractAddress);

    // Set default account for transactions
    web3.eth.defaultAccount = adminAccount;
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

// API Routes

// Get election info
app.get("/api/election", async (req, res) => {
  try {
    const electionName = await votingContract.methods.electionName().call();
    const votingOpen = await votingContract.methods.votingOpen().call();
    const candidatesCount = await votingContract.methods
      .candidatesCount()
      .call();
    const votersCount = await votingContract.methods.votersCount().call();

    res.json({
      electionName,
      votingOpen,
      candidatesCount,
      votersCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all candidates
app.get("/api/candidates", async (req, res) => {
  try {
    const candidatesCount = await votingContract.methods
      .candidatesCount()
      .call();
    const candidates = [];

    for (let i = 1; i <= candidatesCount; i++) {
      const candidate = await votingContract.methods
        .getCandidateDetails(i)
        .call();
      candidates.push({
        id: candidate.id,
        name: candidate.name,
        info: candidate.info,
        voteCount: candidate.voteCount,
      });
    }

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new candidate (admin only)
app.post("/api/candidates", async (req, res) => {
  try {
    const { name, info } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Candidate name is required" });
    }

    const receipt = await votingContract.methods
      .addCandidate(name, info || "")
      .send({
        from: adminAccount,
        gas: 3000000,
      });

    res.json({
      success: true,
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register a voter (admin only)
app.post("/api/voters", async (req, res) => {
  try {
    const { voterAddress } = req.body;

    if (!voterAddress) {
      return res.status(400).json({ error: "Voter address is required" });
    }

    const receipt = await votingContract.methods
      .registerVoter(voterAddress)
      .send({
        from: adminAccount,
        gas: 3000000,
      });

    res.json({
      success: true,
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cast a vote
app.post("/api/vote", async (req, res) => {
  try {
    const { candidateId, voterAddress } = req.body;

    if (!candidateId || !voterAddress) {
      return res
        .status(400)
        .json({ error: "Candidate ID and voter address are required" });
    }

    // Check if voter is registered
    const voter = await votingContract.methods.voters(voterAddress).call();
    if (!voter.isRegistered) {
      return res.status(403).json({ error: "Voter is not registered" });
    }

    // Check if voter has already voted
    if (voter.hasVoted) {
      return res.status(403).json({ error: "Voter has already cast a vote" });
    }

    // Cast the vote
    const receipt = await votingContract.methods.vote(candidateId).send({
      from: voterAddress,
      gas: 3000000,
    });

    res.json({
      success: true,
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Open/close voting (admin only)
app.post("/api/voting-status", async (req, res) => {
  try {
    const { votingOpen } = req.body;

    if (typeof votingOpen !== "boolean") {
      return res
        .status(400)
        .json({ error: "votingOpen parameter must be a boolean" });
    }

    const receipt = await votingContract.methods
      .setVotingStatus(votingOpen)
      .send({
        from: adminAccount,
        gas: 3000000,
      });

    res.json({
      success: true,
      transactionHash: receipt.transactionHash,
      votingOpen,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get election results
app.get("/api/results", async (req, res) => {
  try {
    // Check if there are any candidates
    const candidatesCount = await votingContract.methods
      .candidatesCount()
      .call();

    if (candidatesCount === "0") {
      return res.json({ message: "No candidates registered yet" });
    }

    // Get all candidates and their votes
    const candidates = [];
    for (let i = 1; i <= candidatesCount; i++) {
      const candidate = await votingContract.methods
        .getCandidateDetails(i)
        .call();
      candidates.push({
        id: candidate.id,
        name: candidate.name,
        voteCount: candidate.voteCount,
      });
    }

    // Sort by vote count (descending)
    candidates.sort((a, b) => b.voteCount - a.voteCount);

    // Try to get the winner
    let winner;
    try {
      winner = await votingContract.methods.getWinner().call();
    } catch (error) {
      // If no votes cast yet, the getWinner function will revert
      winner = null;
    }

    res.json({
      candidates,
      winner: winner
        ? {
            id: winner.winnerId,
            name: winner.winnerName,
            voteCount: winner.winnerVotes,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, async () => {
  console.log(`Server running on port ${PORT} and host ${HOST}`);
  await init();
});
