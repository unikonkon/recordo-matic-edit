import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { useFirebase } from "@/contexts/FirebaseContext";

export const Navbar = () => {
  const { toast } = useToast();
  const { user } = useFirebase();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-xl font-bold text-primary">Easy Record</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Button variant="ghost" asChild>
              <Link to="/">HOME</Link>
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              SIGN OUT
            </Button>
            <div>{user.email}</div>

            <Link to="/settings" className="cursor-pointer">
              <Avatar >
                <AvatarImage src="https://github.com/shadcn.png"  />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </Link>
           
          </div>
        </div>
      </div>
    </nav>
  );
};