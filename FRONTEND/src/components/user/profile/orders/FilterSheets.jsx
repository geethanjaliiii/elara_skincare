import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FilterSheet({ children }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="
          w-full h-full fixed inset-0 z-50 bg-white sm:inset-auto sm:w-[500px] sm:h-[80vh] 
          sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg 
          shadow-lg overflow-auto"
      >
        <SheetHeader className="border-b p-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}


// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
//   } from '@/components/ui/sheet'
//   import { SlidersHorizontal } from 'lucide-react'
//   import { Button } from '@/components/ui/button'
// export default function FilterSheet({ children }) {
//     return (
//       <Sheet>
//         <SheetTrigger asChild>
//           <Button variant="outline" size="sm" >
//             <SlidersHorizontal className="mr-2 h-4 w-4" />
//             Filters
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left" className="w-[300px] sm:w-[400px]">
//           <SheetHeader>
//             <SheetTitle>Filters</SheetTitle>
//           </SheetHeader>
//           {children}
//         </SheetContent>
//       </Sheet>
//     )
//   }
  