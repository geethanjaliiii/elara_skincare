import { useState } from 'react'
import { Button } from '../ui/button'// Assuming you have a Button component

export default function EvaraLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <a className="flex items-center justify-center" href="#">
          <span className="sr-only">EVARA</span>
          <span className="font-bold text-2xl">EVARA</span>
        </a>
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block absolute top-14 left-0 right-0 bg-white shadow-md lg:shadow-none lg:static`}>
          <ul className="flex flex-col lg:flex-row gap-4 p-4 lg:p-0">
            <li><a className="text-sm font-medium hover:underline underline-offset-4" href="#">Home</a></li>
            <li><a className="text-sm font-medium hover:underline underline-offset-4" href="#">Products</a></li>
            <li><a className="text-sm font-medium hover:underline underline-offset-4" href="#">About</a></li>
            <li><a className="text-sm font-medium hover:underline underline-offset-4" href="#">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Reveal Your Skin's True Potential
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Discover the power of nature-inspired skincare. Nourish, protect, and revitalize your skin with EVARA.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="transition-transform hover:scale-105">Shop Now</Button>
                  <Button variant="outline" className="transition-transform hover:scale-105">Learn More</Button>
                </div>
              </div>
              <img
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="550"
                src="/placeholder.svg"
                width="550"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Our Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
                  <img
                    alt={`Product ${item}`}
                    className="object-cover w-full h-60"
                    height="300"
                    src="/placeholder.svg"
                    width="400"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" className="transition-transform hover:scale-110">View Product</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Experience the Natural Difference</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <img
                alt="Natural ingredients"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="400"
                src="/placeholder.svg"
                width="600"
              />
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-gray-500 md:text-xl">
                  At EVARA, we believe in the power of nature. Our products are crafted with carefully selected natural ingredients to nourish and revitalize your skin. Experience the difference of truly natural skincare.
                </p>
                <Button className="w-fit transition-transform hover:scale-105">Discover Our Ingredients</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Customer Testimonials</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
                  <p className="text-gray-500 mb-4">"EVARA has transformed my skincare routine. My skin has never looked better!"</p>
                  <p className="font-semibold">- Happy Customer {item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 EVARA. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  )
}