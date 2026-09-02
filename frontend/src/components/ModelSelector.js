const ModelSelector = ({ models, selectedModel, onModelChange, disabled }) => (
    <div style={styles.container}>
        <label style={styles.label}>Model:</label>
        <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={disabled}
            style={styles.select}
        >
            {models.map((model) => (
                <option key={model.id} value={model.id}>
                    {model.name}
                </option>
            ))}
        </select>
    </div>
);

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    label: {
        fontSize: "13px",
        color: "#666",
        fontWeight: "500",
    },
    select: {
        padding: "6px 10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
        backgroundColor: "#fff",
        cursor: "pointer",
        outline: "none",
    },
};

export default ModelSelector;