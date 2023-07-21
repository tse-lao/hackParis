"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import InputField from "../input/InputField";
import Textarea from "../input/Textarea";

export default function FormDetails({ nextStep}: { nextStep: any}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: "", 
    reward: "",
    receiver: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          <InputField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder=" Form name"
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
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Receiver"
              name="receiver"
              type="text"
              value={formData.receiver}
              onChange={handleChange}
              placeholder=" Enter value ethers"
              required={true}
            />
            <InputField
              label="Reward"
              name="reward"
              type="number"
              value={formData.reward}
              onChange={handleChange}
              placeholder=" Enter value ethers"
              required={true}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => nextStep(1)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
