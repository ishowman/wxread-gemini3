import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
}

export const Seo: React.FC<SeoProps> = ({ title, description }) => {
  useEffect(() => {
    // 设置页面标题
    document.title = `${title} | BookMarked`;

    // 设置 Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || 'BookMarked - 极简书单管理工具');

    // 设置 Open Graph Title (社交分享用)
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // 设置 Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description || '分享一个很棒的书单');

  }, [title, description]);

  return null;
};