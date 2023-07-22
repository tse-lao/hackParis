import { NFTDisplay } from "./NFTDisplay";

export default function Marketplace({data}: {data:any[]}) {
  return (
    <div className="grid grid-cols-6 gap-8 m-16">
        {data.map((item:any) => (
            <NFTDisplay key={item.formID} item={item} width={100} height={100}/>
        ))}
    </div>
  );
    
}
