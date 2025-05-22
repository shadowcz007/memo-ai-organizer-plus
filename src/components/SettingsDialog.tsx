
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface ApiSettings {
  apiUrl: string;
  apiKey: string;
  model: string;
}

interface SettingsDialogProps {
  settings: ApiSettings;
  onSaveSettings: (settings: ApiSettings) => void;
}

const SettingsDialog = ({ settings, onSaveSettings }: SettingsDialogProps) => {
  const [localSettings, setLocalSettings] = useState<ApiSettings>(settings);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSave = () => {
    onSaveSettings(localSettings);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API 设置</DialogTitle>
          <DialogDescription>
            配置用于AI处理的API参数
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiUrl" className="text-right">
              API URL
            </Label>
            <Input
              id="apiUrl"
              value={localSettings.apiUrl}
              onChange={(e) => setLocalSettings({ ...localSettings, apiUrl: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={localSettings.apiKey}
              onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Input
              id="model"
              value={localSettings.model}
              onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>保存设置</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
