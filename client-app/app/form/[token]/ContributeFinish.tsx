"use client"
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ABI, CONTRACTS } from "@/services/contracts";
import Link from "next/link";
import { FC } from "react";
import { useContractWrite } from "wagmi";
import { Contribution, Form } from "../types";


interface ContributionFinishProps {

  data: Form;
}

const ContributionCard: FC<{ contribution: Contribution }> = ({ contribution }) => {
  return (
    <div className="grid grid-cols-6 items-center overflow-auto ">
          <div className="ml-4 col-span-5 space-y-1">
            <p className="text-sm font-medium leading-none overflow-auto">{contribution.contributor}</p>
            <p className="text-sm text-muted-foreground truncate overflow-auto">
              {contribution.dataCID}
            </p>
          </div>
        </div>
  );
}



const ContributionFinish: FC<ContributionFinishProps> = ({data}) => {
  const {write} = useContractWrite({
    address: CONTRACTS.mumbai.form,
    abi: ABI.mumbai.form,
    functionName: 'formContribution',
  });
  
  return (
    <div className="flex flex-col justify-center items-center ">

        <div className="md:w-[600px] sm:w-[400px] lg:w-[600px] mt-8 flex flex-col gap-8 p-8">

        <div className="p-4 flex flex-col gap-4">
        <h1 className="flex text-2xl">
            {data.name}
          </h1>
            <span className="text-gray-600 text-md flex items-center gap-2"> {data.description}</span>
            <Link 
                className="text-indigo-400 text-md italic font-light flex items-center gap-2 hover:text-indigo-700"
                href={`/profile/${data.formAdmin}`}
            >
                {data.formAdmin}
            </Link>
            <div>
                <Badge>{data.category}</Badge>
            </div>
        </div>
        <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Contributions</CardTitle>
                        <CardDescription>
                            Total of {data.totalContributions} contributions made 
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-8 max-h-[300px] overflow-auto">

                    {data.contributions.map((contribution, index) => (
                                <ContributionCard key={index} contribution={contribution} />
                                ))}
                                </div>
                    </CardContent>
                    </Card>
        
        </div>
      </div>


  )
}

export default ContributionFinish;
