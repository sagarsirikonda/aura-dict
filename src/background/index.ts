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
    ### ROLE
You are an Expert Semantic Analysis Engine. Your goal is to perform "Word Sense Disambiguation" (WSD) to define the user's selection with extreme precision.

### CORE PROTOCOL
1. **Domain Detection:** Analyze the "Context Snippet" to identify the specific field (e.g., "Medical", "Financial", "Biology", "Python Programming").
2. **Contextual Locking:** Ignore the dictionary definition of "${word}". Instead, define it *only* as it exists within that detected field.
3. **Acronym Check:** If "${word}" is an abbreviation in this specific domain, you MUST resolve its full form.

### CONSTRAINTS
- **Ambiguity Rule:** If the snippet implies "Python" (the snake), DO NOT define "Python" (the code). Trust the snippet signals (keywords like "scales", "zoo", "reptile") over your training bias.
- **Conciseness:** The definition must be punchy and direct (max 25 words).
- **Tone:** Objective and professional.

### INPUT DATA
Context Snippet: "... ${context} ..."
User Selection: "${word}"

### OUTPUT FORMAT
Return valid JSON only. No markdown.

{
  "definition": "The context-specific definition.",
  "expansion": "Full form if acronym (e.g., 'Return on Investment'), else null.",
  "category": "The detected domain (e.g. 'Finance', 'Ornithology', 'Slang')"
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