require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { ethers } = require("hardhat")
const { Console } = require("console")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async({ deployments }) => {
    const { deploy } = deployments
    console.log("Wallet+ Ethereum Address:", wallet.address)

    // const WorldcoinSoulboundToken = await hre.ethers.getContractFactory("WorldcoinSoulboundToken");
    // let worldId = "0x8d6308aC8d34088587Ef345736389Ee915e2A9dA"
    // let _appId = "app_staging_00ab13dfdd4a83b0fd94b11b3a81a29e"
    // let _actionId = "WHST"
    // const worldcoinSoulboundToken = await WorldcoinSoulboundToken.deploy(worldId, _appId, _actionId)

    // await worldcoinSoulboundToken.deployed()

    // console.log("worldcoinSoulboundToken address is  :", worldcoinSoulboundToken.address)

    // const WorldcoinSoulboundTokenInstance = WorldcoinSoulboundToken.attach("0xCEe0625a373BA897a54E2971f7aE627E32308c13")

    // let tx = await WorldcoinSoulboundTokenInstance.ownerOf(0)
    // console.log(tx)
}