
import TemplateCard from '@/components/custom/TemplateCard'
import CheckXMTP from '@/components/custom/extra/CheckXMTP'
import LighthouseCheck from '@/components/custom/extra/LighthouseCheck'
import Worldcoin from '@/components/custom/worldcoin/Worldcoin'
import { EyeOff, SendIcon, StoreIcon, UserCheck } from 'lucide-react'

const templates = [
  {
    link: "#",
    title: "XMTP Connect",
    description: <CheckXMTP />,
    icon: <SendIcon />
  }, 
  {
  link: "#",
  title: "Worldcoin",
  description: <Worldcoin />,
  icon: <UserCheck />
}, 
{
  link: "#",
  title: "Lighthouse",
  description: <LighthouseCheck />,
  icon: <StoreIcon />
},
{
  link: "#",
  title: "PrivacyScore",
  description: <LighthouseCheck />,
  icon: <EyeOff />
}
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {templates.map((template, index) => (
                <TemplateCard key={index} data={template} />
            ))}
      </div>
    </main>
  )
}



