"use client"
import Steps from "@/components/custom/steps/Steps";
import { ABI, CONTRACTS } from "@/services/contracts";
import { getLighthouseKeys } from "@/services/lighthouse";
import axios from "axios";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { Form } from "../types";
import ContributeFinish from "./ContributeFinish";
import ContributionAccess from "./ContributionAccess";
import ContributionForm from "./ContributionForm";

const steps = [
    { id: 0, name: 'Access' },
    { id: 1, name: 'Contribution Form' },
];

interface ContributePageProps {
  data: Form;
}

const ContributePage: FC<ContributePageProps> = ({data}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [proof, setProof] = useState("");
    const [formData, setFormData] = useState<any>({});
    const {address} = useAccount();
    const [isContributor, setIsContributor] = useState(false);
    const { data:claims, isLoading } = useContractRead({
        address: CONTRACTS.mumbai.form,
        abi: ABI.mumbai.form,
        functionName: 'formRequiredClaims',
        args: [data.formID]
    });
    const {write: contributeForm, isError, error} = useContractWrite({
        address: CONTRACTS.mumbai.form,
        abi: ABI.mumbai.form,
        functionName: 'formContribution',
        });
        

    useEffect(() => {
        if(data.contributions.length == 0) return;
        setIsContributor(data.contributions.some(contribution => contribution.contributor === address?.toLowerCase()));
        if(data.formAdmin == address?.toLowerCase()) {
            setIsContributor(true);
        }
    }, [data, address]);

   
    useEffect(() => {
        if(isError) {
            toast.error(error?.message);
        }
        
    }, [isError, error]);

    const handleNextStep = useCallback((step: number) => {
      if(step > 0 && !proof) {
        toast.success("You need to provide a proof to continue");
        return; 
      }
      setActiveStep(step);
    }, [proof]);
    
    const handleProof = useCallback((proof: string) => {
    if(!proof) return;
      setProof(proof);
      console.log(proof);
      
      
    }, []);
  
    const handleData = useCallback((formResult: any) => {
      setFormData(formResult);
      uploadForm(formResult);
    }, []);
    
    const uploadForm = async (formResult: any) => {
        if(!address) return;
        const {JWT, apiKey} = await getLighthouseKeys(address);
        
        if(!JWT || !apiKey) return;
        
        let json = JSON.stringify(formResult);
        
        const formData = {
          json: json,
          address: address,
          apiKey: apiKey, 
          tokenID: data.formID
        } 
    
        const config = {
          headers: {
            'Authorization': `${JWT}`, 
            'Content-Type': 'application/json'
          }
        };
    
        try {
          const response = await axios.post("http://localhost:4000/files/uploadContribution", formData, config);
          contribute(response.data)
        } catch (err) {
            console.log(err)
          toast.error("something went wrong. when uploading the file")
        }
  
      }
      
      const contribute = async (cid: string) => {
        console.log(proof);
        if(!proof){
          
            toast.error("You need to have a proof stored before you can upload")
            return;
        }
        
        
        console.log(data.formID, cid)

            contributeForm({
              args: [data.formID,proof,cid],
            });
            
            toast.success("Succesfully contributed to the form");
      }

    
    
    const CurrentStepComponent = useMemo(() => {
      switch (activeStep) {
        case 0:
          return <ContributionAccess getProof={handleProof} nextStep={handleNextStep} claims={claims} />;
        case 1:
          return <ContributionForm form={data.form} submitData={handleData} />;
        case 2:
          return <ContributeFinish data={data} />;
        default:
          return <ContributionAccess getProof={handleProof} nextStep={handleNextStep} claims={claims} />;
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
            {isLoading ? <div>
                loading
            </div> : CurrentStepComponent }

        </div>
      </div>
        </>
    );
}
 
export default ContributePage;