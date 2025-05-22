
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSavedItemById, exportToFile } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Download, Share } from "lucide-react";

const ViewItem = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<{
    id: string;
    content: string;
    html: string;
    tags: string[];
    timestamp: number;
  } | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!id) {
      navigate("/history");
      return;
    }
    
    const savedItem = getSavedItemById(id);
    if (!savedItem) {
      toast({
        title: "项目未找到",
        description: "无法找到请求的项目，请返回历史记录",
        variant: "destructive",
      });
      navigate("/history");
      return;
    }
    
    setItem(savedItem);
  }, [id, navigate, toast]);
  
  const handleExport = () => {
    if (item) {
      exportToFile(item.content);
      toast({
        title: "导出成功",
        description: "内容已成功导出为文本文件",
      });
    }
  };
  
  const handleShare = async () => {
    if (item && navigator.share) {
      try {
        await navigator.share({
          title: "AI整理结果",
          text: item.content,
        });
        toast({
          title: "分享成功",
          description: "内容已成功分享",
        });
      } catch (error) {
        console.error("分享失败:", error);
        // 如果用户取消分享，不显示错误提示
        if ((error as Error).name !== "AbortError") {
          toast({
            title: "分享失败",
            description: "内容分享失败，请重试",
            variant: "destructive",
          });
        }
      }
    } else {
      // 回退到复制到剪贴板
      navigator.clipboard.writeText(item?.content || "");
      toast({
        title: "已复制到剪贴板",
        description: "内容已成功复制到剪贴板",
      });
    }
  };
  
  if (!item) {
    return <div className="container py-8">加载中...</div>;
  }
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => navigate("/history")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回历史记录
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <div>{new Date(item.timestamp).toLocaleString()}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">导出</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-1">
                <Share className="h-4 w-4" />
                <span className="hidden sm:inline">分享</span>
              </Button>
            </div>
          </CardTitle>
          
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div 
            className="markdown-content bg-gray-50 p-4 rounded-md"
            dangerouslySetInnerHTML={{ __html: item.html }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewItem;
