// AddressCard.tsx

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Home, Building2, Check, MoreVertical } from "lucide-react"


export function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  return (
    <Card className="relative">
      <CardContent className="p-6">
        <div className="absolute right-4 top-4">
          <Badge variant={address.isDefault ? "default" : "outline"}>
            {address.addressType === "Home" ? <Home className="mr-1 h-3 w-3" /> : <Building2 className="mr-1 h-3 w-3" />}
            {address.addressType}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(address)}>Edit address</DropdownMenuItem>
              {!address.isDefault && <DropdownMenuItem onClick={() => onSetDefault(address._id)}>Set as default</DropdownMenuItem>}
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(address._id)}>Delete address</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-4">
          <div><h3 className="font-medium">{address.fullname}</h3><p>{address.phone}</p></div>
          <p>{address.addressLine}</p><p>{address.city}, {address.state} - {address.pincode}</p>
          {address.landmark && <p className="text-muted-foreground">Landmark: {address.landmark}</p>}
          {address.isDefault && <Badge variant="secondary"><Check className="mr-1 h-3 w-3" />Default Address</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}
