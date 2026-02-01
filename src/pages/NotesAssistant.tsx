import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { analyzeNotes, extractTextFromFile, NotesAnalysisResult } from '@/lib/ai/notes-agent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  BookOpen,
  ArrowLeft,
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  ChevronRight,
  Lightbulb,
  List,
  BookMarked,
  Zap,
  X,
  File
} from 'lucide-react';

const NotesAssistant = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [inputText, setInputText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NotesAnalysisResult | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(f => 
      f.type === 'application/pdf' || 
      f.type.startsWith('image/') || 
      f.type === 'text/plain'
    );

    if (validFiles.length === 0) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload PDF, image, or text files',
        variant: 'destructive'
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Extract text from first file
    if (validFiles.length > 0) {
      const text = await extractTextFromFile(validFiles[0]);
      setInputText(prev => prev + (prev ? '\n\n' : '') + text);
    }

    toast({
      title: 'Files uploaded!',
      description: `${validFiles.length} file(s) ready for analysis`
    });
  }, [toast]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadedFiles(prev => [...prev, ...files]);
    
    const text = await extractTextFromFile(files[0]);
    setInputText(prev => prev + (prev ? '\n\n' : '') + text);

    toast({
      title: 'File uploaded!',
      description: `${files[0].name} is ready for analysis`
    });
  }, [toast]);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: 'No content',
        description: 'Please paste text or upload a file first',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeNotes(inputText);
      setResult(analysisResult);
      toast({
        title: 'Analysis complete!',
        description: 'Your notes have been processed'
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

  const clearAll = () => {
    setInputText('');
    setUploadedFiles([]);
    setResult(null);
  };

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
              <div className="p-2 bg-notes/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-notes" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Notes AI</h1>
                <p className="text-xs text-muted-foreground">Smart document analysis</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-notes/30"
              />
            )}
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`drop-zone transition-all duration-300 ${
                isDragging ? 'active border-notes bg-notes/5' : 'hover:border-notes/50'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${isDragging ? 'bg-notes/20' : 'bg-muted'}`}>
                  <Upload className={`w-8 h-8 ${isDragging ? 'text-notes' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-center">
                  <p className="font-medium mb-1">
                    {isDragging ? 'Drop files here!' : 'Drag & drop files here'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, images (OCR), and text files
                  </p>
                </div>
                <div className="flex gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.txt,.png,.jpg,.jpeg,.gif,.webp"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <Button variant="outline" className="gap-2 pointer-events-none">
                      <FileText className="w-4 h-4" />
                      Upload PDF
                    </Button>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <Button variant="outline" className="gap-2 pointer-events-none">
                      <ImageIcon className="w-4 h-4" />
                      Upload Image
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Uploaded Files */}
            <AnimatePresence>
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 glass-card"
                    >
                      <File className="w-4 h-4 text-notes" />
                      <span className="text-sm flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Text Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-notes" />
                Or paste your text directly
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your notes, article, or document content here..."
                className="min-h-[200px] bg-muted/50 border-border resize-none input-glow"
              />
              <p className="text-xs text-muted-foreground text-right">
                {inputText.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="flex-1 h-12 gap-2 bg-gradient-to-r from-notes to-orange-500 text-primary-foreground hover:opacity-90"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Notes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={clearAll}
                className="h-12"
                disabled={isAnalyzing}
              >
                Clear
              </Button>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {!result && !isAnalyzing && (
              <div className="glass-card p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Bot className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Upload a document or paste text to get AI-powered summaries and insights
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="glass-card p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-notes/20 mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8 text-notes" />
                </div>
                <h3 className="text-lg font-medium mb-2">Analyzing Your Content</h3>
                <p className="text-muted-foreground">
                  Extracting key concepts and generating insights...
                </p>
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-notes shimmer" style={{ width: '60%' }} />
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
                  {/* Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-notes/20">
                        <BookMarked className="w-4 h-4 text-notes" />
                      </div>
                      <h3 className="font-semibold">Summary</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {result.summary}
                    </p>
                  </motion.div>

                  {/* Key Concepts */}
                  {result.keyConceptsList.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <List className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-semibold">Key Concepts</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.keyConceptsList.map((concept, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Simple Explanation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-accent/20">
                        <Lightbulb className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="font-semibold">Simple Explanation</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {result.simpleExplanation}
                    </p>
                  </motion.div>

                  {/* Real-World Examples */}
                  {result.realWorldExamples.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-secondary/20">
                          <Zap className="w-4 h-4 text-secondary" />
                        </div>
                        <h3 className="font-semibold">Real-World Examples</h3>
                      </div>
                      <ul className="space-y-3">
                        {result.realWorldExamples.map((example, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <ChevronRight className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Sections */}
                  {result.sections.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-notes/20">
                          <FileText className="w-4 h-4 text-notes" />
                        </div>
                        <h3 className="font-semibold">Document Sections</h3>
                      </div>
                      <div className="space-y-4">
                        {result.sections.map((section, i) => (
                          <div key={i} className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-2 text-notes">{section.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NotesAssistant;
