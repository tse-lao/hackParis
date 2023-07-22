
import TemplateCard from '@/components/custom/TemplateCard'
import CheckXMTP from '@/components/custom/extra/CheckXMTP'

const templates = [
  {
    link: "/form",
    title: "Forms",
    description: "An overview of all the forms that are available on the platform.",
  }, 
  {
    link: "/create",
    title: "create",
    description: "We will help you create your unique form here. ",
  }, 
  {
    link: "#",
    title: "XMTP Connect",
    description: <CheckXMTP />,
  }
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <div className="flex items-center justify-center mt-20 p-24">
        <div className="grid grid-cols-3 gap-4 items-center content-stretch">
            {templates.map((template, index) => (
                <TemplateCard key={index} link={template.link} title={template.title} description={template.description} />
            ))}

        </div>
    </div>
    </main>
  )
}



