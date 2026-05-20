export type Language = 'en' | 'zh';

export const i18n = {
  en: {
    appTitle: 'Markdown to Image',
    uploadMd: 'Upload .md',
    exportPng: 'Export PNG',
    exportJpeg: 'Export JPEG',
    theme: 'Theme',
    watermark: 'Watermark',
    aiWatermark: 'AI Watermark',
    preview: 'Preview',
    editor: 'Editor',
    copyMd: 'Copy',
    copied: 'Copied!',
    downloading: 'Exporting...',
    dragDrop: 'Drag and drop a .md file here, or click to upload',
    themes: {
      github: 'GitHub',
      notion: 'Notion',
      minimal: 'Minimal',
      dark: 'Dark'
    },
    defaultMarkdown: `# Welcome to Markdown Viewer! 🚀

Start typing your markdown here or upload a file.

## Features
- **Real-time preview**
- Export to high-res PNG/WebP
- Math equations: $E = mc^2$
- Syntax highlighting
- Works offline!

### Code Example
\`\`\`javascript
function calculateAnswer() {
  return 42;
}
\`\`\`

### Tables
| Feature | Supported |
|---------|-----------|
| GFM | ✅ |
| Math | ✅ |
| AI Badges | ✅ |

> Design is intelligence made visible. - Alina Wheeler
`
  },
  zh: {
    appTitle: 'Markdown 转换器',
    uploadMd: '上传 .md',
    exportPng: '导出 PNG',
    exportJpeg: '导出 JPEG',
    theme: '主题',
    watermark: '水印',
    aiWatermark: 'AI 徽章',
    preview: '预览',
    editor: '编辑',
    copyMd: '复制',
    copied: '已复制!',
    downloading: '正在导出...',
    dragDrop: '将 .md 文件拖至此处，或点击上传',
    themes: {
      github: 'GitHub',
      notion: 'Notion',
      minimal: '极简',
      dark: '暗黑'
    },
    defaultMarkdown: `# 欢迎使用 Markdown 预览器! 🚀

在这里输入您的 Markdown，或者上传一个 .md 文件。

## 原生功能
- **实时预览**
- 导出高清 PNG/WebP 图片
- 数学公式渲染：$E = mc^2$
- 代码高亮
- 完全纯前端运行！

### 代码示例
\`\`\`javascript
function calculateAnswer() {
  return 42;
}
\`\`\`

### 表格
| 功能 | 支持度 |
|---------|-----------|
| GFM | ✅ |
| 数学公式 | ✅ |
| AI 徽章 | ✅ |

> 设计是清晰可见的智慧。 - 艾丽娜·惠勒
`
  }
};
