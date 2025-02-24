'use client';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import * as React from 'react';
import { TransitionPanel } from '@/components/ui/transition-panel';
import { Flag } from 'lucide-react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import ProtectedRoute from '@/components/protected-route';

const capitalizeTitle = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

function parseTextToCleanList(text) {
    if (!text) return [];

    const sections = text.split(/\d+\./g).filter(section => section.trim() !== '');

    const cleanedList = sections.map(section => {
        return section
            .trim()
            .replace(/\)/g, '')
            .trim();
    });
    return cleanedList.filter(item => item !== '');
}

export default function Industry() {
    const [query, setQuery] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [contentData, setContentData] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);

    const downloadDocx = React.useCallback(() => {
        const doc = new Document({
            sections: [
                {
                    children: contentData.map((item) => [
                        new Paragraph({
                            text: item.subtitle,
                            heading: 'Heading1',
                        }),
                        ...item.content.map((text) =>
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `• ${text}`,
                                        bold: false,
                                    }),
                                ],
                            })
                        ),
                        new Paragraph({ text: '', spacing: { after: 200 } }),
                    ]).flat(),
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, 'Industry_Overview.docx');
        });
    }, [contentData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setErrorMessage("Please enter a search query");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const { data } = await axios.post(
                "https://industry-overview.onrender.com/generate_report",
                { query: trimmedQuery },
                { headers: { "Content-Type": "application/json" } }
            );

            const processedData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, typeof value === 'string' ? parseTextToCleanList(value) : value]));

            const ITEMS = Object.entries(processedData).map(([Key, value]) => ({
                title: capitalizeTitle(Key.trim().split(/\s+/)[0]),
                subtitle: capitalizeTitle(Key),
                content: value,
            }));
            console.log(ITEMS);
            setContentData(ITEMS);
            setActiveIndex(0);
        } catch (error) {
            console.error('API Error:', error);
            setErrorMessage(
                error.response ? `Server Error: ${error.response.data.message || "An unknown error occurred"}` :
                    error.request ? "Network Error: Unable to reach the server. Please check your connection." :
                        `Error: ${error.message || "An unexpected error occurred"}`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-background flex flex-col items-center p-4">
                <div className="w-full max-w-3xl flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4 text-center">
                        Industry Overview
                    </h1>

                    <form className="p-4 flex gap-2 w-full" onSubmit={handleSubmit}>
                        <Input
                            type="search"
                            placeholder="Search for industry overview..."
                            className="w-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    {loading && (
                        <TextShimmer className="font-mono text-sm" duration={1}>
                            Generating industry overview...
                        </TextShimmer>
                    )}

                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </div>
                    )}

                    <div className="w-full max-w-3xl mx-auto">
                        {contentData.length > 0 && (
                            <button
                                type="button"
                                onClick={downloadDocx}
                                className="mt-4 px-4 py-2 mb-5 bg-cyan-600 text-white rounded-lg hover:bg-black transition-all duration-200 ease-in-out"
                            >
                                Download
                            </button>
                        )}

                        {contentData.length === 0 && !loading && (
                            <div className="text-zinc-500 text-center py-8">
                                No industry data found. Try a search!
                            </div>
                        )}

                        {contentData.length > 0 && (
                            <>
                                <div className="mb-6 flex space-x-3">
                                    {contentData.map((item, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 ${activeIndex === index
                                                ? 'bg-cyan-600 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900'
                                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                                                }`}
                                        >
                                            {item.title}
                                        </button>
                                    ))}
                                </div>
                                <div className="overflow-hidden border-t border-zinc-200 dark:border-zinc-700">
                                    <TransitionPanel
                                        activeIndex={activeIndex}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        variants={{
                                            enter: { opacity: 0, y: -20, filter: 'blur(4px)' },
                                            center: { opacity: 1, y: 0, filter: 'blur(0px)' },
                                            exit: { opacity: 0, y: 20, filter: 'blur(4px)' },
                                        }}
                                    >
                                        {contentData.map((item, index) => (
                                            <div key={index} className="py-4">
                                                <h3 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                                                    {item.subtitle}
                                                </h3>
                                                <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
                                                    {item.content.map((text, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start space-x-3 rounded-lg p-3 transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                        >
                                                            <span className="mt-1 flex-shrink-0">
                                                                <Flag size={16} className="text-cyan-500" />
                                                            </span>
                                                            <span className="text-base leading-relaxed">{text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </TransitionPanel>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}