"use client"
import { useState } from "react";
import CreateFormElement from "./CreateFormElement";
import FormElements from "./FormElements";


export default function FormLayout() {
  const [allElements, setAllElements] = useState([])
  

  const addElement = (element: any) => {
    setAllElements((allElements) => [...allElements, element])
  };
  
  function removeElement(id:string){
    let newElements = allElements.filter((element:any) => element.id !== id);
    setAllElements(newElements);
  }
  return (
    <div className="flex flex-col gap-8">
        <FormElements elements={allElements} removeElement={removeElement} />
        <CreateFormElement addElement={addElement}/>


    </div>
  )
}
