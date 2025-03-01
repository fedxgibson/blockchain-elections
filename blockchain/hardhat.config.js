require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  sourcify: {
    enabled: true,
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local Hardhat network that runs inside Docker
    docker: {
      url: "http://localhost:8545",
      // These are the default hardhat accounts - no private key needed
      // They come pre-funded with test ETH
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
      chainId: 31337, // Default Hardhat Network chainId
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1,
    },
    // You can uncomment this if you need it later
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    //   // Use environment variable for private key if needed
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    // }
  },
  // // Define the project's file structure
  // paths: {
  //   sources: "./contracts",
  //   tests: "./test",
  //   cache: "./cache",
  //   artifacts: "./artifacts",
  //   ignition: {
  //     modules: "./ignition/modules",
  //     deployments: "./ignition/deployments",
  //   },
  // },
  // For tests and scripts
  mocha: {
    timeout: 40000,
  },
  // Useful for gas reporting if needed
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
  },
};
