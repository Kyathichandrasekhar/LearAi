import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { generateRoadmap, RoadmapResult } from '@/lib/ai/roadmap-agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Map,
  ArrowLeft,
  Sparkles,
  Loader2,
  ChevronRight,
  ExternalLink,
  Clock,
  BookOpen,
  Video,
  FileText,
  Code2,
  GraduationCap,
  Target,
  CheckCircle2,
  Rocket
} from 'lucide-react';

const RoadmapAssistant = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [expandedStage, setExpandedStage] = useState<number | null>(0);

  const handleGenerate = async () => {
    if (!goal.trim()) {
      toast({
        title: 'No goal specified',
        description: 'Please tell us what you want to learn',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const roadmapResult = await generateRoadmap(goal);
      setResult(roadmapResult);
      toast({
        title: 'Roadmap generated!',
        description: `Your ${roadmapResult.estimatedDuration} learning path is ready`
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    'Web Development',
    'Python Programming',
    'Machine Learning',
    'Java DSA',
    'React',
    'Data Science'
  ];

  const getResourceIcon = (type: 'video' | 'docs' | 'practice' | 'project') => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-red-400" />;
      case 'docs':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'practice':
        return <Code2 className="w-4 h-4 text-green-400" />;
      case 'project':
        return <Rocket className="w-4 h-4 text-purple-400" />;
    }
  };

  const getLevelColor = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    switch (level) {
      case 'Beginner':
        return 'from-green-500 to-emerald-500';
      case 'Intermediate':
        return 'from-yellow-500 to-orange-500';
      case 'Advanced':
        return 'from-red-500 to-pink-500';
    }
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
              <div className="p-2 bg-roadmap/20 rounded-lg">
                <Map className="w-6 h-6 text-roadmap" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Roadmap AI</h1>
                <p className="text-xs text-muted-foreground">Personalized learning paths</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-roadmap/30"
              />
            )}
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <GraduationCap className="w-4 h-4 text-roadmap" />
              <span className="text-sm font-medium">Start Your Learning Journey</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">What do you want to learn?</h2>
            <p className="text-muted-foreground">
              Enter your learning goal and get a personalized roadmap with curated resources
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Web Development, Python, Machine Learning..."
                  className="pl-12 h-14 text-lg bg-muted/50 border-border input-glow"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !goal.trim()}
                className="h-14 px-6 gap-2 bg-gradient-to-r from-roadmap to-teal-400 text-primary-foreground hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span className="hidden sm:inline">Generate</span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Suggestions:</span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setGoal(suggestion)}
                  className="px-3 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-roadmap/20 mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-roadmap" />
              </div>
              <h3 className="text-lg font-medium mb-2">Creating Your Learning Path</h3>
              <p className="text-muted-foreground">
                Curating the best resources and structuring your journey...
              </p>
              <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
                <div className="h-full bg-roadmap shimmer" style={{ width: '60%' }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!result && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ready to Guide You</h3>
              <p className="text-muted-foreground">
                Enter your learning goal above to get started with a personalized roadmap
              </p>
            </div>
          </motion.div>
        )}

        {/* Roadmap Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold mb-2">
                  Your <span className="gradient-text-accent">{result.goal}</span> Roadmap
                </h2>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {result.estimatedDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {result.stages.length} stages
                  </span>
                </div>
              </motion.div>

              {/* Timeline */}
              <div className="max-w-4xl mx-auto">
                {result.stages.map((stage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    {/* Connector Line */}
                    {index < result.stages.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-[calc(100%-4rem)] bg-gradient-to-b from-border to-transparent" />
                    )}

                    <div
                      className={`glass-card p-6 mb-6 cursor-pointer transition-all duration-300 ${
                        expandedStage === index ? 'ring-2 ring-roadmap/50' : ''
                      }`}
                      onClick={() => setExpandedStage(expandedStage === index ? null : index)}
                    >
                      {/* Stage Header */}
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${getLevelColor(stage.level)} flex-shrink-0`}>
                          <span className="text-lg font-bold text-white">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${getLevelColor(stage.level)} text-white`}>
                              {stage.level}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold mb-1">{stage.title}</h3>
                          <p className="text-muted-foreground">{stage.description}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                          expandedStage === index ? 'rotate-90' : ''
                        }`} />
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedStage === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-border"
                          >
                            {/* Topics */}
                            <div className="mb-6">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-roadmap" />
                                Topics to Cover
                              </h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {stage.topics.map((topic, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="flex-1 text-sm">{topic.name}</span>
                                    <span className="text-xs text-muted-foreground">{topic.duration}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resources */}
                            <div>
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-roadmap" />
                                Recommended Resources
                              </h4>
                              <div className="space-y-2">
                                {stage.resources.map((resource, i) => (
                                  <a
                                    key={i}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {getResourceIcon(resource.type)}
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-medium group-hover:text-roadmap transition-colors">
                                        {resource.title}
                                      </span>
                                      <span className="text-xs text-muted-foreground ml-2">
                                        {resource.platform}
                                      </span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setGoal('');
                    setExpandedStage(0);
                  }}
                  className="gap-2"
                >
                  Generate Another Roadmap
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default RoadmapAssistant;
