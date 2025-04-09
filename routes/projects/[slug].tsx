import { Handlers } from "$fresh/server.ts";
import Layout from "../../components/Layout.tsx";
import Markdown from "../../components/Markdown.tsx";
import {
  getProjectById as getProjectBySlug,
  Project,
} from "../../plugins/projects/mod.ts";

export const handler: Handlers<Project | null> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return ctx.renderNotFound();
    }

    return ctx.render(project);
  },
};

export default function ProjectDetail({ data }: { data: Project }) {
  if (!data) {
    return (
      <Layout>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 class="text-4xl font-bold mb-8">项目未找到</h1>
          <p class="text-gray-600">抱歉，您访问的项目不存在。</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700">
          <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2">
              <h1 class="text-3xl font-bold mb-4 dark:text-white">
                {data.title}
              </h1>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                {data.description}
              </p>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-gray-700">
            {data.demoUrl && (
              <div class="mb-8">
                <h2 class="text-2xl font-bold mb-4 dark:text-white">
                  网站完整预览
                </h2>
                <div class="w-full h-[480px] relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src={data.demoUrl}
                    class="absolute top-0 left-0 w-full h-full"
                    title={`${data.title} 完整预览`}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                </div>
              </div>
            )}

            <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 class="text-2xl font-bold mb-4 dark:text-white">技术栈</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                  {data.technologies &&
                    data.technologies.map((tech) => (
                      <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <h2 class="text-2xl font-bold mb-4 dark:text-white">链接</h2>
                <div class="flex flex-wrap gap-3">
                  {data.githubUrl && (
                    <a
                      href={data.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                      <svg
                        class="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      查看源码
                    </a>
                  )}
                  {data.demoUrl && (
                    <a
                      href={data.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        class="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      在线演示
                    </a>
                  )}
                </div>
              </div>
            </div>

            <h2 class="text-2xl font-bold mb-4 dark:text-white">项目特点</h2>
            <ul class="list-disc list-inside mb-6">
              {data.features &&
                data.features.map((feature) => (
                  <li class="text-gray-600 dark:text-gray-300 mb-2">
                    {feature}
                  </li>
                ))}
            </ul>

            <h2 class="text-2xl font-bold mb-4 dark:text-white">项目详情</h2>
            {data.longDescription ? (
              <Markdown content={data.longDescription} />
            ) : (
              <p class="text-gray-600 dark:text-gray-300">暂无详细描述</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
