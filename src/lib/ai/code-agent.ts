// Simulated AI processing for code analysis
export interface CodeAnalysisResult {
  language: string;
  intent: string;
  lineByLineExplanation: { line: number; code: string; explanation: string }[];
  errors: { type: 'syntax' | 'logic' | 'edge-case'; line: number; message: string; severity: 'error' | 'warning' | 'info' }[];
  dryRun: { step: number; description: string; variables: Record<string, string> }[];
  improvements: string[];
  complexity: 'simple' | 'moderate' | 'complex';
}

// Language detection
function detectLanguage(code: string): string {
  const patterns: Record<string, RegExp[]> = {
    'Python': [/\bdef\s+\w+\s*\(/, /\bprint\s*\(/, /\bimport\s+\w+/, /:\s*$/, /\bself\./],
    'JavaScript': [/\bconst\s+/, /\blet\s+/, /\bfunction\s+/, /\b=>\s*{?/, /console\.log/],
    'TypeScript': [/:\s*(string|number|boolean|any)/, /\binterface\s+/, /\btype\s+\w+\s*=/, /\<\w+\>/],
    'Java': [/\bpublic\s+class\s+/, /\bprivate\s+/, /\bSystem\.out\.print/, /\bvoid\s+main/],
    'C++': [/\#include\s*</, /\bstd::/, /\bcout\s*<</, /\bint\s+main\s*\(/],
    'C': [/\#include\s*<stdio/, /\bprintf\s*\(/, /\bint\s+main\s*\(/, /\bmalloc\s*\(/],
  };

  let bestMatch = 'Unknown';
  let maxScore = 0;

  for (const [lang, regexes] of Object.entries(patterns)) {
    const score = regexes.filter(regex => regex.test(code)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = lang;
    }
  }

  return bestMatch;
}

// Detect code intent
function detectIntent(code: string, language: string): string {
  const patterns = [
    { regex: /sort|bubble|quick|merge|insertion/i, intent: 'Implements a sorting algorithm to arrange elements in order' },
    { regex: /search|find|binary|linear/i, intent: 'Implements a search algorithm to find elements' },
    { regex: /fibonacci|factorial|recursive/i, intent: 'Calculates mathematical sequences using recursion' },
    { regex: /class\s+\w+|constructor/i, intent: 'Defines a class structure with object-oriented programming' },
    { regex: /async|await|Promise|fetch/i, intent: 'Handles asynchronous operations for non-blocking execution' },
    { regex: /for\s*\(|while\s*\(|forEach/i, intent: 'Iterates through data using loops' },
    { regex: /if\s*\(|switch\s*\(/i, intent: 'Implements conditional logic for decision making' },
    { regex: /\[\]|\{\}|array|list|map|dict/i, intent: 'Works with data structures to store and manipulate data' },
    { regex: /input|read|scan|prompt/i, intent: 'Handles user input for interactive functionality' },
    { regex: /print|console|output|write/i, intent: 'Outputs data to display results' },
    { regex: /api|http|request|response/i, intent: 'Communicates with external services via API calls' },
    { regex: /file|open|read|write|stream/i, intent: 'Performs file I/O operations' },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(code)) {
      return pattern.intent;
    }
  }

  return `This ${language} code performs specific operations based on the logic defined`;
}

// Generate line-by-line explanation
function explainLines(code: string, language: string): { line: number; code: string; explanation: string }[] {
  const lines = code.split('\n');
  const explanations: { line: number; code: string; explanation: string }[] = [];

  const patterns: { regex: RegExp; explain: (match: RegExpMatchArray, line: string) => string }[] = [
    { 
      regex: /^\s*(import|from|#include|using)\s+(.+)/,
      explain: (m, l) => `Imports ${m[2].trim()} - brings in external functionality`
    },
    { 
      regex: /^\s*(def|function|func)\s+(\w+)\s*\(/,
      explain: (m, l) => `Defines a function named '${m[2]}' that can be called later`
    },
    { 
      regex: /^\s*(class)\s+(\w+)/,
      explain: (m, l) => `Declares a class '${m[2]}' - a blueprint for creating objects`
    },
    { 
      regex: /^\s*(const|let|var|int|float|double|string)\s+(\w+)\s*=/,
      explain: (m, l) => `Creates a variable '${m[2]}' to store data`
    },
    { 
      regex: /^\s*(for|while)\s*\(/,
      explain: (m, l) => `Starts a ${m[1]} loop - repeats the following code block`
    },
    { 
      regex: /^\s*(if)\s*\(/,
      explain: (m, l) => `Conditional check - runs the next block only if condition is true`
    },
    { 
      regex: /^\s*(else if|elif)\s*\(/,
      explain: (m, l) => `Alternative condition - checked if previous conditions were false`
    },
    { 
      regex: /^\s*(else)\s*[:{]?$/,
      explain: (m, l) => `Default case - runs when all previous conditions are false`
    },
    { 
      regex: /^\s*(return)\s+(.+)/,
      explain: (m, l) => `Returns ${m[2].trim()} - sends this value back to the caller`
    },
    { 
      regex: /(print|console\.log|System\.out|cout)\s*[(<]/,
      explain: (m, l) => `Outputs data to the console for debugging or display`
    },
    { 
      regex: /^\s*(try)\s*[:{]?$/,
      explain: (m, l) => `Starts error handling - attempts to run risky code`
    },
    { 
      regex: /^\s*(catch|except)/,
      explain: (m, l) => `Error handler - runs if an error occurs in the try block`
    },
    { 
      regex: /^\s*[}\]]\s*$/,
      explain: (m, l) => `Closes the current code block`
    },
    { 
      regex: /^\s*#.+|^\s*\/\/.+|^\s*\/\*.+/,
      explain: (m, l) => `Comment - documentation for developers, ignored by computer`
    },
  ];

  lines.forEach((line, index) => {
    if (line.trim().length === 0) {
      explanations.push({
        line: index + 1,
        code: line,
        explanation: 'Empty line for code readability'
      });
      return;
    }

    let explained = false;
    for (const pattern of patterns) {
      const match = line.match(pattern.regex);
      if (match) {
        explanations.push({
          line: index + 1,
          code: line,
          explanation: pattern.explain(match, line)
        });
        explained = true;
        break;
      }
    }

    if (!explained) {
      explanations.push({
        line: index + 1,
        code: line,
        explanation: `Executes ${line.trim().substring(0, 30)}${line.trim().length > 30 ? '...' : ''}`
      });
    }
  });

  return explanations;
}

// Detect potential errors
function detectErrors(code: string, language: string): CodeAnalysisResult['errors'] {
  const errors: CodeAnalysisResult['errors'] = [];
  const lines = code.split('\n');

  // Check for common issues
  const checks = [
    {
      regex: /[^=!<>]=[^=]/,
      condition: (line: string) => /if\s*\(/.test(line) && /[^=!<>]=[^=]/.test(line),
      type: 'logic' as const,
      message: 'Possible assignment in condition (use == for comparison)',
      severity: 'warning' as const
    },
    {
      regex: /\/\s*0\b/,
      condition: (line: string) => /\/\s*0\b/.test(line),
      type: 'logic' as const,
      message: 'Division by zero detected',
      severity: 'error' as const
    },
    {
      regex: /\[\s*-\d+\s*\]/,
      condition: (line: string) => /\[\s*-\d+\s*\]/.test(line) && !['Python'].includes(language),
      type: 'edge-case' as const,
      message: 'Negative array index (may cause out-of-bounds error)',
      severity: 'warning' as const
    },
    {
      regex: /while\s*\(\s*true\s*\)|while\s*\(\s*1\s*\)/,
      condition: (line: string) => /while\s*\(\s*(true|1)\s*\)/.test(line),
      type: 'edge-case' as const,
      message: 'Infinite loop detected - ensure there\'s a break condition',
      severity: 'info' as const
    },
    {
      regex: /=\s*null|=\s*undefined|=\s*None/,
      condition: (line: string) => /=\s*(null|undefined|None)\b/.test(line),
      type: 'edge-case' as const,
      message: 'Null/undefined assignment - ensure proper null checking',
      severity: 'info' as const
    },
  ];

  lines.forEach((line, index) => {
    checks.forEach(check => {
      if (check.condition(line)) {
        errors.push({
          type: check.type,
          line: index + 1,
          message: check.message,
          severity: check.severity
        });
      }
    });

    // Check for unbalanced brackets
    const openBrackets = (line.match(/[\(\[\{]/g) || []).length;
    const closeBrackets = (line.match(/[\)\]\}]/g) || []).length;
    if (openBrackets !== closeBrackets && !line.trim().endsWith('{') && !line.trim().endsWith('(')) {
      // This is a simple check - real implementation would track across lines
    }
  });

  return errors;
}

// Generate dry run simulation
function generateDryRun(code: string): CodeAnalysisResult['dryRun'] {
  const steps: CodeAnalysisResult['dryRun'] = [];
  const lines = code.split('\n').filter(l => l.trim().length > 0);
  const variables: Record<string, string> = {};
  let stepNum = 1;

  // Simple simulation
  lines.slice(0, 10).forEach((line, index) => {
    const varMatch = line.match(/(?:const|let|var|int|float|double)\s+(\w+)\s*=\s*(.+)/);
    if (varMatch) {
      const [, name, value] = varMatch;
      variables[name] = value.replace(/;?\s*$/, '');
      steps.push({
        step: stepNum++,
        description: `Initialize variable '${name}' with value ${variables[name]}`,
        variables: { ...variables }
      });
    } else if (/for|while/.test(line)) {
      steps.push({
        step: stepNum++,
        description: `Enter loop - will iterate based on condition`,
        variables: { ...variables }
      });
    } else if (/if\s*\(/.test(line)) {
      steps.push({
        step: stepNum++,
        description: `Evaluate condition - branch based on result`,
        variables: { ...variables }
      });
    } else if (/print|console\.log|System\.out/.test(line)) {
      steps.push({
        step: stepNum++,
        description: `Output to console`,
        variables: { ...variables }
      });
    } else if (/return/.test(line)) {
      steps.push({
        step: stepNum++,
        description: `Return value and exit function`,
        variables: { ...variables }
      });
    }
  });

  if (steps.length === 0) {
    steps.push({
      step: 1,
      description: 'Program starts execution',
      variables: {}
    });
    steps.push({
      step: 2,
      description: 'Process main logic',
      variables: {}
    });
    steps.push({
      step: 3,
      description: 'Program completes',
      variables: {}
    });
  }

  return steps;
}

// Generate improvement suggestions
function generateImprovements(code: string, language: string): string[] {
  const improvements: string[] = [];

  // Check for common improvement opportunities
  if (!code.includes('//') && !code.includes('#') && !code.includes('/*')) {
    improvements.push('Add comments to explain complex logic and improve readability');
  }

  if (code.length > 500 && !code.includes('function') && !code.includes('def')) {
    improvements.push('Consider breaking the code into smaller, reusable functions');
  }

  if (/var\s+/.test(code) && language === 'JavaScript') {
    improvements.push('Use const/let instead of var for better scoping');
  }

  if (/\+\s*["']/.test(code)) {
    improvements.push('Consider using template literals for string concatenation');
  }

  if (/for\s*\(\s*\w+\s*=\s*0/.test(code) && language === 'Python') {
    improvements.push('Consider using Python\'s range() or enumerate() for cleaner iteration');
  }

  if (/catch\s*\(\s*\w*\s*\)\s*\{?\s*\}/.test(code)) {
    improvements.push('Avoid empty catch blocks - log or handle errors properly');
  }

  // Always suggest some best practices
  if (improvements.length < 2) {
    improvements.push('Consider adding input validation for robustness');
    improvements.push('Add error handling for edge cases');
  }

  return improvements.slice(0, 5);
}

export async function analyzeCode(code: string): Promise<CodeAnalysisResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  if (!code || code.trim().length < 10) {
    return {
      language: 'Unknown',
      intent: 'Please provide more code for analysis',
      lineByLineExplanation: [],
      errors: [],
      dryRun: [],
      improvements: [],
      complexity: 'simple'
    };
  }

  const language = detectLanguage(code);
  const lines = code.split('\n').length;
  const complexity = lines < 20 ? 'simple' : lines < 50 ? 'moderate' : 'complex';

  return {
    language,
    intent: detectIntent(code, language),
    lineByLineExplanation: explainLines(code, language),
    errors: detectErrors(code, language),
    dryRun: generateDryRun(code),
    improvements: generateImprovements(code, language),
    complexity
  };
}
