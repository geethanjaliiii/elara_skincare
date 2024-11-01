import { Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumbs({ items }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground py-4">
      <Link to="/" className="flex items-center hover:text-primary">
        <Home className="mr-1 h-4 w-4" />
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}