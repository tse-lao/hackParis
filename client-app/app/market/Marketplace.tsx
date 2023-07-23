import { NFTDisplay } from "./NFTDisplay";

export default function Marketplace({data}: {data:any[]}) {
  return (

    <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5 mx-24">
        {data.map((item:any) => (
            <NFTDisplay key={data[2].formID} className="col-span-1" item={item} width={100} height={100}/>
        ))}
    </div>
  );
    
}
