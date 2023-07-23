import { Injectable } from '@nestjs/common';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

//SUPPORT FOR MORE NETWORKS IS POSSIBLE AS LONG AS THE GRAPH SUPPORTS IT.
const client = new ApolloClient({
        uri: 'https://api.airstack.xyz/gql',
        cache: new InMemoryCache(),
        headers: { Authorization: "c9d9a396e2f74f7c96fcb4bd1206cf98" },
    });






@Injectable()
export class AsService {
    async hasXMTP(address:string): Promise<boolean> {
        const query = gql`{
                    XMTPs(input: {blockchain: ALL, filter: {owner: {_eq: ${address}}}}) {
                    XMTP {
                    isXMTPEnabled
                    }
                }
                }
        `;
        const result = await client.query({
            query: query,
        });
        
        console.log(result.data.XMTPs)
        if(result.data.XMTPs.XMTP == null){
            return false;
        }

        return result.data.XMTPs.XMTP.isXMTPEnabled;
    }
    

}
