"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CopyCheck, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent
} from "../../ui/card";
import InputField from "../input/InputField";
import Textarea from "../input/Textarea";

export default function FormDetails({ formData, handleChange, submitDetails, selectType, selectPayee }: { formData: any, handleChange: any, submitDetails: any, selectType: any, selectPayee:any }) {

  
  const isFormValid = () => {
    // Check if all required fields are filled in
    return formData.name  && formData.description;
};

    const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isFormValid()) {
            submitDetails(1);
        } else {
            // Display an error message or handle the incomplete form scenario
            console.log("Please fill in all required fields.");
            toast.error("Please fill in all required fields.");
        }
    };




  return (
    <Card className="w-[600px]">
      <CardContent className="my-4">
        <div className="flex flex-col gap-8">
          <RadioGroup
            name="type"
            onValueChange={selectType}
            value={formData.type}
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="vote"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="vote" id="vote" className="sr-only" />
              <UserCheck />
              Approval
            </Label>
            <Label
              htmlFor="auto"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="auto" id="auto" className="sr-only" />
              <CopyCheck />
              Auto Accept
            </Label>
          </RadioGroup>

          <InputField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name of the form"
            required={true}
          />
          <Textarea
            label="Description"
            name="description"
            rows={2}
            className="col-span-2"
            value={formData.description}
            onChange={handleChange}
            required={true}
          />
            {formData.type == "auto" ? (
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="col-span-1">
                  <RadioGroup
                    name="type"
                    onValueChange={selectPayee}
                    value={formData.payee}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="user"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem
                        value="user"
                        id="user"
                        className="sr-only"
                      />
                      Contributor
                    </Label>
                    <Label
                      htmlFor="master"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <RadioGroupItem
                        value="master"
                        id="master"
                        className="sr-only"
                      />
                      Paymaster
                    </Label>
                  </RadioGroup>
                </div>

                <InputField
                  label={formData.payee == "user" ? "Reward" : "Sponsor "}
                  name="reward"
                  type="number"
                  value={formData.reward}
                  onChange={handleChange}
                  placeholder=" Enter value ethers"
                  required={true}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Resolution"
                  name="resolution"
                  type="number"
                  value={formData.resolution}
                  onChange={handleChange}
                  placeholder=" Enter value ethers"
                  required={true}
                />
                <InputField
                  label="Team members"
                  name="reward"
                  type="number"
                  value={formData.reward}
                  onChange={handleChange}
                  placeholder=" Enter value ethers"
                  required={true}
                />
              </div>
            )}
        </div>
        <Button
          className="mt-12 w-full"
          onClick={handleContinue}
          disabled={!isFormValid()}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
}
