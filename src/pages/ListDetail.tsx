'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { ChevronLeftIcon, PlusIcon, TrashIcon, ExternalLinkIcon, BookIcon } from '../components/Icons';
import { Modal } from '../components/Modal';

export const ListDetail: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { currentList, fetchListDetails, addNewBook, removeBook, searchQuery, viewMode, isLoading } = useApp();
  
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookUrl, setBookUrl] = useState('');

  useEffect(() => {
    if (id) fetchListDetails(id);
  }, [id, fetchListDetails]);

  // 处理未找到的情况
  if (!isLoading && !currentList && id) {
     // 数据加载中的状态在 AppContext 已经处理，或者显示为空
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !bookTitle || !bookUrl) return;
    await addNewBook(id, bookTitle, bookUrl);
    setIsAddBookOpen(false);
    setBookTitle('');
    setBookUrl('');
  };

  const filteredBooks = currentList?.books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div>
      {/* 头部导航与信息 */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-primary mb-4 transition">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          返回书单列表
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{currentList?.title || '加载中...'}</h1>
            <p className="text-slate-500">{currentList?.description}</p>
          </div>
          {currentList && (
            <button 
              onClick={() => setIsAddBookOpen(true)}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition transform active:scale-95 font-medium shrink-0"
            >
              <PlusIcon className="w-5 h-5" />
              <span>添加书籍</span>
            </button>
          )}
        </div>
      </div>

      {/* 书籍列表 */}
      <div className={`grid gap-4 ${viewMode === 'card' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredBooks.map(book => (
          <div 
            key={book.id} 
            className={`bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition group ${viewMode === 'list' ? 'flex items-center justify-between' : 'flex flex-col'}`}
          >
            <div className={`flex items-start gap-3 ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
              <div className="bg-blue-50 text-primary p-2 rounded-lg shrink-0">
                <BookIcon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <a 
                  href={book.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-800 hover:text-primary transition truncate block"
                  title={book.title}
                >
                  {book.title}
                </a>
                <a 
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-blue-500 truncate block mt-1"
                >
                  {book.url}
                </a>
              </div>
            </div>

            <div className={`flex items-center gap-2 ${viewMode === 'card' ? 'mt-auto pt-4 border-t border-slate-50 justify-between' : 'ml-4'}`}>
              <a 
                href={book.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition flex items-center gap-1"
              >
                打开 <ExternalLinkIcon className="w-3 h-3" />
              </a>
              <button 
                onClick={() => removeBook(book.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                title="移除书籍"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {!isLoading && filteredBooks.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            {searchQuery ? '没有找到匹配的书籍' : '该书单暂时没有书籍'}
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        title="添加新书"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">书籍名称</label>
            <input 
              type="text" 
              required
              value={bookTitle}
              onChange={e => setBookTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="输入书籍名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">链接 (URL)</label>
            <input 
              type="url" 
              required
              value={bookUrl}
              onChange={e => setBookUrl(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="https://..."
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            确认添加
          </button>
        </form>
      </Modal>
    </div>
  );
};