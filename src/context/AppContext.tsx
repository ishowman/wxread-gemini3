'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, ViewMode, BookList, BookListDetail, Book } from '../types';
import { apiService } from '../services/api'; 
import { useToast } from '../components/Toast';

interface AppContextType {
  searchQuery: string;
  viewMode: ViewMode;
  isLoading: boolean;
  lists: BookList[];
  currentList: BookListDetail | null;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  refreshLists: () => Promise<void>;
  createNewList: (title: string, desc: string) => Promise<void>;
  removeList: (id: string) => Promise<void>;
  updateListDetails: (id: string, title: string, desc: string) => Promise<void>;
  fetchListDetails: (id: string) => Promise<void>;
  addNewBook: (listId: string, title: string, url: string) => Promise<void>;
  removeBook: (bookId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    searchQuery: '',
    viewMode: 'card', 
    isLoading: false,
    lists: [],
    currentList: null,
  });
  
  const { showToast } = useToast();
  const service = apiService;

  useEffect(() => {
    refreshLists();
  }, []);

  const refreshLists = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const lists = await service.getLists();
      setState(prev => ({ ...prev, lists, isLoading: false }));
    } catch (e) {
      console.error(e);
      // 在 Next.js 中，如果是 mock 模式，这里通常不会失败
      // 如果失败，通常是网络问题
      showToast('获取书单失败', 'error');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [service, showToast]);

  const createNewList = async (title: string, desc: string) => {
    try {
      await service.createList(title, desc);
      await refreshLists();
      showToast('书单创建成功', 'success');
    } catch (e) {
      showToast('创建失败', 'error');
    }
  };

  const removeList = async (id: string) => {
    try {
      await service.deleteList(id);
      await refreshLists();
      showToast('书单已删除', 'success');
    } catch (e) {
      showToast('删除失败', 'error');
    }
  };

  const updateListDetails = async (id: string, title: string, desc: string) => {
    await service.updateList(id, title, desc);
    await refreshLists();
    if (state.currentList && state.currentList.id === id) {
      fetchListDetails(id);
    }
  };

  const fetchListDetails = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const details = await service.getListDetails(id);
      setState(prev => ({ ...prev, currentList: details, isLoading: false }));
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [service]);

  const addNewBook = async (listId: string, title: string, url: string) => {
    try {
      await service.addBook(listId, title, url);
      await fetchListDetails(listId);
      await refreshLists();
      showToast('书籍添加成功', 'success');
    } catch (e) {
      showToast('添加书籍失败', 'error');
    }
  };

  const removeBook = async (bookId: string) => {
    if(!state.currentList) return;
    try {
      await service.deleteBook(bookId);
      await fetchListDetails(state.currentList.id);
      await refreshLists();
      showToast('书籍已移除', 'success');
    } catch (e) {
      showToast('移除失败', 'error');
    }
  };

  const setViewMode = (mode: ViewMode) => setState(prev => ({ ...prev, viewMode: mode }));
  const setSearchQuery = (query: string) => setState(prev => ({ ...prev, searchQuery: query }));

  return (
    <AppContext.Provider value={{
      ...state,
      setSearchQuery,
      setViewMode,
      refreshLists,
      createNewList,
      removeList,
      updateListDetails,
      fetchListDetails,
      addNewBook,
      removeBook
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};