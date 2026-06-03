'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from './FormattedBibTeXText';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

interface PublicationLink {
    label: string;
    href: string;
}

interface PublicationGroup {
    title: string;
    description?: string;
    order: number;
    publications: Publication[];
}

function buildPublicationLinks(pub: Publication): PublicationLink[] {
    const links: PublicationLink[] = [];

    if (pub.url) links.push({ label: 'Paper', href: pub.url });
    if (pub.arxiv) links.push({ label: 'arXiv', href: pub.arxiv });
    if (pub.pdfUrl) links.push({ label: 'PDF', href: pub.pdfUrl });
    if (pub.code) links.push({ label: 'Code', href: pub.code });
    if (pub.slides) links.push({ label: 'Slides', href: pub.slides });
    if (pub.project) links.push({ label: 'Project', href: pub.project });
    if (pub.doi) links.push({ label: 'DOI', href: `https://doi.org/${pub.doi}` });

    return links;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const messages = useMessages();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map((p) => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map((p) => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    const filteredPublications = useMemo(() => {
        return publications.filter((pub) => {
            const haystack = [
                pub.title,
                ...pub.authors.map((author) => author.name),
                pub.journal || '',
                pub.conference || '',
            ].join(' ').toLowerCase();

            const matchesSearch = haystack.includes(searchQuery.toLowerCase());
            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    const publicationGroups = useMemo(() => {
        const groups = new Map<string, PublicationGroup>();

        filteredPublications.forEach((pub) => {
            const title = pub.researchGroup || 'Other Publications';
            const existing = groups.get(title);

            if (existing) {
                existing.publications.push(pub);
                if (!existing.description && pub.researchGroupDescription) {
                    existing.description = pub.researchGroupDescription;
                }
                return;
            }

            groups.set(title, {
                title,
                description: pub.researchGroupDescription,
                order: pub.researchGroupOrder ?? 999,
                publications: [pub],
            });
        });

        return Array.from(groups.values())
            .map((group) => ({
                ...group,
                publications: group.publications.sort((a, b) => {
                    if (a.publicationOrder !== undefined || b.publicationOrder !== undefined) {
                        return (a.publicationOrder ?? 9999) - (b.publicationOrder ?? 9999);
                    }

                    if (b.year !== a.year) return b.year - a.year;
                    return a.title.localeCompare(b.title);
                }),
            }))
            .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    }, [filteredPublications]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="mb-8">
                <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder={messages.publications.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200',
                            showFilters
                                ? 'bg-accent text-white border-accent'
                                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-accent hover:text-accent'
                        )}
                    >
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        {messages.publications.filters}
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1" /> {messages.publications.year}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedYear('all')}
                                            className={cn(
                                                'px-3 py-1 text-xs rounded-full transition-colors',
                                                selectedYear === 'all'
                                                    ? 'bg-accent text-white'
                                                    : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                            )}
                                        >
                                            {messages.common.all}
                                        </button>
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => setSelectedYear(year)}
                                                className={cn(
                                                    'px-3 py-1 text-xs rounded-full transition-colors',
                                                    selectedYear === year
                                                        ? 'bg-accent text-white'
                                                        : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                                        <BookOpenIcon className="h-4 w-4 mr-1" /> {messages.publications.type}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedType('all')}
                                            className={cn(
                                                'px-3 py-1 text-xs rounded-full transition-colors',
                                                selectedType === 'all'
                                                    ? 'bg-accent text-white'
                                                    : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                            )}
                                        >
                                            {messages.common.all}
                                        </button>
                                        {types.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={cn(
                                                    'px-3 py-1 text-xs rounded-full capitalize transition-colors',
                                                    selectedType === type
                                                        ? 'bg-accent text-white'
                                                        : 'bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                                )}
                                            >
                                                {type.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-10">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        {messages.publications.noResults}
                    </div>
                ) : (
                    publicationGroups.map((group) => (
                        <section key={group.title} className="space-y-5">
                            <div className="space-y-2">
                                <h2 className={`${embedded ? 'text-xl' : 'text-2xl'} font-serif font-bold text-primary`}>
                                    {group.title}
                                </h2>
                                {group.description && (
                                    <p className={`${embedded ? 'text-sm' : 'text-base'} text-neutral-600 dark:text-neutral-500 leading-relaxed max-w-3xl`}>
                                        {group.description}
                                    </p>
                                )}
                            </div>

                            {group.publications.map((pub, index) => {
                                const venue = pub.journal || pub.conference || '';
                                const links = buildPublicationLinks(pub);

                                return (
                            <motion.div
                                key={pub.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.08 * index }}
                                className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800"
                            >
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <h3 className={`${embedded ? 'text-lg' : 'text-xl'} font-semibold text-primary leading-tight`}>
                                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                        </h3>
                                        {pub.type === 'preprint' && (
                                            <span className="inline-flex w-fit items-center rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                                                Preprint
                                            </span>
                                        )}
                                    </div>
                                    <p className={`${embedded ? 'text-sm' : 'text-base'} text-neutral-600 dark:text-neutral-400 leading-relaxed`}>
                                        {pub.authors.map((author, idx) => (
                                            <span key={idx}>
                                                <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                                    {author.name}
                                                </span>
                                                {author.isCoAuthor && (
                                                    <span className="ml-1 align-middle text-[0.65rem] font-semibold uppercase text-info">
                                                        Co-first author
                                                    </span>
                                                )}
                                                {author.isCorresponding && (
                                                    <span className="ml-1 align-middle text-[0.65rem] font-semibold uppercase text-success">
                                                        Corresponding author
                                                    </span>
                                                )}
                                                {author.isStudent && (
                                                    <span className="ml-1 align-middle text-[0.65rem] font-semibold uppercase text-warning">
                                                        Student
                                                    </span>
                                                )}
                                                {idx < pub.authors.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        {venue ? `${venue}. ` : ''}{pub.year}
                                    </p>
                                    {links.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {links.map((link) => (
                                                <a
                                                    key={`${pub.id}-${link.label}`}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                                >
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                                );
                            })}
                        </section>
                    ))
                )}
            </div>
        </motion.div>
    );
}
