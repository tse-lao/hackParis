import Marketplace from "./Marketplace";

const getData = async () => {
    const res = await fetch('http://localhost:4000/form/getForms', { next: { revalidate: 60 } })
    const data = await res.json()
  
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
   
    return data;
}
export default async function Market() {    
const data = await getData()
console.log(data);
  return (
    <div className="min-h-full mt-24 flex flex-col">
        <Marketplace data={data} />
    </div>
  )
}
