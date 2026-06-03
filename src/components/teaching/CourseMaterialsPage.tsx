'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, LockKeyhole, ArrowLeft } from 'lucide-react';

interface CourseMaterialsPageProps {
    courseTitle: string;
    terms: string[];
    pdfBasePath: string;
}

const COURSE_PASSWORD = 'guanxunli1994';

export default function CourseMaterialsPage({ courseTitle, terms, pdfBasePath }: CourseMaterialsPageProps) {
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState('');

    const lectures = useMemo(() => Array.from({ length: 12 }, (_, index) => {
        const lectureNumber = index + 1;
        return {
            label: `Lec${lectureNumber}`,
            href: `${pdfBasePath}/Lec${lectureNumber}.pdf`,
        };
    }), [pdfBasePath]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password === COURSE_PASSWORD) {
            setIsUnlocked(true);
            setError('');
            return;
        }

        setError('Incorrect password.');
    };

    return (
        <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/teaching"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-accent dark:text-neutral-400"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Teaching
                </Link>

                <div className="mb-8 border-b border-neutral-200 pb-6 dark:border-neutral-800">
                    <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
                        {courseTitle}
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {terms.map((term) => (
                            <span
                                key={term}
                                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400"
                            >
                                {term}
                            </span>
                        ))}
                    </div>
                </div>

                {!isUnlocked ? (
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                                <LockKeyhole className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-primary">Course Materials</h2>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Password required</p>
                            </div>
                        </div>

                        <label htmlFor="course-password" className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Password
                        </label>
                        <input
                            id="course-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-accent dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                        />
                        {error && (
                            <p className="mt-2 text-sm font-medium text-error">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                        >
                            Unlock
                        </button>
                    </form>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {lectures.map((lecture) => (
                            <a
                                key={lecture.label}
                                href={lecture.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-neutral-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                            >
                                <FileText className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium">{lecture.label}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
