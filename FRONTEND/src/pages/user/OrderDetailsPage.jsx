import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import OrderDetails from '@/components/user/profile/orders/OrderDetails'
import React from 'react'

const OrderDetailsPage = () => {
  return (
    <div>
        <Navbar/>
        <OrderDetails/>
        <Footer/>
    </div>
  )
}

export default OrderDetailsPage
