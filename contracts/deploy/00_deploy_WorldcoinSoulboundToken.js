require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { ethers } = require("hardhat")
const { Console } = require("console")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async({ deployments }) => {
    const { deploy } = deployments
    console.log("Wallet+ Ethereum Address:", wallet.address)
    const WorldcoinSoulboundToken = await hre.ethers.getContractFactory("WorldcoinSoulboundToken");
    let worldId = "worldcoinAddress"
    let _appId = "appID"
    let _actionId = "ACTION_ID"
    const worldcoinSoulboundToken = await WorldcoinSoulboundToken.deploy(worldId, _appId, _actionId)

    await worldcoinSoulboundToken.deployed()

    console.log("worldcoinSoulboundToken address is  :", worldcoinSoulboundToken.address)

}