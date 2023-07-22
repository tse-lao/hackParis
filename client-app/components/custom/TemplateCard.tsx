import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaneIcon } from "lucide-react"




export default function TemplateCard({ data}: {data: any}){
    return (
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium uppercase">
            {data.title}
          </CardTitle>
        {data.icon ? data.icon : <PlaneIcon />}
        </CardHeader>
        <CardContent className="my-4">
          <div className="text-2xl font-bold">{data.description}</div>
        </CardContent>
      </Card>
    )
}