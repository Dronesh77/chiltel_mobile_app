// src/components/SEO.jsx
import { useEffect } from 'react';
import { seoData } from '../data/seoData';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
}

interface SEOProps {
  page: keyof typeof seoData;
}

export function SEO({ page }: SEOProps) {
  useEffect(() => {
    const pageData = seoData[page];
    
    if (!pageData) {
      console.warn(`No SEO data found for page: ${page}`);
      return;
    }
    
    document.title = pageData.title;
    
    const metaTags = {
      'description': pageData.description,
      'keywords': pageData.keywords,
      // Open Graph tags
      'og:title': pageData.title,
      'og:description': pageData.description,
      'og:type': 'website',
      'og:url': `${window.location.origin}${pageData.canonicalUrl}`,
      // Twitter tags
      'twitter:card': 'summary',
      'twitter:title': pageData.title,
      'twitter:description': pageData.description
    };
    
    Object.entries(metaTags).forEach(([name, content]) => {
      let meta;
      
      if (name.startsWith('og:')) {
        meta = document.querySelector(`meta[property="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', name);
          document.head.appendChild(meta);
        }
      } else {
        meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
      }
      
      meta.setAttribute('content', content);
    });
    
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', `${window.location.origin}${pageData.canonicalUrl}`);
    
  }, [page]);

    return null;
}