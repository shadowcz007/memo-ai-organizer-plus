
interface SavedItem {
  id: string;
  content: string;
  html: string;
  tags: string[];
  timestamp: number;
}

const STORAGE_KEY = "ai_organizer_saved_items";

export const saveItemToLocalStorage = (content: string, html: string, tags: string[]): SavedItem => {
  const newItem: SavedItem = {
    id: Date.now().toString(),
    content,
    html,
    tags,
    timestamp: Date.now(),
  };
  
  // 获取现有项目
  const existingItems = getSavedItems();
  
  // 添加新项目
  const updatedItems = [newItem, ...existingItems];
  
  // 保存到本地存储
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  
  return newItem;
};

export const getSavedItems = (): SavedItem[] => {
  const itemsJson = localStorage.getItem(STORAGE_KEY);
  if (!itemsJson) return [];
  
  try {
    return JSON.parse(itemsJson);
  } catch (error) {
    console.error("Failed to parse saved items:", error);
    return [];
  }
};

export const getSavedItemById = (id: string): SavedItem | null => {
  const items = getSavedItems();
  return items.find(item => item.id === id) || null;
};

export const deleteSavedItem = (id: string): boolean => {
  const items = getSavedItems();
  const updatedItems = items.filter(item => item.id !== id);
  
  if (updatedItems.length === items.length) {
    return false; // Item not found
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  return true;
};

export const exportToFile = (content: string, filename = "整理结果.txt"): void => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};
