"use client";
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Send, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

const IdeaToPPTConverter = () => {
    const [ideaDescription, setIdeaDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const generateFileName = useCallback(() => {
        const timestamp = new Date().toISOString().split('T')[0];
        const sanitizedIdea = ideaDescription
            .slice(0, 30)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_');
        return `PitchDeck_${sanitizedIdea}_${timestamp}.pptx`;
    }, [ideaDescription]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            setIsLoading(true);

            const response = await fetch("https://pitch-deck-foss.onrender.com/generate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idea: ideaDescription.trim() }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate presentation');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = generateFileName();
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setSuccessMessage('Your presentation has been generated and downloaded successfully!');
            setIdeaDescription('');
        } catch (err) {
            setError(err.message || 'Failed to generate presentation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Convert Your Idea to Presentation
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Describe your idea in detail and we'll generate a professional presentation for you
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="idea"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Describe Your Idea
                            </label>
                            <Textarea
                                id="idea"
                                rows={8}
                                className="resize-none"
                                placeholder="Enter a detailed description of your idea..."
                                value={ideaDescription}
                                onChange={(e) => {
                                    setIdeaDescription(e.target.value);
                                    setError('');
                                }}
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {successMessage && (
                            <Alert className="bg-green-50 text-green-800 border-green-200">
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Presentation...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Generate Presentation
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default IdeaToPPTConverter;