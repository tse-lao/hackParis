import { Address } from "viem";
import goerliFormABI from "./abi/goerli/form.json";
import voteFormABI from "./abi/mumbai/voteForm.json";
import worldABI from "./abi/mumbai/worldcoin.json";

const CONTRACTS = {
  goerli: {
    FORM: "0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7" as Address,
    
  },
  mumbai: {
    form: "0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7" as Address,
    worldcoin: "0xCEe0625a373BA897a54E2971f7aE627E32308c13" as Address,
    voteForm: "" as Address,
  },
};

const ABI = {
  goerli: {
    form: goerliFormABI,
  },
  mumbai: {
    form: goerliFormABI,
    worldcoin: worldABI,
    voteForm: voteFormABI,
  },
};
export { ABI, CONTRACTS };
