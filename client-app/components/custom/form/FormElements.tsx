// DisplayForm.tsx
import { FC } from "react";

type DisplayFormProps = {
  elements: any[];
  removeElement?: (id: string) => void; // Option for creation form.
};

const FormElements: FC<DisplayFormProps> = ({ elements, removeElement }) => {
  return (
    <div className="space-y-4 max-h-[600px] overflow-auto">
      {elements.map((element, index) => {
        return (
          <div key={index}   className="w-full flex flex-col gap-2">
            <div className="block text-md tracking-wider capitalize	text-sm">
              {element.label}
            </div>
              
                {element.type === "input" && (
                  <input
                    name={element.name}
                    type={element.inputType}
                    required={element.required}
                    className="block w-full p-2 border rounded-md"
                  />
                )}
                {element.type === "textarea" && (
                  <textarea
                    name={element.name}
                    required={element.required}
                    className="block w-full p-2 border rounded-md"
                  />
                )}
                {element.type === "select" && (
                  <select
                    name={element.name}
                    required={element.required}
                    className="block w-full p-2 border rounded-md"
                  >
                    {element.options?.map((option:any, i:number) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                
                {element.helptext && (
                  <span className="border-none w-full text-sm font-light tracking-wider text-gray-400 italic mb-2">
                      {element.helptext}
                  </span>  
                )}
                

          <div>
          <div className="">
             {removeElement && (
                <button
                  onClick={(e ) => {e.preventDefault(); removeElement(element.id)}}
                  className="col-span-1 px-2 bg-red-500 text-white rounded-md text-sm"
                >
                  Delete
                </button>
              )}
              </div>
            </div>
          </div>
       
        );
      })}
    </div>
  );
};

export default FormElements;
