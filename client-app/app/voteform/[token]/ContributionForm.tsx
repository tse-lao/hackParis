import DisplayForm from "./DisplayForm"


export default function ContributionForm({form, submitData}: {form: any, submitData: any}) {
    
    if(!form){
        return <div>no form found...</div>
    }
  return (
    <pre>
        <DisplayForm elements={form} submitData={submitData}/>
    </pre>
  )
}
