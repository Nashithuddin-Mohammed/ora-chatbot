import { useState, useCallback } from "react";
import { sendMessageStream } from "../utils/api";

export const useChat = () => {
    const [conversations, setConversations] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (userInput, model) => {
        if (!userInput.trim()) return;

        const userMessage = { role: "user", content: userInput };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setIsLoading(true);
        setError(null);

        // Add empty assistant message for streaming
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "", streaming: true },
        ]);

        try {
            await sendMessageStream(
                updatedMessages,
                model,
                (chunk) => {
                    setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                            role: "assistant",
                            content: chunk,
                            streaming: true,
                        };
                        return updated;
                    });
                },
                (fullText) => {
                    const finalMessages = [
                        ...updatedMessages,
                        { role: "assistant", content: fullText, streaming: false },
                    ];

                    setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                            role: "assistant",
                            content: fullText,
                            streaming: false,
                        };
                        return updated;
                    });

                    // Save conversation to sidebar
                    setConversations((prev) => {
                        const title = userInput.slice(0, 40) + (userInput.length > 40 ? "..." : "");
                        const existing = prev.find((c) => c.id === currentId);
                        if (existing) {
                            return prev.map((c) =>
                                c.id === currentId
                                    ? { ...c, messages: finalMessages }
                                    : c
                            );
                        } else {
                            const newId = Date.now().toString();
                            setCurrentId(newId);
                            return [
                                { id: newId, title, messages: finalMessages },
                                ...prev,
                            ];
                        }
                    });

                    setIsLoading(false);
                }
            );
        } catch (err) {
            setError("Failed to get response. Please check your API key and try again.");
            setMessages((prev) => prev.slice(0, -1));
            setIsLoading(false);
        }
    }, [messages, currentId]);

    const clearChat = useCallback(() => {
        setMessages([]);
        setCurrentId(null);
        setError(null);
    }, []);

    const selectConversation = useCallback((id) => {
        const conv = conversations.find((c) => c.id === id);
        if (conv) {
            setMessages(conv.messages);
            setCurrentId(id);
            setError(null);
        }
    }, [conversations]);

    const newChat = useCallback(() => {
        setMessages([]);
        setCurrentId(null);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
        conversations,
        currentId,
        selectConversation,
        newChat,
    };
};