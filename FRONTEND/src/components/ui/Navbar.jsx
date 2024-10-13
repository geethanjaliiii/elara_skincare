// components/ui/Navbar.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FiSearch, FiShoppingCart, FiMenu } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif">Elara</h1>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary">HOME</a>
          <a href="#" className="text-sm font-medium hover:text-primary">SHOP</a>
          <a href="#" className="text-sm font-medium hover:text-primary">ABOUT US</a>
          <a href="#" className="text-sm font-medium hover:text-primary">CONTACT</a>
        </nav>
        <div className="flex items-center space-x-4">
          <FiSearch className="text-muted-foreground" />
          <FiShoppingCart className="text-muted-foreground" />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FiMenu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <a href="#" className="text-sm font-medium hover:text-primary">HOME</a>
            <a href="#" className="text-sm font-medium hover:text-primary">SHOP</a>
            <a href="#" className="text-sm font-medium hover:text-primary">ABOUT US</a>
            <a href="#" className="text-sm font-medium hover:text-primary">CONTACT</a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
