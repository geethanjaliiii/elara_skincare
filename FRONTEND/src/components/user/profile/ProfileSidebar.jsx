

import React from 'react'
import { User, MapPin, ShoppingBag, Heart, Wallet, Ticket, AlertCircle, Trash2,DollarSign } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function ProfileSidebar({ user, activeItem, onNavigate }) {
  const navItems = [
    {
      group: 'Manage Account',
      items: [
        { label: 'My Profile', icon: User },
        { label: 'Address Book', icon: MapPin }
      ]
    },
    { label: 'My Orders', icon: ShoppingBag },
    { label: 'My Wishlist', icon: Heart },
    { label: 'Wallet', icon: Wallet },
    { label: 'Coupons', icon: Ticket },
    {label:"Refer & Earn", icon:DollarSign }
  ]

  const renderNavItems = () => (
    <nav className="space-y-2">
      {navItems.map((item, index) => (
        <div key={index}>
          {item.group ? (
            <div className="space-y-2">
              <div className="px-3 text-sm font-medium text-muted-foreground">
                {item.group}
              </div>
              {item.items.map((subItem) => (
                <Button
                  key={subItem.label}
                  variant={activeItem === subItem.label ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onNavigate(subItem.label)}
                >
                  <subItem.icon className="mr-2 h-4 w-4" />
                  <span className="lg:inline">{subItem.label}</span>
                </Button>
              ))}
            </div>
          ) : (
            <Button
              variant={activeItem === item.label ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigate(item.label)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span className="lg:inline">{item.label}</span>
            </Button>
          )}
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile view */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" >
              <User className="mr-2 h-4 w-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Profile Menu</SheetTitle>
              <SheetDescription>
                Navigate through your profile options
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {renderNavItems()}
              <Separator className="my-4" />
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-amber-600">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Deactivate Account
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block space-y-6 w-[300px]">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg'} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm text-muted-foreground">Hello,</div>
                <div className="font-semibold">{user.name}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {renderNavItems()}
            <Separator className="my-4" />
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-amber-600">
                <AlertCircle className="mr-2 h-4 w-4" />
                Deactivate Account
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
export default ProfileSidebar


// import React from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import {
//   User,
//   MapPin,
//   ShoppingBag,
//   Heart,
//   Wallet,
//   Ticket,
//   AlertCircle,
//   Trash2,
  
// } from "lucide-react"

// const ProfileSidebar = ({user, activeItem ,onNavigate}) => {
//   const navItems =[
//     {group:'Manage Account',
//      items:[
//             {label :'My Profile',icon: User},
//             {label : 'Address Book', icon: MapPin }
//         ]
//     },
//     { label: 'My Orders', icon: ShoppingBag },
//     { label: 'My Wishlist', icon: Heart },
//     { label: 'Wallet', icon: Wallet },
//     { label: 'Coupons', icon: Ticket }
//   ]
//   return (
//     <div  className="space-y-6">
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center space-x-4">
//             <Avatar className="h-16 w-16">
//               <AvatarImage src={'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg'} alt={user.name} />
//             </Avatar>
//             <div>
//               <div className="text-sm text-muted-foreground">Hello,</div>
//               <div className="font-semibold">{user.name}</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardContent className="p-4">
//           <nav className="space-y-2">
//             {navItems.map((item, index) => (
//               <div key={index}>
//                 {item.group ? (
//                   <div className="space-y-2">
//                     <div className="px-3 text-sm font-medium text-muted-foreground">
//                       {item.group}
//                     </div>
//                     {item.items.map((subItem) => (
//                       <Button
//                         key={subItem.label}
//                         variant={activeItem === subItem.label ? "secondary" : "ghost"}
//                         className="w-full justify-start"
//                         onClick={() => onNavigate(subItem.label)}
//                       >
//                         <subItem.icon className="mr-2 h-4 w-4" />
//                         {subItem.label}
//                       </Button>
//                     ))}
//                   </div>
//                 ) : (
//                   <Button
//                     variant={activeItem === item.label ? "secondary" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => onNavigate(item.label)}
//                   >
//                     <item.icon className="mr-2 h-4 w-4" />
//                     {item.label}
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </nav>
//           <Separator className="my-4" />
//           <div className="space-y-2">
//             <Button variant="ghost" className="w-full justify-start text-amber-600">
//               <AlertCircle className="mr-2 h-4 w-4" />
//               Deactivate Account
//             </Button>
//             <Button variant="ghost" className="w-full justify-start text-red-600">
//               <Trash2 className="mr-2 h-4 w-4" />
//               Delete Account
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default ProfileSidebar
