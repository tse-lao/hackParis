"use client"
import Steps from "@/components/custom/steps/Steps";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { Form } from "../types";
import ContributeFinish from "./ContributeFinish";
import ContributionAccess from "./ContributionAccess";
import ContributionForm from "./ContributionForm";

const steps = [
    { id: 0, name: 'Access' },
    { id: 1, name: 'Contribution Form' },
    { id: 2, name: 'Finish' },
];



interface ContributePageProps {
  data: Form;
}

const ContributePage: FC<ContributePageProps> = ({data}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [proof, setProof] = useState("");
    const [formData, setFormData] = useState<any>({});
    const [transactionHash, setTransactionHash] = useState("");
    const {address} = useAccount();
    const [isContributor, setIsContributor] = useState(false);

    // Check if the current user is a contributor whenever 'data' or 'address' changes
    useEffect(() => {
        if(data.contributions.length == 0) return;
        setIsContributor(data.contributions.some(contribution => contribution.contributor === address?.toLowerCase()));
        if(data.formAdmin == address?.toLowerCase()) {
            setIsContributor(true);
        }
    }, [data, address]);

   


    const handleNextStep = useCallback((step: number) => {
      if(step > 0 && !proof) {
        toast.success("You need to provide a proof to continue");
        return; 
      }
      setActiveStep(step);
    }, [proof]);
    
    const handleProof = useCallback((proof: string) => {
      setProof(proof);
      console.log(proof);
    }, []);
  
    const handleData = useCallback((formResult: any) => {
      setFormData(formResult);
      uploadForm(formResult);
    }, []);
    
    const uploadForm = async (formResult: any) => {
        console.log(formResult)

    }

    
    
    const CurrentStepComponent = useMemo(() => {
      switch (activeStep) {
        case 0:
          return <ContributionAccess getProof={handleProof} nextStep={handleNextStep} />;
        case 1:
          return <ContributionForm dataForm={data.formCID} submitData={handleData} />;
        case 2:
          return <ContributeFinish data={data} />;
        default:
          return <ContributionAccess getProof={handleProof} nextStep={handleNextStep} />;
      }
    }, [activeStep, handleProof, handleNextStep, handleData, data]);
    

    


    if(isContributor) {return <ContributeFinish data={data} />}
  

    return ( 
        <>  
        <div className="flex flex-col justify-center items-center ">
          <h1 className="flex justify-center m-x-12 text-2xl rounded-md p-4">
            {data.name}
          </h1>
        <div>
        <Steps steps={steps} activeStep={activeStep} nextStep={handleNextStep} />
        </div>
        <div className="md:w-[600px] sm:w-[400px] lg:w-[600px] mt-8">
            {CurrentStepComponent}
        </div>
      </div>
        </>
    );
}
 
export default ContributePage;