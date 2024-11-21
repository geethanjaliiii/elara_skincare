import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWallet } from "@/services/wallet";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function Wallet() {
  const userId=useSelector((state)=>state?.user?.userInfo?._id)
  
  const {data:wallet={},isLoading,error}=useQuery({
    queryKey:['wallet'],
    queryFn:()=>fetchWallet(userId)
  })
  
  return (
    <div className="max-w-auto mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Wallet Balance Section */}
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">Wallet Balance</h3>
            <Card className="bg-muted">
              <CardContent className="p-4">
                <div className="text-lg">
                  Available wallet balance: ₹{wallet?.balance?wallet.balance.toFixed(2):0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Transactions Section */}
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">Wallet Transaction History</h3>
            <Table className="table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallet.transactionHistory?.length>0 && wallet.transactionHistory.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell
                      className={
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </TableCell>
                    <TableCell
                      className={
                        transaction.status === "success"
                          ? "text-green-600"
                          : transaction.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


// export default function Wallet({ customerName = "Customer Name", balance = 4890.00, transactions = [
//   { id: "#9374034804", date: "25-07-2024", amount: 800, type: "debit" },
//   { id: "#9374034804", date: "25-07-2024", amount: 800, type: "credit" },
//   { id: "#9374034804", date: "25-07-2024", amount: 800, type: "debit" },
//   { id: "#9374034804", date: "25-07-2024", amount: 800, type: "debit" },
//   { id: "#9374034804", date: "25-07-2024", amount: 800, type: "debit" },
// ] }) {
//   return (
//     <div className="max-w-4xl mx-2 py-4">
     
//       <Card>
//         <CardHeader>
//           <CardTitle>Wallet</CardTitle>
//         </CardHeader>
//         <CardContent className="grid gap-6">
//           <div className="grid gap-2">
//             <h3 className="text-lg font-medium">Wallet Balance</h3>
//             <Card className="bg-muted">
//               <CardContent className="p-4">
//                 <div className="text-lg">
//                   Available wallet balance : ₹{balance.toFixed(2)}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//           <div className="grid gap-2">
//             <h3 className="text-lg font-medium">Wallet Transaction History</h3>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Transaction ID</TableHead>
//                   <TableHead>Transaction Date</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Debit / Credit</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {transactions.map((transaction, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{transaction.id}</TableCell>
//                     <TableCell>{transaction.date}</TableCell>
//                     <TableCell>{transaction.amount}</TableCell>
//                     <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
//                       {transaction.type === "credit" ? "Amount Credited" : "Amount Debited"}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }