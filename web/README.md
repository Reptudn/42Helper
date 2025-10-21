<div align="center">

# 🎓 42 Helper

### _Connecting 42 Students Through Collaboration_

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PocketBase](https://img.shields.io/badge/PocketBase-Latest-green?style=for-the-badge&logo=pocketbase)](https://pocketbase.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.3-5a67d8?style=for-the-badge)](https://daisyui.com/)

_A platform that connects 42 students who need help with those eager to offer it — whether for fun, collaboration, or project work._

[Features](#-features) •
[Setup](#-setup) •
[Architecture](#-architecture) •
[Contributing](#-contributing) •
[Team](#-team)

</div>

---

## 🌟 Features

### 🤝 **Request & Offer System**

- **Create Requests**: Post when you need help with any 42 project
- **Offer Help**: Share your expertise and help fellow students
- **Browse & Filter**: Find relevant requests and offers easily
- **Real-time Updates**: See new posts as they appear

### 🔐 **42 OAuth Integration**

- Seamless login with your 42 School account
- Automatic profile synchronization
- Secure authentication with NextAuth.js

### 📊 **Live Visualizer**

- Full-screen visualization mode
- Auto-scrolling request and offer feeds
- Real-time updates every 5 minutes
- Perfect for campus displays

### 💼 **Personal Dashboard**

- Manage your own posts
- Track requests and offers
- Edit and delete functionality
- User-friendly interface

### 🎨 **Modern UI/UX**

- Dark theme with neon accents
- Smooth animations and transitions
- Project-specific color coding

---

## 🚀 Setup

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **PocketBase** binary
- **42 API Credentials** (OAuth Client ID & Secret)

## 🏗️ Architecture

### Tech Stack

| Layer                | Technology                         |
| -------------------- | ---------------------------------- |
| **Frontend**         | Next.js 15.1, React 19, TypeScript |
| **Styling**          | TailwindCSS, DaisyUI               |
| **Backend**          | PocketBase (BaaS)                  |
| **Authentication**   | NextAuth.js with 42 OAuth          |
| **State Management** | React Context API                  |
| **Deployment**       | Docker, Docker Compose             |

### Project Structure

```
42Helper/
├── web/
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── requests/         # Browse requests
│   │   │   ├── offers/           # Browse offers
│   │   │   ├── my-posts/         # User dashboard
│   │   │   ├── visualizer/       # Live visualizer
│   │   │   └── login/            # Login page
│   │   ├── components/           # Reusable React components
│   │   │   ├── Card.tsx          # Post card component
│   │   │   ├── CreatePostModal.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── Navigation.tsx
│   │   ├── contexts/             # React Context providers
│   │   │   └── AuthContext.tsx   # Authentication state
│   │   ├── lib/                  # Utilities and config
│   │   │   ├── pocketbaseClient.ts
│   │   │   └── config.ts
│   │   └── types/                # TypeScript type definitions
│   ├── public/                   # Static assets
│   ├── Dockerfile                # Docker configuration
│   ├── docker-compose.yml        # Docker Compose setup
│   └── package.json
└── pocketbase/
    ├── pocketbase                # PocketBase binary
    └── start_pocketbase.sh       # Startup script
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Update documentation for new features
- Test your changes thoroughly

## 📝 License

This project was created for the 42 Heilbronn Hackathon 2025.

---

## 👥 Team

<div align="center">

**42 Heilbronn Hackathon 2025**

Made with ❤️ by:

[**jkauker**](https://profile.intra.42.fr/users/jkauker) •
[**lseeger**](https://profile.intra.42.fr/users/lseeger) •
[**lbohm**](https://profile.intra.42.fr/users/lbohm) •
[**lglauch**](https://profile.intra.42.fr/users/lglauch)

</div>

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Questions?** Open an issue or contact the team.

</div>
