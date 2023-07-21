import goerliFormABI from "./abi/goerli/form.json";

const CONTRACTS = {
  goerli: {
    FORM: "0x3074394e41FBa1b790767A229dD497e40B63A090",
  },
  mumbai: {
    FORM: "",
  },
};

const ABI = {
  goerli: {
    form: goerliFormABI,
  },
};
export { ABI, CONTRACTS };
