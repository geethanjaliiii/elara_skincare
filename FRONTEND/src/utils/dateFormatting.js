export const formatDeliveryDate=(date)=>{
    const deliveryDate=new Date(date)
    const day=deliveryDate.getDate().toString().padStart(2,'0')
    const month=deliveryDate.toLocaleString('default',{month: 'long'})
    const year=deliveryDate.getFullYear()
    return `${day} - ${month} - ${year}`
  }
  export const formatOrderDate=(date)=>{
    
    const day=date.getDate().toString().padStart(2,'0');
    const month=date.toLocaleString('default',{month:'long'}).slice(0,3)
    const year=date.getFullYear()
    return `${month} ${day} , ${year}`
  
  }

  