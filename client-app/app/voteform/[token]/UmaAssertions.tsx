import EscalationManager from "@/components/custom/esclation/EscalationManager"



async function getData(id:string) {
    const res = await fetch(`http://localhost:4000/voteform/getAssertionsById?id=${id}`, { next: { revalidate: 60 }})
  
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}
export default async function UmaAssertions({id}: {id:string}) {
    
    const data = await getData(id)
  return (
    <div>
        <EscalationManager data={data}/>
    </div>
  )
}
