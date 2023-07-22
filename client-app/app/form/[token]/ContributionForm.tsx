import { Button } from "@/components/ui/button"


export default function ContributionForm({dataForm, submitData}: {dataForm: any, submitData: any}) {
  return (
    <pre>
        {JSON.stringify(dataForm, null, 2)}
        
        <Button onClick={submitData}>
            Submit data
        </Button>
    </pre>
  )
}
