// TypeScript interfaces and Seed Data for Nexus Community Mock Database

export interface Organization {
  id: string;
  name: string;
  type: "university" | "corporate";
  logo: string;
  domain: string;
  verified: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: "admin" | "moderator" | "member";
  org: Organization | null;
  verificationStatus: "unverified" | "pending" | "verified";
  verificationDetails?: {
    type: "id_card" | "invite_code" | "email_otp";
    value: string;
    fileUrl?: string;
  };
  reputation: number;
  badges: Badge[];
  joinedAt: string;
  bio: string;
  title: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: "general" | "study" | "work" | "gaming" | "events" | "other";
  memberCount: number;
  members: string[]; // userIds
  logo: string;
  isPrivate: boolean;
  createdBy: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  reactions: { [emoji: string]: string[] }; // emoji -> userIds
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  communityId?: string; // empty means global feed
  media?: { type: "image" | "video"; url: string }[];
  reactions: { [emoji: string]: string[] }; // emoji -> userIds
  comments: Comment[];
  bookmarks: string[]; // userIds
  pinned: boolean;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  type: "dm" | "channel";
  name?: string; // channel name (e.g. "announcements", "general")
  members: string[]; // userIds
  communityId?: string; // if a community channel
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  media?: { type: "image" | "file"; url: string; name: string; size?: string }[];
  createdAt: string;
}

export interface QAQuestion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  votes: number;
  upvotedBy: string[]; // userIds
  downvotedBy: string[]; // userIds
  answersCount: number;
  acceptedAnswerId?: string;
  createdAt: string;
  views: number;
}

export interface QAAnswer {
  id: string;
  questionId: string;
  authorId: string;
  content: string;
  votes: number;
  upvotedBy: string[];
  downvotedBy: string[];
  createdAt: string;
  isAccepted: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: string[] }[]; // optionId -> userIds
  authorId: string;
  createdAt: string;
  expiresAt: string;
  communityId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  isOnline: boolean;
  meetingLink?: string;
  authorId: string;
  registeredUsers: string[]; // userIds
  communityId?: string;
  coverImage: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  pinned: boolean;
  createdAt: string;
  targetRoles?: ("admin" | "moderator" | "member")[];
}

export interface Notification {
  id: string;
  userId: string;
  type: "like" | "comment" | "chat" | "mention" | "reputation" | "system";
  title: string;
  content: string;
  sourceId: string; // post id, chat thread id, Q&A id
  senderId?: string;
  read: boolean;
  createdAt: string;
}

export interface FlaggedContent {
  id: string;
  contentType: "post" | "comment" | "answer";
  contentId: string;
  contentSnippet: string;
  reportedBy: string;
  reason: string;
  createdAt: string;
  status: "pending" | "resolved" | "dismissed";
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: "electronics" | "books" | "housing" | "other";
  contact: string;
  authorId: string;
  createdAt: string;
}

export interface MentorshipListing {
  id: string;
  title: string;
  role: string;
  companyOrSchool: string;
  description: string;
  skills: string[];
  avatar: string;
  authorId: string;
  available: boolean;
}

export interface LostAndFoundItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: "lost" | "found";
  image?: string;
  authorId: string;
  createdAt: string;
}

// Initial Mock Orgs
export const mockOrgs: Organization[] = [
  {
    id: "org-nexus-univ",
    name: "Nexus University",
    type: "university",
    logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&crop=faces",
    domain: "nexus.edu",
    verified: true,
  },
  {
    id: "org-vercel-labs",
    name: "Vercel Labs",
    type: "corporate",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
    domain: "vercel.com",
    verified: true,
  },
];

// Initial Badges
export const mockBadges: Badge[] = [
  { id: "badge-verified", name: "Verified Member", icon: "🛡️", description: "Completed organization email or ID check", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { id: "badge-founder", name: "Founder", icon: "👑", description: "Created a verified community hub", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { id: "badge-helper", name: "Top Contributor", icon: "🤝", description: "Has at least 5 accepted answers in Q&A", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: "badge-innovator", name: "AI Builder", icon: "⚡", description: "Engaged in AI Hackathons", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
];

// Seed Users
export const mockUsers: User[] = [
  {
    id: "user-leo",
    name: "Leo Sterling",
    username: "leosterling",
    email: "leo@nexus.edu",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces",
    role: "member",
    org: mockOrgs[0],
    verificationStatus: "verified",
    reputation: 340,
    badges: [mockBadges[0], mockBadges[3]],
    joinedAt: "2026-01-10",
    bio: "Computer Science senior. React enthusiast, keyboard builders collector. Let's build something epic!",
    title: "CS Undergrad @ Nexus Univ",
  },
  {
    id: "user-sarah",
    name: "Sarah Jenkins",
    username: "sarahjenkins",
    email: "sarah.jenkins@nexus.edu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    role: "admin",
    org: mockOrgs[0],
    verificationStatus: "verified",
    reputation: 1540,
    badges: [mockBadges[0], mockBadges[1]],
    joinedAt: "2025-05-12",
    bio: "Nexus Campus Community Admin. Reach out for partnership inquiries or verification audits.",
    title: "Community Director @ Nexus Univ",
  },
  {
    id: "user-alex",
    name: "Alex Rivera",
    username: "alexrivera",
    email: "alex@vercel.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    role: "moderator",
    org: mockOrgs[1],
    verificationStatus: "verified",
    reputation: 680,
    badges: [mockBadges[0], mockBadges[2]],
    joinedAt: "2025-09-18",
    bio: "Engineering Lead @ Vercel Labs. Open Source enthusiast. Moderator for design and coding sections.",
    title: "Lead Engineer @ Vercel Labs",
  },
  {
    id: "user-elena",
    name: "Elena Vance",
    username: "elenavance",
    email: "elena@vercel.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    role: "member",
    org: mockOrgs[1],
    verificationStatus: "verified",
    reputation: 210,
    badges: [mockBadges[0]],
    joinedAt: "2026-02-14",
    bio: "Product Designer. Obsessed with clean UI, micro-interactions, and glassmorphism layouts. Tailwind advocate.",
    title: "UI Designer @ Vercel",
  },
  {
    id: "user-liam",
    name: "Liam Carter",
    username: "liamcarter",
    email: "liam.carter@nexus.edu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    role: "member",
    org: null, // Unverified at start for demo onboarding
    verificationStatus: "unverified",
    reputation: 0,
    badges: [],
    joinedAt: "2026-07-01",
    bio: "New student on campus looking to connect with clubs and get verified.",
    title: "Freshman @ Nexus Univ",
  },
];

// Seed Communities
export const mockCommunities: Community[] = [
  {
    id: "comm-dev",
    name: "Dev & Coffee",
    description: "The primary coding community. We discuss React, Next.js, Rust, Tailwind CSS, and swap bugs.",
    category: "study",
    memberCount: 245,
    members: ["user-leo", "user-sarah", "user-alex", "user-elena"],
    logo: "💻",
    isPrivate: false,
    createdBy: "user-sarah",
  },
  {
    id: "comm-design",
    name: "UI/UX Designers Hub",
    description: "A space to share mockups, crit UI designs, discuss design systems, and debate Figma vs CSS.",
    category: "work",
    memberCount: 182,
    members: ["user-leo", "user-elena", "user-alex"],
    logo: "🎨",
    isPrivate: false,
    createdBy: "user-elena",
  },
  {
    id: "comm-gaming",
    name: "Nexus Esports League",
    description: "CS2, Valorant, League of Legends, Smash tournaments. Casual and competitive players welcome.",
    category: "gaming",
    memberCount: 310,
    members: ["user-leo", "user-sarah", "user-liam"],
    logo: "🎮",
    isPrivate: false,
    createdBy: "user-leo",
  },
  {
    id: "comm-ai",
    name: "AI & Neural Nets Lab",
    description: "Discussing LLMs, Stable Diffusion, agentic frameworks, and theoretical computer science.",
    category: "study",
    memberCount: 154,
    members: ["user-leo", "user-sarah", "user-alex"],
    logo: "🤖",
    isPrivate: false,
    createdBy: "user-alex",
  },
];

// Seed Posts
export const mockPosts: Post[] = [
  {
    id: "post-1",
    content: "Just migrated my entire dashboard structure to Tailwind CSS v4! It is incredibly fast. The CSS-first config resolves so much cleaner than tailwind.config.js. What are your thoughts on it?",
    authorId: "user-elena",
    communityId: "comm-design",
    createdAt: "2026-07-12T08:30:00Z",
    pinned: true,
    reactions: {
      "🔥": ["user-leo", "user-sarah"],
      "❤️": ["user-alex"],
      "👍": ["user-sarah", "user-leo", "user-alex"],
    },
    comments: [
      {
        id: "c-1",
        postId: "post-1",
        authorId: "user-leo",
        content: "Totally agree! The `@theme` directive makes maintaining style variables super clean. Dynamic compiling feels way snappier too.",
        createdAt: "2026-07-12T08:45:00Z",
        reactions: { "👍": ["user-elena"] },
      },
    ],
    bookmarks: ["user-leo"],
  },
  {
    id: "post-2",
    content: "Excited to announce the annual Nexus Hackathon starting next Friday! 48 hours to build any Web3, AI, or SaaS application. Pizza and energy drinks are on us. Team registrations are now open in the Events tab!",
    authorId: "user-sarah",
    communityId: "comm-dev",
    createdAt: "2026-07-11T14:15:00Z",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop" }
    ],
    pinned: false,
    reactions: {
      "🚀": ["user-leo", "user-alex", "user-elena"],
      "🙌": ["user-leo", "user-liam"],
    },
    comments: [],
    bookmarks: ["user-leo", "user-alex"],
  },
];

// Seed ChatThreads
export const mockChatThreads: ChatThread[] = [
  {
    id: "thread-general",
    type: "channel",
    name: "general",
    members: ["user-leo", "user-sarah", "user-alex", "user-elena", "user-liam"],
    communityId: "comm-dev",
    createdAt: "2026-01-10T12:00:00Z",
  },
  {
    id: "thread-announcements",
    type: "channel",
    name: "announcements",
    members: ["user-leo", "user-sarah", "user-alex", "user-elena"],
    communityId: "comm-dev",
    createdAt: "2026-01-10T12:00:00Z",
  },
  {
    id: "thread-dm-1",
    type: "dm",
    members: ["user-leo", "user-elena"],
    createdAt: "2026-07-10T09:00:00Z",
  },
  {
    id: "thread-dm-2",
    type: "dm",
    members: ["user-leo", "user-sarah"],
    createdAt: "2026-07-11T10:00:00Z",
  },
];

// Seed ChatMessages
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    threadId: "thread-general",
    senderId: "user-sarah",
    content: "Hey team! Welcome to the Dev & Coffee general channel.",
    createdAt: "2026-07-12T09:00:00Z",
  },
  {
    id: "msg-2",
    threadId: "thread-general",
    senderId: "user-leo",
    content: "Thanks Sarah! Glad to be here. Working on a React 19 UI component library.",
    createdAt: "2026-07-12T09:05:00Z",
  },
  {
    id: "msg-3",
    threadId: "thread-dm-1",
    senderId: "user-elena",
    content: "Hi Leo, did you check the glassmorphism parameters I sent you for the dashboard layout?",
    createdAt: "2026-07-12T10:10:00Z",
  },
  {
    id: "msg-4",
    threadId: "thread-dm-1",
    senderId: "user-leo",
    content: "Hey Elena! Yes, just looked. They look beautiful on dark mode, the blur filter is perfect. Let me apply it to the cards.",
    createdAt: "2026-07-12T10:12:00Z",
  },
];

// Seed Q&A
export const mockQAQuestions: QAQuestion[] = [
  {
    id: "q-1",
    title: "How to resolve React 19 duplicate ref issues with Framer Motion layout animations?",
    content: "I am trying to implement a slider tab with Framer Motion `layoutId` using React 19. It seems that passing the ref throws a duplicate warning or fails to transition smoothly. What is the correct API design for refs in React 19?",
    authorId: "user-leo",
    tags: ["react-19", "framer-motion", "nextjs-15"],
    votes: 18,
    upvotedBy: ["user-alex", "user-elena"],
    downvotedBy: [],
    answersCount: 1,
    acceptedAnswerId: "a-1",
    createdAt: "2026-07-11T15:30:00Z",
    views: 128,
  },
];

export const mockQAAnswers: QAAnswer[] = [
  {
    id: "a-1",
    questionId: "q-1",
    authorId: "user-alex",
    content: "In React 19, `ref` is now passed directly as a prop, and `forwardRef` is deprecated. With Framer Motion, make sure you are using version `11.5.0+` which fully supports React 19 ref injection. Instead of wrapping with forwardRef, simply pass `ref` directly down:\n\n```tsx\nexport function Tab({ ref, ...props }) {\n  return <motion.div ref={ref} layoutId=\"tab\" {...props} />;\n}\n```",
    votes: 12,
    upvotedBy: ["user-leo", "user-elena"],
    downvotedBy: [],
    createdAt: "2026-07-11T16:10:00Z",
    isAccepted: true,
  },
];

// Seed Polls
export const mockPolls: Poll[] = [
  {
    id: "poll-1",
    question: "Which global state management tool will you use for React 19 / Next.js 15 apps?",
    options: [
      { id: "opt-1", text: "Zustand (Sleek & lightweight)", votes: ["user-leo", "user-elena", "user-sarah"] },
      { id: "opt-2", text: "Redux Toolkit (Enterprise standard)", votes: ["user-liam"] },
      { id: "opt-3", text: "React Context API (Built-in)", votes: ["user-alex"] },
    ],
    authorId: "user-alex",
    createdAt: "2026-07-12T05:00:00Z",
    expiresAt: "2026-07-19T05:00:00Z",
    communityId: "comm-dev",
  },
];

// Seed Events
export const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Tailwind CSS v4 Advanced Workshop",
    description: "Deep dive into CSS-first configurations, performance compilation, custom CSS properties, `@theme` parameters, and responsive design systems using Tailwind CSS v4.",
    date: "2026-07-18",
    time: "15:00",
    location: "Online (Vercel Room)",
    isOnline: true,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    authorId: "user-elena",
    registeredUsers: ["user-leo", "user-sarah", "user-alex"],
    communityId: "comm-design",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
  },
  {
    id: "event-2",
    title: "Nexus Campus AI Hackathon 2026",
    description: "Connect with developers, design beautiful prototypes, build intelligent agents, and win $5,000 in prizes. Open to all students.",
    date: "2026-07-24",
    time: "09:00",
    location: "Nexus Campus Innovation Hub",
    isOnline: false,
    authorId: "user-sarah",
    registeredUsers: ["user-leo", "user-liam"],
    communityId: "comm-dev",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
  },
];

// Seed Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "System Update: Organization Verification Now Required",
    content: "To ensure high quality discussions and academic/professional trust, all profiles must verify their university or corporate association within 7 days. Go to Settings -> Verification to upload credentials.",
    authorId: "user-sarah",
    pinned: true,
    createdAt: "2026-07-10T08:00:00Z",
  },
];

// Seed Marketplace
export const mockMarketplace: MarketplaceItem[] = [
  {
    id: "m-1",
    title: "Keychron K2 Mechanical Keyboard",
    description: "Gateron Brown switches, RGB backlight, Aluminum frame. Mint condition, used for 2 months. Selling because I upgraded.",
    price: 65,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop",
    category: "electronics",
    contact: "leo@nexus.edu",
    authorId: "user-leo",
    createdAt: "2026-07-10T12:00:00Z",
  },
  {
    id: "m-2",
    title: "Cracking the Coding Interview Book",
    description: "6th Edition, absolute bible for SWE prep. Some highlight marks, otherwise in excellent condition.",
    price: 15,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop",
    category: "books",
    contact: "alex@vercel.com",
    authorId: "user-alex",
    createdAt: "2026-07-11T14:00:00Z",
  },
];

// Seed Mentorship
export const mockMentorship: MentorshipListing[] = [
  {
    id: "ment-1",
    title: "UX Career Coaching & Portfolio Reviews",
    role: "Lead UI Designer",
    companyOrSchool: "Vercel Labs",
    description: "Happy to review Figma layouts, design systems implementation, and talk about building a frontend design portfolio.",
    skills: ["Figma", "CSS Glassmorphism", "Tailwind v4", "Prototyping"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    authorId: "user-elena",
    available: true,
  },
  {
    id: "ment-2",
    title: "Fullstack Interview Prep & Mock Coding",
    role: "Engineering Director",
    companyOrSchool: "Nexus University Alumni",
    description: "Offering mock technical interviews, algorithmic walkthroughs, and system design evaluations.",
    skills: ["Data Structures", "Next.js", "Node.js", "AWS Architecture"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    authorId: "user-alex",
    available: true,
  },
];

// Seed Lost and Found
export const mockLostAndFound: LostAndFoundItem[] = [
  {
    id: "lf-1",
    title: "Found: Apple AirPods Pro Case",
    description: "Found on a table in the Science Library Cafeteria around 4 PM. Contact me to describe the custom engraving to claim them.",
    location: "Science Library Cafeteria",
    date: "2026-07-12",
    status: "found",
    authorId: "user-leo",
    createdAt: "2026-07-12T10:00:00Z",
  },
];

// Seed Flagged
export const mockFlagged: FlaggedContent[] = [
  {
    id: "flag-1",
    contentType: "post",
    contentId: "post-1",
    contentSnippet: "Just migrated my entire dashboard structure to Tailwind...",
    reportedBy: "user-liam",
    reason: "Spam advertising",
    createdAt: "2026-07-12T11:00:00Z",
    status: "pending",
  },
];

// Helper database manager wrapper to mimic client-server database persistence
export class MockDatabaseService {
  private static KEY = "nexus_community_db";

  static getDb() {
    if (typeof window === "undefined") {
      return this.getRawData();
    }
    const data = localStorage.getItem(this.KEY);
    if (!data) {
      const initial = this.getRawData();
      localStorage.setItem(this.KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static saveDb(data: any) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }

  private static getRawData() {
    return {
      users: mockUsers,
      orgs: mockOrgs,
      communities: mockCommunities,
      posts: mockPosts,
      chatThreads: mockChatThreads,
      chatMessages: mockChatMessages,
      qaQuestions: mockQAQuestions,
      qaAnswers: mockQAAnswers,
      polls: mockPolls,
      events: mockEvents,
      announcements: mockAnnouncements,
      marketplace: mockMarketplace,
      mentorship: mockMentorship,
      lostAndFound: mockLostAndFound,
      flagged: mockFlagged,
    };
  }

  static reset() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.KEY);
  }
}
