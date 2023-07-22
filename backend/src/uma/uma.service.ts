import { Injectable } from '@nestjs/common';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

//SUPPORT FOR MORE NETWORKS IS POSSIBLE AS LONG AS THE GRAPH SUPPORTS IT.
const client = new ApolloClient({
        uri: 'https://api.studio.thegraph.com/query/50124/umamumbai/version/latest',
        cache: new InMemoryCache(),
    });

export interface Assertion {
    assertionId: string
    domainId: string
    claim: string
    asserter: any
    identifier: string
    callbackRecipient: any
    escalationManager: any
    caller: any
    expirationTime: number
    currency: any
    bond: number
    blockNumber: number
    blockTimestamp: number
    transactionHash: any
}

export interface Dispute {
id: any
  assertionId: any
  caller: any 
  disputer: any
  blockNumber: number
  blockTimestamp: number
  transactionHash: any
}

export interface AssertionSettled{
    id: any
  assertionId: any 
  bondRecipient: any
  disputed: boolean
  settlementResolution: boolean 
  settleCaller: any
  blockNumber: number
  blockTimestamp: number
  transactionHash: any
}

@Injectable()
export class UmaService {
    async getAssertions(): Promise<Array<Assertion>> {
        const query = gql`
        {
            assertionMades(first: 20) {
            assertionId
            domainId
            claim
            asserter
            identifier
            callbackRecipient
            escalationManager
            caller
            expirationTime
            currency
            bond
            }
        }
        `;
        const result = await client.query({
            query: query,
        });

        return result.data.assertionMades;
    }
    
    async getDisputes(): Promise<Array<Dispute>>{
        const query = gql`
        {
            assertionDisputeds(first: 20) {
                assertionId
                caller
                disputer
                blockNumber
                blockTimestamp
                transactionHash
            }
        }
        `;
        const result = await client.query({
            query: query,
        });

        return result.data.assertionDisputeds;
    }
    async getAssertionSettled(): Promise<Array<AssertionSettled>>{
        const query = gql`
        {
            assertionSettleds(first: 20) {
                id
                assertionId
                bondRecipient
                disputed
                settlementResolution
                settleCaller
                blockNumber
                blockTimestamp
                transactionHash
            }
        }
        `;
        const result = await client.query({
            query: query,
        });

        return result.data.assertionSettleds;
    }

    async getAssertionById(assertionID: string): Promise<Assertion> {
        const query = gql`
                {
                    assertionMades (where: {assertionId: "${assertionID}"}) {
                        assertionId
                        domainId
                        claim
                        asserter
                        identifier
                        callbackRecipient
                        escalationManager
                        caller
                        expirationTime
                        currency
                        bond
                    
                    }
                    }
                `;

        const response = await client.query({
            query,
            fetchPolicy: 'no-cache',
        });

        const assertion = response.data.assertions[0];

        const currentTimestamp = Math.floor(new Date().getTime() / 1000); // Unix timestamp in seconds

        // Determine the status
        if (assertion.expirationTime < currentTimestamp) {
          assertion.status = (assertion.disputer) ? 'disputing' : 'open';
        } else {
          assertion.status = (assertion.settlementTimestamp) ? 'finished' : 'ready';
        }
      

        return assertion;
    }

}
