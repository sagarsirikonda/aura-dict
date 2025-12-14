// src/background/index.ts
import { GROQ_API_KEY } from '../secrets';

// define structure of AI message
interface FetchRequest {
    action: string;
    word: string;
    context: string;
}

chrome.runtime.onMessage.addListener((
    request: FetchRequest, 
    _sender: chrome.runtime.MessageSender, 
    sendResponse: (response?: any) => void
) => {
    if (request.action === "FETCH_DEFINITION") {
        fetchDefinition(request.word, request.context)
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: (error as Error).message }));
        
        return true; // Keep channel open for async response
    }
});

async function fetchDefinition(word: string, context: string) {
    const prompt = `
    You are a context-aware dictionary assistant.
    The user is reading a webpage and wants to know the meaning of the term: "${word}".
    
    Here is the surrounding context where the term appears:
    " ... ${context} ... "
    
    Task:
    1. Define "${word}" strictly based on how it is used in the context.
    2. If it is an acronym, provide the full form.
    3. Be concise (max 2 sentences).
    4. Provide a "category" tag (e.g., Medical, Tech, Slang).

    Output format (JSON only):
    {
      "definition": "The definition here...",
      "expansion": "Full Form (if acronym) or null",
      "category": "Category Name"
    }
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a helpful concise dictionary helper that outputs JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        // Safe parsing
        const content = typeof data.choices[0].message.content === 'string' 
            ? JSON.parse(data.choices[0].message.content) 
            : data.choices[0].message.content;
            
        return content;

    } catch (err) {
        console.error("Groq API Error:", err);
        throw new Error("Failed to reach AI");
    }
}