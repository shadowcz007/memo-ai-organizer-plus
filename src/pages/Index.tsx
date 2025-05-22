
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import InputSection from "@/components/InputSection";
import OutputSection from "@/components/OutputSection";
import { processTextWithAPI, defaultApiSettings } from "@/lib/api";
import { saveItemToLocalStorage, exportToFile } from "@/lib/storage";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [settings, setSettings] = useState(defaultApiSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState("");
  const [rawOutput, setRawOutput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  // 从localStorage加载API设置
  useEffect(() => {
    const savedSettings = localStorage.getItem("ai_organizer_api_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);
  
  // 保存API设置到localStorage
  const saveSettings = (newSettings: typeof defaultApiSettings) => {
    setSettings(newSettings);
    localStorage.setItem("ai_organizer_api_settings", JSON.stringify(newSettings));
    toast({
      title: "设置已保存",
      description: "API设置已成功保存",
    });
  };
  
  // 处理文本
  const processText = async (text: string) => {
    if (!settings.apiKey) {
      toast({
        title: "API密钥缺失",
        description: "请在设置中配置API密钥",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await processTextWithAPI(text, settings);
      setOutput(result.content);
      setRawOutput(text);
      setTags(result.tags);
      
      toast({
        title: "处理完成",
        description: "文本已成功整理",
      });
    } catch (error) {
      console.error("处理失败:", error);
      toast({
        title: "处理失败",
        description: `发生错误: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // 保存到本地存储
  const handleSave = () => {
    if (!output || !rawOutput) return;
    
    try {
      saveItemToLocalStorage(rawOutput, output, tags);
      toast({
        title: "保存成功",
        description: "已保存到本地存储",
      });
    } catch (error) {
      console.error("保存失败:", error);
      toast({
        title: "保存失败",
        description: "保存到本地存储时发生错误",
        variant: "destructive",
      });
    }
  };
  
  // 导出到文件
  const handleExport = () => {
    if (!rawOutput) return;
    
    try {
      exportToFile(rawOutput);
      toast({
        title: "导出成功",
        description: "内容已成功导出为文本文件",
      });
    } catch (error) {
      console.error("导出失败:", error);
      toast({
        title: "导出失败",
        description: "导出文件时发生错误",
        variant: "destructive",
      });
    }
  };
  
  // 分享内容
  const handleShare = async () => {
    if (!rawOutput) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI整理结果",
          text: rawOutput,
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
      navigator.clipboard.writeText(rawOutput);
      toast({
        title: "已复制到剪贴板",
        description: "内容已成功复制到剪贴板",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar settings={settings} onSaveSettings={saveSettings} />
      
      <div className="container max-w-4xl py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">AI碎片信息整理助手</h1>
          <p className="text-gray-600">
            将杂乱无章的碎片信息转化为结构化、条理清晰的内容
          </p>
        </div>
        
        <div className="space-y-8">
          <InputSection 
            onProcess={processText}
            isProcessing={isProcessing}
          />
          
          {output && (
            <OutputSection
              output={output}
              tags={tags}
              onSave={handleSave}
              onExport={handleExport}
              onShare={handleShare}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
