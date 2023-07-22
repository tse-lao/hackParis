import { assertionColumn } from "./assertion-column"
import { AssertionTable } from "./assertion-table"


async function getData() {

    const res = await fetch(`http://localhost:4000/uma/getAssertions`, { next: { revalidate: 60 }})
  
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }
   

export default async function Assertion(
    
) {
    const data = await getData()

  return (
    <div className="mt-[5%]">
        <AssertionTable data={data} columns={assertionColumn}/>
    </div>
  )
}
