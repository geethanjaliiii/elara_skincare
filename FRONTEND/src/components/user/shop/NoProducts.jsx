import { PackageX, RefreshCw, Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

export default function NoProducts() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <PackageX className="mx-auto h-24 w-24 text-gray-400" />
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">No Products Found</h2>
        <p className="mt-2 text-lg text-gray-600">
          We couldn't find any products matching your criteria.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-base text-gray-500">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    </div>
  )
}