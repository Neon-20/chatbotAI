import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#e84315" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="#e84315" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="#e84315" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>DomusAI Docs</span>
    </div>
  ),
  project: {
    link: 'https://github.com/your-org/chatbotAI',
  },
  chat: {
    link: 'https://discord.gg/domusai',
  },
  docsRepositoryBase: 'https://github.com/your-org/chatbotAI/tree/main/docs',
  footer: {
    text: (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>© 2024 AlterDomus. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="/privacy" style={{ color: '#e84315' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#e84315' }}>Terms of Service</a>
          <a href="/support" style={{ color: '#e84315' }}>Support</a>
        </div>
      </div>
    )
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – DomusAI Documentation'
      }
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="DomusAI Documentation" />
      <meta property="og:description" content="Comprehensive documentation for DomusAI - Advanced AI-powered chat interface" />
      <meta name="description" content="Comprehensive documentation for DomusAI - Advanced AI-powered chat interface" />
      <link rel="icon" href="/favicon.ico" />
      <style jsx global>{`
        :root {
          --nextra-primary-hue: 14deg;
          --nextra-primary-saturation: 85%;
          --nextra-primary-lightness: 50%;
        }
        
        .nextra-nav-container {
          border-bottom: 1px solid #e5e5e5;
        }
        
        .dark .nextra-nav-container {
          border-bottom: 1px solid #404040;
        }
        
        .nextra-sidebar-container {
          border-right: 1px solid #e5e5e5;
        }
        
        .dark .nextra-sidebar-container {
          border-right: 1px solid #404040;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #e84315;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #d32f2f;
        }
        
        /* Code blocks */
        .nextra-code-block {
          border-radius: 8px;
        }
        
        /* Search */
        .nextra-search input {
          border-radius: 8px;
        }
        
        /* Links */
        a {
          color: #e84315;
        }
        
        a:hover {
          color: #d32f2f;
        }
        
        /* Tables */
        table {
          border-radius: 8px;
          overflow: hidden;
        }
        
        /* Cards */
        .nextra-card {
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          transition: all 0.2s ease;
        }
        
        .nextra-card:hover {
          border-color: #e84315;
          box-shadow: 0 4px 12px rgba(232, 67, 21, 0.1);
        }
        
        .dark .nextra-card {
          border-color: #404040;
        }
        
        .dark .nextra-card:hover {
          border-color: #e84315;
          box-shadow: 0 4px 12px rgba(232, 67, 21, 0.2);
        }
      `}</style>
    </>
  ),
  primaryHue: 14,
  primarySaturation: 85,
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <div style={{ fontWeight: 'bold', color: '#e84315', marginTop: '16px' }}>{title}</div>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 1,
    autoCollapse: true
  },
  toc: {
    backToTop: true
  },
  editLink: {
    text: 'Edit this page on GitHub →'
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback'
  },
  search: {
    placeholder: 'Search documentation...'
  },
  banner: {
    key: 'domusai-v2',
    text: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        🎉 DomusAI v2.0 is now available! 
        <a href="/changelog" style={{ color: '#e84315', textDecoration: 'underline' }}>
          Read the changelog →
        </a>
      </div>
    )
  },
  navigation: {
    prev: true,
    next: true
  },
  darkMode: true,
  nextThemes: {
    defaultTheme: 'light'
  }
}

export default config
