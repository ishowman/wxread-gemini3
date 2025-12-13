import { IDataService, BookList, BookListDetail, Book } from '../types';

/**
 * 本地存储服务实现
 * 用于在没有后端连接时的演示模式
 */
export class LocalStorageService implements IDataService {
  private LISTS_KEY = 'bookmarked_lists';
  private BOOKS_KEY = 'bookmarked_books';

  // 模拟网络延迟
  private async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getListsFromStorage(): BookList[] {
    const data = localStorage.getItem(this.LISTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getBooksFromStorage(): Book[] {
    const data = localStorage.getItem(this.BOOKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveLists(lists: BookList[]) {
    localStorage.setItem(this.LISTS_KEY, JSON.stringify(lists));
  }

  private saveBooks(books: Book[]) {
    localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
  }

  async getLists(): Promise<BookList[]> {
    await this.delay();
    const lists = this.getListsFromStorage();
    const books = this.getBooksFromStorage();
    
    // 计算每本书单的书籍数量
    return lists.map(list => ({
      ...list,
      bookCount: books.filter(b => b.listId === list.id).length
    })).sort((a, b) => b.createdAt - a.createdAt);
  }

  async createList(title: string, description?: string): Promise<BookList> {
    await this.delay();
    const lists = this.getListsFromStorage();
    const newList: BookList = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: Date.now(),
      bookCount: 0
    };
    this.saveLists([newList, ...lists]);
    return newList;
  }

  async deleteList(id: string): Promise<void> {
    await this.delay();
    const lists = this.getListsFromStorage().filter(l => l.id !== id);
    const books = this.getBooksFromStorage().filter(b => b.listId !== id);
    this.saveLists(lists);
    this.saveBooks(books);
  }

  async updateList(id: string, title: string, description?: string): Promise<BookList> {
    await this.delay();
    const lists = this.getListsFromStorage();
    const index = lists.findIndex(l => l.id === id);
    if (index === -1) throw new Error("List not found");
    
    lists[index] = { ...lists[index], title, description: description || lists[index].description };
    this.saveLists(lists);
    return lists[index];
  }

  async getListDetails(id: string): Promise<BookListDetail | null> {
    await this.delay();
    const lists = this.getListsFromStorage();
    const list = lists.find(l => l.id === id);
    if (!list) return null;

    const books = this.getBooksFromStorage().filter(b => b.listId === id);
    return { ...list, books: books.sort((a, b) => b.createdAt - a.createdAt) };
  }

  async addBook(listId: string, title: string, url: string): Promise<Book> {
    await this.delay();
    const books = this.getBooksFromStorage();
    const newBook: Book = {
      id: crypto.randomUUID(),
      listId,
      title,
      url,
      createdAt: Date.now()
    };
    this.saveBooks([newBook, ...books]);
    return newBook;
  }

  async deleteBook(bookId: string): Promise<void> {
    await this.delay();
    const books = this.getBooksFromStorage().filter(b => b.id !== bookId);
    this.saveBooks(books);
  }
}

export const dataService = new LocalStorageService();