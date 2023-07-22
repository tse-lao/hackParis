import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"




export default function TemplateCard({link, title, description}: {link: string, title: string, description: any}){
    return (
        
            <Card className="hover:border-purple-600">
                    <CardHeader>
                    <CardTitle>
                        {title}
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[150px]">
                        {description}
                    </CardContent>
                    
                </Card>

    )
}