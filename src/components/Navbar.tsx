import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">Easy Record</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button variant="ghost">HOME</Button>
            <Button variant="ghost">CART</Button>
            <Button variant="ghost">PRE ORDER</Button>
            <Button variant="ghost">ABOUT</Button>
            <Button variant="ghost">CONTACT</Button>
            
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>OW</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};