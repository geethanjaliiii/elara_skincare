import { adminAxiosInstance } from "@/config/axiosConfig";

export const fetchSalesData =async({queryKey})=>{
    const [,{filterType,currentPage,ordersPerPage,startDate,endDate}]=queryKey;

    const{data}=await adminAxiosInstance.get('/api/admin/sales',{
        params:{filterType,startDate,endDate,currentPage,ordersPerPage}
    })
    return data
  }