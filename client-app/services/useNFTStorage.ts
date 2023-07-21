import { NFTStorage } from 'nft.storage';

const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE as string })

export async function storeFile(data: any){
    const someData = new Blob([data])
    
    return new Promise(async (resolve, reject) => {
        try {
            const cid = await client.storeBlob(someData)
            resolve(cid)
        } catch (error) {
            console.log(error);
            reject(error)
        }
    });

}

