import goerliFormABI from "./abi/goerli/form.json";

const CONTRACTS = {
  goerli: {
    FORM: "0xe29369e7020354Bf49A90ca491f92Df26Fe2c50E",
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
