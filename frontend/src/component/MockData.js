export const MOCK_IDEAS = [
  {
    id: 'mx-1',
    title: 'AI-Powered Vertical Farming',
    description: 'Autonomous vertical farms that use machine learning to optimize crop yield and resource usage in urban environments.',
    verdict: 'High-potential sustainability venture with strong urban market fit.',
    likes: { length: 124 },
    comments: { length: 45 },
    user: { 
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        bio: 'AgriTech innovator passionate about sustainable cities.',
        _count: { ideas: 5, likes: 320, comments: 150 },
        friends: ['mx-u2', 'mx-u3']
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'mx-2',
    title: 'Decentralized Energy Grid',
    description: 'Peer-to-peer energy trading platform allowing homeowners to sell excess solar power directly to neighbors.',
    verdict: 'Disruptive infrastructure play, regulatory hurdles but massive scale potential.',
    likes: { length: 89 },
    comments: { length: 32 },
    user: { 
        name: 'Marcus Rodriguez',
        email: 'marcus.r@example.com',
        bio: 'Blockchain enthusiast building decentralized infrastructure.',
        _count: { ideas: 3, likes: 150, comments: 40 },
        friends: ['mx-u1']
    },
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'mx-3',
    title: 'Neuro-Adaptive Learning App',
    description: 'Education platform that adjusts content difficulty and style in real-time based on student brainwave patterns via consumer EEG.',
    verdict: 'Futuristic EdTech moonshot. Technology is early but concept is revolutionary.',
    likes: { length: 76 },
    comments: { length: 28 },
    user: { 
        name: 'Dr. Emily Weiss',
        email: 'emily.weiss@example.com',
        bio: 'Cognitive scientist creating the future of learning.',
        _count: { ideas: 8, likes: 500, comments: 200 },
        friends: ['mx-u1', 'mx-u4']
    },
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'mx-4',
    title: 'Ocean Plastic Upcycling Fleet',
    description: 'Autonomous vessel network that collects ocean plastic and converts it into 3D printing filament onboard.',
    verdict: 'Compelling circular economy solution. High operational complexity but high impact.',
    likes: { length: 42 },
    comments: { length: 15 },
    user: { 
        name: 'OceanCleanDAO',
        email: 'contact@oceanclean.org',
        bio: 'Collective focusing on marine preservation technology.',
        _count: { ideas: 1, likes: 42, comments: 15 },
        friends: ['mx-u3']
    },
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

export const MOCK_USERS = MOCK_IDEAS.map(idea => ({
    id: 'user-' + idea.id,
    ...idea.user,
    ideas: [idea]
}));
