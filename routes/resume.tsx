import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Layout from "../components/Layout.tsx";
import { ResumePlugin } from "../plugins/resume/mod.ts";

interface ResumePageData {
  resumeHtml: string;
  resumeStyles: string;
  locale: string;
  translations: Record<string, string>;
}

export const handler: Handlers<ResumePageData> = {
  async GET(req, ctx) {
    // 从URL获取语言设置
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    let locale = searchParams.get("lang") || "zh";

    // 只允许zh或en
    if (locale !== "zh" && locale !== "en") {
      locale = "zh";
    }

    // 初始化简历插件，使用当前语言的JSON文件
    const resumePlugin = new ResumePlugin({
      dataPath: `./docs/resume/resume_${locale}.json`,
      printable: true,
      downloadable: true,
    });

    // 加载简历数据
    await resumePlugin.init();

    // 获取渲染后的简历HTML和样式
    const resumeHtml = resumePlugin.renderResume();
    const resumeStyles = resumePlugin.getResumeStyles();

    // 准备UI文本翻译
    const translations = {
      pageTitle:
        locale === "zh"
          ? "简历 - zhizheng's profilo"
          : "Resume - zhizheng's profilo",
      description: locale === "zh" ? "我的个人简历" : "My professional resume",
      print: locale === "zh" ? "打印简历" : "Print Resume",
      switchLanguage: locale === "zh" ? "Switch to English" : "切换到中文",
      downloadPdf: locale === "zh" ? "下载PDF" : "Download PDF",
    };

    // 返回渲染数据
    return ctx.render({
      resumeHtml,
      resumeStyles,
      locale,
      translations,
    });
  },
};

export default function ResumePage({ data }: PageProps<ResumePageData>) {
  const { resumeHtml, resumeStyles, locale, translations } = data;

  // 切换语言的URL
  const switchLangUrl = locale === "zh" ? "/resume?lang=en" : "/resume?lang=zh";

  return (
    <Layout
      title={translations.pageTitle}
      description={translations.description}
    >
      <Head>
        <style dangerouslySetInnerHTML={{ __html: resumeStyles }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>

      {/* 页面顶部背景 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-40 w-full absolute top-0 left-0 z-0"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* 操作栏 */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-5 border-t-4 border-blue-500">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {locale === "zh" ? "个人简历" : "Professional Resume"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {locale === "zh"
                ? "前端工程师 | 爱尔兰利莫瑞克大学软件工程硕士在读"
                : "Frontend Engineer | MSc in Software Engineering at University of Limerick"}
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={switchLangUrl}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <i className="fas fa-language mr-2"></i>
              {translations.switchLanguage}
            </a>

            <button
              onClick="window.print();"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <i className="fas fa-print mr-2"></i> {translations.print}
            </button>
          </div>
        </div>

        {/* 简历内容 */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
          <div
            className="p-8"
            dangerouslySetInnerHTML={{ __html: resumeHtml }}
          />
        </div>
      </div>

      {/* 自定义样式覆盖 */}
      <style>{`
        /* 增强版简历样式覆盖 */
        .resume {
          max-width: 100%;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .resume-header {
          margin-bottom: 3rem;
          text-align: left;
          position: relative;
          padding-left: 1rem;
          border-left: 4px solid #3b82f6;
        }
        
        .resume-name {
          font-size: 2.5rem;
          font-weight: 800;
          background: -webkit-linear-gradient(45deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }
        
        .resume-title {
          font-size: 1.5rem;
          color: #4b5563;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        
        .resume-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }
        
        .resume-contact > div {
          display: flex;
          align-items: center;
        }
        
        .resume-contact i, .resume-social i {
          margin-right: 0.5rem;
          color: #3b82f6;
        }
        
        .resume-social {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        
        .resume-social-link {
          color: #3b82f6;
          text-decoration: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        
        .resume-social-link:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .resume-summary {
          line-height: 1.7;
          font-size: 1.05rem;
          max-width: 100%;
          margin: 0;
          color: #4b5563;
        }
        
        .resume-section {
          margin-bottom: 2.5rem;
        }
        
        .resume-section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
          position: relative;
          border-bottom: none;
        }
        
        .resume-section-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 3px;
          width: 50px;
          background: linear-gradient(to right, #3b82f6, #8b5cf6);
        }
        
        .resume-item {
          margin-bottom: 2rem;
          padding-left: 1rem;
          border-left: 2px solid #e5e7eb;
          transition: border-color 0.3s;
        }
        
        .resume-item:hover {
          border-left-color: #3b82f6;
        }
        
        .resume-item-header {
          margin-bottom: 0.75rem;
        }
        
        .resume-item-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }
        
        .resume-item-subtitle {
          font-size: 1.1rem;
          color: #4b5563;
          margin-bottom: 0.25rem;
        }
        
        .resume-item-subtitle a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .resume-item-subtitle a:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .resume-item-date {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }
        
        .resume-skill-keywords, .resume-item-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }
        
        .resume-skill-keyword {
          background: #f3f4f6;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #4b5563;
          transition: all 0.2s;
        }
        
        .resume-skill-keyword:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }
        
        .resume-item-technology {
          background: #eff6ff;
          color: #3b82f6;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .resume-item-technology:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }
        
        .resume-item-highlights {
          padding-left: 1.25rem;
          margin-top: 0.75rem;
          color: #4b5563;
        }
        
        .resume-item-highlights li {
          margin-bottom: 0.5rem;
          position: relative;
        }
        
        .resume-item-highlights li::before {
          content: '•';
          position: absolute;
          left: -1rem;
          color: #3b82f6;
          font-weight: bold;
        }
        
        /* 暗色模式适配 */
        .dark .resume-section-title {
          color: #f3f4f6;
        }
        
        .dark .resume-name {
          background: -webkit-linear-gradient(45deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .dark .resume-title {
          color: #e5e7eb;
        }
        
        .dark .resume-summary, 
        .dark .resume-item-highlights {
          color: #d1d5db;
        }
        
        .dark .resume-item-title {
          color: #f9fafb;
        }
        
        .dark .resume-item-subtitle {
          color: #e5e7eb;
        }
        
        .dark .resume-item-date {
          color: #9ca3af;
        }
        
        .dark .resume-skill-keyword {
          background: #1f2937;
          color: #e5e7eb;
        }
        
        .dark .resume-skill-keyword:hover {
          background: #374151;
        }
        
        .dark .resume-item-technology {
          background: #1e3a8a;
          color: #93c5fd;
        }
        
        .dark .resume-item-technology:hover {
          background: #1e40af;
        }
        
        .dark .resume-item {
          border-left-color: #374151;
        }
        
        .dark .resume-item:hover {
          border-left-color: #60a5fa;
        }
        
        /* 打印模式 */
        @media print {
          .layout-navbar, .layout-footer, button, a.inline-flex, .bg-gradient-to-r {
            display: none !important;
          }
          
          body, html {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .max-w-5xl {
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .bg-white {
            background-color: white !important;
          }
          
          .shadow-lg, .shadow-xl {
            box-shadow: none !important;
          }
          
          .rounded-lg {
            border-radius: 0 !important;
          }
          
          .border, .border-t-4 {
            border: none !important;
          }
          
          .p-8, .p-5 {
            padding: 0 !important;
          }
          
          .mb-8 {
            margin-bottom: 0 !important;
          }
          
          .resume-header {
            text-align: center !important;
            border-left: none !important;
            padding-left: 0 !important;
          }
          
          .resume-section-title::after {
            display: none !important;
          }
          
          .resume-section-title {
            border-bottom: 1px solid #000 !important;
          }
          
          .resume-name {
            color: #000 !important;
            -webkit-text-fill-color: #000 !important;
          }
          
          .resume-item {
            break-inside: avoid !important;
          }
        }
        
        /* 响应式设计优化 */
        @media (max-width: 640px) {
          .resume-header {
            text-align: center;
            border-left: none;
            padding-left: 0;
          }
          
          .resume-contact, .resume-social {
            justify-content: center;
          }
          
          .resume-section-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .resume-item {
            padding-left: 0.75rem;
          }
          
          .resume-name {
            font-size: 2rem;
          }
          
          .resume-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </Layout>
  );
}
