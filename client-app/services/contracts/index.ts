import { Address } from "viem";
import goerliFormABI from "./abi/goerli/form.json";
import voteFormABI from "./abi/mumbai/voteForm.json";
import mumbaiFormABI from "./abi/mumbai/formv2.json";

import worldABI from "./abi/mumbai/worldcoin.json";

const CONTRACTS = {
  goerli: {
    FORM: "0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7" as Address,
    
  },
  mumbai: {
    form: "0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7" as Address,
    formV2: "0x407e7f38571D4772C84AAa40BF56d9850059Daa6" as Address,
    worldcoin: "0xCEe0625a373BA897a54E2971f7aE627E32308c13" as Address,
    voteForm: "0x41bD4839ca2180282d35e7b01CDFeEDB16EEefB8" as Address,
  },
};

const ABI = {
  goerli: {
    form: goerliFormABI,
  },
  mumbai: {
    form: goerliFormABI,
    formV2: mumbaiFormABI,
    worldcoin: worldABI,
    voteForm: voteFormABI,
  },
};
export { ABI, CONTRACTS };
