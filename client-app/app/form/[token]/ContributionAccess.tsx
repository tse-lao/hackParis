import {
    AuthType,
    ClaimRequest
} from "@sismo-core/sismo-connect-react";
import { FC } from "react";
import { SismoProof } from "./SismoProof";
  
  export const AUTHS = [{ authType: AuthType.VAULT }];
  
  export const CLAIMS: ClaimRequest[] = [
    {
      // Sismo Community Members
      groupId: "0xa565351b9db92b09f52ef99600a55921",
      isSelectableByUser: true,
    }, 
    {
      // Sismo Community Members
      groupId: "0xa565351b9db92b09f52ef99600a55921",
      isSelectableByUser: true,
    }
  ];
  
  
  
  interface ContributionAccessProps {
      nextStep: (step: number) => void
      getProof: (proof: string) => void
      claims: any
  }
   
  const ContributionAccess: FC<ContributionAccessProps> = ({nextStep, getProof, claims}) => {
    
      console.log(claims);
    
      return (
      <div className="flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md border flex flex-col gap-4">
          <span className="text-gray-600 text-md">
               Please provided that you have the corresponding access based on the following conditions: 
          </span>
          <ul className="list-disc list-inside text-md m-2 ">
              <li>You are in the possession of a WorldID</li>
              <li>You are a contributor to the developer hackathon-fvm</li>
          </ul>
          
      </div>
        <SismoProof data={{auths: AUTHS, claims:claims}} nextStep={nextStep} getProof={getProof}/>
      </div>
      
      );
  }
   
  export default ContributionAccess;