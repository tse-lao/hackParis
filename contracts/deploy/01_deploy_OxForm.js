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

    const OxForm = await hre.ethers.getContractFactory("OxForm")

    // const oxForm = await OxForm.deploy(sismoGlobalVerifier.address, sender.address)
    const oxForm = await OxForm.deploy(
        "0x9A84aA1594F6EFd15bb93BC75b958AaC0AEcFe05",
        "0x2Eb638C8d78673A14322aBE1d0317AD32F3f5249"
    )

    await oxForm.deployed()

    console.log("oxForm  :", oxForm.address)

    let mintPrice = 1
    let submissionReward = 1
    let formCID = "CIDDDD"
    let name = "name"
    let category = "category"
    let formMetadataCID = "formMetadataCID"
    let formAdmin = "0x044B595C9b94A17Adc489bD29696af40ccb3E4d2"
    let EventMetadata = [formCID, name, category, formMetadataCID, formAdmin, "true"]

    const OxFormInstance = OxForm.attach(oxForm.address)
        // const OxFormInstance = OxForm.attach("0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7")

    let tx = await OxFormInstance.formRequest(mintPrice, submissionReward, true, EventMetadata, [], {
        value: 10,
        gasLimit: 10000000,
    })

    receipt = await tx.wait()

    console.log("Form request Created")

    let sismoProof = "0x"

    tx = await OxFormInstance.formContribution(1, sismoProof, "dataCID", {
        gasLimit: 10000000,
    })

    receipt = await tx.wait()

    console.log("Contribution Made ")

    //Minting the form with ID = 1

    tx = await OxFormInstance.mint(1, { value: 1, gasLimit: 100000 })
    receipt = await tx.wait()

    console.log("Minted succesfully")
}