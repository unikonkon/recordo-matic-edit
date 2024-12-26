import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, User, CreditCard, Headphones, Mail, Info, FileText, LogOut } from "lucide-react";
import { useFirebase } from "@/contexts/FirebaseContext";

const Settings = () => {
  const { user } = useFirebase();
  const userCredit = "30.00 IC";
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.photoURL || "https://github.com/shadcn.png"} />
              <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">สวัสดี, {user?.displayName || "Guest"}</h2>
              <p className="text-sm text-gray-600">เครดิตที่ใช้งานได้ {userCredit}</p>
              {user?.email && (
                <p className="text-sm text-gray-500">{user.email}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          {[
            { icon: User, label: "บัญชีผู้ใช้" },
            { icon: CreditCard, label: "เติมเครดิต" },
            { icon: Headphones, label: "ส่งฟีดแบ็กการใช้งาน" },
            { icon: Mail, label: "ติดต่อเรา" },
            { icon: Info, label: "เกี่ยวกับเรา" },
            { icon: FileText, label: "นโยบายความเป็นส่วนตัว" },
            { icon: FileText, label: "ข้อกำหนดการใช้งาน" },
          ].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between h-14 px-4"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-gray-500" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>
          ))}
          
          <Button
            variant="ghost"
            className="w-full justify-between h-14 px-4 text-red-500"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              <span>ออกจากระบบ</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          v1.0.3 (81)
        </p>
      </div>
    </div>
  );
};

export default Settings;