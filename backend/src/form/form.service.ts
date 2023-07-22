import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { Injectable } from '@nestjs/common';

//SUPPORT FOR MORE NETWORKS IS POSSIBLE AS LONG AS THE GRAPH SUPPORTS IT.
const thegraph = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/50124/forms/version/latest',
  cache: new InMemoryCache(),
});

export interface Form {
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
export class FormService {
  async getFormByCreator(creator: string) {
    const result = await this.getForms(creator);

    for (let i = 0; i < result.length; i++) {
      const contributions = await this.allContributionsByForm(result[i].formID);
      result[i].totalContributions = contributions.length;
    }

    return result;
  }

  async getForms(formAdmin: string): Promise<Array<Form>> {
    let query = gql`
      {
        formRequestCreateds(first: 20) {
          formID
          formCID
          category
          name
          rewardToken
          submitionReward
          formAdmin
        }
      }
    `;

    if (formAdmin != '') {
      query = gql`{
                formRequestCreateds (where: {formAdmin: "${formAdmin}"}) {
                  formID
                  formCID
                  category
                  name
                  rewardToken
                  submitionReward
                  formAdmin
                }
                }`;
    }

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });
    const requests = response.data.formRequestCreateds.map((request: Form) => {
      return {
        formID: request.formID,
        formCID: request.formCID,
        category: request.category,
        name: request.name,
        rewardToken: request.rewardToken,
        submitionReward: request.submitionReward,
        formAdmin: request.formAdmin,
      };
    });
    

    return requests;
  }

  async getAllForms() {
    const forms = await this.getForms('');

    for (let i = 0; i < forms.length; i++) {
      const contributions = await this.allContributionsByForm(forms[i].formID);
      const readCID = await fetch(`https://ipfs.io/ipfs/${forms[i].formCID}`);
      const data = await readCID.json();
      forms[i].image = data.banner;
      forms[i].description = data.formDetail.description;
      forms[i].totalContributions = contributions.length;
    }

    console.log(forms);

    return forms;
  }

  async getFormById(formID: number) {
    const query = gql`
        {
          formRequestCreateds (where: {formID: "${formID}"}) {
              formID
                  formCID
                  category
                  name
                  rewardToken
                  submitionReward
                  formAdmin
            }
            }
        `;

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });

    const request = response.data.formRequestCreateds[0];

    console.log(request);

    const contributions = await this.allContributionsByForm(formID);
    

    const readCID = await fetch(`https://ipfs.io/ipfs/${request.formCID}`);
    const data = await readCID.json();
    console.log(data);
    const form: Form = {
      formID: request.formID,
      formCID: request.formCID,
      category: request.category,
      name: request.name,
      rewardToken: request.rewardToken,
      submitionReward: request.submitionReward,
      formAdmin: request.formAdmin,
      contributions: contributions,
      totalContributions: contributions.length,
      image: data.banner,
      description: data.formDetail.description,
      form: data.formElements,
    };

    return form;
  }

  async allContributionsByForm(formID: number) {
    const query = gql`{
      contributionCreateds(where: {formID: "${formID}"}) {
        id
        formID
        contributionCID
        contributor
    }
    }
     
        `;

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });

    const requests = response.data.contributionCreateds.map(
      (request: Contribution) => {
        return {
          id: request.id,
          formID: request.formID,
          contributionCID: request.contributionCID,
          contributor: request.contributor,
        };
      },
    );

    if (response.data.contributionCreateds.length == 0) {
      return [];
    }
    return requests;
  }

  async getAllContributions() {
    const query = gql`{
      contributionCreateds() {
        id
        formID
        contributionCID
        contributor
    }
    }
     
        `;

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });

    const requests = response.data.contributionCreateds.map(
      (request: Contribution) => {
        return {
          id: request.id,
          formID: request.formID,
          contributionCID: request.contributionCID,
          contributor: request.contributor,
        };
      },
    );

    if (response.data.contributionCreateds.length == 0) {
      return [];
    }
    return requests;
  }

  async getContributionsByUser(
    contributor: string,
  ): Promise<Array<Contribution>> {
    const query = gql`
        {
          contributionCreateds (where: {contributor: "${contributor}"}) {
            id
            formID
            contributionCID
            contributor
            }
            }
        `;

    const response = await thegraph.query({
      query,
      fetchPolicy: 'no-cache',
    });

    const requests = response.data.contributionCreateds.map(
      (request: Contribution) => {
        return {
          id: request.id,
          formID: request.formID,
          contributionCID: request.contributionCID,
          contributor: request.contributor,
        };
      },
    );

    if (response.data.contributionCreateds.length == 0) {
      return [];
    }
    return requests;
  }
}
