"use client";
import Competition from "./Competition";
import Market from "./MarketAnalysis";

import { TextShimmer } from "@/components/ui/text-shimmer";
import TopbarSearch from "@/components/ui/topbar-search";
import { Input } from "@/components/ui/input";
import ProtectedRoute from "@/components/protected-route";

import * as React from "react";
import axios from "axios";
import { ChartCandlestickIcon, Search } from "lucide-react";

const INDUSTRY_ENDPOINT = 'https://industry-overview.onrender.com/generate_report';
const COMPETITOR_ENDPOINT = 'categorize';

const searchCategories = [
    {
        name: "Industry overview",
        icon: ChartCandlestickIcon,
        placeholder: "Get information about industry...",
        endPoint: INDUSTRY_ENDPOINT
    },
    {
        name: "Competitor analysis",
        icon: Search,
        placeholder: "Get information about competitors...",
        endPoint: COMPETITOR_ENDPOINT
    },
];

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

export default function Home() {
    const [activeCategory, setActiveCategory] = React.useState(searchCategories[0]);
    const [loading, setLoading] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [contentData, setContentData] = React.useState({});
    const [errorMessage, setErrorMessage] = React.useState("");

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
                activeCategory.endPoint,
                { query: trimmedQuery },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true"
                    },
                }
            );

            // Process data based on endpoint type
            const processedData = activeCategory.endPoint === INDUSTRY_ENDPOINT
                ? Object.fromEntries(
                    Object.entries(data).map(([key, value]) => [
                        key,
                        typeof value === 'string' ? parseTextToCleanList(value) : value
                    ])
                )
                : data;

            setContentData(prev => ({
                ...prev,
                [activeCategory.endPoint]: processedData
            }));
        } catch (error) {
            console.error('API Error:', error);
            if (error.response) {
                setErrorMessage(`Server Error: ${error.response.data.message || "An unknown error occurred"}`);
            } else if (error.request) {
                setErrorMessage("Network Error: Unable to reach the server. Please check your connection.");
            } else {
                setErrorMessage(`Error: ${error.message || "An unexpected error occurred"}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset error message when changing categories or query
    React.useEffect(() => {
        setErrorMessage("");
    }, [activeCategory, query]);

    // Clear content when changing categories
    React.useEffect(() => {
        setQuery("");
        setContentData(prev => ({
            ...prev,
            [activeCategory.endPoint]: null
        }));
    }, [activeCategory]);

    const renderContent = () => {
        const currentData = contentData[activeCategory.endPoint];

        if (!currentData) return null;

        return activeCategory.endPoint === INDUSTRY_ENDPOINT ? (
            <Market data={currentData} />
        ) : (
            <Competition data={currentData} />
        );
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-background flex flex-col items-center p-4">
                <div className="w-full max-w-3xl flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4 text-center">Validate your Idea</h1>

                    <TopbarSearch
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        searchCategories={searchCategories}
                    />

                    <form className="p-4 flex gap-2 w-full" onSubmit={handleSubmit}>
                        <Input
                            type="search"
                            placeholder={activeCategory.placeholder}
                            className="w-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    {loading && (
                        <TextShimmer className="font-mono text-sm" duration={1}>
                            {`Generating ${activeCategory.name.toLowerCase()}...`}
                        </TextShimmer>
                    )}

                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}

                    {renderContent()}
                </div>
            </main>
        </ProtectedRoute>
    );
}