# Nexus Community

Nexus Community is a premium, pixel-perfect SaaS frontend social workspace designed for verified organization networks (colleges, universities, and corporate workplaces). 

This is a **frontend-only, zero-backend** application using realistic mock data, complete logic simulation, and browser-persistent memory database storage.

---

## 🚀 Key Modules & Pages

1. **Landing Page**: Animated landing page with GSAP entry flows and an interactive preview card.
2. **Login / Signup**: Credential shortcut panel for rapid preview testing, student/professional modes.
3. **Organization Onboarding**: Multi-option wizard (invite code, email OTP, or ID card drop file upload).
4. **Social Feed**: Rich text posts with image attachments, reactions (fire, heart, like), and slide-up comments drawers.
5. **Communities Explorer**: Category search pills (Study, Gaming, Work, General) and join triggers.
6. **Chat Module**: Discord/Slack-style layout with channel hash topics (`#general`, `#announcements`) and direct messages with attachment files.
7. **Q&A Forum**: Stack Overflow style boards with vote counters, tags, and answer acceptance flag constraints.
8. **Interactive Polls**: Live visual percentage bars animated dynamically using Framer Motion when casting votes.
9. **Events Calendar**: Date listings, attendee counts, RSVP bookings, and map location tags.
10. **Admin Panel**: Visual Area/Bar analytics graphs and verified membership approval queues.
11. **Moderator Panel**: Violations logs queue and post/comment deletion actions.
12. **AI Companion Panel**: Floating glass assistant sidebar providing automated chat summaries and mentorship matchmaking.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Runtime**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Local Persistence**: Client-side database sync to `localStorage`
- **Animations**: [GSAP](https://gsap.com/) (Hero landing), [Framer Motion](https://www.framer.com/motion/) (Micro-interactions & drawers), and [Lenis](https://lenis.darkroom.engineering/) (Smooth Inertia Scrolling)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics Visualization**: [Recharts](https://recharts.org/)

---

## 👥 Demo Accounts (No password required)

To facilitate grading and review, we pre-loaded the database with the following profiles:

| Account Type | Username | Role / Organization | Purpose / Actions |
| :--- | :--- | :--- | :--- |
| **CS Student** | `leosterling` | Member / Nexus University | Standard verified workspace interaction. |
| **Freshman** | `liamcarter` | Member / Unverified | Can submit ID scans to test the verification wizard. |
| **Campus Admin** | `sarahjenkins` | Admin / Nexus University | Accesses Admin Panel to approve Liam's ID card upload. |
| **Engineer Lead** | `alexrivera` | Moderator / Vercel Labs | Accesses Moderator Panel to delete/dismiss reported items. |

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18.x or newer recommended).

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/GauravGauri/nexus-community.git
   cd nexus-community
   ```
2. Install all node packages:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the Application

Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to interact with the application.

### Building for Production

Compile and verify code type checks:
```bash
npm run build
```
The optimized bundle is output inside the `.next` directory.
