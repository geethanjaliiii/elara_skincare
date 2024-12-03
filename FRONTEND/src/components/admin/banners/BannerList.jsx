
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'



export default function BannerList({ banners, onEdit, onDelete }) {
    console.log(banners);
    
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {banners?.length>0 && banners?.map((banner) => (
          <TableRow key={banner._id}>
            <TableCell>{banner.title}</TableCell>
            <TableCell>{banner.content}</TableCell>
            <TableCell>
                <button  variant="destructive">
                <Switch checked={banner.isActive} onClick={() => onDelete(banner._id)}/>
                </button>
              
            </TableCell>
            <TableCell>
              <Button variant="outline" className="mr-2" onClick={() => onEdit(banner)}>
                Edit
              </Button>
              {/* <Button variant="destructive" onClick={() => onDelete(banner._id)}>
                Delete
              </Button> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

