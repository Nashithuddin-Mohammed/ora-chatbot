const TypingIndicator = () => (
    <div style={styles.container}>
        <div style={styles.bubble}>
            <span style={{ ...styles.dot, animationDelay: "0ms" }} />
            <span style={{ ...styles.dot, animationDelay: "150ms" }} />
            <span style={{ ...styles.dot, animationDelay: "300ms" }} />
        </div>
        <style>{`
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
      }
    `}</style>
    </div>
);

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
    },
    bubble: {
        background: "#f0f0f0",
        borderRadius: "18px",
        padding: "10px 16px",
        display: "flex",
        gap: "4px",
        alignItems: "center",
    },
    dot: {
        display: "inline-block",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#888",
        animation: "bounce 1.2s infinite",
    },
};

export default TypingIndicator;