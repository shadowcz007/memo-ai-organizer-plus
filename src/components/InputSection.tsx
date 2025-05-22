
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface InputSectionProps {
  onProcess: (text: string) => void;
  isProcessing: boolean;
}

const InputSection = ({ onProcess, isProcessing }: InputSectionProps) => {
  const [inputText, setInputText] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = () => {
    if (!inputText.trim()) {
      toast({
        title: "请输入内容",
        description: "请输入需要整理的碎片信息",
        variant: "destructive",
      });
      return;
    }
    
    onProcess(inputText);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Textarea 
            placeholder="在此粘贴或输入您的碎片信息..."
            className="min-h-[200px] resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isProcessing || !inputText.trim()}
            >
              {isProcessing ? "处理中..." : "开始整理"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputSection;
