// groupCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface SismoGroupProps {
  group: any;

}

const SismoGroup: React.FC<SismoGroupProps> = ({ group }) => {
    console.log("group item")
    console.log(group)
  return (
    
    <Card 
        className={`col-span-1 border rounded-lg  bg-white relative group cursor-pointer `}
    >
      <CardHeader className="text-left">
        <CardTitle>{group.name}</CardTitle>
        <CardDescription >{group.id}</CardDescription>
      </CardHeader> 
      
      <CardContent>
        <span className="text-gray-600 text-sm flex justify-center items-center gap-4 bottom-0 relative">
        <UsersIcon height="16" width="16"/> {group.latestSnapshot.valueDistribution[0].numberOfAccounts}
        </span>
      </CardContent>

    </Card>
  );
};

export default SismoGroup;
