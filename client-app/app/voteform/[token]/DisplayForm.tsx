// DisplayForm.tsx
"use client"


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FC, useState } from 'react';
type DisplayFormProps = {
  elements: any[];
  submitData?: (data: any) => void ;
};


const DisplayForm: FC<DisplayFormProps> = ({ elements, submitData }) => {
    const [formData, setFormData] = useState<any>({});

    const handleChange = (e:any) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = (e:any) => {
      e.preventDefault();
      submitData(formData);
    };
    
    
  return (
    <div className='flex flex-col gap-4'>
    <div className="bg-white rounded-md space-y-4 overflow-auto">
      {elements.map((element, index) => {
        return (
          <div key={index} className="space-y-2  p-4 rounded-md ">
            <label className="block text-md tracking-wider capitalize	text-sm ">{element.label}</label>

            <div className="grid grid-cols-6 gap-2">
              <div className='col-span-5'>
                {element.type === 'input' && (
                  <Input
                    name={element.name}
                    type={element.inputType}
                    required={element.required}
                    value={formData[element.name] || ''}
                    onChange={handleChange}
                    className="block w-full p-2 border rounded-md"
                  />
                )}
                {element.type === 'textarea' && (
                  <textarea
                    name={element.name}
                    required={element.required}
                    value={formData[element.name] || ''}
                    onChange={handleChange}
                    className="block w-full p-2 border rounded-md"
                  />
                )}
                {element.type === 'select' && (
                  <Select
                    
                  >
                     <SelectTrigger className="block w-full  border">
                      <SelectValue 
                      name={element.name}
                      required={element.required}
                      value={formData[element.name] || ''}
                      placeholder={element.name}
                      onChange={handleChange} />
                    </SelectTrigger>
                  <SelectContent>
                    {element.options?.map((option, i) => (
                        <SelectItem key={i} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    
                  </SelectContent>
                    
                  </Select>
                )}
              </div>
             
            </div>
        
          </div>
        );
      })}
          
    
    </div>
     
   <Button onClick={(e) => handleSubmit(e)} >
   Submit
</Button>
</div>

  );
};

export default DisplayForm;
