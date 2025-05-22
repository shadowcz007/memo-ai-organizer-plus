
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSavedItems, deleteSavedItem } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { List } from "lucide-react";

const History = () => {
  const [items, setItems] = useState<Array<{
    id: string;
    content: string;
    html: string;
    tags: string[];
    timestamp: number;
  }>>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedItems = getSavedItems();
    setItems(savedItems);
  }, []);
  
  const handleDelete = (id: string) => {
    if (deleteSavedItem(id)) {
      setItems(items.filter(item => item.id !== id));
      toast({
        title: "删除成功",
        description: "已从历史记录中删除该项目",
      });
    }
  };
  
  const handleViewItem = (id: string) => {
    navigate(`/view/${id}`);
  };
  
  if (items.length === 0) {
    return (
      <div className="container max-w-4xl py-8">
        <h1 className="text-2xl font-bold mb-6">历史记录</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <List className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500">暂无历史记录</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/")}
            >
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">历史记录</h1>
      <div className="space-y-4">
        {items.map(item => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {new Date(item.timestamp).toLocaleString()}
              </CardTitle>
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="truncate text-gray-600 mb-4">
                {item.content.substring(0, 150)}...
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewItem(item.id)}
                >
                  查看
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(item.id)}
                >
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;
