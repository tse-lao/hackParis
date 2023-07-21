import { FormInputIcon, ListIcon, PlusIcon, TextIcon } from "lucide-react";

export default function QuickHelper({callAction, type}:{callAction:any, type:string}) {
  return (
    <div className="flex flex-row gap-8 bg-white rounded-md">
        <FormInputIcon className={`hover:text-purple-600 hover:scale-125 ${type == 'input' && 'text-purple-600'}`} onClick={(e) =>{ e.preventDefault(); callAction('input')}}/>
        <ListIcon className={`hover:text-purple-600 hover:scale-125 ${type == 'option' && 'text-purple-600'}`} onClick={(e) =>{ e.preventDefault(); callAction('option')}}/>
        <TextIcon className={`hover:text-purple-600 hover:scale-125 ${type == 'textarea' && 'text-purple-600'}`} onClick={(e) =>{ e.preventDefault(); callAction('textarea')}} />
        <PlusIcon className="text-green-500 hover:text-green-600 hover:scale-125" onClick={(e) =>{ e.preventDefault(); callAction('submit')}}/>
    </div>
  )
}
