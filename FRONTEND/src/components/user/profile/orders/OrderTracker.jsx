

import { Check, Clock, Cross,CrossIcon, Package, Truck } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function OrderTracker({ 
  currentStatus, 
  statusUpdates,
  expectedDelivery 
}) {
  const statuses = [ "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",]
  
  const getStatusIndex = (status) => statuses.indexOf(status)
  const currentStatusIndex = getStatusIndex(currentStatus)

  const getIcon = (status) => {
    switch(status) {
      case 'Pending':
        return Clock
      case 'Confirmed':
        return Check
      case 'Shipped':
        return Package
      case 'Delivered':
        return Truck
      case 'Cancelled':
        return CrossIcon
      default:
        return Clock
    }
  }

  const getStatusDetails = (status) => {
    switch(status) {
      case 'Pending':
        return {
          title: 'Processing your order',
          date: statusUpdates.ordered.date,
          time: statusUpdates.ordered.time,
        }
      case 'Confirmed':
        return {
          title: 'Order Confirmed',
          date: statusUpdates.ordered.date,
          time: statusUpdates.ordered.time,
        }
      case 'Shipped':
        return {
          title: 'Shipped',
          date: statusUpdates.shipped?.date,
          time: statusUpdates.shipped?.time,
        }
      
      case 'Delivered':
        return {
          title: 'Delivered',
          date: statusUpdates.delivered?.date,
          time: statusUpdates.delivered?.time,
        }
      case 'Cancelled':
        return {
          title: 'Cancelled',
          date: statusUpdates.delivered?.date,
          time: statusUpdates.delivered?.time,
        }
      case 'Returned':
        return {
          title: 'Returned',
          date: statusUpdates.delivered?.date,
          time: statusUpdates.delivered?.time,
        }
      default:
        return {
          title: '',
          date: '',
          time: '',
        }
    }
  }

  return (
    <div className="p-6 " >
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-[2.25rem] left-[1.625rem] w-[calc(100%-3.25rem)] h-1 bg-muted">
          <div
            className="h-full  transition-all duration-500"
            style={{
              width: `${
                currentStatusIndex === 0 ? '0%' :
                currentStatusIndex === 1 ? '33%' :
                currentStatusIndex === 2 ? '66%' :
                '100%'
              }`
            }}
          />
        </div>

        {/* Status Points */}
        <div className="relative flex justify-between">
          {statuses.map((status, index) => {
            const StatusIcon = getIcon(status)
            const details = getStatusDetails(status)
            const isCompleted = currentStatusIndex >= index
            const isPending = currentStatusIndex === index - 1
            
            return (
              <div
                key={status}
                className={
                  `flex flex-col items-center w-[100px]",
                  ${index === 0? "items-start":""}
                  ${index === statuses.length - 1? "items-end":""}`
                }
              >
                <div
                  className={`rounded-full p-2 border-2 
                    ${isCompleted ? "border-primary bg-primary text-primary-foreground" : ""}
                    ${isPending ? "border-primary" : ""}
                    ${!isCompleted && !isPending ? "border-muted bg-muted" : ""}
                  `}
                  
                >
                  <StatusIcon className="h-3 w-3" />
                </div>
                <div className="mt-4 space-y-1.5 ">
                    <div className='flex space-x-4'>
                  <p className={`
                    text-sm 
                    ${(isCompleted || isPending) && "text-foreground"}
                    ${!isCompleted && !isPending && "text-muted-foreground"}
                  `}>
                    {details.title}
                  </p>
                  </div>
                  {details.date && (
                    <p className="text-xs text-muted-foreground">
                      {details.date}
                      {details.time && `, ${details.time}`}
                    </p>
                  )}
                  {status === 'delivered' && !details.date && (
                    <p className="text-xs text-muted-foreground">
                      Expected by {expectedDelivery}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
