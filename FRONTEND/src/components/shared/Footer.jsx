import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-stone-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Elara</h3>
            <p className="text-sm text-muted-foreground">Your skincare solution</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm space-y-1">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Home</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Shop</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Policies</h4>
            <ul className="text-sm space-y-1">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Payment Options</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Returns</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-2">Stay up to date with our latest offers</p>
            <Input type="email" placeholder="Your email" />
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2023 Elara. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;