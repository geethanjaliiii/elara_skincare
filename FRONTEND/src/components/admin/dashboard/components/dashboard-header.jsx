import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



export function DashboardHeader({ period, setPeriod }) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

