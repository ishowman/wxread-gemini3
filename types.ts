// 定义视图模式：卡片或列表
export type ViewMode = 'card' | 'list';

// 书籍接口
export interface Book {
  id: string;
  listId: string;
  title: string;
  url: string;
  createdAt: number;
}

// 书单接口
export interface BookList {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  bookCount: number; // 辅助字段，用于UI展示
}

// 包含书籍详情的书单
export interface BookListDetail extends BookList {
  books: Book[];
}

// 应用上下文状态接口
export interface AppState {
  searchQuery: string;
  viewMode: ViewMode;
  isLoading: boolean;
  lists: BookList[];
  currentList: BookListDetail | null;
}

// API 服务接口定义 (Adapter Pattern)
export interface IDataService {
  getLists(): Promise<BookList[]>;
  createList(title: string, description?: string): Promise<BookList>;
  deleteList(id: string): Promise<void>;
  updateList(id: string, title: string, description?: string): Promise<BookList>;
  getListDetails(id: string): Promise<BookListDetail | null>;
  addBook(listId: string, title: string, url: string): Promise<Book>;
  deleteBook(bookId: string): Promise<void>;
}