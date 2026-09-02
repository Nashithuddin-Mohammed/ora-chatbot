import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ messages, isLoading, darkMode }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return (
            <div style={styles.empty}>
                <div style={styles.emptyIcon}>🤖</div>
                <h2 style={{ ...styles.emptyTitle, color: darkMode ? "#fff" : "#1a1a2e" }}>
                    ORA Chatbot
                </h2>
                <p style={{ ...styles.emptySubtitle, color: darkMode ? "#aaa" : "#666" }}>
                    Select a model above and start chatting!
                </p>
                <div style={styles.suggestions}>
                    {["Explain quantum computing", "Write a Python function", "What is machine learning?"].map((s) => (
                        <div key={s} style={{
                            ...styles.suggestion,
                            backgroundColor: darkMode ? "#2d2d2d" : "#f0f0f0",
                            color: darkMode ? "#fff" : "#1a1a2e",
                        }}>
                            {s}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {messages.map((message, index) => (
                <MessageBubble
                    key={index}
                    message={message}
                    darkMode={darkMode}
                />
            ))}
            {isLoading && !messages[messages.length - 1]?.streaming && (
                <TypingIndicator />
            )}
            <div ref={bottomRef} />
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        overflowY: "auto",
        paddingTop: "16px",
        paddingBottom: "16px",
    },
    empty: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "40px",
    },
    emptyIcon: {
        fontSize: "48px",
        marginBottom: "8px",
    },
    emptyTitle: {
        fontSize: "24px",
        fontWeight: "600",
        margin: 0,
    },
    emptySubtitle: {
        fontSize: "14px",
        margin: 0,
    },
    suggestions: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "16px",
    },
    suggestion: {
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "13px",
        cursor: "pointer",
    },
};

export default ChatWindow;