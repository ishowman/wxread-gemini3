import { IDataService, BookList, BookListDetail, Book } from '../types';

// Next.js API Routes are served from the same origin
const API_BASE_URL = '/api'; 

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
    return this.request<BookList>(`/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
    });
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