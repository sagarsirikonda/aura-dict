import React from 'react';
import ReactDOM from 'react-dom/client';
import css from '../assets/styles.css?inline'; // Import Tailwind styles
import GhostButton from '../components/GhostButton';

// Container for our Extension UI (Shadow DOM)
const rootElement = document.createElement('div');
rootElement.id = 'context-dictionary-root';
Object.assign(rootElement.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '2147483647',
    pointerEvents: 'none'
});
document.body.appendChild(rootElement);

const shadowRoot = rootElement.attachShadow({ mode: 'open' });
const shadowContainer = document.createElement('div');
shadowRoot.appendChild(shadowContainer);

const style = document.createElement('style');
style.textContent = css;
shadowContainer.appendChild(style);

const root = ReactDOM.createRoot(shadowContainer);

// LOGIC to find the nearest sentence/paragraph.
function getContext(selection: Selection): string {
    if (!selection.anchorNode) return "";

    let currentNode: Node | null = selection.anchorNode;
    const blockTags = ['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'ARTICLE', 'SECTION'];
    
    // Finds the parent block
    while (currentNode && currentNode.nodeName !== 'BODY') {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
            if (blockTags.includes(currentNode.nodeName)) {
                break; 
            }
        }
        currentNode = currentNode.parentNode;
    }

    const element = currentNode as HTMLElement;
    if (!element) return selection.anchorNode.textContent || "";
    
    const clone = element.cloneNode(true) as HTMLElement;

    // Remove scripts, styles, and hidden elements from the clone
    const junkTags = clone.querySelectorAll('script, style, noscript, iframe, svg');
    junkTags.forEach(tag => tag.remove());

    // Clean text
    let cleanText = clone.textContent || "";
    
    // Collapse multiple spaces into one
    return cleanText.replace(/\s+/g, ' ').trim(); 
}

// Close the tooltip if the user clicks anywhere else on the page
document.addEventListener('mousedown', (event) => {
    if (event.target === rootElement) {
        return;
    }
    root.render(<></>);
});

document.addEventListener('mouseup', () => {
    const selection = window.getSelection();

    if (!selection || selection.toString().trim().length === 0) {
        // root.render(<></>); 
        return;
    }

    // Get the specific word and the context
    const selectedText = selection.toString().trim();
    const context = getContext(selection);

    // Calculates Position (Where to show the Ghost Icon)
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect(); // Gives us coordinates relative to viewport
    
    // Position Logic
    const position = {
        top: rect.top + window.scrollY, 
        left: rect.left + window.scrollX + (rect.width / 2)
    };

    // console.log("Target Word:", selectedText);
    // console.log("Context Found:", context);
    // console.log("Position:", position);
    
    const handleClose = () => {
    root.render(<></>); // Unmounts by rendering nothing
};

root.render(
    <React.StrictMode>
        <GhostButton 
            x={position.left} 
            y={position.top} 
            selectedText={selectedText} 
            context={context}
            onClose={handleClose}
        />
    </React.StrictMode>
);

});