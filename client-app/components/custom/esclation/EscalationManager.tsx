"use client"
import { useEffect, useState } from "react";
import EscalationItem from "./EscalationItem";

export default function EscalationManager({ id }: { id: number }) {
    const [loading, setLoading] = useState(true);
    const [assertions, setAssertions] = useState<any[]>([]);
    
    useEffect(() => {
        if (!id) return;
        if(id){
            const getData = async () => {
                const result = await fetch(`http://localhost:4000/voteform/getAssertionsById?id=${id}`, { next: { revalidate: 60 }})
                const data = await result.json()
                setAssertions(data)
            }
            getData();
            setLoading(false);
        }
        
        console.log(id)
        
    }, [id])
    
    const performAction = async () => {
        console.log("test")
    }
  return (
    <main className="flex flex-col gap-4 max-h-[500px] overflow-auto">
      {assertions.map((item: any, index:number) => (
        <EscalationItem key={index} item={item} />
      ))}

      
      {!loading && assertions.length === 0 && (
        <div className="w-full bg-gray-100 p-4 rounded-md">
            <h1>No assertions found</h1>
        </div>
      )}
    </main>
  );
}
