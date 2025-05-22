
interface ApiSettings {
  apiUrl: string;
  apiKey: string;
  model: string;
}

interface ProcessTextResponse {
  content: string;
  tags: string[];
}

export const processTextWithAPI = async (
  text: string,
  settings: ApiSettings
): Promise<ProcessTextResponse> => {
  try {
    const { apiUrl, apiKey, model } = settings;
    
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "你是一个专业的信息整理助手。你的任务是：\n1. 将用户提供的碎片信息进行结构化整理\n2. 自动添加合适的标签（如#工作、#生活、#学习等）\n3. 将整理后的内容格式化为Markdown格式，包括适当的标题、列表和强调\n4. 返回格式化后的内容和标签列表"
          },
          {
            role: "user",
            content: text,
          },
        ],
        stream: false,
        max_tokens: 1024,
        enable_thinking: false,
      }),
    };

    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const formattedContent = data.choices[0].message.content;
    
    // 从内容中提取标签
    const tagRegex = /#[\u4e00-\u9fa5a-zA-Z0-9]+/g;
    const foundTags = formattedContent.match(tagRegex) || [];
    
    // 将Markdown转换为HTML
    const htmlContent = markdownToHtml(formattedContent);
    
    return {
      content: htmlContent,
      tags: foundTags,
    };
  } catch (error) {
    console.error("Error processing text:", error);
    throw error;
  }
};

// 简单的Markdown转HTML实现
const markdownToHtml = (markdown: string): string => {
  let html = markdown
    // 标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 列表
    .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/^(\d+)\. (.*$)/gim, '<ol><li>$2</li></ol>')
    // 代码块
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // 粗体
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/_(.*?)_/gim, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    // 换行
    .replace(/\n/gim, '<br>');
  
  // 修复嵌套问题
  html = html
    .replace(/<\/ul><br><ul>/g, '')
    .replace(/<\/ol><br><ol>/g, '')
    .replace(/<br><br>/g, '<br>');
  
  return html;
};

// 默认API设置
export const defaultApiSettings: ApiSettings = {
  apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
  apiKey: "",
  model: "Qwen/Qwen3-8B",
};
