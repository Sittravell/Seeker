
// Helper to sanitize and split strings (genres, keywords)
export const parseFeatures = (text: string): Set<string> => {
    if (!text) return new Set();
    const items = text.split(',').map(item => item.trim().toLowerCase()).filter(item => item.length > 0);
    return new Set(items);
};

// Jaccard Similarity Calculator
export const calculateJaccardSimilarity = (setA: Set<string>, setB: Set<string>): number => {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    if (union.size === 0) return 0;
    return intersection.size / union.size;
};
