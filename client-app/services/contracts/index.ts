import { Address } from "viem";
import goerliFormABI from "./abi/goerli/form.json";
import mumbaiFormABI from "./abi/mumbai/formv2.json";
import voteFormABI from "./abi/mumbai/voteForm.json";

import worldABI from "./abi/mumbai/worldcoin.json";

const CONTRACTS = {
  goerli: {
    FORM: "0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7" as Address,
    
  },
  mumbai: {
    form: "0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7" as Address,
    formV2: "0xAED60986c79c32977859d7d2D96f7bF8b299872D" as Address,
    //worldcoin: "0x8d6308ac8d34088587ef345736389ee915e2a9da" as Address,
    worldcoin: "0x65f0eFc3AB80CBe23EDD22c9Ba6cec0bb85440a2" as Address,
    voteForm: "0x95F59D962432b44c2BcbcE1cfa7B514c78e03CB4" as Address,
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