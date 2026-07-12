import { create } from "zustand";
import {
  MockDatabaseService,
  User,
  Organization,
  Community,
  Post,
  ChatThread,
  ChatMessage,
  QAQuestion,
  QAAnswer,
  Poll,
  Event,
  Announcement,
  Notification,
  FlaggedContent,
  MarketplaceItem,
  MentorshipListing,
  LostAndFoundItem,
  Comment,
  mockBadges,
  mockOrgs
} from "@/services/mockDb";

interface StoreState {
  users: User[];
  orgs: Organization[];
  communities: Community[];
  posts: Post[];
  chatThreads: ChatThread[];
  chatMessages: ChatMessage[];
  qaQuestions: QAQuestion[];
  qaAnswers: QAAnswer[];
  polls: Poll[];
  events: Event[];
  announcements: Announcement[];
  marketplace: MarketplaceItem[];
  mentorship: MentorshipListing[];
  lostAndFound: LostAndFoundItem[];
  flagged: FlaggedContent[];
  notifications: Notification[];
  
  // Active Navigation/UI state
  currentUser: User | null;
  activeThreadId: string | null;
  activeCommunityId: string | null;

  // Actions
  login: (username: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
  verifyOrg: (details: { type: "id_card" | "invite_code" | "email_otp"; value: string; fileUrl?: string }) => void;
  
  // Post/Feed actions
  createPost: (content: string, communityId?: string, mediaUrl?: string) => void;
  deletePost: (postId: string) => void;
  reactToPost: (postId: string, emoji: string) => void;
  addComment: (postId: string, content: string) => void;
  reactToComment: (postId: string, commentId: string, emoji: string) => void;
  toggleBookmark: (postId: string) => void;

  // Community actions
  joinCommunity: (communityId: string) => void;
  createCommunity: (name: string, description: string, category: Community["category"], isPrivate: boolean) => void;

  // Chat actions
  sendChatMessage: (content: string, media?: ChatMessage["media"]) => void;
  startDM: (targetUserId: string) => string;
  setActiveThread: (threadId: string | null) => void;

  // Q&A actions
  askQuestion: (title: string, content: string, tags: string[]) => void;
  answerQuestion: (questionId: string, content: string) => void;
  voteQuestion: (questionId: string, direction: "up" | "down") => void;
  voteAnswer: (answerId: string, direction: "up" | "down") => void;
  acceptAnswer: (questionId: string, answerId: string) => void;

  // Poll actions
  castVote: (pollId: string, optionId: string) => void;
  createPoll: (question: string, options: string[], communityId?: string) => void;

  // Event actions
  registerForEvent: (eventId: string) => void;
  createEvent: (eventData: Omit<Event, "id" | "registeredUsers" | "authorId">) => void;

  // Notification actions
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;

  // Admin/Mod actions
  approveVerification: (userId: string) => void;
  rejectVerification: (userId: string) => void;
  flagContent: (contentType: FlaggedContent["contentType"], contentId: string, snippet: string, reason: string) => void;
  resolveFlagged: (flagId: string, action: "dismiss" | "delete") => void;

  // Additional Modules
  addMarketplaceItem: (title: string, description: string, price: number, image: string, category: MarketplaceItem["category"], contact: string) => void;
  addMentorshipListing: (title: string, role: string, companyOrSchool: string, description: string, skills: string[]) => void;
  addLostAndFoundItem: (title: string, description: string, location: string, status: "lost" | "found", image?: string) => void;
}

export const useStore = create<StoreState>((set, get) => {
  // Load database from localStorage
  const db = MockDatabaseService.getDb();

  // Set initial current user as user-leo (the default logged in student)
  const defaultUser = db.users.find((u: User) => u.id === "user-leo") || null;

  // Filter notifications belonging to the logged-in user
  const initialNotifications: Notification[] = [
    {
      id: "notif-welcome",
      userId: "user-leo",
      type: "system",
      title: "Welcome to Nexus Community",
      content: "Verify your email or upload an ID card to unlock student badges and private group channels.",
      sourceId: "welcome",
      read: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "notif-mention",
      userId: "user-leo",
      type: "mention",
      title: "Alex Rivera mentioned you",
      content: "tagged you in a comment inside '#general'",
      sourceId: "thread-general",
      senderId: "user-sarah",
      read: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    }
  ];

  const syncDb = (updatedFields: Partial<typeof db>) => {
    const currentDb = MockDatabaseService.getDb();
    const newDb = { ...currentDb, ...updatedFields };
    MockDatabaseService.saveDb(newDb);
  };

  return {
    ...db,
    notifications: initialNotifications,
    currentUser: defaultUser,
    activeThreadId: "thread-general", // default channel
    activeCommunityId: "comm-dev",

    login: (username: string) => {
      const { users } = get();
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
      if (user) {
        set({ currentUser: user });
        return true;
      }
      return false;
    },

    logout: () => {
      set({ currentUser: null, activeThreadId: null, activeCommunityId: null });
    },

    updateProfile: (profile: Partial<User>) => {
      const { currentUser, users } = get();
      if (!currentUser) return;
      const updatedUser = { ...currentUser, ...profile };
      const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
      set({ currentUser: updatedUser, users: updatedUsers });
      syncDb({ users: updatedUsers });
    },

    verifyOrg: (details) => {
      const { currentUser, users } = get();
      if (!currentUser) return;
      
      const updatedUser: User = {
        ...currentUser,
        verificationStatus: "pending",
        verificationDetails: details,
      };

      // Simulating immediate feedback or auto-verify for specific methods to enhance UX
      if (details.type === "invite_code" && details.value === "NEXUS-2026") {
        updatedUser.verificationStatus = "verified";
        updatedUser.badges = [...updatedUser.badges, mockBadges[0]]; // Add verified badge
        updatedUser.org = mockOrgs[0]; // Set default Nexus Univ
      } else if (details.type === "email_otp") {
        updatedUser.verificationStatus = "verified";
        updatedUser.badges = [...updatedUser.badges, mockBadges[0]];
        // Extract domain
        const emailDomain = details.value.split("@")[1];
        const matchedOrg = mockOrgs.find((o) => o.domain === emailDomain) || mockOrgs[0];
        updatedUser.org = matchedOrg;
      }

      const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
      set({ currentUser: updatedUser, users: updatedUsers });
      syncDb({ users: updatedUsers });
    },

    createPost: (content, communityId, mediaUrl) => {
      const { currentUser, posts, users } = get();
      if (!currentUser) return;

      const newPost: Post = {
        id: `post-${Date.now()}`,
        content,
        authorId: currentUser.id,
        communityId,
        media: mediaUrl ? [{ type: "image", url: mediaUrl }] : undefined,
        reactions: {},
        comments: [],
        bookmarks: [],
        pinned: false,
        createdAt: new Date().toISOString(),
      };

      const updatedPosts = [newPost, ...posts];
      
      // Update author reputation + 5
      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          const rep = u.reputation + 5;
          return { ...u, reputation: rep };
        }
        return u;
      });

      const updatedCurrentUser = updatedUsers.find((u) => u.id === currentUser.id) || currentUser;

      set({ posts: updatedPosts, users: updatedUsers, currentUser: updatedCurrentUser });
      syncDb({ posts: updatedPosts, users: updatedUsers });
    },

    deletePost: (postId) => {
      const { posts } = get();
      const updatedPosts = posts.filter((p) => p.id !== postId);
      set({ posts: updatedPosts });
      syncDb({ posts: updatedPosts });
    },

    reactToPost: (postId, emoji) => {
      const { currentUser, posts } = get();
      if (!currentUser) return;

      const updatedPosts = posts.map((post) => {
        if (post.id !== postId) return post;

        const reactions = { ...post.reactions };
        const usersReacted = reactions[emoji] ? [...reactions[emoji]] : [];
        const index = usersReacted.indexOf(currentUser.id);

        if (index > -1) {
          usersReacted.splice(index, 1);
        } else {
          usersReacted.push(currentUser.id);
        }

        if (usersReacted.length === 0) {
          delete reactions[emoji];
        } else {
          reactions[emoji] = usersReacted;
        }

        return { ...post, reactions };
      });

      set({ posts: updatedPosts });
      syncDb({ posts: updatedPosts });
    },

    addComment: (postId, content) => {
      const { currentUser, posts, notifications } = get();
      if (!currentUser) return;

      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId,
        authorId: currentUser.id,
        content,
        createdAt: new Date().toISOString(),
        reactions: {},
      };

      const targetPost = posts.find((p) => p.id === postId);

      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      });

      // Send notification to post author if not current user
      let updatedNotifications = [...notifications];
      if (targetPost && targetPost.authorId !== currentUser.id) {
        const notif: Notification = {
          id: `notif-${Date.now()}`,
          userId: targetPost.authorId,
          type: "comment",
          title: "New comment on your post",
          content: `${currentUser.name} commented: "${content.substring(0, 30)}..."`,
          sourceId: postId,
          senderId: currentUser.id,
          read: false,
          createdAt: new Date().toISOString(),
        };
        updatedNotifications = [notif, ...updatedNotifications];
      }

      set({ posts: updatedPosts, notifications: updatedNotifications });
      syncDb({ posts: updatedPosts });
    },

    reactToComment: (postId, commentId, emoji) => {
      const { currentUser, posts } = get();
      if (!currentUser) return;

      const updatedPosts = posts.map((post) => {
        if (post.id !== postId) return post;

        const updatedComments = post.comments.map((comment) => {
          if (comment.id !== commentId) return comment;

          const reactions = { ...comment.reactions };
          const usersReacted = reactions[emoji] ? [...reactions[emoji]] : [];
          const index = usersReacted.indexOf(currentUser.id);

          if (index > -1) {
            usersReacted.splice(index, 1);
          } else {
            usersReacted.push(currentUser.id);
          }

          if (usersReacted.length === 0) {
            delete reactions[emoji];
          } else {
            reactions[emoji] = usersReacted;
          }

          return { ...comment, reactions };
        });

        return { ...post, comments: updatedComments };
      });

      set({ posts: updatedPosts });
      syncDb({ posts: updatedPosts });
    },

    toggleBookmark: (postId) => {
      const { currentUser, posts } = get();
      if (!currentUser) return;

      const updatedPosts = posts.map((post) => {
        if (post.id !== postId) return post;
        const bookmarks = [...post.bookmarks];
        const idx = bookmarks.indexOf(currentUser.id);
        if (idx > -1) {
          bookmarks.splice(idx, 1);
        } else {
          bookmarks.push(currentUser.id);
        }
        return { ...post, bookmarks };
      });

      set({ posts: updatedPosts });
      syncDb({ posts: updatedPosts });
    },

    joinCommunity: (communityId) => {
      const { currentUser, communities } = get();
      if (!currentUser) return;

      const updatedCommunities = communities.map((comm) => {
        if (comm.id !== communityId) return comm;

        const members = [...comm.members];
        const idx = members.indexOf(currentUser.id);
        let count = comm.memberCount;

        if (idx > -1) {
          members.splice(idx, 1);
          count -= 1;
        } else {
          members.push(currentUser.id);
          count += 1;
        }

        return { ...comm, members, memberCount: count };
      });

      set({ communities: updatedCommunities });
      syncDb({ communities: updatedCommunities });
    },

    createCommunity: (name, description, category, isPrivate) => {
      const { currentUser, communities } = get();
      if (!currentUser) return;

      const newComm: Community = {
        id: `comm-${Date.now()}`,
        name,
        description,
        category,
        memberCount: 1,
        members: [currentUser.id],
        logo: "🔮",
        isPrivate,
        createdBy: currentUser.id,
      };

      const updatedCommunities = [...communities, newComm];
      set({ communities: updatedCommunities });
      syncDb({ communities: updatedCommunities });
    },

    sendChatMessage: (content, media) => {
      const { currentUser, activeThreadId, chatMessages } = get();
      if (!currentUser || !activeThreadId) return;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        threadId: activeThreadId,
        senderId: currentUser.id,
        content,
        media,
        createdAt: new Date().toISOString(),
      };

      const updatedMsgs = [...chatMessages, newMsg];
      set({ chatMessages: updatedMsgs });
      syncDb({ chatMessages: updatedMsgs });
    },

    startDM: (targetUserId) => {
      const { currentUser, chatThreads } = get();
      if (!currentUser) return "";

      // Check if DM thread already exists
      const existingThread = chatThreads.find(
        (t) => t.type === "dm" && t.members.includes(currentUser.id) && t.members.includes(targetUserId)
      );

      if (existingThread) {
        set({ activeThreadId: existingThread.id });
        return existingThread.id;
      }

      // Create new thread
      const newThreadId = `thread-dm-${Date.now()}`;
      const newThread: ChatThread = {
        id: newThreadId,
        type: "dm",
        members: [currentUser.id, targetUserId],
        createdAt: new Date().toISOString(),
      };

      const updatedThreads = [...chatThreads, newThread];
      set({ chatThreads: updatedThreads, activeThreadId: newThreadId });
      syncDb({ chatThreads: updatedThreads });

      return newThreadId;
    },

    setActiveThread: (threadId) => {
      set({ activeThreadId: threadId });
    },

    askQuestion: (title, content, tags) => {
      const { currentUser, qaQuestions, users } = get();
      if (!currentUser) return;

      const newQuestion: QAQuestion = {
        id: `q-${Date.now()}`,
        title,
        content,
        authorId: currentUser.id,
        tags,
        votes: 0,
        upvotedBy: [],
        downvotedBy: [],
        answersCount: 0,
        createdAt: new Date().toISOString(),
        views: 1,
      };

      const updatedQuestions = [newQuestion, ...qaQuestions];
      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return { ...u, reputation: u.reputation + 5 };
        }
        return u;
      });

      const updatedCurrentUser = updatedUsers.find((u) => u.id === currentUser.id) || currentUser;

      set({ qaQuestions: updatedQuestions, users: updatedUsers, currentUser: updatedCurrentUser });
      syncDb({ qaQuestions: updatedQuestions, users: updatedUsers });
    },

    answerQuestion: (questionId, content) => {
      const { currentUser, qaAnswers, qaQuestions, users, notifications } = get();
      if (!currentUser) return;

      const newAnswer: QAAnswer = {
        id: `a-${Date.now()}`,
        questionId,
        authorId: currentUser.id,
        content,
        votes: 0,
        upvotedBy: [],
        downvotedBy: [],
        createdAt: new Date().toISOString(),
        isAccepted: false,
      };

      const targetQuestion = qaQuestions.find((q) => q.id === questionId);

      const updatedAnswers = [...qaAnswers, newAnswer];
      const updatedQuestions = qaQuestions.map((q) => {
        if (q.id === questionId) {
          return { ...q, answersCount: q.answersCount + 1 };
        }
        return q;
      });

      // Reputation +10 for answering
      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return { ...u, reputation: u.reputation + 10 };
        }
        return u;
      });

      // Notify question author
      let updatedNotifications = [...notifications];
      if (targetQuestion && targetQuestion.authorId !== currentUser.id) {
        const notif: Notification = {
          id: `notif-${Date.now()}`,
          userId: targetQuestion.authorId,
          type: "reputation",
          title: "New Answer to Question",
          content: `${currentUser.name} answered your question: "${targetQuestion.title}"`,
          sourceId: questionId,
          senderId: currentUser.id,
          read: false,
          createdAt: new Date().toISOString(),
        };
        updatedNotifications = [notif, ...updatedNotifications];
      }

      const updatedCurrentUser = updatedUsers.find((u) => u.id === currentUser.id) || currentUser;

      set({
        qaAnswers: updatedAnswers,
        qaQuestions: updatedQuestions,
        users: updatedUsers,
        currentUser: updatedCurrentUser,
        notifications: updatedNotifications,
      });
      syncDb({ qaAnswers: updatedAnswers, qaQuestions: updatedQuestions, users: updatedUsers });
    },

    voteQuestion: (questionId, direction) => {
      const { currentUser, qaQuestions } = get();
      if (!currentUser) return;

      const updatedQuestions = qaQuestions.map((q) => {
        if (q.id !== questionId) return q;

        let upvotedBy = [...q.upvotedBy];
        let downvotedBy = [...q.downvotedBy];

        const hasUpvoted = upvotedBy.includes(currentUser.id);
        const hasDownvoted = downvotedBy.includes(currentUser.id);

        if (direction === "up") {
          if (hasUpvoted) {
            upvotedBy = upvotedBy.filter((id) => id !== currentUser.id);
          } else {
            upvotedBy.push(currentUser.id);
            downvotedBy = downvotedBy.filter((id) => id !== currentUser.id);
          }
        } else {
          if (hasDownvoted) {
            downvotedBy = downvotedBy.filter((id) => id !== currentUser.id);
          } else {
            downvotedBy.push(currentUser.id);
            upvotedBy = upvotedBy.filter((id) => id !== currentUser.id);
          }
        }

        return {
          ...q,
          upvotedBy,
          downvotedBy,
          votes: upvotedBy.length - downvotedBy.length,
        };
      });

      set({ qaQuestions: updatedQuestions });
      syncDb({ qaQuestions: updatedQuestions });
    },

    voteAnswer: (answerId, direction) => {
      const { currentUser, qaAnswers } = get();
      if (!currentUser) return;

      const updatedAnswers = qaAnswers.map((a) => {
        if (a.id !== answerId) return a;

        let upvotedBy = [...a.upvotedBy];
        let downvotedBy = [...a.downvotedBy];

        const hasUpvoted = upvotedBy.includes(currentUser.id);
        const hasDownvoted = downvotedBy.includes(currentUser.id);

        if (direction === "up") {
          if (hasUpvoted) {
            upvotedBy = upvotedBy.filter((id) => id !== currentUser.id);
          } else {
            upvotedBy.push(currentUser.id);
            downvotedBy = downvotedBy.filter((id) => id !== currentUser.id);
          }
        } else {
          if (hasDownvoted) {
            downvotedBy = downvotedBy.filter((id) => id !== currentUser.id);
          } else {
            downvotedBy.push(currentUser.id);
            upvotedBy = upvotedBy.filter((id) => id !== currentUser.id);
          }
        }

        return {
          ...a,
          upvotedBy,
          downvotedBy,
          votes: upvotedBy.length - downvotedBy.length,
        };
      });

      set({ qaAnswers: updatedAnswers });
      syncDb({ qaAnswers: updatedAnswers });
    },

    acceptAnswer: (questionId, answerId) => {
      const { qaAnswers, qaQuestions, users } = get();
      
      const updatedQuestions = qaQuestions.map((q) => {
        if (q.id === questionId) {
          return { ...q, acceptedAnswerId: answerId };
        }
        return q;
      });

      const targetAnswer = qaAnswers.find((a) => a.id === answerId);
      
      const updatedAnswers = qaAnswers.map((a) => {
        if (a.questionId === questionId) {
          return { ...a, isAccepted: a.id === answerId };
        }
        return a;
      });

      // Grant answer author 15 reputation points if correct
      let updatedUsers = users;
      if (targetAnswer) {
        updatedUsers = users.map((u) => {
          if (u.id === targetAnswer.authorId) {
            const hasHelperBadge = u.badges.some((b) => b.id === "badge-helper");
            const newRep = u.reputation + 15;
            let badges = [...u.badges];
            // If they reach enough reputation, auto grant badge
            if (newRep >= 50 && !hasHelperBadge) {
              badges.push(mockBadges[2]);
            }
            return { ...u, reputation: newRep, badges };
          }
          return u;
        });
      }

      set({ qaQuestions: updatedQuestions, qaAnswers: updatedAnswers, users: updatedUsers });
      syncDb({ qaQuestions: updatedQuestions, qaAnswers: updatedAnswers, users: updatedUsers });
    },

    castVote: (pollId, optionId) => {
      const { currentUser, polls } = get();
      if (!currentUser) return;

      const updatedPolls = polls.map((poll) => {
        if (poll.id !== pollId) return poll;

        const options = poll.options.map((opt) => {
          // Remove user's previous votes on other options
          let votes = opt.votes.filter((uid) => uid !== currentUser.id);
          // Add vote to the selected option
          if (opt.id === optionId) {
            votes.push(currentUser.id);
          }
          return { ...opt, votes };
        });

        return { ...poll, options };
      });

      set({ polls: updatedPolls });
      syncDb({ polls: updatedPolls });
    },

    createPoll: (question, options, communityId) => {
      const { currentUser, polls } = get();
      if (!currentUser) return;

      const newPoll: Poll = {
        id: `poll-${Date.now()}`,
        question,
        options: options.map((opt, idx) => ({ id: `opt-${idx}`, text: opt, votes: [] })),
        authorId: currentUser.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000 * 24 * 7).toISOString(), // 1 week
        communityId,
      };

      const updatedPolls = [newPoll, ...polls];
      set({ polls: updatedPolls });
      syncDb({ polls: updatedPolls });
    },

    registerForEvent: (eventId) => {
      const { currentUser, events } = get();
      if (!currentUser) return;

      const updatedEvents = events.map((event) => {
        if (event.id !== eventId) return event;
        const registeredUsers = [...event.registeredUsers];
        const idx = registeredUsers.indexOf(currentUser.id);

        if (idx > -1) {
          registeredUsers.splice(idx, 1);
        } else {
          registeredUsers.push(currentUser.id);
        }

        return { ...event, registeredUsers };
      });

      set({ events: updatedEvents });
      syncDb({ events: updatedEvents });
    },

    createEvent: (eventData) => {
      const { currentUser, events } = get();
      if (!currentUser) return;

      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        authorId: currentUser.id,
        registeredUsers: [currentUser.id],
      };

      const updatedEvents = [newEvent, ...events];
      set({ events: updatedEvents });
      syncDb({ events: updatedEvents });
    },

    markNotificationRead: (notifId) => {
      const { notifications } = get();
      const updated = notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n));
      set({ notifications: updated });
    },

    markAllNotificationsRead: () => {
      const { notifications } = get();
      const updated = notifications.map((n) => ({ ...n, read: true }));
      set({ notifications: updated });
    },

    approveVerification: (userId) => {
      const { users, currentUser } = get();
      
      const updatedUsers = users.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            verificationStatus: "verified" as const,
            badges: [...u.badges, mockBadges[0]], // add verified badge
            org: u.verificationDetails?.value.includes("@") 
              ? (mockOrgs.find((o) => o.domain === u.verificationDetails?.value.split("@")[1]) || mockOrgs[0])
              : mockOrgs[0],
          };
        }
        return u;
      });

      const updatedCurrentUser = updatedUsers.find((u) => u.id === currentUser?.id) || currentUser;

      set({ users: updatedUsers, currentUser: updatedCurrentUser });
      syncDb({ users: updatedUsers });
    },

    rejectVerification: (userId) => {
      const { users, currentUser } = get();
      const updatedUsers = users.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            verificationStatus: "unverified" as const,
            verificationDetails: undefined,
          };
        }
        return u;
      });
      const updatedCurrentUser = updatedUsers.find((u) => u.id === currentUser?.id) || currentUser;
      set({ users: updatedUsers, currentUser: updatedCurrentUser });
      syncDb({ users: updatedUsers });
    },

    flagContent: (contentType, contentId, snippet, reason) => {
      const { flagged, currentUser } = get();
      const reporter = currentUser ? currentUser.name : "Anonymous";

      const newFlag: FlaggedContent = {
        id: `flag-${Date.now()}`,
        contentType,
        contentId,
        contentSnippet: snippet,
        reportedBy: reporter,
        reason,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      const updatedFlagged = [newFlag, ...flagged];
      set({ flagged: updatedFlagged });
      syncDb({ flagged: updatedFlagged });
    },

    resolveFlagged: (flagId, action) => {
      const { flagged, posts } = get();
      
      let updatedPosts = [...posts];
      const targetFlag = flagged.find((f) => f.id === flagId);

      if (action === "delete" && targetFlag) {
        if (targetFlag.contentType === "post") {
          updatedPosts = posts.filter((p) => p.id !== targetFlag.contentId);
        } else if (targetFlag.contentType === "comment") {
          updatedPosts = posts.map((post) => ({
            ...post,
            comments: post.comments.filter((c) => c.id !== targetFlag.contentId),
          }));
        }
      }

      const updatedFlagged = flagged.map((f) => {
        if (f.id === flagId) {
          return { ...f, status: action === "dismiss" ? ("dismissed" as const) : ("resolved" as const) };
        }
        return f;
      });

      set({ flagged: updatedFlagged, posts: updatedPosts });
      syncDb({ flagged: updatedFlagged, posts: updatedPosts });
    },

    // Additional modules
    addMarketplaceItem: (title, description, price, image, category, contact) => {
      const { marketplace, currentUser } = get();
      if (!currentUser) return;

      const newItem: MarketplaceItem = {
        id: `m-${Date.now()}`,
        title,
        description,
        price,
        image,
        category,
        contact,
        authorId: currentUser.id,
        createdAt: new Date().toISOString(),
      };

      const updatedMarketplace = [newItem, ...marketplace];
      set({ marketplace: updatedMarketplace });
      syncDb({ marketplace: updatedMarketplace });
    },

    addMentorshipListing: (title, role, companyOrSchool, description, skills) => {
      const { mentorship, currentUser } = get();
      if (!currentUser) return;

      const newListing: MentorshipListing = {
        id: `ment-${Date.now()}`,
        title,
        role,
        companyOrSchool,
        description,
        skills,
        avatar: currentUser.avatar,
        authorId: currentUser.id,
        available: true,
      };

      const updatedMentorship = [newListing, ...mentorship];
      set({ mentorship: updatedMentorship });
      syncDb({ mentorship: updatedMentorship });
    },

    addLostAndFoundItem: (title, description, location, status, image) => {
      const { lostAndFound, currentUser } = get();
      if (!currentUser) return;

      const newItem: LostAndFoundItem = {
        id: `lf-${Date.now()}`,
        title,
        description,
        location,
        date: new Date().toISOString().split("T")[0],
        status,
        image,
        authorId: currentUser.id,
        createdAt: new Date().toISOString(),
      };

      const updatedLostAndFound = [newItem, ...lostAndFound];
      set({ lostAndFound: updatedLostAndFound });
      syncDb({ lostAndFound: updatedLostAndFound });
    }
  };
});
