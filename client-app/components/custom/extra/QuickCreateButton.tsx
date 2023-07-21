"use client"
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export default function QuickCreateButton() {
  const path = usePathname()

  if (path == '/create') return null


  return (

    <Link href="/create" className='fixed right-12 bottom-12 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full hover:scale-150'>
        <PlusIcon className='lg:h-14 lg:w-14 md:h-12 md:w-12 sm:h-8 sm:w-8 w-4 h-4 ' />
    </Link>

  )
}
