import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import BannerList from './BannerList'
import BannerForm from './BannerForm'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast,{Toaster} from 'react-hot-toast'
import { LoadingSpinner } from '@/App'
import { createBanner, deleteBanner, getBanners, updateBanner } from '../api/banner'

export default function BannerManagement() {
  const [editingBanner, setEditingBanner] = useState(null)
  const queryClient = useQueryClient()


  const { data: banners, isLoading, isError } = useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
  })

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success( 'Banner created successfully' )
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({id,updatedData})=>updateBanner({id,updatedData}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      setEditingBanner(null)
      toast.success('Banner updated successfully' )
    },
    
  })

  const deleteMutation = useMutation({
    mutationFn:(id)=> deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner status updated.' )
    },
  })

  const handleEdit = (banner) => {
    setEditingBanner(banner)
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id)
  }

  const handleSubmit = (banner) => {
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner._id, updatedData: banner })
    } else {
      createMutation.mutate(banner)
    }
  }

  if (isLoading) return <LoadingSpinner/>
  if (isError) return toast.error("Failed to load banners")

  return (
    <Card className="w-full max-w-4xl mx-auto">
        <Toaster/>
      <CardHeader>
        <CardTitle>Banner Management</CardTitle>
      </CardHeader>
      <CardContent>
        <BannerForm onSubmit={handleSubmit} initialBanner={editingBanner} />
        <BannerList 
          banners={banners || []} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </CardContent>
      <Toaster />
    </Card>
  )
}

