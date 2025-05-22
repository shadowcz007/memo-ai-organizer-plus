
import { Button } from "@/components/ui/button";
import { Share, Save } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-brand-indigo">AI碎片信息整理助手</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">保存</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">分享</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
