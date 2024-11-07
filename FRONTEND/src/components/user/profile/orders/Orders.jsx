import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ChevronRight, Package, Search, SlidersHorizontal, Star } from 'lucide-react'
import { Link } from 'react-router-dom'


const orders = [
  {
    id: 1,
    status: 'on-the-way',
    statusText: 'Delivery expected by Nov 10',
    date: '2023-11-10',
    product: {
      name: 'RED TAPE Casual Sneaker Shoes for Men',
      image: '/placeholder.svg',
      price: 1192,
      color: 'Black',
      size: '7'
    }
  },
  {
    id: 2,
    status: 'delivered',
    statusText: 'Delivered on Oct 31',
    date: '2023-10-31',
    product: {
      name: 'Cadbury Celebrations Assorted Chocolate',
      image: '/placeholder.svg',
      price: 196,
      size: 'Standard'
    }
  },
  {
    id: 3,
    status: 'cancelled',
    statusText: 'Cancelled on Aug 30',
    date: '2023-08-30',
    product: {
      name: 'ZEBRONICS Zeb-Jaguar Wireless Mouse',
      image: '/placeholder.svg',
      price: 346,
      color: 'Black'
    },
    cancelReason: 'The delivery partner was unable to deliver to your location'
  }
]

function RatingDialog({ productName }) {
  const [rating, setRating] = useState(0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Star className="mr-2 h-4 w-4" />
          Rate & Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate & Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-2">{productName}</h4>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`hover:text-yellow-400 ${
                    rating >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="Write your review here..."
          />
          <Button className="w-full">Submit Review</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FilterSheet({ children }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [selectedYears, setSelectedYears] = useState([])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(order.status)
    const matchesYear = selectedYears.length === 0 || selectedYears.includes(new Date(order.date).getFullYear().toString())
    return matchesSearch && matchesStatus && matchesYear
  })

  const FilterContent = () => (
    <div className="space-y-4 px-1">
      <div>
        <h3 className="text-sm font-medium mb-2">ORDER STATUS</h3>
        <div className="space-y-2">
          {['on-the-way', 'delivered', 'cancelled', 'returned'].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`${status}-status`}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStatuses([...selectedStatuses, status])
                  } else {
                    setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                  }
                }}
              />
              <label htmlFor={`${status}-status`} className="text-sm capitalize">
                {status.replace('-', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-sm font-medium mb-2">ORDER TIME</h3>
        <div className="space-y-2">
          {['2023', '2022', '2021', '2020'].map((year) => (
            <div key={year} className="flex items-center space-x-2">
              <Checkbox
                id={`${year}-year`}
                checked={selectedYears.includes(year)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedYears([...selectedYears, year])
                  } else {
                    setSelectedYears(selectedYears.filter(y => y !== year))
                  }
                }}
              />
              <label htmlFor={`${year}-year`} className="text-sm">
                {year}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/account" className="hover:underline">
          My Account
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>My Orders</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit hidden lg:block p-4">
          <h2 className="font-semibold mb-4">Filters</h2>
          <FilterContent />
        </Card>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your orders here"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <FilterSheet>
              <FilterContent />
            </FilterSheet>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="p-3">
                  <div className="flex gap-3">
                    <image
                      src={order.product.image}
                      alt={order.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{order.product.name}</h3>
                          <div className="text-sm text-muted-foreground space-x-2">
                            {order.product.color && <span>Color: {order.product.color}</span>}
                            {order.product.size && <span>Size: {order.product.size}</span>}
                          </div>
                        </div>
                        <p className="font-medium whitespace-nowrap">₹{order.product.price}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`${
                            order.status === 'delivered' ? 'bg-green-500' : 
                            order.status === 'cancelled' ? 'bg-red-500' : 
                            'bg-blue-500'
                          } text-white`}
                        >
                          {order.statusText}
                        </Badge>
                        {order.status !== 'cancelled' && <RatingDialog productName={order.product.name} />}
                      </div>
                      {order.status === 'cancelled' && (
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Package className="mr-2 h-4 w-4" />
                            Buy Again
                          </Button>
                        </div>
                      )}
                      {order.cancelReason && (
                        <p className="text-sm text-muted-foreground mt-2">{order.cancelReason}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}