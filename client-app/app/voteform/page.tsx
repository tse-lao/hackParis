import { FormColumns } from "./form-columns"
import { FormTable } from "./form-table"

async function getData() {

  const res = await fetch(`http://localhost:4000/form/getForms`, { next: { revalidate: 60 }})

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}
 
export default async function Forms() {
  const data = await getData();
  
  return (
    <div className="flex mt-24 justify-center items-center flex-col">
      <h2 className="text-2xl font-bold tracking-tight">Forms</h2>
      <div className="min-w-[800px]">
          <FormTable
            columns={FormColumns} 
            data={data} 
        />
      </div>
    
      
    </div>
  )
}