import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import toast,{ Toaster } from "react-hot-toast";
import { adminAxiosInstance } from "@/config/axiosConfig";


export function CategoryOfferManagement({ categoryOffers, onAddOffer }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [offerName, setOfferName] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false)

  async function fetchCategories() {
    setLoading(true);
    try {
      const response = await adminAxiosInstance.get(
        '/api/admin/categories/offer'
      );
      setCategories(response.data.categories );
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedCategory || !offerName.trim() || !discountPercentage || !startDate || !endDate) {
      toast.error('Please fill in all fields')
      return
    }
  
    const offerData = {
      targetId: selectedCategory,
      name: offerName,
      offerValue: parseInt(discountPercentage),
      startDate,
      endDate,
    }
  
    onAddOffer(offerData)
    // Reset form fields
    setIsDialogOpen(false)
    setSelectedCategory(null)
    setOfferName('')
    setDiscountPercentage('')
    setStartDate('')
    setEndDate('')
   
    
  }
  
  return (
    <div className="space-y-8">
      <Toaster/>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Current Category Offers</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category Offer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category Offer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Select Category</Label>
                  <Select
                    onValueChange={setSelectedCategory}
                    value={selectedCategory}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.length>0 && categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerName">Offer Name</Label>
                  <Input
                    id="offerName"
                    value={offerName}
                    onChange={(e) => setOfferName(e.target.value)}
                    placeholder="Enter offer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">
                    Discount Percentage
                  </Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="Enter discount percentage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Offer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {categoryOffers?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Offer Name</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                {/* <TableHead>Is Active</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryOffers.length>0 && categoryOffers.map((offer) => (
                <TableRow key={offer._id}>
                  <TableCell>{offer?.targetId?.name||''}</TableCell>
                  <TableCell>{offer.name}</TableCell>
                  <TableCell>{offer.offerValue}%</TableCell>
                  <TableCell>{offer.startDate}</TableCell>
                  <TableCell>{offer.endDate}</TableCell>
                  {/* <TableCell>
                  <Switch
                    checked={offer.isActive}
                    onCheckedChange={() => toggleOfferStatus(offer.id)}
                    aria-label={`Toggle active status for ${offer.name}`}
                  />
                </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-lg font-semibold text-gray-700">
              No offers found!
            </p>
            <span className="text-sm text-gray-500">
              Currently, there are no active product offers.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
