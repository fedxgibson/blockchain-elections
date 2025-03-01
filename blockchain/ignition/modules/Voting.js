// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingModule", (m) => {
  // Define the parameter for the election name with a default value
  const electionName = m.getParameter("electionName", "Default Election");

  // Deploy the Voting contract with the election name
  const voting = m.contract("Voting", [electionName]);

  return { Voting: voting };
});
