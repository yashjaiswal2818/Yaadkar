# YaadKar (याद कर) - AI-Powered Face Recognition for Dementia Care

> **"Remember"** - Helping dementia patients recognize loved ones, one familiar face at a time.

[![TechSprint AI Hack '25](https://img.shields.io/badge/Hackathon-TechSprint%20AI%20Hack%20'25-blue)](https://vision.hack2skill.com/event/gdgoc-25-techsprint-ai-hack-gdgpce?utm_source=hack2skill&utm_medium=homepage)
[![Team](https://img.shields.io/badge/Team-Code%20200-green)](https://github.com/yashjaiswal2818/Yaadkar)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://yaadkar.vercel.app)

---

## Problem Statement

**India faces a dementia crisis:**
- **8.8 Million** people living with dementia (Lancet, 2024)
- **90%** of cases go undiagnosed (ARDSI, 2024)
- **₹2.1 Lakh Crore** annual economic burden (Dementia India Alliance, 2024)
- **16+ Million** family caregivers affected

**The core problem:** When dementia patients don't recognize family members, it causes:
- Emotional trauma for both patients and families
- Patients becoming scared, confused, or aggressive
- Caregivers (70% women) leaving jobs to provide full-time care
- Families going into debt to afford quality care

**Existing solutions fail because:**
- Photo albums can't help in real-time when someone visits
- Verbal introductions ("I'm your son") aren't trusted by patients
- Memory care facilities cost ₹50K-2L/month (unaffordable for 99% of families)
- Existing apps are built for caregivers, not patients (complex UI, require login, no voice, English-only)

---

## Our Solution

**YaadKar** is a simple, patient-first app that works in **3 steps:**

1. **Point** → Patient points camera at visitor
2. **Recognize** → AI identifies the person instantly (2 seconds)
3. **Hear** → Voice says: *"This is Yash, your grandson!"*

### Key Differentiators

| Feature | Other Solutions | YaadKar |
|---------|----------------|---------|
| **Who uses it** | Caregivers | **Patients themselves** |
| **Login required** | Every time | **Never** (Patient Mode) |
| **Interface** | Complex menus | **ONE button** |
| **Languages** | English only | **Hindi, Tamil, Telugu, Marathi...** |
| **Output** | Text on screen | **Voice output** |
| **Cost** | ₹500-5000/month | **FREE forever** |
| **Works offline** | No | **Yes** (face detection) |

---

## Tech Stack

### Google Technologies

#### 1. **Firebase Authentication**
- **Google Sign-In** for secure, one-click authentication
- Session management for caregivers
- No password management needed
- OAuth 2.0 integration for seamless user experience

#### 2. **Firebase Firestore**
- Real-time database for storing family member profiles
- Recognition history tracking
- Secure document-based data storage
- Offline persistence support

#### 3. **Google Gemini AI**
- **Face recognition and matching** using Gemini's vision capabilities
- **Conversation generation** based on person's memories and relationship context
- Context-aware prompts in multiple Indian languages
- Natural language understanding for personalized interactions
- Multi-modal AI processing for image and text analysis

#### 4. **Web Speech API (Google TTS)**
- **Text-to-speech** in 7+ Indian languages:
  - Hindi (हिंदी)
  - English
  - Tamil (தமிழ்)
  - Telugu (తెలుగు)
  - Marathi (मराठी)
  - Bengali (বাংলা)
  - Kannada (ಕನ್ನಡ)
- Natural-sounding voice output
- Language detection and automatic switching
- Real-time speech synthesis

### Core Technologies

- **Next.js 14** - React framework with App Router, server-side rendering, and API routes
- **TypeScript** - Type-safe development for better code reliability
- **Tailwind CSS** - Utility-first styling with custom animations and responsive design
- **face-api.js** - Client-side face detection (privacy-first, runs locally on device)
- **Lucide React** - Professional icon library for consistent UI elements

### Infrastructure

- **Vercel** - Hosting and deployment with edge functions
- **Firebase Hosting** - Additional hosting capabilities for static assets

---

## Features

### For Patients
- **One-tap recognition** - No navigation, no login required
- **Voice output** - Hears who is in front of them in their preferred language
- **Multi-language support** - Works in native Indian languages
- - **Simple interface** - Large buttons, clear feedback, minimal cognitive load

### For Caregivers
- **Add family members** - Upload photos, add relationship details and memories
- **Conversation suggestions** - AI-generated talking points using Gemini
- **Emergency SOS** - Quick access to emergency contacts
- **Multi-language dashboard** - Manage in preferred language

---

## Project Structure

```
YaadKar/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/             # Caregiver dashboard
│   ├── camera/                # Face recognition page
│   ├── add-person/            # Add family member
│   └── sos/                   # Emergency SOS page
├── components/
│   ├── PersonCard.tsx         # Family member card
│   ├── FloatingPersonCard.tsx # Recognition result card
│   ├── ConversationCard.tsx   # AI conversation suggestions
│   ├── SOSButton.tsx          # Emergency button
│   └── Navbar.tsx             # Navigation bar
├── lib/
│   ├── firebase.ts            # Firebase config & auth
│   ├── api.ts                 # API calls (Gemini)
│   ├── face-detection.ts      # Face detection logic
│   ├── speech-messages.ts     # TTS templates
│   └── language-context.tsx   # Multi-language support
└── types/
    └── index.ts               # TypeScript definitions
```

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yashjaiswal2818/Yaadkar.git
cd Yaadkar

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

---

## Design Philosophy

### Patient-First Design
- **Minimal cognitive load** - One action at a time
- **Large touch targets** - 44px minimum for accessibility
- **Clear visual feedback** - Immediate response to actions
- **Voice-first** - Audio output, not just text

### Privacy & Security
- **Client-side face detection** - Face data processed locally, never leaves device
- **Secure authentication** - Firebase Auth with Google Sign-In
- **No data collection** - Only stores what caregivers explicitly add
- **Encrypted storage** - All data encrypted in transit and at rest

---

## Impact & Statistics

### The Problem We're Solving
- **8.8 Million** dementia patients in India (growing to 22M by 2050)
- **90%** undiagnosed cases
- **16+ Million** affected caregivers
- **70%** of caregivers are women who leave jobs

### How YaadKar Helps
- **Instant recognition** reduces confusion and anxiety
- **Voice output** works even for patients with vision issues
- **Multi-language** support for India's diverse population
- **Free forever** - accessible to all families regardless of economic status

---

## Future Enhancements

### Short-term Roadmap
- Offline mode with local AI models for complete privacy
- Voice commands for hands-free operation
- Integration with smart home devices (Google Home, Alexa)
- Caregiver analytics and insights dashboard
- Support for additional Indian languages (Gujarati, Punjabi, Malayalam)

### Long-term Vision
- **Video Call Platform Integration**: Seamless integration with video calling platforms (Zoom, Google Meet, Microsoft Teams) to enable real-time face recognition during virtual visits. This would allow remote family members to be recognized and identified, making long-distance care more personal and effective.

- **B2B Services**: Enterprise solutions for healthcare facilities, nursing homes, and memory care centers. Features would include:
  - Multi-patient management systems
  - Staff recognition and access control
  - Integration with Electronic Health Records (EHR)
  - Analytics and reporting for healthcare providers
  - White-label solutions for healthcare organizations
  - API access for third-party healthcare applications

- Mobile app (React Native) for iOS and Android
- Wearable device integration (smartwatches, smart glasses)
- Integration with telemedicine platforms
- Advanced analytics for tracking cognitive health patterns

---

## Team

**Code 200** - TechSprint AI Hack '25

- **Yash Jaiswal** - [GitHub](https://github.com/yashjaiswal2818) | [LinkedIn](https://www.linkedin.com/in/yash-jaiswal-093684344/)

---

## Resources & References

### Statistics Sources
- [Lancet Neurology - India Dementia Report 2024](https://www.thelancet.com/journals/laneur/article/PIIS1474-4422(23)00169-0/fulltext)
- [ARDSI - Alzheimer's & Related Disorders Society of India](https://ardsi.org/)
- [Dementia India Alliance](https://www.dementiaindia.org/)
- [WHO - Dementia Fact Sheet 2024](https://www.who.int/news-room/fact-sheets/detail/dementia)

### Technology Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Google Gemini API](https://ai.google.dev/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## License

This project is developed for **TechSprint AI Hack '25**. All rights reserved.

---

## Acknowledgments

- **TechSprint AI Hack '25** for the platform and opportunity
- **Google** for Firebase (Authentication, Firestore), Gemini AI, and Web Speech API
- **ARDSI** and **Dementia India Alliance** for research and data
- Open-source community for face-api.js and other libraries

---

## Contact & Links

- **Live Demo:** [yaadkar.vercel.app](https://yaadkar.vercel.app)
- **GitHub:** [github.com/yashjaiswal2818/Yaadkar](https://github.com/yashjaiswal2818/Yaadkar)
- **LinkedIn:** [linkedin.com/in/yash-jaiswal-093684344](https://www.linkedin.com/in/yash-jaiswal-093684344/)

---

**Built for dementia patients and their families**

*"Every 3 seconds, someone in the world develops dementia. By the time you finish reading this sentence, another family has begun their journey with this disease."* - World Alzheimer Report 2024
