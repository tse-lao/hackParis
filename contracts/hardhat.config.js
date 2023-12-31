require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
    /** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
                // details: { yul: false },
            },
        },
    },
    // defaultNetwork: "goerli",
    defaultNetwork: "mumbai",

    networks: {
        goerli: {
            chainId: 5,
            url: "https://rpc.ankr.com/eth_goerli",
            accounts: [PRIVATE_KEY],
        },
        mumbai: {
            chainId: 80001,
            url: `https://polygon-mumbai.g.alchemy.com/v2/ZiPX0JtXnVqQ56RGdvdy8mvCOs4ZDchO`,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: "JYMKRTHHFUSX4X11I1NQRNW6X7K2FJFJUU",
        // apiKey: "KNVT7KRT9B15Z5UTXZT8TG8HNMIJXWXRMY",

        customChains: [],
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}