import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookListDetail } from '../types';
import { apiService } from '../services/api'; // Use apiService directly or via context
import { BookIcon, ExternalLinkIcon } from '../components/Icons';
import { Seo } from '../components/Seo';

export const SharedList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<BookListDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useApp();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await apiService.getListDetails(id);
        setList(data);
      } catch (e) {
        console.error("Failed to load shared list", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="p-8 text-center text-slate-500">
      <Seo title="加载中..." />
      加载中...
    </div>
  );
  
  if (!list) return (
    <div className="p-8 text-center text-slate-500">
      <Seo title="书单未找到" />
      该分享链接已失效。
    </div>
  );

  const filteredBooks = list.books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* 动态 SEO：标题和描述与书单内容一致 */}
      <Seo title={list.title} description={list.description || `查看 ${list.title} 书单包含的书籍`} />

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{list.title}</h1>
        <p className="text-slate-600">{list.description}</p>
        <div className="mt-4 inline-block px-3 py-1 bg-white text-xs font-semibold text-blue-600 rounded-full border border-blue-200 uppercase tracking-wide">
          只读模式
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map(book => (
          <a 
            key={book.id}
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-500 group-hover:text-primary group-hover:bg-blue-50 transition">
                <BookIcon className="w-6 h-6" />
              </div>
              <ExternalLinkIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1 line-clamp-2 group-hover:text-primary transition">{book.title}</h3>
            <p className="text-xs text-slate-400 truncate mt-auto pt-2 border-t border-slate-50 group-hover:border-slate-100">
              {book.url}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};