import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  BookOpen, 
  Code2, 
  Map, 
  Sparkles, 
  LogOut,
  ChevronRight,
  Zap,
  Brain,
  Rocket
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const assistants = [
    {
      id: 'notes',
      title: 'Notes AI',
      description: 'Upload PDFs, images, or paste text. Get instant summaries, key concepts, and easy explanations.',
      icon: BookOpen,
      color: 'notes',
      features: ['PDF & Image Upload', 'Smart Summarization', 'Key Concepts Extraction'],
      path: '/notes'
    },
    {
      id: 'code',
      title: 'Code AI',
      description: 'Paste your code for detailed analysis, error detection, dry runs, and optimization tips.',
      icon: Code2,
      color: 'code',
      features: ['Multi-Language Support', 'Line-by-Line Explanation', 'Error Detection'],
      path: '/code'
    },
    {
      id: 'roadmap',
      title: 'Roadmap AI',
      description: 'Tell us what you want to learn. Get a personalized roadmap with curated resources.',
      icon: Map,
      color: 'roadmap',
      features: ['Personalized Paths', 'Curated Resources', 'Progress Tracking'],
      path: '/roadmap'
    }
  ];

  const stats = [
    { icon: Zap, label: 'Instant Analysis', value: '<1s' },
    { icon: Brain, label: 'AI Models', value: '3' },
    { icon: Rocket, label: 'Languages', value: '10+' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">Code Companion</span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-primary/30"
                />
                <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Learning Platform</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Student'}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your AI assistant below to start learning smarter, not harder.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Assistant Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {assistants.map((assistant) => (
            <motion.div
              key={assistant.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(assistant.path)}
              className={`glass-card p-6 lg:p-8 cursor-pointer hover-glow group relative overflow-hidden`}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-${assistant.color}`} />
              
              {/* Icon */}
              <div className={`relative inline-flex p-4 rounded-xl bg-${assistant.color}/10 mb-6`}>
                <assistant.icon className={`w-8 h-8 text-${assistant.color}`} />
                <div className={`absolute inset-0 rounded-xl bg-${assistant.color}/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                {assistant.title}
                <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-muted-foreground mb-6">
                {assistant.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {assistant.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${assistant.color}`} />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <Button
                className={`mt-6 w-full bg-${assistant.color}/10 hover:bg-${assistant.color}/20 text-${assistant.color} border border-${assistant.color}/30`}
              >
                Launch Assistant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium">Pro tip:</span> Drag and drop files directly onto any assistant for instant analysis
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
