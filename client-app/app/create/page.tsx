"use client"
import FormDetails from "@/components/custom/form/FormDetails";
import FormLayout from "@/components/custom/form/FormLayout";
import UploadBanner from "@/components/custom/form/UploadBanner";
import UserRequirements from "@/components/custom/sismo/UserRequirements";
import Steps from "@/components/custom/steps/Steps";
import { Button } from "@/components/ui/button";
import { ABI, CONTRACTS } from "@/services/contracts";
import { storeFile } from "@/services/useNFTStorage";
import { ClaimRequest } from "@sismo-core/sismo-connect-react";

import { useState } from "react";
import { toast } from "react-toastify";
import { useContractWrite } from "wagmi";

export default function CreateForm() {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        groups: [] as ClaimRequest,
        banner: "",
    });
    const [formElements, setFormElements] = useState<any[]>([]);
    const [image, setImage]  = useState("");
    const [groups, setGroups] = useState<any[]>();
    const { write:formRequest } = useContractWrite({
        address: CONTRACTS.goerli.forms,
        abi: ABI.goerli.forms,
        functionName: 'formRequest',
    });
    
    const nextStep = (step: number) => {
        console.log(step)
        setActiveStep(step);
    }
    
    const submitForm = async() => {
        //make sure we can submit form here.. 
        console.log(formData)
        console.log(formElements)
        let imageCID = "";
        if(image == ""){
            toast.error("Please upload a banner image");
        }
        
        await toast.promise(storeFile(image), {
            pending: 'Uploading your banner to ipfs...',
            success: 'Succesfully uploaded your banner!',
            error: 'Something went wrong..',
        }).then(
            (result) => {
                imageCID = result as string;
                console.log(result);
            });
        
        let cid = "";
        await toast.promise(storeFile(JSON.stringify({formDetail: formData, formElements:formElements, banner: imageCID})), {
            pending: 'Uploading to IPFS...',
            success: 'Uploaded to IPFS!',
            error: 'Failed to upload to IPFS',
        }).then(
            (result) => {
                cid = result as string;
                console.log(result);
                const category = "test"
                const metadata = [
                    result, formData.name, category
                ]
                formRequest({
                    args: [mintPrice, submissionReward, metadata, formData.groups]
                })
            });
        
    }
    
    
    const saveForm = (data: any) => {
        console.log(data);
        setFormData(data);
 
    }
    
    function addElement(element:any){
        setFormElements([...formElements, element]);
    }
    function removeElement(id:string){
        let newElements = formElements.filter((element:any) => element.id !== id);
        setFormElements(newElements);
      }
      
      const addGroup = (group: any) => {
        console.log("show me what it is us")
        console.log(group);
        //it it in the group
        if(groups == undefined){
            //add in existing group
            setGroups([group]);
        }
        setGroups((prev) => [...prev, group]);
        ;

    };
    
    const addClaimRequest = (claimRequest: any) => {
        console.log(claimRequest);
    }
    
    const steps = [
        {
            name: "Form Details", 
            component: <FormDetails nextStep={nextStep} passData={saveForm}/>
        },
        {
            name: "Form Layout", 
            component: <FormLayout formElements={formElements} removeElement={removeElement} addElement={addElement}/>
        },
        {
            name: "User Requirements", 
            component: <UserRequirements nextStep={console.log("nextStep")} addGroup={addGroup} groups={groups}/>
        },
    ]

  
    
    const handleImageChange = (e:any) => {
      if (e.target.files && e.target.files[0]) {
        let img = URL.createObjectURL(e.target.files[0]);
        setImage(img);
      }
    };
    
  return (
    <div className="flex flex-col items-center justify-center mt-4 p-24">
        <UploadBanner handleImage={handleImageChange} image={image}/>
        <div className="flex flex-row gap-5 items-center">
        <Steps
            steps={steps}
            activeStep={activeStep}
            nextStep={nextStep}
        />
        <Button onClick={submitForm}>Submit </Button>
        </div>
    
        
        <div className="mt-10">
            {steps[activeStep].component}    
        </div>
    </div>
  )
}
