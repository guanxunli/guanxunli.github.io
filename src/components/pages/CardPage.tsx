'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const renderTitle = (item: CardPageConfig['items'][number]) => {
        const className = `${embedded ? 'text-lg' : 'text-xl'} font-semibold text-primary`;

        if (!item.link) {
            return <h3 className={className}>{item.title}</h3>;
        }

        if (item.link.startsWith('http')) {
            return (
                <h3 className={className}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                        {item.title}
                    </a>
                </h3>
            );
        }

        return (
            <h3 className={className}>
                <Link href={item.link} className="transition-colors hover:text-accent">
                    {item.title}
                </Link>
            </h3>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? 'mb-4' : 'mb-8'}>
                <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div className={`grid ${embedded ? 'gap-4' : 'gap-6'}`}>
                {config.items.map((item, index) => (
                    <motion.div
                        key={`${item.title}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`bg-white dark:bg-neutral-900 ${embedded ? 'p-4' : 'p-6'} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200`}
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    {renderTitle(item)}
                                    {(item.role || item.subtitle || item.institution) && (
                                        <div className={`${embedded ? 'text-sm' : 'text-base'} mt-1 flex flex-wrap gap-x-2 gap-y-1 text-neutral-600 dark:text-neutral-500`}>
                                            {(item.role || item.subtitle) && (
                                                <span className="font-medium text-accent">{item.role || item.subtitle}</span>
                                            )}
                                            {item.institution && (
                                                <span>{item.institution}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {item.date && (
                                    <span className="w-fit text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                        {item.date}
                                    </span>
                                )}
                            </div>

                            {item.terms && item.terms.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-primary mb-2">Terms</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.terms.map((term) => (
                                            <span
                                                key={term}
                                                className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/60 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700"
                                            >
                                                {term}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {item.content && (
                                <div className={`${embedded ? 'text-sm' : 'text-base'} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                    <ReactMarkdown components={markdownComponents}>
                                        {item.content}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {item.links && item.links.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {item.links.map((link) => (
                                        <a
                                            key={`${item.title}-${link.label}`}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}

                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag) => (
                                        <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
