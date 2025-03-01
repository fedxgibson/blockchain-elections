const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const VotingModule = require("../ignition/modules/Voting");

async function main() {
  console.log("Deploying Voting contract with Ignition...");

  try {
    // Deploy the Voting contract using Ignition
    const deployment = await hre.ignition.deploy(VotingModule, {
      parameters: { electionName: "Docker Blockchain Election" },
    });

    // Retrieve the deployed contract instance
    const votingContract = deployment.Voting;
    if (!votingContract) {
      throw new Error(
        "Voting contract deployment failed or not found in artifacts."
      );
    }

    console.log(
      "Voting contract deployed to:",
      await votingContract.getAddress()
    );

    // Save the contract address to a file
    fs.writeFileSync(
      path.join("/shared", "contract-address.txt"),
      await votingContract.getAddress()
    );
    // Read the contract artifact file
    const contractArtifact = require("../artifacts/contracts/Voting.sol/Voting.json");

    // Extract just the ABI
    const contractABI = JSON.stringify(contractArtifact.abi, null, 2);

    // Write it to the shared volume
    fs.writeFileSync(path.join("/shared", "VotingABI.json"), contractABI);
    console.log("Contract address saved to contract-address.txt");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
