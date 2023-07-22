import { Injectable } from '@nestjs/common';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const sismoClient = new ApolloClient({
  uri: 'https://api.sismo.io',
  cache: new InMemoryCache(),
});

export interface Contributions {
  id: string;
  requestID: string;
  dataID: string;
  rows: string;
  contributor: string;
}

@Injectable()
export class PrivacyService {
  async getPrivacyScore(groupid: string[]): Promise<number> {
    console.log(groupid);

    const query = gql`
      query ExampleQuery($groupId: String) {
        groupSnapshot(groupId: $groupId) {
          dataUrl
          size
        }
      }
    `;
    let privacyScore = 0;

    for (let i = 0; i < groupid.length; i++) {
      const variables = {
        groupId: groupid[i],
      };

      const response = await sismoClient.query({ query: query, variables });

      privacyScore += response.data.groupSnapshot.size;
    }

    return privacyScore / groupid.length;
  }
}
