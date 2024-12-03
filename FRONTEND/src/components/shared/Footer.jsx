import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter } from 'lucide-react'

 function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">ELARA</h3>
            <p className="text-xs sm:text-sm text-gray-600">Nurturing your skin with nature&apos;s finest ingredients.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Products', 'About Us', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li>123 Skincare Lane</li>
              <li>Beauty City, BC 12345</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@elaraskincare.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full text-xs sm:text-sm"
                aria-label="Email for newsletter"
              />
              <Button type="submit" className="w-full text-xs sm:text-sm">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200 py-6">
          <p className="text-xs sm:text-sm text-center text-gray-500">&copy; {new Date().getFullYear()} Elara Skincare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer


// import { Input } from "@/components/ui/input";

// const Footer = () => {
//   return (
//     <footer className="bg-stone-100 ">
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//           <div>
//             <h3 className="font-semibold mb-2">Elara</h3>
//             <p className="text-sm text-muted-foreground">Your skincare solution</p>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-2">Quick Links</h4>
//             <ul className="text-sm space-y-1">
//               <li><a href="#" className="text-muted-foreground hover:text-primary">Home</a></li>
//               <li><a href="#" className="text-muted-foreground hover:text-primary">Shop</a></li>
//               <li><a href="#" className="text-muted-foreground hover:text-primary">About</a></li>
//               <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-2">Policies</h4>
//             <ul className="text-sm space-y-1">
//               <li><a href="#" className="text-muted-foreground hover:text-primary">Payment Options</a></li>
//               <li><a href="#" className="text-muted-foreground hover:text-primary">Returns</a></li>
//               <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-2">Newsletter</h4>
//             <p className="text-sm text-muted-foreground mb-2">Stay up to date with our latest offers</p>
//             <Input type="email" placeholder="Your email" />
//           </div>
//         </div>
//       </div>
//       <div className="border-t">
//         <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
//           © 2023 Elara. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;