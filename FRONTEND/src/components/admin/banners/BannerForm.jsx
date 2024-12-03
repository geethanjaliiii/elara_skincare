import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { uploadImageToCloudinary } from '@/services/uploadImageToCloudinary'
import toast, { Toaster } from 'react-hot-toast'


export default function BannerForm({ onSubmit, initialBanner }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const[image,setImage]=useState(null);
  const[imageUrl,setImageUrl]=useState('')
  const [isActive, setIsActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialBanner) {
      setTitle(initialBanner.title)
      setContent(initialBanner.content)
      setIsActive(initialBanner.isActive)
      setImageUrl(initialBanner.image || '')
    } else {
    resetForm()
    }
  }, [initialBanner])

  const resetForm = () => {
    setTitle('')
    setContent('')
    setIsActive(false)
    setImage(null)
    setImageUrl('')
    setPreviewUrl('')
    setLoading(false)
  }
  const handleImageChange=(e)=>{
    const file=e.target.files[0]
    if(file){
        setImage(file)
        const preview = URL.createObjectURL(file)
        setPreviewUrl(preview)
    }else{
        setPreviewUrl("")
    }
    
  }
  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!title.trim() ||!content.trim()||!image && !initialBanner ){
        return toast.error("Please fill all the fields properly.")
    }
    setLoading(true) // Start loading

   let uploadedImageUrl=imageUrl
   if(image){
    try {
         uploadedImageUrl=await uploadImageToCloudinary(image)
    } catch (error) {
        console.error('Image upload failed',error);
        return 
    }
   }
    onSubmit({ title, content, isActive ,image:uploadedImageUrl})
   resetForm()
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Toaster/>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          placeholder='Enter Title'
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder='Enter Content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" onChange={handleImageChange} accept="image/*" />
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Selected Preview"
              className="max-w-xs rounded"
            />
          </div>
        )}
        {imageUrl && !previewUrl &&(
          <div className="mt-2">
            <img src={imageUrl} alt="Uploaded Preview" className="max-w-xs rounded" />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading?initialBanner ? 'Updating..':'Uploading..':initialBanner?'Update Banner' : 'Create Banner'}
      </Button>
    </form>
  )
}

