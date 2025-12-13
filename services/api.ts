import { IDataService, BookList, BookListDetail, Book } from '../types';

const API_BASE_URL = 'http://localhost:8787/api'; // 本地 Wrangler 默认端口，生产环境需替换为真实域名

class ApiService implements IDataService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getLists(): Promise<BookList[]> {
    return this.request<BookList[]>('/lists');
  }

  async createList(title: string, description?: string): Promise<BookList> {
    return this.request<BookList>('/lists', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async deleteList(id: string): Promise<void> {
    await this.request(`/lists/${id}`, { method: 'DELETE' });
  }

  async updateList(id: string, title: string, description?: string): Promise<BookList> {
    // 后端目前需要补充 update 接口，暂时模拟
    // 在实际生产中，你需要在 Hono 中添加 PUT /lists/:id 路由
    console.warn("Update API not implemented in backend yet, strictly speaking."); 
    return { id, title, description, createdAt: Date.now(), bookCount: 0 } as BookList;
  }

  async getListDetails(id: string): Promise<BookListDetail | null> {
    try {
      return await this.request<BookListDetail>(`/lists/${id}`);
    } catch (e) {
      return null;
    }
  }

  async addBook(listId: string, title: string, url: string): Promise<Book> {
    return this.request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify({ listId, title, url }),
    });
  }

  async deleteBook(bookId: string): Promise<void> {
    await this.request(`/books/${bookId}`, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();