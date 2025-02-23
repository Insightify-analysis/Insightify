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

const searchCategories = [
    { name: "Industry overview", icon: ChartCandlestickIcon, placeholder: "Get information about industry...", endPoints: "https://dba4-103-155-138-209.ngrok-free.app/generate_report" },
    { name: "Competitor analysis", icon: Search, placeholder: "Get information about competitors...", endPoints: "categorize" },
];

function parseTextToCleanList(text) {
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
        if (!query.trim()) return;

        setLoading(true);
        setErrorMessage("");

        try {
            const { data } = await axios.post(
                activeCategory.endPoints,
                { query },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true"
                    },
                }
            );

            const parsedData = activeCategory.endPoints === 'https://dba4-103-155-138-209.ngrok-free.app/generate_report' ? Object.fromEntries(Object.entries(data).map(([key, value]) => [key, parseTextToCleanList(value)])) : data;
            setContentData(prev => ({
                ...prev,
                [activeCategory.endPoints]: parsedData
            }));
        } catch (error) {
            if (error.response) setErrorMessage(`Server Error: ${error.response.data.message || "Unknown error"}`)
            else if (error.request) setErrorMessage("Network Error: No response from the server. Check your connection.");
            else setErrorMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Dynamic content renderer
    const renderContent = () => {
        if (!contentData[activeCategory.endPoints]) return null;

        return activeCategory.endPoints === 'generate_report' ? (
            <Market data={contentData.generate_report} />
        ) : (
            <Competition data={contentData.categorize} />
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