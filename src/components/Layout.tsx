'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { SearchIcon, GridIcon, ListIcon } from './Icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { searchQuery, setSearchQuery, viewMode, setViewMode } = useApp();
  const pathname = usePathname();
  const isSharedPage = pathname?.startsWith('/shared');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 顶部固定栏 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800 hover:opacity-80 transition">
            <span className="bg-primary text-white p-1 rounded-md">BM</span>
            <span className="hidden sm:block">BookMarked</span>
          </Link>

          {/* 搜索框 (根据需求，始终置顶) */}
          <div className="flex-1 max-w-md relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="搜索书单或书籍..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white border-2 focus:border-primary rounded-full outline-none transition-all text-sm sm:text-base"
            />
          </div>

          {/* 视图切换 (只在非分享页或根据需求显示) */}
          {!isSharedPage && (
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                title="卡片视图"
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                title="列表视图"
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© 2024 BookMarked. Simple Book Lists.</p>
      </footer>
    </div>
  );
};