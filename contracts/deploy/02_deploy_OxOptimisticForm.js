require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { ethers } = require("hardhat")
const { Console } = require("console")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async({ deployments }) => {
    const { deploy } = deployments
    console.log("Wallet+ Ethereum Address:", wallet.address)

    // const Sender = await hre.ethers.getContractFactory("sender")

    // const sender = await Sender.deploy()
    // await sender.deployed()

    // console.log("sender  :", sender.address)

    // const SismoGlobalVerifier = await hre.ethers.getContractFactory("sismoGlobalVerifier")
    // let appId = "0x54c31943e929a55cbd8da2251dd3bc08"
    // const sismoGlobalVerifier = await SismoGlobalVerifier.deploy(appId)
    // await sismoGlobalVerifier.deployed()

    // console.log("sismoGlobalVerifier  :", sismoGlobalVerifier.address)

    const OxOptimisticForm = await hre.ethers.getContractFactory("OxOptimisticForm")

    // const oxOptimisticForm = await OxOptimisticForm.deploy(sismoGlobalVerifier.address, optimticOracleV3Mumbai, sender.address)
    const oxOptimisticForm = await OxOptimisticForm.deploy(
        "0x9A84aA1594F6EFd15bb93BC75b958AaC0AEcFe05", "0x2Eb638C8d78673A14322aBE1d0317AD32F3f5249"
    )

    await oxOptimisticForm.deployed()
    console.log("oxOptimisticForm deployed in address : ", oxOptimisticForm.address)

    const OxFormEscalationManager = await hre.ethers.getContractFactory("OxFormEscalationManager")

    const oxFormEscalationManager = await OxFormEscalationManager.deploy(oxOptimisticForm.address)
    await oxFormEscalationManager.deployed()
    console.log("oxFormEscalationManager  :", oxFormEscalationManager.address)
    let oxFormEscalationManagerInstance = OxFormEscalationManager.attach(
        oxFormEscalationManager.address
    )
    tx = await oxFormEscalationManagerInstance.configureEscalationManager(
        true,
        true,
        true,
        true,
        false
    )
    await tx.wait()
    console.log("EscalationManager configured")
    const oxOptimisticFormInstance = OxOptimisticForm.attach(oxOptimisticForm.address)

    tx = await oxOptimisticFormInstance.setEscalationManager(oxFormEscalationManager.address)
    await tx.wait()
    console.log("EscalationManager setted on oxOptimisticForm contract")

    // let RequestDetails = [
    //     "category",
    //     1,
    //     0,
    //     1,
    //     60, []
    // ]
    // tx = await oxOptimisticFormInstance.optimisticFormRequest("dataFormatCID", "requestName", "requestDescription", RequestDetails, [], [wallet.address], { gasLimit: 10000000 })
    // let receipt = await tx.wait()
    // console.log("Request successfull")

    // tx = await oxOptimisticFormInstance.assertContribution(1, "dataCID", 1, "0x", { gasLimit: 10000000 })
    // receipt = await tx.wait()

    // let assertions = await oxOptimisticFormInstance.getAssertions(1)
    // console.log(assertions)

    // tx = await oxOptimisticFormInstance.disputeAssertion(assertions[0], { gasLimit: 10000000 })
    // receipt = await tx.wait()
    // console.log("Assertion disputed:", assertions[0])

    // tx = await oxOptimisticFormInstance.voteOnAssertionResolution(true, assertions[0], { gasLimit: 10000000 })
    // receipt = await tx.wait()

    // tx = await oxOptimisticFormInstance.assertContribution(1, "dataCID", 1, "0x", { gasLimit: 10000000 })
    // receipt = await tx.wait()
    // tx = await oxOptimisticFormInstance.assertContribution(1, "dataCID", 1, "0x", { gasLimit: 10000000 })
    // receipt = await tx.wait()
    // tx = await oxOptimisticFormInstance.assertContribution(1, "dataCID", 1, "0x", { gasLimit: 10000000 })
    // receipt = await tx.wait()
    // tx = await oxOptimisticFormInstance.assertContribution(1, "dataCID", 1, "0x", { gasLimit: 10000000 })
    // receipt = await tx.wait()
    // tx = await oxOptimisticFormInstance.assertDataset(1, "dataCID", 1, wallet.address, { gasLimit: 10000000 })
    // receipt = await tx.wait()

    // console.log("Contribution assertion Made succesfully")

    // let voted = await oxOptimisticFormInstance.assertionVotingPhase(assertions[0])
    // console.log(voted)

    // await sleep(60000);

    // tx = await oxOptimisticFormInstance.settleAssertions(1, { gasLimit: 10000000 })
    // await tx.wait()

    // tx = await oxOptimisticFormInstance.mint(1, { value: 1 })
    // receipt = await tx.wait()

    // function sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }
}