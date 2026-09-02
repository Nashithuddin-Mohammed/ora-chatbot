const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const fetchModels = async () => {
    const response = await fetch(`${API_BASE_URL}/api/models`);
    const data = await response.json();
    return data.models;
};

export const sendMessage = async (messages, model) => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, model, stream: false }),
    });
    const data = await response.json();
    return data.choices[0].message.content;
};

export const sendMessageStream = async (messages, model, onChunk, onDone) => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, model, stream: true }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") {
                    onDone(fullText);
                    return;
                }
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                        fullText += content;
                        onChunk(fullText);
                    }
                } catch (e) { }
            }
        }
    }
    onDone(fullText);
};