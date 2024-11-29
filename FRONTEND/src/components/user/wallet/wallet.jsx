import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { creditMoneyToWallet, fetchWallet } from "@/services/wallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addMoneyToWallet } from "@/services/razorpay";
import toast, { Toaster } from "react-hot-toast";
import { useAddMoney } from "@/hooks/usePayment";
import { LoadingSpinner } from "@/App";

export default function Wallet() {
  const userId = useSelector((state) => state?.user?.userInfo?._id);
  const [addAmount, setAddAmount] = useState("");
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    data: wallet = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => fetchWallet(userId),
    retry:false
  });
if(isLoading) <LoadingSpinner/>
  const mutation = useMutation({
    mutationFn: creditMoneyToWallet,
    onSuccess: (data) => {
      console.log("Amount credited to wallet");
      setIsAddingMoney(false);
      setAddAmount("")
      toast.success("Amount credited to wallet");
      queryClient.invalidateQueries(["wallet"]);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const {handleAddMoneyToWallet}=useAddMoney(mutation,toast)
  const handleAddMoney = () => {
    if (!addAmount || isNaN(addAmount) || addAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if(addAmount>2000){
      toast.error("Maximum limit is ₹2000. Please enter a smaller amount.")
    }
    setIsAddingMoney(true);
   handleAddMoneyToWallet({userId,amount:addAmount})
  };
  return (
    <div className="max-w-auto mx-auto py-4 px-4 sm:px-6 lg:px-8">
     <Toaster/>
      <Card>
        <CardHeader >
          <div className="flex justify-center">
          <CardTitle>Wallet</CardTitle>
          </div>
         
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Wallet Balance Section */}
          <div className="grid gap-2">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Wallet Balance</h3>
            {/* Add Money to Wallet */}
            <div className="grid gap-2 ">
              <Dialog>
                <DialogTrigger>
                  <Button>Add Money</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Money</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <Input
                      type="number"
                      placeholder="Enter amount to add"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingMoney(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddMoney}
                      disabled={mutation.isLoading}
                    >
                      {mutation.isLoading ? "Adding..." : "Add Money"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            </div>
            <Card className="bg-muted">
              <CardContent className="p-4">
                <div className="text-lg">
                  Available wallet balance: ₹
                  {wallet?.balance ? wallet.balance.toFixed(2) : 0}
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
                {wallet.transactionHistory?.length > 0 ?
                  wallet.transactionHistory.map((transaction, index) => (
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
                  )):(<TableRow><div className="flex justify-center">No Transactions</div></TableRow>)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
