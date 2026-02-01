import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { analyzeCode, CodeAnalysisResult } from '@/lib/ai/code-agent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Code2,
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ChevronRight,
  Play,
  Lightbulb,
  FileCode,
  Bug,
  Zap
} from 'lucide-react';

const CodeAssistant = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CodeAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'errors' | 'dryrun' | 'improvements'>('explanation');

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: 'No code',
        description: 'Please paste some code to analyze',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeCode(code);
      setResult(analysisResult);
      toast({
        title: 'Analysis complete!',
        description: `Detected ${analysisResult.language} code`
      });
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleCode = `def fibonacci(n):
    # Calculate the nth Fibonacci number
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`;

  const loadSample = () => {
    setCode(sampleCode);
    toast({
      title: 'Sample loaded',
      description: 'Python Fibonacci example is ready'
    });
  };

  const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const tabs: { id: 'explanation' | 'errors' | 'dryrun' | 'improvements'; label: string; icon: typeof FileCode; count?: number }[] = [
    { id: 'explanation', label: 'Line-by-Line', icon: FileCode },
    { id: 'errors', label: 'Issues', icon: Bug, count: result?.errors.length },
    { id: 'dryrun', label: 'Dry Run', icon: Play },
    { id: 'improvements', label: 'Tips', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-b border-border/50 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-code/20 rounded-lg">
                <Code2 className="w-6 h-6 text-code" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Code AI</h1>
                <p className="text-xs text-muted-foreground">Intelligent code analysis</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {result && (
              <span className="px-3 py-1 rounded-full bg-code/20 text-code text-sm font-medium">
                {result.language}
              </span>
            )}
            {user && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-code/30"
              />
            )}
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Code2 className="w-4 h-4 text-code" />
                Paste your code
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadSample}
                className="text-xs text-muted-foreground"
              >
                Load sample
              </Button>
            </div>

            <div className="relative">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Paste your code here
// Supports: Java, Python, JavaScript, C++, and more

function example() {
  console.log("Hello, World!");
}`}
                className="min-h-[400px] font-mono text-sm bg-[hsl(222,47%,5%)] border-border resize-none input-glow leading-relaxed"
                spellCheck={false}
              />
              {code && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {code.split('\n').length} lines
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
                className="flex-1 h-12 gap-2 bg-gradient-to-r from-code to-blue-400 text-primary-foreground hover:opacity-90"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Code
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCode('');
                  setResult(null);
                }}
                className="h-12"
                disabled={isAnalyzing}
              >
                Clear
              </Button>
            </div>

            {/* Supported Languages */}
            <div className="flex flex-wrap gap-2">
              {['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C'].map(lang => (
                <span
                  key={lang}
                  className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {!result && !isAnalyzing && (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Bot className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground mb-4">
                  Paste your code to get line-by-line explanations, error detection, and optimization tips
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileCode className="w-3 h-3" /> Line explanations
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Bug className="w-3 h-3" /> Error detection
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Play className="w-3 h-3" /> Dry run
                  </span>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="glass-card p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-code/20 mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8 text-code" />
                </div>
                <h3 className="text-lg font-medium mb-2">Analyzing Code</h3>
                <p className="text-muted-foreground">
                  Detecting patterns, errors, and generating explanations...
                </p>
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-code shimmer" style={{ width: '60%' }} />
                </div>
              </div>
            )}

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Intent Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-code/20">
                        <Zap className="w-4 h-4 text-code" />
                      </div>
                      <h3 className="font-semibold">Code Intent</h3>
                      <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                        result.complexity === 'simple' ? 'bg-green-500/20 text-green-400' :
                        result.complexity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {result.complexity}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{result.intent}</p>
                  </motion.div>

                  {/* Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab(tab.id)}
                        className={`gap-2 flex-shrink-0 ${
                          activeTab === tab.id ? 'bg-code text-primary-foreground' : ''
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-destructive/20 text-destructive">
                            {tab.count}
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 max-h-[400px] overflow-y-auto"
                  >
                    {activeTab === 'explanation' && (
                      <div className="space-y-3">
                        {result.lineByLineExplanation.map((item, i) => (
                          <div key={i} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                            <span className="text-xs text-muted-foreground font-mono w-8 flex-shrink-0">
                              L{item.line}
                            </span>
                            <div className="flex-1 min-w-0">
                              <code className="text-xs font-mono text-code block truncate mb-1">
                                {item.code.trim() || '(empty)'}
                              </code>
                              <p className="text-sm text-muted-foreground">
                                {item.explanation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'errors' && (
                      <div className="space-y-3">
                        {result.errors.length === 0 ? (
                          <div className="text-center py-8">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="font-medium">No issues detected!</p>
                            <p className="text-sm text-muted-foreground">Your code looks good</p>
                          </div>
                        ) : (
                          result.errors.map((error, i) => (
                            <div
                              key={i}
                              className={`flex items-start gap-3 p-3 rounded-lg ${
                                error.severity === 'error' ? 'bg-destructive/10' :
                                error.severity === 'warning' ? 'bg-yellow-500/10' :
                                'bg-primary/10'
                              }`}
                            >
                              {getSeverityIcon(error.severity)}
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                                    Line {error.line}
                                  </span>
                                  <span className="text-xs text-muted-foreground capitalize">
                                    {error.type.replace('-', ' ')}
                                  </span>
                                </div>
                                <p className="text-sm">{error.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === 'dryrun' && (
                      <div className="space-y-4">
                        {result.dryRun.map((step, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-code/20 flex items-center justify-center text-code font-bold text-sm">
                                {step.step}
                              </div>
                              {i < result.dryRun.length - 1 && (
                                <div className="w-0.5 h-8 bg-code/30 mx-auto mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="font-medium mb-2">{step.description}</p>
                              {Object.keys(step.variables).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(step.variables).map(([key, value]) => (
                                    <span key={key} className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                      {key} = {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'improvements' && (
                      <div className="space-y-3">
                        {result.improvements.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">{tip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CodeAssistant;
