
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Share, Save, Download } from "lucide-react";

interface OutputSectionProps {
  output: string;
  tags: string[];
  onSave: () => void;
  onExport: () => void;
  onShare: () => void;
}

const OutputSection = ({ 
  output, 
  tags, 
  onSave, 
  onExport, 
  onShare 
}: OutputSectionProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "已复制到剪贴板",
      description: "内容已成功复制到剪贴板",
    });
  };
  
  if (!output) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <div>整理结果</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              复制
            </Button>
            <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">导出</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onShare} className="flex items-center gap-1">
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline">分享</span>
            </Button>
          </div>
        </CardTitle>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div 
          className="markdown-content bg-gray-50 p-4 rounded-md" 
          dangerouslySetInnerHTML={{ __html: output }}
        />
      </CardContent>
    </Card>
  );
};

export default OutputSection;
