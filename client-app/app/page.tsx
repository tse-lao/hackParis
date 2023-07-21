
import TemplateCard from '@/components/custom/TemplateCard'


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <div className="flex items-center justify-center mt-20 p-24">
        <div className="grid grid-cols-6 gap-8">

            <TemplateCard />
            <TemplateCard />
            <TemplateCard />
            <TemplateCard />
        </div>
    </div>
    </main>
  )
}



