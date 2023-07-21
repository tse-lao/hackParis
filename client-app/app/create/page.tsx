"use client"
import FormDetails from "@/components/custom/form/FormDetails";
import FormLayout from "@/components/custom/form/FormLayout";
import UploadBanner from "@/components/custom/form/UploadBanner";
import Steps from "@/components/custom/steps/Steps";
import { useState } from "react";



export default function CreateForm() {
    const [activeStep, setActiveStep] = useState(0);
    
    
    const nextStep = (step: number) => {
        console.log(step)
        setActiveStep(step);
    }
    
    const steps = [
        {
            name: "Form Details", 
            component: <FormDetails nextStep={nextStep}/>
        },
        {
            name: "Form Layout", 
            component: <FormLayout />
        },
    ]
    
  return (
    <div className="flex flex-col  items-center justify-center mt-20 p-24">
        <UploadBanner />
        <Steps
            steps={steps}
            activeStep={activeStep}
            nextStep={nextStep}
        />
        
        {steps[activeStep].component}
    </div>
  )
}
