const Sidebar = ({ conversations, currentId, onSelect, onNew, darkMode }) => {
    const bg = darkMode ? "#16213e" : "#f8f9fa";
    const borderColor = darkMode ? "#333" : "#e0e0e0";
    const textColor = darkMode ? "#ffffff" : "#1a1a2e";
    const hoverBg = darkMode ? "#2d2d2d" : "#e8e8e8";

    return (
        <div style={{ ...styles.sidebar, backgroundColor: bg, borderRight: `1px solid ${borderColor}` }}>
            {/* New Chat Button */}
            <button onClick={onNew} style={styles.newChatBtn}>
                + New Chat
            </button>

            {/* Conversation List */}
            <div style={styles.list}>
                {conversations.length === 0 ? (
                    <p style={{ ...styles.empty, color: darkMode ? "#666" : "#999" }}>
                        No conversations yet
                    </p>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            style={{
                                ...styles.item,
                                backgroundColor: conv.id === currentId ? hoverBg : "transparent",
                                color: textColor,
                            }}
                        >
                            <span style={styles.itemIcon}>💬</span>
                            <span style={styles.itemTitle}>
                                {conv.title || "New Conversation"}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div style={{ ...styles.footer, borderTop: `1px solid ${borderColor}` }}>
                <p style={{ ...styles.footerText, color: darkMode ? "#666" : "#999" }}>
                    ORA Chatbot
                </p>
                <p style={{ ...styles.footerText, color: darkMode ? "#666" : "#999" }}>
                    Powered by OpenRouter
                </p>
            </div>
        </div>
    );
};

const styles = {
    sidebar: {
        width: "260px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
    },
    newChatBtn: {
        margin: "12px",
        padding: "10px 16px",
        borderRadius: "8px",
        border: "1px solid #1B4F8A",
        backgroundColor: "#1B4F8A",
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "left",
    },
    list: {
        flex: 1,
        overflowY: "auto",
        padding: "4px 8px",
    },
    empty: {
        fontSize: "13px",
        textAlign: "center",
        marginTop: "20px",
    },
    item: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        marginBottom: "2px",
        transition: "background 0.15s",
    },
    itemIcon: {
        fontSize: "14px",
        flexShrink: 0,
    },
    itemTitle: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flex: 1,
    },
    footer: {
        padding: "12px 16px",
    },
    footerText: {
        fontSize: "11px",
        margin: "2px 0",
    },
};

export default Sidebar;