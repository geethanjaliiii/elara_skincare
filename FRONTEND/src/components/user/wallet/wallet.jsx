import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function Wallet({ customerName = "Customer Name", balance = 4890.00, transactions = [
  { id: "#9374034804", date: "25-07-2024", amount: 800, type: "debit" },
  { id: "#9374034804", date: "25-07-2024", amount: 800, type: "credit" },
  { id: "#9374034804", date: "25-07-2024", amount: 800, type: "debit" },
  { id: "#9374034804", date: "25-07-2024", amount: 800, type: "debit" },
  { id: "#9374034804", date: "25-07-2024", amount: 800, type: "debit" },
] }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-right mb-4">
        Welcome! <span className="text-primary">{customerName}</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">Wallet Balance</h3>
            <Card className="bg-muted">
              <CardContent className="p-4">
                <div className="text-lg">
                  Available wallet balance : ₹{balance.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">Wallet Transaction History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Debit / Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "credit" ? "Amount Credited" : "Amount Debited"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}