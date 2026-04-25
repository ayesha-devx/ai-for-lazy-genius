import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ArticleBody = ({ content }) => {
  // Helper to create IDs for headings to match TOC
  const createId = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="prose prose-lg dark:prose-invert max-w-none prose-indigo prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-img:rounded-[32px] prose-img:shadow-2xl selection:bg-indigo-500/30"
    >
      <div className="markdown-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <div className="relative group my-10">
                  <div className="absolute -inset-2 bg-indigo-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <pre className="relative bg-zinc-900 text-zinc-100 p-8 rounded-2xl overflow-x-auto font-mono text-sm border border-zinc-800 shadow-xl scrollbar-thin scrollbar-thumb-zinc-700">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md font-mono text-sm border border-indigo-100/50 dark:border-indigo-500/20" {...props}>
                  {children}
                </code>
              );
            },
            h1: ({children}) => (
              <h1 id={createId(children.toString())} className="text-4xl sm:text-5xl font-black mb-10 mt-16 scroll-mt-32">
                {children}
              </h1>
            ),
            h2: ({children}) => (
              <h2 id={createId(children.toString())} className="text-3xl font-bold mb-8 mt-14 scroll-mt-32 border-b border-gray-100 dark:border-zinc-800 pb-4">
                {children}
              </h2>
            ),
            h3: ({children}) => (
              <h3 id={createId(children.toString())} className="text-2xl font-bold mb-6 mt-10 scroll-mt-32">
                {children}
              </h3>
            ),
            p: ({children}) => <p className="mb-8 leading-relaxed text-lg">{children}</p>,
            ul: ({children}) => <ul className="list-disc pl-8 mb-8 space-y-3 marker:text-indigo-500">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal pl-8 mb-8 space-y-3 marker:text-indigo-500 marker:font-bold">{children}</ol>,
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-indigo-500 pl-8 py-4 italic bg-indigo-50/30 dark:bg-indigo-900/10 rounded-r-2xl my-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                {children}
              </blockquote>
            ),
            hr: () => <hr className="my-16 border-gray-100 dark:border-zinc-800" />,
            a: ({children, href}) => (
              <a href={href} className="text-indigo-600 dark:text-indigo-400 font-bold underline decoration-2 underline-offset-4 hover:text-indigo-700 transition-colors">
                {children}
              </a>
            ),
          }}
        >
          {content || "No content available for this story."}
        </ReactMarkdown>
      </div>

      {/* Aesthetic End Divider */}
      <div className="mt-20 mb-10 flex items-center justify-center gap-4">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-800" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
              className="w-2 h-2 rounded-full bg-indigo-500/40" 
            />
          ))}
        </div>
        <div className="h-px flex-grow bg-gradient-to-l from-transparent to-gray-200 dark:to-gray-800" />
      </div>
    </motion.article>
  );
};

export default ArticleBody;
