import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./lib/prisma.js";
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.PORT || 4000;
const API_BASE_URL = "http://localhost:4000/api";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware
app.use(cors());
app.use(express.json());
// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};
app.get("/", (req, res) => {
  res.send(" Flawender backend is live!");
});
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/ideas", authenticateToken, async (req, res) => {
  try {
    const { Description, Verdict, Positive, Negative } = req.body;

    const idea = await prisma.idea.create({
      data: {
        Description,
        Verdict,
        Positive,
        Negative,
        user_id: req.user.userId,
      },
    });

    res.status(201).json({ message: "Idea saved successfully", idea });
  } catch (error) {
    console.error("Save idea error:", error);
    res.status(500).json({ error: "Failed to save idea" });
  }
});

app.get("/api/ideas", async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ ideas });
  } catch (error) {
    console.error("Fetch ideas error:", error);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
});

app.get("/api/user/ideas", authenticateToken, async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: {
        user_id: req.user.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ ideas });
  } catch (error) {
    console.error("Fetch user ideas error:", error);
    res.status(500).json({ error: "Failed to fetch user ideas" });
  }
});

// Like routes
app.post("/api/ideas/:ideaId/like", authenticateToken, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.userId;

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        user_id_idea_id: {
          user_id: userId,
          idea_id: parseInt(ideaId),
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      res.json({ message: "Unliked successfully", liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          user_id: userId,
          idea_id: parseInt(ideaId),
        },
      });
      res.json({ message: "Liked successfully", liked: true });
    }
  } catch (error) {
    console.error("Like/Unlike error:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

// Comment routes
app.post("/api/ideas/:ideaId/comment", authenticateToken, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text.trim()) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        user_id: userId,
        idea_id: parseInt(ideaId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

app.get("/api/ideas/leaderboard", async (req, res) => {
  try {
    const { period = "all" } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: weekAgo } };
    } else if (period === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { gte: monthAgo } };
    }

    const ideas = await prisma.idea.findMany({
      where: dateFilter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const topIdeas = ideas
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(0, 10);

    res.json({ ideas: topIdeas });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            ideas: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Follow system routes
app.post("/api/users/:userId/follow", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.userId;
    const targetUserId = parseInt(userId);

    if (followerId === targetUserId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    // Check if target user exists and if they're private
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: targetUserId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({ error: "Already following this user" });
    }

    if (targetUser.isPrivate) {
      const existingRequest = await prisma.followRequest.findUnique({
        where: {
          sender_id_receiver_id: {
            sender_id: followerId,
            receiver_id: targetUserId,
          },
        },
      });

      if (existingRequest) {
        return res.status(400).json({ error: "Follow request already sent" });
      }

      await prisma.followRequest.create({
        data: {
          sender_id: followerId,
          receiver_id: targetUserId,
        },
      });

      res.json({ message: "Follow request sent", requestSent: true });
    } else {
      // Direct follow for public users
      await prisma.follow.create({
        data: {
          follower_id: followerId,
          following_id: targetUserId,
        },
      });

      res.json({ message: "Successfully followed user", following: true });
    }
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

app.delete("/api/users/:userId/follow", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.userId;
    const targetUserId = parseInt(userId);

    await prisma.follow.deleteMany({
      where: {
        follower_id: followerId,
        following_id: targetUserId,
      },
    });

    res.json({ message: "Successfully unfollowed user", following: false });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

app.get("/api/follow-requests", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await prisma.followRequest.findMany({
      where: {
        receiver_id: userId,
        status: "pending",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ requests });
  } catch (error) {
    console.error("Fetch requests error:", error);
    res.status(500).json({ error: "Failed to fetch follow requests" });
  }
});

app.post(
  "/api/follow-requests/:requestId/accept",
  authenticateToken,
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const userId = req.user.userId;

      const request = await prisma.followRequest.findUnique({
        where: { id: parseInt(requestId) },
      });

      if (!request || request.receiver_id !== userId) {
        return res.status(404).json({ error: "Request not found" });
      }

      await prisma.follow.create({
        data: {
          follower_id: request.sender_id,
          following_id: request.receiver_id,
        },
      });

      await prisma.followRequest.update({
        where: { id: parseInt(requestId) },
        data: { status: "accepted" },
      });

      res.json({ message: "Follow request accepted" });
    } catch (error) {
      console.error("Accept request error:", error);
      res.status(500).json({ error: "Failed to accept request" });
    }
  }
);

app.post(
  "/api/follow-requests/:requestId/reject",
  authenticateToken,
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const userId = req.user.userId;

      const request = await prisma.followRequest.findUnique({
        where: { id: parseInt(requestId) },
      });

      if (!request || request.receiver_id !== userId) {
        return res.status(404).json({ error: "Request not found" });
      }

      await prisma.followRequest.update({
        where: { id: parseInt(requestId) },
        data: { status: "rejected" },
      });

      res.json({ message: "Follow request rejected" });
    } catch (error) {
      console.error("Reject request error:", error);
      res.status(500).json({ error: "Failed to reject request" });
    }
  }
);

app.get("/api/users/:userId/followers", async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await prisma.follow.findMany({
      where: { following_id: parseInt(userId) },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ followers: followers.map((f) => f.follower) });
  } catch (error) {
    console.error("Fetch followers error:", error);
    res.status(500).json({ error: "Failed to fetch followers" });
  }
});

app.get("/api/users/:userId/following", async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await prisma.follow.findMany({
      where: { follower_id: parseInt(userId) },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ following: following.map((f) => f.following) });
  } catch (error) {
    console.error("Fetch following error:", error);
    res.status(500).json({ error: "Failed to fetch following" });
  }
});

app.get("/api/chats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ chats });
  } catch (error) {
    console.error("Fetch chats error:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

app.post("/api/chats", authenticateToken, async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.userId;

    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: {
            user_id: { in: [userId, participantId] },
          },
        },
      },
    });

    if (existingChat) {
      return res.json({ chat: existingChat });
    }

    const chat = await prisma.chat.create({
      data: {
        participants: {
          create: [{ user_id: userId }, { user_id: participantId }],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({ chat });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

app.get("/api/chats/:chatId/messages", authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chat_id: parseInt(chatId),
        user_id: userId,
      },
    });

    if (!participant) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await prisma.message.findMany({
      where: { chat_id: parseInt(chatId) },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json({ messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/api/chats/:chatId/messages", authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chat_id: parseInt(chatId),
        user_id: userId,
      },
    });

    if (!participant) {
      return res.status(403).json({ error: "Access denied" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        chat_id: parseInt(chatId),
        sender_id: userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});


export default app;

app.listen(3000)