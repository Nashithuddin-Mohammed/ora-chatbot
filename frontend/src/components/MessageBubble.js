import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBubble = ({ message, darkMode }) => {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === "user";

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            ...styles.wrapper,
            justifyContent: isUser ? "flex-end" : "flex-start",
        }}>
            {!isUser && (
                <div style={styles.avatar}>🤖</div>
            )}
            <div style={{
                ...styles.bubble,
                backgroundColor: isUser
                    ? "#1B4F8A"
                    : darkMode ? "#2d2d2d" : "#f0f0f0",
                color: isUser ? "#fff" : darkMode ? "#fff" : "#1a1a2e",
                borderRadius: isUser
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
            }}>
                {isUser ? (
                    <p style={styles.userText}>{message.content}</p>
                ) : (
                    <ReactMarkdown
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code style={styles.inlineCode} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                )}
                {message.streaming && (
                    <span style={styles.cursor}>▋</span>
                )}
            </div>
            {!isUser && (
                <button
                    onClick={handleCopy}
                    style={styles.copyBtn}
                    title="Copy message"
                >
                    {copied ? "✅" : "📋"}
                </button>
            )}
            {isUser && (
                <div style={{ ...styles.avatar, backgroundColor: "#1B4F8A", color: "#fff" }}>
                    👤
                </div>
            )}
        </div>
    );
};

const styles = {
    wrapper: {
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        marginBottom: "16px",
        padding: "0 16px",
    },
    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        flexShrink: 0,
        backgroundColor: "#e0e0e0",
    },
    bubble: {
        maxWidth: "70%",
        padding: "12px 16px",
        fontSize: "14px",
        lineHeight: "1.6",
        wordBreak: "break-word",
    },
    userText: {
        margin: 0,
        fontSize: "14px",
        lineHeight: "1.6",
    },
    inlineCode: {
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: "2px 6px",
        borderRadius: "4px",
        fontFamily: "monospace",
        fontSize: "13px",
    },
    cursor: {
        animation: "blink 1s infinite",
        marginLeft: "2px",
    },
    copyBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        padding: "4px",
        opacity: 0.6,
        flexShrink: 0,
    },
};

export default MessageBubble;