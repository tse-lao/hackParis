"use client"
import { useEffect, useState } from "react";
import EscalationItem from "./EscalationItem";

export default function EscalationManager({ id }: { id: number }) {
    const [loading, setLoading] = useState(true);
    const [assertions, setAssertions] = useState<any[]>([
        {
            "id": "0xf88d55b3d47c16a3e217d057b3c6161f7239c9c0a0bc969517c761a8fc01216758000000",
            "assertionID": "0x91fa25d792a6d249893bfd4eaa5529273bcf6992f383760b06b3fc8e3a4e5ca5",
            "__typename": "AssertionMade",
            "assertionId": "0x91fa25d792a6d249893bfd4eaa5529273bcf6992f383760b06b3fc8e3a4e5ca5",
            "domainId": "0x0000000000000000000000000000000000000000000000000000000000013881",
            "claim": "0x436f6e747269627574696f6e206f6e20666f726d49442030783220776974682064617461203a20516d636d5366646437646546626b3276315858376270336859613167706537566557557471374342426d4b4466702077697468206e756d656272206f6620656e74726965732030783120636f6e7472696275746f722061646472657373203a20307836353162343232623636376133656234663338333166383332303937643137363934316439383431",
            "asserter": "0x651b422b667a3eb4f3831f832097d176941d9841",
            "identifier": "0x5945535f4f525f4e4f5f51554552590000000000000000000000000000000000",
            "callbackRecipient": "0x95f59d962432b44c2bcbce1cfa7b514c78e03cb4",
            "escalationManager": "0x5e140419f90fb5f090c5e1849253fda03b5029e4",
            "caller": "0x95f59d962432b44c2bcbce1cfa7b514c78e03cb4",
            "expirationTime": "1690248413",
            "currency": "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747",
            "bond": "0",
            "status": "active"
        }, 
        {
            "id": "0xf88d55b3d47c16a3e217d057b3c6161f7239c9c0a0bc969517c761a8fc01216758000000",
            "assertionID": "0x91fa25d792a6d249893bfd4eaa5529273bcf6992f383760b06b3fc8e3a4e5ca5",
            "__typename": "AssertionMade",
            "assertionId": "0x91fa25d792a6d249893bfd4eaa5529273bcf6992f383760b06b3fc8e3a4e5ca5",
            "domainId": "0x0000000000000000000000000000000000000000000000000000000000013881",
            "claim": "0x436f6e747269627574696f6e206f6e20666f726d49442030783220776974682064617461203a20516d636d5366646437646546626b3276315858376270336859613167706537566557557471374342426d4b4466702077697468206e756d656272206f6620656e74726965732030783120636f6e7472696275746f722061646472657373203a20307836353162343232623636376133656234663338333166383332303937643137363934316439383431",
            "asserter": "0x651b422b667a3eb4f3831f832097d176941d9841",
            "identifier": "0x5945535f4f525f4e4f5f51554552590000000000000000000000000000000000",
            "callbackRecipient": "0x95f59d962432b44c2bcbce1cfa7b514c78e03cb4",
            "escalationManager": "0x5e140419f90fb5f090c5e1849253fda03b5029e4",
            "caller": "0x95f59d962432b44c2bcbce1cfa7b514c78e03cb4",
            "expirationTime": "1690248413",
            "currency": "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747",
            "bond": "0",
            "status": "dispute"
        }, {
            "id": "0xf88d55b3d47c16a3e217d057b3c6161f7239c9c0a0bc969517c761a8fc01216758000000",
            "assertionID": "0x91fa25d792a6d249893bfd4eaa5529273bcf6992f383760b06b3fc8e3a4e5ca5",
            "__typename": "AssertionMade",
            "assertionId": "0x91fa25d792a6d249893bfd4eaa5529273bcf6992f383760b06b3fc8e3a4e5ca5",
            "domainId": "0x0000000000000000000000000000000000000000000000000000000000013881",
            "claim": "0x436f6e747269627574696f6e206f6e20666f726d49442030783220776974682064617461203a20516d636d5366646437646546626b3276315858376270336859613167706537566557557471374342426d4b4466702077697468206e756d656272206f6620656e74726965732030783120636f6e7472696275746f722061646472657373203a20307836353162343232623636376133656234663338333166383332303937643137363934316439383431",
            "asserter": "0x651b422b667a3eb4f3831f832097d176941d9841",
            "identifier": "0x5945535f4f525f4e4f5f51554552590000000000000000000000000000000000",
            "callbackRecipient": "0x95f59d962432b44c2bcbce1cfa7b514c78e03cb4",
            "escalationManager": "0x5e140419f90fb5f090c5e1849253fda03b5029e4",
            "caller": "0x95f59d962432b44c2bcbce1cfa7b514c78e03cb4",
            "expirationTime": "1690248413",
            "currency": "0xe6b8a5cf854791412c1f6efc7caf629f5df1c747",
            "bond": "0",
            "status": "expired"
        }
    ]);
    
    useEffect(() => {
        if (!id) return;
        if(id){
            const getData = async () => {
                const result = await fetch(`http://localhost:4000/voteform/getAssertionsById?id=${id}`, { next: { revalidate: 60 }})
                const data = await result.json()
                const newAssetions = {...assertions, data}
               // setAssertions(newAssetions)
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
