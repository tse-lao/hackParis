"use client";
import { ABI, CONTRACTS } from "@/services/contracts";
import { getLighthouseKeys } from "@/services/lighthouse";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import ContributeFinish from "./ContributeFinish";
import ContributionAccess from "./ContributionAccess";
import ContributionForm from "./ContributionForm";

const steps = [
  { id: 0, name: "Access" },
  { id: 1, name: "Contribution Form" },
];

interface ContributePageProps {
  data: any;
}

const ContributePage: FC<ContributePageProps> = ({ data }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [proof, setProof] = useState("");
  const [formData, setFormData] = useState<any>({});
  const { address } = useAccount();
  const [isContributor, setIsContributor] = useState(false);
  const { data: sismoClaims, isLoading } = useContractRead({
    address: CONTRACTS.mumbai.voteForm,
    abi: ABI.mumbai.voteForm,
    functionName: "getFormClaims",
    args: [data.formID],
  });

  const { write: contributeForm, isSuccess } = useContractWrite({
    address: CONTRACTS.mumbai.voteForm,
    abi: ABI.mumbai.voteForm,
    functionName: "assertContribution",
  });

  useEffect(() => {
    if (data.creator == address?.toLowerCase()) {
      setIsContributor(true);
    }
    if (data.contributions.length == 0) return;
    setIsContributor(
      data.contributions.some(
        (contribution: any) =>
          contribution.contributor === address?.toLowerCase()
      )
    );
  }, [data, address]);

  const handleNextStep = useCallback(
    (step: number) => {
      if (proof) {
        setActiveStep(1);
      }
    },
    [proof]
  );

  const getProof = useCallback((sismoProof:any) => {
      if (!sismoProof) return;
      setProof(sismoProof);
    },[]);

  const handleData = useCallback((formResult: any) => {
   
    const uploadForm = async (formResult: any) => {
      if (!address) return;
      const { JWT, apiKey } = await getLighthouseKeys(address);
  
      if (!JWT || !apiKey) return;
  
      let json = JSON.stringify(formResult);
  
      const formData = {
        json: json,
        address: address,
        apiKey: apiKey,
        tokenID: data.formID,
      };
  
      const config = {
        headers: {
          Authorization: `${JWT}`,
          "Content-Type": "application/json",
        },
      };
  
      try {
        const response = await axios.post(
          "http://localhost:4000/files/uploadContribution",
          formData,
          config
        );
        contribute(response.data);
      } catch (err) {
        console.log(err);
        toast.error("something went wrong. when uploading the file");
      }
    };
    
  
    
    const contribute = async (cid: string) => {
      console.log(proof);
      if (!proof) {
        toast.error("You need to have a proof stored before you can upload");
        return;
      }
  
      console.log(data.formID, cid);
  
      contributeForm({
        args: [data.formID, cid, 2, proof],
      });
  
      toast.success("Succesfully contributed to the form");
    };
    setFormData(formResult);
    uploadForm(formResult);
  }, [address, data.formID, contributeForm, proof]);

 

  const CurrentStepComponent = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <ContributionAccess
            getProof={getProof}
            nextStep={handleNextStep}
            claims={sismoClaims}
          />
        );
      case 1:
        return (
          <ContributionForm form={data.formElements} submitData={handleData} />
        );
      case 2:
        return <ContributeFinish data={data} />;
    }
  }, [activeStep, handleNextStep, sismoClaims, data, handleData, getProof]);

  if (isContributor) {
    return <ContributeFinish data={data} />;
  }

  console.log(sismoClaims);
  if (isSuccess) return <div>Thanks for contirbuting...</div>;
  return (
    <>
      <div className="flex flex-col justify-center items-center ">
        <Image
          src={`https://ipfs.io/ipfs/${data.banner}`}
          alt="Picture of the author"
          width={600}
          height={100}
        />
        <h1 className="flex justify-center m-x-12 text-2xl rounded-md p-4">
          {data.requestName}
        </h1>
        <Link href={`/profile/${data.creator}`}>{data.creator}</Link>
        <div className="md:w-[600px] sm:w-[400px] lg:w-[600px] mt-8">
          {isLoading ? <div>loading</div> : CurrentStepComponent}
        </div>
      </div>
    </>
  );
};

export default ContributePage;
