import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookIcon, PlusIcon, TrashIcon, ShareIcon } from '../components/Icons';
import { Modal } from '../components/Modal';
import { Seo } from '../components/Seo';
import { useToast } from '../components/Toast'; // Import Toast hook
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { lists, searchQuery, viewMode, createNewList, removeList } = useApp();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  // 模糊搜索逻辑
  const filteredLists = lists.filter(list => 
    list.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (list.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    await createNewList(newListTitle, newListDesc);
    setIsModalOpen(false);
    setNewListTitle('');
    setNewListDesc('');
  };

  const copyShareLink = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止冒泡，防止触发 Link 跳转
    const url = `${window.location.origin}/#/shared/${id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      showToast('分享链接已复制！', 'success');
    } catch (err) {
      showToast('复制失败，请手动复制', 'error');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // 关键：阻止冒泡
    
    if (confirm("确定要删除这个书单吗？所有书籍也将被删除。")) {
      await removeList(id);
    }
  };

  return (
    <div>
      <Seo title="我的书单" description="管理和分享您最喜爱的书籍列表" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">我的书单</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition transform active:scale-95 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">新建书单</span>
        </button>
      </div>

      {filteredLists.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <BookIcon className="w-16 h-16 mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 text-lg">暂无书单，开始创建一个吧！</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'card' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredLists.map(list => (
            <Link 
              to={`/list/${list.id}`} 
              key={list.id}
              className={`group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all hover:border-blue-200 relative overflow-hidden ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
            >
              <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors line-clamp-1">{list.title}</h3>
                  {viewMode === 'card' && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                      {list.bookCount} 本
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[1.25rem]">
                  {list.description || '暂无描述'}
                </p>
                {viewMode === 'list' && (
                   <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium mr-4">
                     {list.bookCount} 本
                   </span>
                )}
              </div>
              
              <div className={`flex items-center gap-2 ${viewMode === 'card' ? 'mt-auto pt-4 border-t border-slate-100' : ''}`}>
                <button 
                  onClick={(e) => copyShareLink(e, list.id)}
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition"
                  title="分享书单"
                >
                  <ShareIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => handleDelete(e, list.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition ml-auto"
                  title="删除书单"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="新建书单"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">书单名称</label>
            <input 
              type="text" 
              required
              value={newListTitle}
              onChange={e => setNewListTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="例如：2024必读书目"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">描述（可选）</label>
            <textarea 
              value={newListDesc}
              onChange={e => setNewListDesc(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none h-24 resize-none"
              placeholder="这个书单主要关于..."
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            创建
          </button>
        </form>
      </Modal>
    </div>
  );
};