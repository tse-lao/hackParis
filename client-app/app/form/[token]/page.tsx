import ContributePage from "./ContributePage"


async function getData(token:number) {

    const res = await fetch(`http://localhost:4000/form/getFormById?id=${token}`, { next: { revalidate: 60 }})
  
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }
   

export default async function Contribute(
    {params: { token },}: {params: { token: number }}

    
) {
    const data = await getData(token)

  return (
    <div className="mt-[5%]">
        <ContributePage data={data}/>
    </div>
  )
}