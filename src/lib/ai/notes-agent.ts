// Simulated AI processing for notes analysis
export interface NotesAnalysisResult {
  summary: string;
  keyConceptsList: string[];
  simpleExplanation: string;
  realWorldExamples: string[];
  sections: {
    title: string;
    content: string;
  }[];
}

// Keyword extraction using TF-IDF-like approach
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with',
    'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'be', 'are', 'was',
    'were', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
    'dare', 'ought', 'used', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'who',
    'how', 'when', 'where', 'why', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

// Sentence extraction for summarization
function extractImportantSentences(text: string, count: number = 5): string[] {
  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 30 && s.length < 300);

  if (sentences.length <= count) return sentences;

  // Score sentences based on keyword presence and position
  const keywords = extractKeywords(text);
  const scored = sentences.map((sentence, index) => {
    let score = 0;
    const lowerSentence = sentence.toLowerCase();
    
    keywords.forEach(keyword => {
      if (lowerSentence.includes(keyword.toLowerCase())) {
        score += 2;
      }
    });

    // First and last sentences often important
    if (index < 3) score += 3;
    if (index >= sentences.length - 3) score += 2;

    // Sentences with certain patterns
    if (/^(therefore|thus|in conclusion|importantly|notably|significantly)/i.test(sentence)) {
      score += 3;
    }

    return { sentence, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.sentence);
}

// Generate section headers based on content
function identifySections(text: string): { title: string; content: string }[] {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 50);
  
  if (paragraphs.length === 0) {
    return [{ title: 'Main Content', content: text }];
  }

  return paragraphs.slice(0, 5).map((paragraph, index) => {
    const firstLine = paragraph.split(/[.!?\n]/)[0].trim();
    const keywords = extractKeywords(paragraph);
    const title = keywords.length > 0 
      ? `${keywords[0]} ${keywords[1] ? `& ${keywords[1]}` : ''}`
      : `Section ${index + 1}`;
    
    return {
      title: title.length > 50 ? title.substring(0, 47) + '...' : title,
      content: paragraph.trim()
    };
  });
}

// Generate beginner-friendly explanation
function generateSimpleExplanation(text: string): string {
  const keywords = extractKeywords(text);
  const sentences = extractImportantSentences(text, 3);
  
  const intro = `This document primarily discusses ${keywords.slice(0, 3).join(', ').toLowerCase()}.`;
  const main = sentences.length > 0 
    ? ` The main point is that ${sentences[0].toLowerCase().replace(/^[a-z]/, c => c.toUpperCase())}.`
    : '';
  const context = keywords.length > 3
    ? ` It also covers topics related to ${keywords.slice(3, 6).join(', ').toLowerCase()}.`
    : '';
  
  return intro + main + context;
}

// Generate real-world examples
function generateExamples(text: string): string[] {
  const keywords = extractKeywords(text);
  const examples: string[] = [];

  // Pattern-based example generation
  const patterns = [
    { keyword: 'algorithm', example: 'Like following a recipe step-by-step to bake a cake' },
    { keyword: 'function', example: 'Similar to a vending machine that takes input (money) and gives output (snack)' },
    { keyword: 'variable', example: 'Like a labeled box where you can store and change items' },
    { keyword: 'loop', example: 'Like brushing your teeth every day - same action repeated' },
    { keyword: 'array', example: 'Like a row of mailboxes, each with a number and can hold mail' },
    { keyword: 'object', example: 'Like a car with properties (color, speed) and actions (drive, stop)' },
    { keyword: 'class', example: 'Like a blueprint for building houses - same plan, different houses' },
    { keyword: 'database', example: 'Like a digital filing cabinet with organized folders' },
    { keyword: 'network', example: 'Like roads connecting different cities together' },
    { keyword: 'security', example: 'Like locks and keys protecting your home' },
    { keyword: 'api', example: 'Like a waiter taking your order to the kitchen and bringing food back' },
    { keyword: 'machine', example: 'Like teaching a child by showing examples until they learn patterns' },
    { keyword: 'data', example: 'Like collecting puzzle pieces to see the full picture' },
    { keyword: 'process', example: 'Like an assembly line in a factory, step by step' },
    { keyword: 'system', example: 'Like the human body with organs working together' },
  ];

  keywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    const match = patterns.find(p => lowerKeyword.includes(p.keyword));
    if (match && examples.length < 4) {
      examples.push(`**${keyword}**: ${match.example}`);
    }
  });

  // Add generic examples if not enough
  if (examples.length < 2) {
    examples.push('Think of the main concepts as building blocks that stack on top of each other');
    examples.push('Each new idea connects to what you already know, like adding pieces to a puzzle');
  }

  return examples;
}

export async function analyzeNotes(text: string): Promise<NotesAnalysisResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  if (!text || text.trim().length < 50) {
    return {
      summary: 'Please provide more text for a comprehensive analysis. The current content is too short.',
      keyConceptsList: [],
      simpleExplanation: 'Not enough content to generate an explanation.',
      realWorldExamples: [],
      sections: []
    };
  }

  const importantSentences = extractImportantSentences(text, 5);
  const keywords = extractKeywords(text);
  const sections = identifySections(text);

  return {
    summary: importantSentences.join('. ') + '.',
    keyConceptsList: keywords,
    simpleExplanation: generateSimpleExplanation(text),
    realWorldExamples: generateExamples(text),
    sections
  };
}

// PDF text extraction simulation (in real app, use PDF.js)
export function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result;
      
      if (file.type === 'text/plain') {
        resolve(content as string);
      } else if (file.type === 'application/pdf') {
        // Simulated PDF extraction
        resolve(`[PDF Content Extracted from: ${file.name}]\n\nThis is simulated PDF content. In a production environment, this would use PDF.js or a backend service to extract actual text from the PDF document.\n\nThe document appears to contain information about programming concepts, software development practices, and technical documentation.\n\nKey sections would include introduction, main body with detailed explanations, code examples, and conclusions with best practices and recommendations for implementation.`);
      } else if (file.type.startsWith('image/')) {
        // Simulated OCR
        resolve(`[OCR Text Extracted from: ${file.name}]\n\nThis is simulated OCR content. In a production environment, this would use Tesseract.js or a backend OCR service to extract text from the image.\n\nThe image appears to contain handwritten or printed notes about technical subjects, with diagrams and annotations explaining key concepts.`);
      } else {
        resolve(`[Content from: ${file.name}]\n\nFile type: ${file.type}\nSize: ${(file.size / 1024).toFixed(2)} KB`);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      // For non-text files, just simulate
      setTimeout(() => {
        reader.onload?.({ target: { result: '' } } as any);
      }, 500);
    }
  });
}
