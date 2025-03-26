"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
    Mic,
    Play,
    Pause,
    Volume2,
    Volume1,
    VolumeX,
    SkipBack,
    SkipForward,
    Download,
    Share2
} from 'lucide-react';

const Speech = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [visualizerData, setVisualizerData] = useState(Array(32).fill(0));
    const audioRef = useRef(null);
    const animationFrameRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const setupAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 64;

            const audioSource = audioContextRef.current.createMediaElementSource(audioRef.current);
            audioSource.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
        }
    };

    const updateVisualizer = () => {
        if (!isPlaying || !analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        setVisualizerData(Array.from(dataArray));
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };


    const formatTime = (time) => {
        if (!isFinite(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);

        try {
            const response = await axios({
                method: 'post',
                url: 'https://voice-6sa5.onrender.com/roast',
                data: { idea: query },
                responseType: 'blob'
            });

            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(audioBlob);

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }

            setAudioUrl(url);

            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.load();
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    setupAudioContext();
                    updateVisualizer();
                }).catch(console.error);
            }
        } catch (error) {
            console.error('Error fetching audio:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
                setupAudioContext();
                updateVisualizer();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (value) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    };

    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
        }
    };

    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
        }
    };

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center">
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <Card className="relative w-full max-w-3xl bg-black backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">

                <CardContent className="p-10 relative">
                    {/* Header Section */}
                    <div className="text-center mb-12 space-y-4">
                        <h1 className="text-5xl font-bold text-cyan-500">
                            Give a speech for my Idea
                        </h1>
                        <p className="text-white text-lg">
                            Get a professional speech of your idea in audio format. Just type in your idea and hit generate!
                        </p>
                    </div>

                    {/* Input Section */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="relative w-full bg-white text-black placeholder-gray-900 text-lg py-6 px-4 rounded-lg transition-all duration-300 resize-none"
                                placeholder="Type your idea here..."
                                rows={2}
                            />
                            <Mic className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-pulse" />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transform transition-all duration-300 py-6 text-lg font-semibold rounded-lg ${isLoading ? 'animate-pulse' : ''}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <span className="animate-spin">⚪</span>
                                    <span>Generating Audio...</span>
                                </div>
                            ) : (
                                'Generate Audio'
                            )}
                        </Button>
                    </form>

                    {/* Audio Player Section */}
                    {audioUrl && (
                        <div className="mt-12 space-y-6">
                            {/* Visualizer */}
                            <div className="h-32 flex items-center justify-center space-x-1">
                                {visualizerData.map((value, index) => (
                                    <div
                                        key={index}
                                        className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transform transition-all duration-150"
                                        style={{
                                            height: `${(value / 255) * 100}%`,
                                            opacity: isPlaying ? 0.8 : 0.4
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Time and Progress */}
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={(e) => handleSeek(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-wrap items-center justify-center space-x-3 sm:space-x-6 w-full">
                                <Button
                                    onClick={skipBackward}
                                    className="bg-white/10 hover:bg-white/20 rounded-full w-12 h-12"
                                >
                                    <SkipBack className="w-5 h-5" />
                                </Button>

                                <Button
                                    onClick={togglePlay}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full w-16 h-16 flex items-center justify-center transform hover:scale-105 transition-all duration-200"
                                >
                                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                </Button>

                                <Button
                                    onClick={skipForward}
                                    className="bg-white/10 hover:bg-white/20 rounded-full w-12 h-12"
                                >
                                    <SkipForward className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Volume and Additional Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setVolume(volume === 0 ? 1 : 0)}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        {volume === 0 ? <VolumeX /> : volume < 0.5 ? <Volume1 /> : <Volume2 />}
                                    </button>
                                    <Slider
                                        value={[volume * 100]}
                                        min={0}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => setVolume(value[0] / 100)}
                                        className="w-24"
                                    />
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = audioUrl;
                                            a.download = 'audio.mp3';
                                            a.click();
                                        }}
                                        className="bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 p-0"
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(audioUrl);
                                        }}
                                        className="bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 p-0"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Speech;