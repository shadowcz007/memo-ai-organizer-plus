
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SettingsDialog from "./SettingsDialog";
import { defaultApiSettings } from "@/lib/api";

interface NavbarProps {
  settings: typeof defaultApiSettings;
  onSaveSettings: (settings: typeof defaultApiSettings) => void;
}

const Navbar = ({ settings, onSaveSettings }: NavbarProps) => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary">
            AI碎片整理助手
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button 
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
            >
              首页
            </Button>
          </Link>
          
          <Link to="/history">
            <Button 
              variant={location.pathname.includes("/history") || location.pathname.includes("/view") ? "default" : "ghost"}
              size="sm"
            >
              历史记录
            </Button>
          </Link>
          
          <SettingsDialog 
            settings={settings} 
            onSaveSettings={onSaveSettings} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
