"use client";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Input } from "@/components/ui/input";
import ProtectedRoute from "@/components/protected-route";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

import * as React from "react";
import axios from "axios";

function capitalizeTitle(key) {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const projects = [];
export default function Competition() {
    const [query, setQuery] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [contentData, setContentData] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState("");

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
                "https://competitor-analysis-brsb.onrender.com/company_json",
                { query: trimmedQuery },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setContentData(data.result.ai_based.raw_market_data.related_companies);
            for (let key in contentData) {
                const newObject = {};
                newObject.title = capitalizeTitle(key);
                newObject.description = contentData[key];
                projects.push(newObject);
            }
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
    return (
            <main className="flex flex-col items-center bg-background p-4 min-h-screen">
                <div className="flex flex-col justify-center items-center w-full max-w-5xl">
                    <h1 className="mb-4 font-bold text-2xl text-center">
                        Competitor Analysis
                    </h1>

                    <form className="flex gap-2 p-4 w-full" onSubmit={handleSubmit}>
                        <Input
                            type="search"
                            placeholder={"Search for competitors..."}
                            className="w-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    {loading && (
                        <TextShimmer className="font-mono text-sm" duration={1}>
                            {`Generating competitor analysis...`}
                        </TextShimmer>
                    )}

                    {errorMessage && (
                        <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
                    )}

                    {contentData.length > 0 && (
                        <button
                            type="button"
                            onClick={downloadDocx}
                            className="bg-cyan-600 hover:bg-black mt-4 mb-5 px-4 py-2 rounded-lg text-white transition-all duration-200 ease-in-out"
                        >
                            Download
                        </button>
                    )}

                    {contentData.length === 0 && !loading && (
                        <div className="py-8 text-zinc-500 text-center">
                            No competitor data found. Try a search!
                        </div>
                    )}
                    <div className="mx-auto px-8">
                        <HoverEffect items={projects} />
                    </div>
                </div>
            </main>
    );
}