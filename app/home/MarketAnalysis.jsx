'use client';
import { useState } from 'react';
import { TransitionPanel } from '@/components/ui/transition-panel';
import { Flag } from 'lucide-react';

export default function TabsTransitionPanel({ data }) {
    const [activeIndex, setActiveIndex] = useState(0);
    if (!data) return null;

    const ITEMS = [];
    Object.entries(data).map(([Key, value]) => {
        const newItem = {};
        newItem.title = capitalizeTitle(Key.trim().split(/\s+/)[0]);
        newItem.subtitle = capitalizeTitle(Key);
        newItem.content = value;
        ITEMS.push(newItem);
    });

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="mb-6 flex space-x-3">
                {ITEMS.map((item, index) => (
                    <button
                        key={index}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 ${activeIndex === index
                                ? 'bg-zinc-900 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900'
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
                    {ITEMS.map((item, index) => (
                        <div key={index} className="py-4">
                            <h3 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                                {item.subtitle}
                            </h3>
                            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
                                {item.content.map((text, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start space-x-3 rounded-lg p-3 transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                    >
                                        <span className="mt-1 flex-shrink-0">
                                            <Flag size={16} className="text-emerald-500" />
                                        </span>
                                        <span className="text-base leading-relaxed">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </TransitionPanel>
            </div>
        </div>
    );
}

const capitalizeTitle = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());