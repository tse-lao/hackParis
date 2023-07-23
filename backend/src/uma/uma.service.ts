import { Injectable } from '@nestjs/common';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

//SUPPORT FOR MORE NETWORKS IS POSSIBLE AS LONG AS THE GRAPH SUPPORTS IT.
const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/50124/umamumbai/version/latest',
  cache: new InMemoryCache(),
});

export interface Assertion {
  assertionId: string;
  domainId: string;
  claim: string;
  asserter: any;
  identifier: string;
  callbackRecipient: any;
  escalationManager: any;
  caller: any;
  expirationTime: number;
  currency: any;
  bond: number;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface Dispute {
  id: any;
  assertionId: any;
  caller: any;
  disputer: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

export interface AssertionSettled {
  id: any;
  assertionId: any;
  bondRecipient: any;
  disputed: boolean;
  settlementResolution: boolean;
  settleCaller: any;
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: any;
}

@Injectable()
export class UmaService {
  async getAssertions(): Promise<Array<Assertion>> {
    //get current timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const query = gql`
      {
        assertionMades(
          first: 20
          where: {
            escalationManager: "0x5E140419F90Fb5F090C5e1849253fDA03B5029e4"
            expirationTime_gt: currentTimestamp
          }
        ) {
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

  async getPastAssertions(): Promise<Array<Assertion>> {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const query = gql`
      {
        assertionMades(
          first: 20
          where: {
            escalationManager: "0x5E140419F90Fb5F090C5e1849253fDA03B5029e4"
            expirationTime_lte: currentTimestamp
          }
        ) {
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

  async getDisputes(): Promise<Array<Dispute>> {
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
  async getAssertionSettled(): Promise<Array<AssertionSettled>> {
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

    const assertion = response.data.assertionMades[0];
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (assertion.expirationTime < currentTimestamp) {
      assertion.status = 'expired';
    } else {
      const dispute = await this.getDispute(assertionID);
      console.log(dispute);
      if (dispute) {
        return { ...assertion, ...dispute, status: 'disputed' };
      }
      assertion.status = 'active';
    }

    return assertion;
  }

  async getDispute(assertionID: string) {
    const query = gql`
                {
                    assertionDisputeds (where: {assertionId: "${assertionID}"}) {
                        assertionId
                        caller
                        disputer
                        blockNumber
                        blockTimestamp
                        transactionHash
                    }
                    }`;
    const response = await client.query({
      query,
      fetchPolicy: 'no-cache',
    });

    if (response.data.assertionDisputeds.length == 0) {
      return null;
    }
    return response.data.assertionDisputeds[0];
  }

  async getAllAssertions() {
    const query = gql`
      query GetAllAssertions {
        made: assertionMades(
          first: 1000
          where: {
            escalationManager: "0x5E140419F90Fb5F090C5e1849253fDA03B5029e4"
          }
        ) {
          assertionId
          asserter
          bond
          caller
          claim
          escalationManager
          expirationTime
        }
      }
    `;

    const response = await client.query({
      query,
      fetchPolicy: 'no-cache',
    });

    const madeAssertions = response.data.made.map(
      ({
        id,
        assertionId,
        asserter,
        bond,
        caller,
        claim,
        escalationManager,
        expirationTime,
      }) => ({
        id,
        assertionId,
        asserter,
        bond,
        caller,
        claim,
        escalationManager,
        expirationTime,
        status: 'Made',
      }),
    );
    const disputedAssertions = response.data.disputed.map(
      ({ id, assertionId, blockTimestamp, caller, disputer }) => ({
        id,
        assertionId,
        blockTimestamp,
        caller,
        disputer,
        status: 'Disputed',
      }),
    );
    const settledAssertions = response.data.settled.map(
      ({
        id,
        blockTimestamp,
        assertionId,
        bondRecipient,
        disputed,
        settleCaller,
        settlementResolution,
      }) => ({
        id,
        blockTimestamp,
        assertionId,
        bondRecipient,
        disputed,
        settleCaller,
        settlementResolution,
        status: 'Settled',
      }),
    );

    return [...madeAssertions, ...disputedAssertions, ...settledAssertions];
  }
}
