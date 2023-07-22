import { Address } from "viem";
import goerliFormABI from "./abi/goerli/form.json";

const CONTRACTS = {
  goerli: {
    FORM: "0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7" as Address,
  },
  mumbai: {
    form: "0x1c510a3439d01E066b5C30A3A882A5DC1A1B98F7" as Address,
  },
};

const ABI = {
  goerli: {
    form: goerliFormABI,
  },
  mumbai: {
    form: goerliFormABI,
  },
};
export { ABI, CONTRACTS };
