"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "react-toastify";
import QuickHelper from "./QuickHelper";

export default function CreateFormElement({ addElement }: { addElement: any }) {
  const [label, setLabel] = useState<string>("");
  const [type, setType] = useState<string>("input");
  const [helptext, setHelptext] = useState<string>("");
  const [options, setOptions] = useState<string>("");
  const [inputType, setInputType] = useState<string>("text");
  
  
  const handleSubmit = () => {
    //validate if label is empty
    if (!label) {
        toast.error("Only the label is required to fill in.");
        return;
    }
    const name = label.toLowerCase().replace(/\s/g, "-");
    const id = Math.random().toString(36).substr(2, 9);
    const optionsArray = options.split(",").map((option) => option.trim());

    addElement({
      id,
      type,
      label,
      helptext: helptext ? helptext : undefined,
      name,
      inputType: type === "input" ? inputType : undefined,
      options: type === "select" ? optionsArray : undefined,
    });
    setLabel("");
    setHelptext("");
  };

  const callAction = (action: string) => {
    console.log(action);
    switch (action) {
      case "input":
        setType("input");
        
        break;
      case "textarea":
        setType("textarea");
        break;
      case "option":
        setType("select");
        break;
    case "submit":
        handleSubmit();
        break;
      default:
        setType("input");
        break;
    }
  };

  return (
    <main className="flex flex-col span-4 items-center gap-4 w-[600px]">
      <Card className="w-full">
        <CardContent className="p-8 flex flex-col gap-1 h-[250px]">
          {type === "input" && ( // Show input type select only when 'type' is 'input'
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="block w-full p-2 border rounded-md mb-8"
            >
              <option value="text">Text</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="email">Email</option>
              <option value="tel">Telephone</option>
              <option value="url">URL</option>
              <option value="file">File</option>
              <option value="search">Search</option>
              <option value="range">Range</option>
              <option value="color">Color</option>
            </select>
          )}
          
          {type === "select" && (
            
            <Input
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              className="block w-full p-2 border rounded-md mb-5"
              placeholder="Options (comma separated)"
              required={true}
            />
          )}

          <input
            type="text"
            name="label"
            value={label}
            className="border-none block text-sm tracking-wider font-medium text-black py-2 "
            placeholder="Please enter label"
            onChange={(e: any) => setLabel(e.target.value)}
            required
          />
       

          {type === "textarea" && (
            <Textarea
              name="description"
              rows={2}
              className="col-span-2"
              value="random values for the text area here. "
              required={true}
            />
          )}
          
          { type === "select" && (
            <select
            className="block w-full p-2 border rounded-md"
          >
              <option value="somet">
                value 1
              </option>
          </select>
          )}

          {type === "input" && (
            <Input type={inputType} placeholder={inputType} required={true} />
          )}
          <input
            type="text"
            name="helptext"
            value={helptext}
            className="border-none w-full text-sm font-light tracking-wider text-gray-400 italic mb-2"
            placeholder="Feel free to enter a help text"
            onChange={(e: any) => setHelptext(e.target.value)}
          />
        </CardContent>
      </Card>
      <div className="col-span-1">
        <QuickHelper callAction={callAction} type={type} />
      </div>
    </main>
  );
}
