"use client"
import CreateFormElement from "./CreateFormElement";
import FormElements from "./FormElements";


export default function FormLayout({addElement, formElements, removeElement}: {addElement: any, formElements: any[], removeElement: any}) {
  return (
    <div className="flex flex-col gap-8">
        <FormElements elements={formElements} removeElement={removeElement} />
        <CreateFormElement addElement={addElement}/>
    </div>
  )
}
