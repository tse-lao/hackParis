"use client";
import FormDetails from "@/components/custom/form/FormDetails";
import FormLayout from "@/components/custom/form/FormLayout";
import UploadBanner from "@/components/custom/form/UploadBanner";
import UserRequirements from "@/components/custom/sismo/UserRequirements";
import Steps from "@/components/custom/steps/Steps";
import { ABI, CONTRACTS } from "@/services/contracts";
import { storeFile } from "@/services/useNFTStorage";
import { ClaimRequest, ClaimType } from "@sismo-core/sismo-connect-react";
import { parseEther } from 'viem';

import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useContractWrite } from "wagmi";

export default function CreateForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "auto",
    payee: "user",
    mintable: true, //if false, form is not mintable
    resolution:  60 * 60 * 24 * 2, //in minutes
    reward: 0, //in wei
    mintPrice: 0, //in wei
    groups: [] as ClaimRequest,
    banner: "",
  });
  const { address } = useAccount();
  const [formElements, setFormElements] = useState<any[]>([]);
  const [image, setImage] = useState("");
  const [groups, setGroups] = useState<any[]>();
  const { write: formRequest } = useContractWrite({
    address: CONTRACTS.mumbai.formV2,
    abi: ABI.mumbai.formV2,
    functionName: "formRequest",
  });
  const { write: voteRequest } = useContractWrite({
    address: CONTRACTS.mumbai.voteForm,
    abi: ABI.mumbai.voteForm,
    functionName: "optimisticFormRequest",
  });

  const nextStep = (step: number) => {
    if(step == -1){
      submitForm();
      return;
    }
    console.log(step);
    setActiveStep(step);
  };

  const submitForm = async () => {
    let imageCID = "";
    if (image == "") {
      toast.error("Please upload a banner image");
    }

    await toast
      .promise(storeFile(image), {
        pending: "Uploading your banner to ipfs...",
        success: "Succesfully uploaded your banner!",
        error: "Something went wrong..",
      })
      .then((result) => {
        imageCID = result as string;
        console.log(result);
      });

    await toast.promise(
        storeFile(JSON.stringify({formDetail: formData,formElements: formElements,banner: imageCID})),{
          pending: "Uploading to IPFS...",
          success: "Uploaded to IPFS!",
          error: "Failed to upload to IPFS",
        })
      .then((result) => {
        const category = "test";
        const metadata = [result, formData.name, category];

        const mintPrice = 0;
        const submissionReward = 0;

        const sismoGroups = [];
        const eventSismo = [];
        if (groups != undefined) {
          for (let i = 0; i < groups.length; i++) {
            
            if (groups[i] != undefined) {
              eventSismo.push(groups[i].id);
              sismoGroups.push([
                ClaimType.GTE,
                groups[i].id,
                "0x6c61746573740000000000000000000",
                1,
                false,
                true,
                "0x00",
              ]);
            }
          }
        }
        
        if(formData.type == "vote"){
          let RequestDetails = [
                 "category",      //category
                 1,               //rewquiredContributions
                 0,               //enrties
                 1,           //minSubRows
                 formData.resolution,        //
                 []           //assertions
             ]
            
          voteRequest({args:[
            result, formData.name, formData.description, RequestDetails, sismoGroups, [address], eventSismo
          ]})
          
          return;
        }
        if(formData.type == "auto") { formRequest({args: [0, parseEther(formData.reward.toString()), formData.mintable, metadata, sismoGroups]})}
        
      });
  };

  const saveForm = (data: any) => {
    console.log(data);
    setFormData(data);
  };

  function addElement(element: any) {
    setFormElements([...formElements, element]);
  }
  function removeElement(id: string) {
    let newElements = formElements.filter((element: any) => element.id !== id);
    setFormElements(newElements);
  }

  const addGroup = (group: any) => {
    console.log("show me what it is us");
    console.log(group);
    //it it in the group
    if (groups == undefined) {
      //add in existing group
      setGroups([group]);
      return;
    }
    setGroups((prev) => [...prev, group]);
  };
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      type: type,
    }));
  };
  
  const selectPayee = (isMintable:boolean) => {
    setFormData((prev) => ({
      ...prev,
      mintable: isMintable,
    }));
  };
  const removeGroup = (id: string) => {
    console.log("remove group");
    console.log(id);
    let newGroups = groups?.filter((group) => group.id !== id);
    setGroups(newGroups);
  };

  const steps = [
    {
      name: "Form Details",
      component: <FormDetails formData={formData} handleChange={handleChange} submitDetails={nextStep} selectType={selectType} selectPayee={selectPayee} />,
    },
    {
      name: "Form Layout",
      component: (
        <FormLayout
          formElements={formElements}
          removeElement={removeElement}
          addElement={addElement}
        />
      ),
    },
    {
      name: "User Requirements",
      component: (
        <UserRequirements
          nextStep={nextStep}
          addGroup={addGroup}
          groups={groups}
          removeGroup={removeGroup}
        />
      ),
    },
  ];

  const handleImageChange = (e: any) => {
    if(!e) {
      setImage(""); return;
    }
    
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center px-24">
      <h1 className="text-4xl font-bold text-gray-700">Create Form</h1>
      <Steps steps={steps} activeStep={activeStep} nextStep={nextStep} />
      <UploadBanner handleImage={handleImageChange} image={image} />

      <div className="mt-10">{steps[activeStep].component}</div>
    </div>
  );
}
