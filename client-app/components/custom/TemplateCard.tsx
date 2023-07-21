import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"



export default function TemplateCard(){
    return (
        <Card className="hover:border-purple-600">
                <CardHeader>
                <CardTitle>
                    Feedback Template
                </CardTitle>
                </CardHeader>
                <CardContent>
                    This template will provide you feedback...
                </CardContent>
                
            </Card>
    )
}