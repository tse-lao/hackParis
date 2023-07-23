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
    let worldId = "0x719683F13Eeea7D84fCBa5d7d17Bf82e03E3d260"
    let _appId = "app_17dda298a99fac82b669a6da6405db74"
    let _actionId = "worldcoin-human-soulbound-token"
    const worldcoinSoulboundToken = await WorldcoinSoulboundToken.deploy(worldId, _appId, _actionId)

    await worldcoinSoulboundToken.deployed()

    console.log("worldcoinSoulboundToken address is  :", worldcoinSoulboundToken.address)

    // const WorldcoinSoulboundTokenInstance = WorldcoinSoulboundToken.attach("0xCEe0625a373BA897a54E2971f7aE627E32308c13")

    // let tx = await WorldcoinSoulboundTokenInstance.ownerOf(0)
    // console.log(tx)
}