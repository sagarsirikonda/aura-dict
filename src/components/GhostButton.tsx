import React, { useState, useEffect } from 'react';
import { BookOpen, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostButtonProps {
    x: number;
    y: number;
    selectedText: string;
    context: string;
    onClose: () => void;
}

const GhostButton: React.FC<GhostButtonProps> = ({ x, y, selectedText, context, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [definition, setDefinition] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // AI TRIGGER
    useEffect(() => {
        if (isOpen && !definition && !loading) {
            setLoading(true);
            
            chrome.runtime.sendMessage(
                { 
                    action: "FETCH_DEFINITION", 
                    word: selectedText, 
                    context: context 
                },
                (response: { success: boolean; data?: any; error?: string }) => {
                    setLoading(false);
                    if (response && response.success) {
                        setDefinition(response.data);
                    } else {
                        setError("Could not connect to AI.");
                    }
                }
            );
        }
    }, [isOpen]);

    // GHOST BUTTON
    if (!isOpen) {
        return (
            <button
                style={{
                    position: 'absolute',
                    top: y - 40, left: x - 20,
                    width: '40px', height: '40px',
                    backgroundColor: '#818cf8', // Indigo
                    color: 'white',
                    border: 'none', borderRadius: '50%',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(129, 140, 248, 0.4)',
                    zIndex: 2147483647, pointerEvents: 'auto'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
            >
                <BookOpen size={20} />
            </button>
        );
    }

    // THE CARD (Expanded View)
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                    position: 'absolute',
                    top: y + 10, left: x,
                    width: '320px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 2147483647,
                    overflow: 'hidden', pointerEvents: 'auto',
                    border: '1px solid #e2e8f0', textAlign: 'left',
                    fontFamily: 'sans-serif'
                }}
            >
                {/* Header */}
                <div style={{ padding: '12px', background: '#e0e7ff', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #c7d2fe' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#4f46e5', letterSpacing: '0.5px' }}>
                        {definition?.category || "AURA"}
                    </span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                        {selectedText}
                    </h3>
                    
                    {definition?.expansion && (
                        <div style={{ fontSize: '13px', color: '#4f46e5', fontWeight: '600', marginBottom: '8px' }}>
                            {definition.expansion}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px', margin: '12px 0' }}>
                            <Loader2 size={16} className="animate-spin" /> 
                            <span>Analyzing context...</span>
                        </div>
                    )}

                    {/* Result */}
                    {definition && !loading && (
                        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#334155', marginTop: '8px' }}>
                            {definition.definition}
                        </p>
                    )}

                    {/* Error state */}
                    {error && (
                        <p style={{ fontSize: '14px', color: '#ef4444', marginTop: '8px' }}>{error}</p>
                    )}

                    <div style={{ fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '12px' }}>
                        <strong>Context:</strong> {context.substring(0, 50)}...
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GhostButton;