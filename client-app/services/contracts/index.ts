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
    formV2: "0xAED60986c79c32977859d7d2D96f7bF8b299872D" as Address,
    worldcoin: "0xCEe0625a373BA897a54E2971f7aE627E32308c13" as Address,
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
