
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from 'lucide-react'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    alert('Thank you for your message. We\'ll get back to you soon!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-yellow-900 mb-6">Send Us a Message</h2>
      <div className="space-y-4">
        <Input type="text" placeholder="Your Name" required className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500" />
        <Input type="email" placeholder="Your Email" required className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500" />
        <Input type="text" placeholder="Subject" required className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500" />
        <Textarea placeholder="Your Message" required className="border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500"  rows={4} />
      </div>
      <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white" disabled={isSubmitting}>
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            Send Message
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}

