import { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import ModelSelector from "./components/ModelSelector";
import Sidebar from "./components/Sidebar";
import { fetchModels } from "./utils/api";
import { useChat } from "./hooks/useChat";

function App() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("meta-llama/llama-3.1-8b-instruct:free");
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const inputRef = useRef(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    conversations,
    currentId,
    selectConversation,
    newChat,
  } = useChat();

  useEffect(() => {
    fetchModels()
      .then(setModels)
      .catch(() => console.error("Could not fetch models"));
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input;
    setInput("");
    await sendMessage(userInput, selectedModel);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const bg = darkMode ? "#1a1a2e" : "#ffffff";
  const headerBg = darkMode ? "#16213e" : "#f8f9fa";
  const borderColor = darkMode ? "#333" : "#e0e0e0";
  const inputBg = darkMode ? "#2d2d2d" : "#f0f0f0";
  const textColor = darkMode ? "#ffffff" : "#1a1a2e";

  return (
    <div style={{ ...styles.app, backgroundColor: bg, color: textColor }}>

      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          conversations={conversations}
          currentId={currentId}
          onSelect={selectConversation}
          onNew={newChat}
          darkMode={darkMode}
        />
      )}

      {/* Main Area */}
      <div style={styles.main}>

        {/* Header */}
        <div style={{
          ...styles.header,
          backgroundColor: headerBg,
          borderBottom: `1px solid ${borderColor}`
        }}>
          <div style={styles.headerLeft}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={styles.sidebarToggle}
              title="Toggle sidebar"
            >
              ☰
            </button>
            <span style={styles.logo}>🤖</span>
            <span style={{ ...styles.title, color: textColor }}>ORA Chatbot</span>
            <span style={styles.badge}>Powered by OpenRouter</span>
          </div>
          <div style={styles.headerRight}>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading}
            />
            <button
              onClick={clearChat}
              style={styles.clearBtn}
              title="Clear chat"
            >
              🗑️ Clear
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={styles.themeBtn}
              title="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          darkMode={darkMode}
        />

        {/* Error */}
        {error && (
          <div style={styles.error}>{error}</div>
        )}

        {/* Input Area */}
        <div style={{
          ...styles.inputArea,
          backgroundColor: headerBg,
          borderTop: `1px solid ${borderColor}`
        }}>
          <div style={{ ...styles.inputWrapper, backgroundColor: inputBg }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              style={{
                ...styles.textarea,
                color: textColor,
                backgroundColor: "transparent"
              }}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                ...styles.sendBtn,
                opacity: isLoading || !input.trim() ? 0.5 : 1,
              }}
            >
              {isLoading ? "⏳" : "➤"}
            </button>
          </div>
          <p style={{ ...styles.hint, color: darkMode ? "#666" : "#999" }}>
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    overflow: "hidden",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: "10px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  sidebarToggle: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    color: "#666",
  },
  logo: { fontSize: "24px" },
  title: {
    fontSize: "18px",
    fontWeight: "600",
  },
  badge: {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "12px",
    backgroundColor: "#EEEDFE",
    color: "#534AB7",
    fontWeight: "500",
  },
  clearBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "12px",
    color: "#666",
  },
  themeBtn: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "16px",
  },
  inputArea: {
    padding: "12px 20px",
    flexShrink: 0,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "flex-end",
    borderRadius: "12px",
    padding: "8px 12px",
    gap: "8px",
  },
  textarea: {
    flex: 1,
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "14px",
    lineHeight: "1.5",
    fontFamily: "inherit",
    maxHeight: "120px",
    overflowY: "auto",
  },
  sendBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1B4F8A",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  hint: {
    fontSize: "11px",
    textAlign: "center",
    margin: "6px 0 0 0",
  },
  error: {
    backgroundColor: "#faece7",
    color: "#993C1D",
    padding: "10px 20px",
    fontSize: "13px",
    textAlign: "center",
  },
};

export default App;