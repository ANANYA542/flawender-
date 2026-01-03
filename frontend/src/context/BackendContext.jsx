import React, { createContext, useContext, useState, useEffect } from 'react';

const BackendContext = createContext();

export const useBackend = () => useContext(BackendContext);

const MOCK_USERS = [
    { id: '101', name: 'Alex Chen', role: 'Product Designer', avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=0D8ABC&color=fff', bio: 'Building tools for the future of work.', followers: 1200, following: 450, expertise: ['SaaS', 'AI/ML'] },
    { id: '102', name: 'Sarah Miller', role: 'AI Researcher', avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=random', bio: 'PhD in NLP. Passionate about healthcare AI.', followers: 890, following: 230, expertise: ['HealthTech', 'NLP'] },
    { id: '103', name: 'David Kim', role: 'Entrepreneur', avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=random', bio: 'Serial entrepreneur. 3x founder.', followers: 2100, following: 500, expertise: ['Marketplace', 'B2B'] },
];

const INITIAL_IDEAS = [
    {
        id: '1',
        authorId: '101',
        title: 'EcoTrack - Supply Chain Carbon AI',
        description: 'An automated platform helping logistics companies track real-time carbon emissions using predictive modeling. We integrate directly with existing ERPs to provide actionable insights.',
        markdown: `## Problem\nLogistics emissions...\n## Solution\nAI-driven tracking...`,
        tags: ['GreenTech', 'B2B', 'AI'],
        author: { name: 'Alex Chen', role: 'Product Designer', avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=0D8ABC&color=fff' },
        postedAt: '2h ago',
        likes: 425,
        comments: [
            { id: 1, author: 'David Kim', avatar: 'https://ui-avatars.com/api/?name=David+Kim', text: 'Have you considered the integration challenges with legacy ERPs?', time: '1h ago' }
        ],
        score: 92,
        status: 'High Market Fit'
    },
    {
        id: '2',
        authorId: '102',
        title: 'MediScribe - Automated Clinical Notes',
        description: 'MediScribe listens to doctor-patient consultations and automatically generates structured clinical notes in the correct EMR format, saving doctors 2 hours per day.',
        markdown: `## Overview\nMediScribe is an AI assistant...`,
        tags: ['HealthTech', 'NLP'],
        author: { name: 'Sarah Miller', role: 'AI Researcher', avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=random' },
        postedAt: '4h ago',
        likes: 328,
        comments: [],
        score: 85,
        status: 'Strong Potential'
    },
    {
        id: '3',
        authorId: '103',
        title: 'RentMyTool - P2P Tool Sharing',
        description: 'A hyperlocal marketplace for neighbors to rent out power tools and gardening equipment. Like Airbnb but for your garage.',
        markdown: `## Overview\nRentMyTool connects neighbors...`,
        tags: ['Marketplace', 'SharingEconomy'],
        author: { name: 'David Kim', role: 'Entrepreneur', avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=random' },
        postedAt: '6h ago',
        likes: 89,
        comments: [],
        score: 78,
        status: 'Moderate Fit'
    }
];

export const BackendProvider = ({ children }) => {
    const [ideas, setIdeas] = useState(INITIAL_IDEAS);
    const [trendingTopics, setTrendingTopics] = useState(['Generative AI', 'SaaS', 'Climate', 'Web3', 'No-Code']);
    const [communityThreads, setCommunityThreads] = useState([
         { id: 1, title: 'Feedback on an AI-driven gardening assistant?', author: 'Sarah Jenkins', role: 'SaaS Founder', avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins', time: '2 hours ago', likes: 42, comments: 12, tags: ['b2c-mobile-app', 'gardening'] },
    ]);
    const [users, setUsers] = useState(MOCK_USERS);
    const [followedUsers, setFollowedUsers] = useState([]);
    const [loading, setLoading] = useState(false); // General loading state for async ops

    // --- Idea Logic ---
    const addIdea = (idea) => {
        setLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const newIdea = {
                    ...idea,
                    id: Date.now().toString(),
                    markdown: `## Description\n${idea.description}`,
                    likes: 0,
                    comments: [],
                    score: Math.floor(Math.random() * (95 - 60) + 60),
                    status: 'Pending Review',
                    postedAt: 'Just now'
                };
                if(newIdea.score > 90) newIdea.status = 'High Market Fit';
                else if(newIdea.score > 80) newIdea.status = 'Strong Potential';
                else newIdea.status = 'Moderate Fit';

                setIdeas(prev => [newIdea, ...prev]);
                setLoading(false);
                resolve(newIdea);
            }, 800);
        });
    };

    const toggleLike = (id) => {
        setIdeas(prev => prev.map(idea => 
            idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea
        ));
    };

    const addComment = (ideaId, commentText, authorUser) => {
        if (!authorUser) return;
        setIdeas(prev => prev.map(idea => {
            if (idea.id === ideaId) {
                const newComment = {
                    id: Date.now(),
                    author: authorUser.name,
                    avatar: authorUser.avatar,
                    text: commentText,
                    time: 'Just now'
                };
                return { ...idea, comments: [...(idea.comments || []), newComment] };
            }
            return idea;
        }));
    };

    const getIdea = (id) => ideas.find(i => i.id === id);

    // --- Community Logic ---
    const addThread = (title, authorUser) => {
        const newThread = {
            id: Date.now(),
            title: title,
            author: authorUser.name,
            role: 'Member',
            avatar: authorUser.avatar,
            time: 'Just now',
            likes: 0,
            comments: 0,
            tags: ['general']
        };
        setCommunityThreads(prev => [newThread, ...prev]);
    };

    const toggleThreadLike = (threadId) => {
        setCommunityThreads(prev => prev.map(thread => 
            thread.id === threadId ? { ...thread, likes: thread.likes + 1 } : thread
        ));
    };

    // --- User Logic ---
    const toggleFollow = (userId) => {
        // Find user name if ID is passed to check against mock data or simply toggle ID
        setFollowedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };
    
    // Helper to find a user profile match
    const getUserProfile = (idOrName) => {
        let found = users.find(u => u.id === idOrName);
        if(!found) {
            found = users.find(u => u.name === idOrName); 
        }
        return found || { 
            id: '999', 
            name: idOrName, 
            role: 'Member', 
            avatar: `https://ui-avatars.com/api/?name=${idOrName}`, 
            bio: 'Community member', 
            followers: 0, 
            following: 0, 
            expertise: [] 
        };
    };

    return (
        <BackendContext.Provider value={{ 
            ideas, trendingTopics, communityThreads, loading,
            addIdea, toggleLike, addComment, getIdea, 
            addThread, toggleThreadLike,
            toggleFollow, followedUsers, getUserProfile 
        }}>
            {children}
        </BackendContext.Provider>
    );
};
