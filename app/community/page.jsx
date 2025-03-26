"use client"
import { useState, useRef, useEffect } from 'react';

const DiscordLikeChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser] = useState({
        name: 'Mudit',
        avatar: 'https://i.pravatar.cc/100?u=jake',
    });

    const messagesEndRef = useRef(null);

    // Initialize default messages if local storage is empty
    const defaultMessages = [
        {
            id: 1,
            author: 'Tushya',
            avatar: 'https://i.pravatar.cc/100?u=alex',
            content: 'Hey everyone! Welcome to our community chat 👋',
            timestamp: '2025-03-09T10:30:00Z',
            isBot: false,
        },
        {
            id: 2,
            author: 'Mudit',
            avatar: 'https://i.pravatar.cc/100?u=jake',
            content: 'Hi there! I\'m working on an IoT solutions for MSME; need some help!',
            timestamp: '2025-03-09T10:31:00Z',
            isBot: true,
        },
        {
            id: 3,
            author: 'Aashima',
            avatar: 'https://i.pravatar.cc/100?u=jane',
            content: 'I can help you with PCB designing.',
            timestamp: '2025-03-09T10:32:00Z',
            isBot: false,
        },
    ];

    // Load messages from local storage on component mount
    useEffect(() => {
        const storedMessages = localStorage.getItem('chatMessages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        } else {
            // If no stored messages, use default ones and save them
            setMessages(defaultMessages);
            localStorage.setItem('chatMessages', JSON.stringify(defaultMessages));
        }
    }, []);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Save messages to local storage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (newMessage.trim() === '') return;

        const message = {
            id: Date.now(),
            author: currentUser.name,
            avatar: currentUser.avatar,
            content: newMessage,
            timestamp: new Date().toISOString(),
            isBot: true,
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Function to clear chat history (for testing)
    const clearChatHistory = () => {
        localStorage.removeItem('chatMessages');
        setMessages(defaultMessages);
        localStorage.setItem('chatMessages', JSON.stringify(defaultMessages));
    };

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white">
            {/* Server Sidebar */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">I</div>
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold">+</div>
                    <button
                        onClick={clearChatHistory}
                        className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold mt-auto"
                        title="Clear chat history"
                    >
                        Clear
                    </button>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-700 flex items-center">
                        <span className="ml-3 text-gray-400">IoT Hub</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.isBot ? 'opacity-90' : ''}`}>
                                <img
                                    src={message.avatar}
                                    alt={`${message.author}'s avatar`}
                                    className="w-10 h-10 rounded-full mr-3"
                                    onError={(e) => {
                                        e.target.src = `/api/placeholder/40/40`;
                                    }}
                                />
                                <div>
                                    <div className="flex items-center">
                                        <span className={`font-bold ${message.isBot ? 'text-green-400' : ''}`}>{message.author}</span>
                                        <span className="text-gray-400 text-xs ml-2">{formatTimestamp(message.timestamp)}</span>
                                    </div>
                                    <div className="mt-1 text-gray-100">{message.content}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4">
                        <form onSubmit={handleSendMessage} className="flex items-center bg-gray-700 rounded-lg p-2">
                            <button
                                type="button"
                                className="p-2 rounded-full hover:bg-gray-600 text-gray-400"
                                title="Add attachment"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Message"
                                className="flex-1 bg-transparent border-0 focus:outline-none text-white px-3 py-1"
                            />
                            <button
                                type="button"
                                className="p-2 rounded-full hover:bg-gray-600 text-gray-400 mr-1"
                                title="Add emoji"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                type="submit"
                                className="p-2 rounded-full hover:bg-gray-600 text-gray-400"
                                title="Send message"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Members Sidebar */}
                <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
                    <h3 className="text-gray-400 uppercase text-xs font-bold mb-4">Members — 3</h3>
                    <div className="space-y-2">
                        <div className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer">
                            <div className="relative">
                                <img
                                    src="https://i.pravatar.cc/100?u=alex"
                                    alt="Jane's avatar"
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                        e.target.src = `/api/placeholder/32/32`;
                                    }}
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <span className="ml-2">Tushya</span>
                        </div>
                        <div className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer">
                            <div className="relative">
                                <img
                                    src="https://i.pravatar.cc/100?u=jake"
                                    alt="John's avatar"
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                        e.target.src = `/api/placeholder/32/32`;
                                    }}
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <span className="ml-2 text-green-400">Mudit</span>
                        </div>
                        <div className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer">
                            <div className="relative">
                                <img
                                    src="https://i.pravatar.cc/100?u=jane"
                                    alt="Bot's avatar"
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                        e.target.src = `/api/placeholder/32/32`;
                                    }}
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <span className="ml-2">Aashima</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscordLikeChat;