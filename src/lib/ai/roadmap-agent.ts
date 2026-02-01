// Simulated AI processing for learning roadmap generation
export interface RoadmapResult {
  goal: string;
  estimatedDuration: string;
  stages: {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    title: string;
    description: string;
    topics: { name: string; duration: string; completed?: boolean }[];
    resources: {
      type: 'video' | 'docs' | 'practice' | 'project';
      title: string;
      url: string;
      platform: string;
    }[];
  }[];
}

// Topic database with curated resources
const topicDatabase: Record<string, {
  keywords: string[];
  stages: RoadmapResult['stages'];
  duration: string;
}> = {
  'web-development': {
    keywords: ['web', 'frontend', 'website', 'html', 'css', 'react', 'javascript', 'full stack', 'fullstack'],
    duration: '4-6 months',
    stages: [
      {
        level: 'Beginner',
        title: 'Web Fundamentals',
        description: 'Master the building blocks of the web - HTML, CSS, and basic JavaScript',
        topics: [
          { name: 'HTML5 Basics & Semantics', duration: '1 week' },
          { name: 'CSS3 & Responsive Design', duration: '2 weeks' },
          { name: 'JavaScript Fundamentals', duration: '2 weeks' },
          { name: 'Git & Version Control', duration: '3 days' },
        ],
        resources: [
          { type: 'video', title: 'HTML & CSS Full Course', url: 'https://youtube.com/results?search_query=html+css+full+course', platform: 'YouTube' },
          { type: 'docs', title: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Learn', platform: 'Mozilla' },
          { type: 'practice', title: 'Frontend Mentor Challenges', url: 'https://www.frontendmentor.io/', platform: 'Frontend Mentor' },
        ]
      },
      {
        level: 'Intermediate',
        title: 'Modern JavaScript & Frameworks',
        description: 'Learn modern JavaScript features and popular frameworks',
        topics: [
          { name: 'ES6+ Features', duration: '1 week' },
          { name: 'React Fundamentals', duration: '2 weeks' },
          { name: 'State Management', duration: '1 week' },
          { name: 'API Integration & Fetch', duration: '1 week' },
        ],
        resources: [
          { type: 'video', title: 'React Course - Beginner to Pro', url: 'https://youtube.com/results?search_query=react+full+course', platform: 'YouTube' },
          { type: 'docs', title: 'React Official Docs', url: 'https://react.dev/', platform: 'React' },
          { type: 'project', title: 'Build a Todo App', url: 'https://github.com/topics/todo-app', platform: 'GitHub' },
        ]
      },
      {
        level: 'Advanced',
        title: 'Full Stack Development',
        description: 'Connect frontend with backend and deploy real applications',
        topics: [
          { name: 'Node.js & Express', duration: '2 weeks' },
          { name: 'Database (PostgreSQL/MongoDB)', duration: '1 week' },
          { name: 'Authentication & Security', duration: '1 week' },
          { name: 'Deployment & DevOps', duration: '1 week' },
        ],
        resources: [
          { type: 'video', title: 'Full Stack Development Guide', url: 'https://youtube.com/results?search_query=mern+stack+tutorial', platform: 'YouTube' },
          { type: 'docs', title: 'Node.js Documentation', url: 'https://nodejs.org/docs/', platform: 'Node.js' },
          { type: 'practice', title: 'Full Stack Open', url: 'https://fullstackopen.com/', platform: 'University of Helsinki' },
        ]
      }
    ]
  },
  'python': {
    keywords: ['python', 'automation', 'scripting', 'data analysis'],
    duration: '3-4 months',
    stages: [
      {
        level: 'Beginner',
        title: 'Python Fundamentals',
        description: 'Learn Python syntax, data types, and basic programming concepts',
        topics: [
          { name: 'Variables & Data Types', duration: '3 days' },
          { name: 'Control Flow & Loops', duration: '4 days' },
          { name: 'Functions & Modules', duration: '1 week' },
          { name: 'File Handling', duration: '3 days' },
        ],
        resources: [
          { type: 'video', title: 'Python for Beginners', url: 'https://youtube.com/results?search_query=python+beginner+course', platform: 'YouTube' },
          { type: 'docs', title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', platform: 'Python.org' },
          { type: 'practice', title: 'Python Exercises', url: 'https://www.practicepython.org/', platform: 'Practice Python' },
        ]
      },
      {
        level: 'Intermediate',
        title: 'Python Deep Dive',
        description: 'Master OOP, data structures, and popular libraries',
        topics: [
          { name: 'Object-Oriented Programming', duration: '1 week' },
          { name: 'Data Structures', duration: '1 week' },
          { name: 'Error Handling', duration: '3 days' },
          { name: 'Libraries (NumPy, Pandas)', duration: '2 weeks' },
        ],
        resources: [
          { type: 'video', title: 'Python OOP Course', url: 'https://youtube.com/results?search_query=python+oop+tutorial', platform: 'YouTube' },
          { type: 'docs', title: 'Real Python Tutorials', url: 'https://realpython.com/', platform: 'Real Python' },
          { type: 'practice', title: 'LeetCode Python', url: 'https://leetcode.com/problemset/all/?difficulty=EASY', platform: 'LeetCode' },
        ]
      },
      {
        level: 'Advanced',
        title: 'Specialized Python',
        description: 'Apply Python to real-world domains and projects',
        topics: [
          { name: 'Web Scraping', duration: '1 week' },
          { name: 'API Development (FastAPI)', duration: '1 week' },
          { name: 'Testing & Best Practices', duration: '4 days' },
          { name: 'Project Development', duration: '2 weeks' },
        ],
        resources: [
          { type: 'video', title: 'FastAPI Tutorial', url: 'https://youtube.com/results?search_query=fastapi+tutorial', platform: 'YouTube' },
          { type: 'docs', title: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com/', platform: 'FastAPI' },
          { type: 'project', title: 'Python Projects', url: 'https://github.com/topics/python-projects', platform: 'GitHub' },
        ]
      }
    ]
  },
  'java-dsa': {
    keywords: ['java', 'dsa', 'data structure', 'algorithm', 'coding interview', 'leetcode', 'competitive'],
    duration: '4-5 months',
    stages: [
      {
        level: 'Beginner',
        title: 'Java & Basic DSA',
        description: 'Master Java syntax and fundamental data structures',
        topics: [
          { name: 'Java Syntax & OOP', duration: '2 weeks' },
          { name: 'Arrays & Strings', duration: '1 week' },
          { name: 'Linked Lists', duration: '1 week' },
          { name: 'Stacks & Queues', duration: '1 week' },
        ],
        resources: [
          { type: 'video', title: 'Java DSA Full Course', url: 'https://youtube.com/results?search_query=java+dsa+full+course', platform: 'YouTube' },
          { type: 'docs', title: 'GeeksforGeeks DSA', url: 'https://www.geeksforgeeks.org/data-structures/', platform: 'GeeksforGeeks' },
          { type: 'practice', title: 'LeetCode Easy Problems', url: 'https://leetcode.com/problemset/all/?difficulty=EASY', platform: 'LeetCode' },
        ]
      },
      {
        level: 'Intermediate',
        title: 'Advanced Data Structures',
        description: 'Learn trees, graphs, and advanced data structures',
        topics: [
          { name: 'Trees & Binary Search Trees', duration: '2 weeks' },
          { name: 'Heaps & Priority Queues', duration: '1 week' },
          { name: 'Hash Tables', duration: '1 week' },
          { name: 'Graphs Basics', duration: '2 weeks' },
        ],
        resources: [
          { type: 'video', title: 'Trees & Graphs Tutorial', url: 'https://youtube.com/results?search_query=trees+graphs+dsa', platform: 'YouTube' },
          { type: 'docs', title: 'Visualgo - Visualize DSA', url: 'https://visualgo.net/', platform: 'VisuAlgo' },
          { type: 'practice', title: 'LeetCode Medium Problems', url: 'https://leetcode.com/problemset/all/?difficulty=MEDIUM', platform: 'LeetCode' },
        ]
      },
      {
        level: 'Advanced',
        title: 'Algorithms & Interview Prep',
        description: 'Master algorithms and prepare for technical interviews',
        topics: [
          { name: 'Sorting & Searching', duration: '1 week' },
          { name: 'Dynamic Programming', duration: '2 weeks' },
          { name: 'Graph Algorithms', duration: '2 weeks' },
          { name: 'Mock Interviews', duration: '2 weeks' },
        ],
        resources: [
          { type: 'video', title: 'Dynamic Programming Guide', url: 'https://youtube.com/results?search_query=dynamic+programming+tutorial', platform: 'YouTube' },
          { type: 'docs', title: 'Cracking the Coding Interview', url: 'https://github.com/careercup/CtCI-6th-Edition', platform: 'GitHub' },
          { type: 'practice', title: 'LeetCode Hard Problems', url: 'https://leetcode.com/problemset/all/?difficulty=HARD', platform: 'LeetCode' },
        ]
      }
    ]
  },
  'machine-learning': {
    keywords: ['machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning', 'neural network', 'data science'],
    duration: '6-8 months',
    stages: [
      {
        level: 'Beginner',
        title: 'ML Foundations',
        description: 'Build mathematical and programming foundations for ML',
        topics: [
          { name: 'Python for Data Science', duration: '2 weeks' },
          { name: 'NumPy & Pandas', duration: '1 week' },
          { name: 'Statistics & Probability', duration: '2 weeks' },
          { name: 'Data Visualization', duration: '1 week' },
        ],
        resources: [
          { type: 'video', title: 'Python for Data Science', url: 'https://youtube.com/results?search_query=python+data+science+course', platform: 'YouTube' },
          { type: 'docs', title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', platform: 'Kaggle' },
          { type: 'practice', title: 'Kaggle Datasets', url: 'https://www.kaggle.com/datasets', platform: 'Kaggle' },
        ]
      },
      {
        level: 'Intermediate',
        title: 'Core ML Algorithms',
        description: 'Learn and implement fundamental ML algorithms',
        topics: [
          { name: 'Supervised Learning', duration: '2 weeks' },
          { name: 'Unsupervised Learning', duration: '2 weeks' },
          { name: 'Model Evaluation', duration: '1 week' },
          { name: 'Scikit-learn', duration: '1 week' },
        ],
        resources: [
          { type: 'video', title: 'Machine Learning Course', url: 'https://youtube.com/results?search_query=machine+learning+full+course', platform: 'YouTube' },
          { type: 'docs', title: 'Scikit-learn Docs', url: 'https://scikit-learn.org/stable/user_guide.html', platform: 'Scikit-learn' },
          { type: 'practice', title: 'Kaggle Competitions', url: 'https://www.kaggle.com/competitions', platform: 'Kaggle' },
        ]
      },
      {
        level: 'Advanced',
        title: 'Deep Learning & Deployment',
        description: 'Master neural networks and deploy ML models',
        topics: [
          { name: 'Neural Networks', duration: '2 weeks' },
          { name: 'TensorFlow/PyTorch', duration: '2 weeks' },
          { name: 'Computer Vision/NLP', duration: '2 weeks' },
          { name: 'Model Deployment', duration: '1 week' },
        ],
        resources: [
          { type: 'video', title: 'Deep Learning Specialization', url: 'https://youtube.com/results?search_query=deep+learning+course', platform: 'YouTube' },
          { type: 'docs', title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', platform: 'PyTorch' },
          { type: 'project', title: 'ML Project Ideas', url: 'https://github.com/topics/machine-learning-projects', platform: 'GitHub' },
        ]
      }
    ]
  },
  'default': {
    keywords: [],
    duration: '3-4 months',
    stages: [
      {
        level: 'Beginner',
        title: 'Getting Started',
        description: 'Build foundational knowledge and skills',
        topics: [
          { name: 'Core Concepts', duration: '2 weeks' },
          { name: 'Basic Tools & Setup', duration: '1 week' },
          { name: 'Fundamental Practices', duration: '2 weeks' },
        ],
        resources: [
          { type: 'video', title: 'Beginner Tutorial', url: 'https://youtube.com', platform: 'YouTube' },
          { type: 'docs', title: 'Official Documentation', url: 'https://google.com', platform: 'Documentation' },
          { type: 'practice', title: 'Practice Exercises', url: 'https://github.com', platform: 'GitHub' },
        ]
      },
      {
        level: 'Intermediate',
        title: 'Building Skills',
        description: 'Develop practical skills through projects',
        topics: [
          { name: 'Advanced Concepts', duration: '2 weeks' },
          { name: 'Project Development', duration: '3 weeks' },
          { name: 'Best Practices', duration: '1 week' },
        ],
        resources: [
          { type: 'video', title: 'Intermediate Course', url: 'https://youtube.com', platform: 'YouTube' },
          { type: 'project', title: 'Build Projects', url: 'https://github.com', platform: 'GitHub' },
        ]
      },
      {
        level: 'Advanced',
        title: 'Mastery',
        description: 'Master advanced topics and specialize',
        topics: [
          { name: 'Expert Topics', duration: '2 weeks' },
          { name: 'Specialization', duration: '2 weeks' },
          { name: 'Real-world Projects', duration: '2 weeks' },
        ],
        resources: [
          { type: 'video', title: 'Advanced Course', url: 'https://youtube.com', platform: 'YouTube' },
          { type: 'project', title: 'Portfolio Projects', url: 'https://github.com', platform: 'GitHub' },
        ]
      }
    ]
  }
};

function findMatchingTopic(goal: string): string {
  const lowerGoal = goal.toLowerCase();
  
  for (const [key, data] of Object.entries(topicDatabase)) {
    if (key === 'default') continue;
    if (data.keywords.some(keyword => lowerGoal.includes(keyword))) {
      return key;
    }
  }
  
  return 'default';
}

export async function generateRoadmap(goal: string): Promise<RoadmapResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  if (!goal || goal.trim().length < 3) {
    return {
      goal: 'Please provide a learning goal',
      estimatedDuration: 'Unknown',
      stages: []
    };
  }

  const topicKey = findMatchingTopic(goal);
  const topic = topicDatabase[topicKey];

  // Customize the roadmap based on the goal
  const customizedStages = topic.stages.map(stage => ({
    ...stage,
    title: stage.title.replace('Fundamentals', `${goal} Fundamentals`).substring(0, 50),
  }));

  return {
    goal: goal.charAt(0).toUpperCase() + goal.slice(1),
    estimatedDuration: topic.duration,
    stages: customizedStages
  };
}
