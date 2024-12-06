import Footer from '@/components/shared/Footer'
import ContactForm from '@/components/user/Contact/ContactForm'
import ContactInfo from '@/components/user/Contact/ContactInfo'

import Navbar from '@/components/shared/Navbar'

export default function ContactPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-yellow-900 sm:text-5xl md:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-yellow-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            We're here to help you achieve your best skin. Reach out to us for personalized skincare advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-100 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-100 rounded-full -ml-20 -mb-20"></div>
            <div className="relative">
              <ContactForm />
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-100 rounded-full -ml-20 -mt-20"></div>
              <div className="relative">
                <ContactInfo />
              </div>
            </div>
            {/* <div className="bg-white rounded-lg shadow-xl p-8 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Skincare products"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

