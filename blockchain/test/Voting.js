// test/Voting.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Voting Contract", function () {
  // Define a fixture to reuse the same setup in different tests
  async function deployVotingFixture() {
    const [admin, voter1, voter2, voter3] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy("Test Election");

    return { voting, admin, voter1, voter2, voter3 };
  }

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const { voting, admin } = await loadFixture(deployVotingFixture);
      expect(await voting.admin()).to.equal(admin.address);
    });

    it("Should set the election name correctly", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      expect(await voting.electionName()).to.equal("Test Election");
    });

    it("Should initialize with voting closed", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      expect(await voting.votingOpen()).to.equal(false);
    });
  });

  describe("Candidate Management", function () {
    it("Should allow admin to add candidates", async function () {
      const { voting, admin } = await loadFixture(deployVotingFixture);

      await voting.connect(admin).addCandidate("Alice", "Candidate 1");
      await voting.connect(admin).addCandidate("Bob", "Candidate 2");

      expect(await voting.candidatesCount()).to.equal(2);

      const candidate1 = await voting.getCandidateDetails(1);
      expect(candidate1.name).to.equal("Alice");
      expect(candidate1.info).to.equal("Candidate 1");

      const candidate2 = await voting.getCandidateDetails(2);
      expect(candidate2.name).to.equal("Bob");
      expect(candidate2.info).to.equal("Candidate 2");
    });

    it("Should not allow non-admin to add candidates", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);

      await expect(
        voting.connect(voter1).addCandidate("Charlie", "Candidate 3")
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });

  describe("Voter Registration", function () {
    it("Should allow admin to register voters", async function () {
      const { voting, admin, voter1, voter2 } = await loadFixture(deployVotingFixture);

      await voting.connect(admin).registerVoter(voter1.address);
      await voting.connect(admin).registerVoter(voter2.address);

      expect(await voting.votersCount()).to.equal(2);

      const voter1Data = await voting.voters(voter1.address);
      expect(voter1Data.isRegistered).to.equal(true);
      expect(voter1Data.hasVoted).to.equal(false);

      const voter2Data = await voting.voters(voter2.address);
      expect(voter2Data.isRegistered).to.equal(true);
      expect(voter2Data.hasVoted).to.equal(false);
    });

    it("Should not allow non-admin to register voters", async function () {
      const { voting, voter1, voter2 } = await loadFixture(deployVotingFixture);

      await expect(
        voting.connect(voter1).registerVoter(voter2.address)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not allow registering the same voter twice", async function () {
      const { voting, admin, voter1 } = await loadFixture(deployVotingFixture);

      await voting.connect(admin).registerVoter(voter1.address);

      await expect(
        voting.connect(admin).registerVoter(voter1.address)
      ).to.be.revertedWith("Voter is already registered");
    });
  });

  describe("Voting Process", function () {
    it("Should allow registered voters to vote when voting is open", async function () {
      const { voting, admin, voter1, voter2 } = await loadFixture(deployVotingFixture);

      // Setup
      await voting.connect(admin).addCandidate("Alice", "Candidate 1");
      await voting.connect(admin).addCandidate("Bob", "Candidate 2");
      await voting.connect(admin).registerVoter(voter1.address);
      await voting.connect(admin).registerVoter(voter2.address);
      await voting.connect(admin).setVotingStatus(true);

      // Vote
      await voting.connect(voter1).vote(1); // Vote for Alice
      await voting.connect(voter2).vote(2); // Vote for Bob

      // Verification
      const candidate1 = await voting.getCandidateDetails(1);
      expect(candidate1.voteCount).to.equal(1);

      const candidate2 = await voting.getCandidateDetails(2);
      expect(candidate2.voteCount).to.equal(1);

      const voter1Data = await voting.voters(voter1.address);
      expect(voter1Data.hasVoted).to.equal(true);
      expect(voter1Data.votedCandidateId).to.equal(1);

      const voter2Data = await voting.voters(voter2.address);
      expect(voter2Data.hasVoted).to.equal(true);
      expect(voter2Data.votedCandidateId).to.equal(2);
    });

    it("Should not allow voting when voting is closed", async function () {
      const { voting, admin, voter1 } = await loadFixture(deployVotingFixture);

      // Setup
      await voting.connect(admin).addCandidate("Alice", "Candidate 1");
      await voting.connect(admin).registerVoter(voter1.address);
      // Note: not opening voting

      // Attempt to vote
      await expect(
        voting.connect(voter1).vote(1)
      ).to.be.revertedWith("Voting is not open");
    });

    it("Should not allow unregistered voters to vote", async function () {
      const { voting, admin, voter1, voter2 } = await loadFixture(deployVotingFixture);

      // Setup
      await voting.connect(admin).addCandidate("Alice", "Candidate 1");
      await voting.connect(admin).registerVoter(voter1.address);
      await voting.connect(admin).setVotingStatus(true);

      // Attempt to vote with unregistered voter
      await expect(
        voting.connect(voter2).vote(1)
      ).to.be.revertedWith("You are not registered to vote");
    });

    it("Should not allow voting for invalid candidate", async function () {
      const { voting, admin, voter1 } = await loadFixture(deployVotingFixture);

      // Setup
      await voting.connect(admin).addCandidate("Alice", "Candidate 1");
      await voting.connect(admin).registerVoter(voter1.address);
      await voting.connect(admin).setVotingStatus(true);

      // Attempt to vote for invalid candidate
      await expect(
        voting.connect(voter1).vote(2) // Candidate 2 doesn't exist
      ).to.be.revertedWith("Invalid candidate");
    });

    it("Should not allow voting twice", async function () {
      const { voting, admin, voter1 } = await loadFixture(deployVotingFixture);

      // Setup
      await voting.connect(admin).addCandidate("Alice", "Candidate 1");
      await voting.connect(admin).registerVoter(voter1.address);
      await voting.connect(admin).setVotingStatus(true);

      // First vote
      await voting.connect(voter1).vote(1);

      // Attempt to vote again
      await expect(
        voting.connect(voter1).vote(1)
      ).to.be.revertedWith("You have already voted");
    });
  });

  describe("Results", function () {
    it("Should correctly identify the winner", async function () {
      const { voting, admin, voter1, voter2, voter3 } = await loadFixture(deployVotingFixture);

      // Setup
      await voting.connect(admin).addCandidate("Alice", "Candidate 1");
      await voting.connect(admin).addCandidate("Bob", "Candidate 2");
      await voting.connect(admin).registerVoter(voter1.address);
      await voting.connect(admin).registerVoter(voter2.address);
      await voting.connect(admin).registerVoter(voter3.address);
      await voting.connect(admin).setVotingStatus(true);

      // Voting
      await voting.connect(voter1).vote(1); // Alice
      await voting.connect(voter2).vote(2); // Bob
      await voting.connect(voter3).vote(1); // Alice

      // Check winner
      const winner = await voting.getWinner();
      expect(winner.winnerId).to.equal(1);
      expect(winner.winnerName).to.equal("Alice");
      expect(winner.winnerVotes).to.equal(2);
    });

    it("Should revert if trying to get winner with no candidates", async function () {
      const { voting } = await loadFixture(deployVotingFixture);

      await expect(
        voting.getWinner()
      ).to.be.revertedWith("No candidates registered");
    });

    it("Should revert if trying to get winner with no votes", async function () {
      const { voting, admin } = await loadFixture(deployVotingFixture);

      await voting.connect(admin).addCandidate("Alice", "Candidate 1");

      await expect(
        voting.getWinner()
      ).to.be.revertedWith("No votes cast yet");
    });
  });

  describe("Events", function() {
    it("Should emit events correctly", async function () {
      const { voting, admin, voter1 } = await loadFixture(deployVotingFixture);

      // CandidateAdded event
      await expect(voting.connect(admin).addCandidate("Alice", "Candidate 1"))
        .to.emit(voting, "CandidateAdded")
        .withArgs(1, "Alice");

      // VoterRegistered event
      await expect(voting.connect(admin).registerVoter(voter1.address))
        .to.emit(voting, "VoterRegistered")
        .withArgs(voter1.address);

      // VotingStatusChange event
      await expect(voting.connect(admin).setVotingStatus(true))
        .to.emit(voting, "VotingStatusChange")
        .withArgs(true);

      // VoteCast event
      await expect(voting.connect(voter1).vote(1))
        .to.emit(voting, "VoteCast")
        .withArgs(voter1.address, 1);
    });
  });
});
