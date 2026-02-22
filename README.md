# Dispatchly Frontend 🚀

A premium, high-performance task management and dispatch system built with **React**, **TypeScript**, and **Redux Toolkit**. Designed with a high-end monochromatic aesthetic, Dispatchly enables seamless team coordination through a unified authentication and task lifecycle flow.

## ✨ Key Features

- **🛡️ Intelligent Authentication**: 
  - Dual-mode login (Phone or Email).
  - OTP-based verification with automatic user onboarding.
  - Role-based access control (Admin vs. Dispatch Officer).
  - Admin-specific password protection.
- **🏗️ Task Command Center**:
  - **Admins**: Create tasks, assign to team members by name, and set deadlines.
  - **Operatives**: View personal task manifests and toggle status (Pending/Completed).
- **🎨 Premium Design System**: 
  - High-end monochromatic (Black & White) aesthetic.
  - Glassmorphism effects and micro-animations.
  - Optimized for professional use with the Inter font family.
- **⚡ Real-time State**: 
  - Powered by **RTK Query** for instant cache synchronization and zero-refresh updates.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/) (Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **API Handling**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Styling**: Vanilla CSS (Custom Monochromatic System)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: `react-phone-input-2` for international mobile support.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/vahinireddy20/Dispatchly-Frontend.git

# Navigate to the directory
cd Dispatchly-Frontend

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Development
```bash
# Start the development server
npm run dev
```

### 5. Production
```bash
# Build for production
npm run build

# Preview build
npm run preview
```

---

## 📁 Project Structure

- `src/store/api`: RTK Query endpoint definitions (Auth, Task, User).
- `src/store/slices`: Redux slices for global state (Authentication).
- `src/pages`: Core application views (Dashboard, Auth flow, Onboarding).
- `src/index.css`: Centralized monochromatic design system and tokens.

---

## 🔐 Auth Workflow
1. **Request**: Enter Phone or Email -> OTP is sent via Nodemailer (Email) or Mock (Phone).
2. **Verify**: Enter 6-digit code.
3. **Onboard**: New users are automatically prompted to complete their profile (Name/Email) before entering the dashboard.
4. **Admin**: Existing admins use a secure password for final verification.

---

## 🤝 Contributing
For updates or feature requests, please contact the repository owner at [vahinireddy20](https://github.com/vahinireddy20).

---

## 📄 License
MIT License. Created by Vahini Reddy.
