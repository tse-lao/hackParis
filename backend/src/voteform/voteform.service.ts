import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { Injectable } from '@nestjs/common';
import { UmaService } from 'src/uma/uma.service';

//SUPPORT FOR MORE NETWORKS IS POSSIBLE AS LONG AS THE GRAPH SUPPORTS IT.
const thegraph = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/50124/voteforms/version/latest',
  cache: new InMemoryCache(),
});

export interface VoteForm {
  formID: number;
  formCID: string;
  category: string;
  name: string;
  rewardToken: string;
  submitionReward: string;
  formAdmin: string;
  contributions?: Contribution[];
  totalContributions: number;
  form?: any;
  description?: string;
  image?: string;
}

export interface Contribution {
  id: string;
  formID: string;
  contributionCID: string;
  contributor: string;
}

@Injectable()
export class VoteFormService {
  constructor(private readonly UmaService: UmaService) {}

  async getAllRequestCreated() {
    const query = gql`
      {
        requestCreateds {
          id
          formID
          requestName
          requestDescription
          category
          dataFormatCID
          requiredEntries
          minSubRows
          creator
          claimGroups
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
    `;

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });

    return response.data.requestCreateds;
  }
  async getById(id: number) {
    const query = gql`
      {
        requestCreateds(where: {formID: "${id}"}) {
          id
          formID
          requestName
          requestDescription
          category
          dataFormatCID
          requiredEntries
          minSubRows
          creator
          claimGroups
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
    `;

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });

    const result = response.data.requestCreateds[0];
    //read the ipfs to get the form and all the othermetedata.
    const readCID = await fetch(`https://ipfs.io/ipfs/${result.dataFormatCID}`);
    const data = await readCID.json();

    //add in the contributions

    const returnData = {
      ...result,
      ...data,
      contributions: [],
      totalContributions: 0,
    };

    return returnData;
  }

  //get all the contributions, asserted, disputed, approved, rejected
  async getContributionByRequest() {
    const query = gql`
      {
        assertionVotes {
          id
          assertionID
          voter
          vote
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
    `;

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });

    return response.data.assertionVotes;
  }

  //get all the open request, that has not be exectued.
  async getAssertionsById(formID: number) {
    const query = gql`
      {
        contributionAssertionCreateds(where: {formID: ${formID}}) {
          id
          assertionID
        }
      }
    `;

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });

    //map over it and search for the results
    const assertions = response.data.contributionAssertionCreateds;


    console.log(assertions);
    for (let i = 0; i < assertions.length; i++) {
      const result = await this.UmaService.getAssertionById(
        assertions[i].assertionID,
      );

      assertions[i] = {
        ...assertions[i],
        ...result,
      };
    }
    return assertions;
  }

  //all succesfully commited assertions
  async getAllApprovedAssertions() {}

  //END CHAT CREATED
}
