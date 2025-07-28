# PayPing - Payment Management Platform

A modern payment reminder and customer management platform built with React, Vite, and Firebase.

## 🚀 Features

- **Customer Management**: Upload and manage customer data
- **Payment Tracking**: Monitor payment statuses and history
- **Template Editor**: Create custom payment reminder templates
- **Real-time Updates**: Firebase-powered real-time data synchronization
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Ready for Vercel, Netlify, or Firebase Hosting

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Firebase project setup

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd paypin-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup** 🔥
   
   Your Firebase project is already configured! You just need to:
   
   a) Get your Web App ID from [Firebase Console](https://console.firebase.google.com):
      - Go to Project Settings → Your apps
      - Copy the App ID (format: `1:17753421255:web:xxxxx`)
   
   b) Replace `your_app_id_here` in `.env` file with your actual App ID
   
   c) Enable Authentication and Firestore in Firebase Console
   
   📋 **Detailed instructions**: See `FIREBASE_SETUP.md`

4. **Start development**
   ```bash
   npm run dev
   ```

## 🏃‍♂️ Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init`
3. Deploy: `firebase deploy`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomerTable.jsx
│   ├── Navbar.jsx
│   ├── PaymentStatusCard.jsx
│   ├── ReminderToggle.jsx
│   └── TemplateEditor.jsx
├── contexts/           # React Context providers
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── LandingPage.jsx
│   ├── Payments.jsx
│   ├── Settings.jsx
│   ├── SignupPage.jsx
│   ├── Templates.jsx
│   └── UploadCustomers.jsx
├── firebase.js         # Firebase configuration
├── App.jsx            # Main App component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🔐 Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and Firestore Database
3. Get your Firebase config from Project Settings
4. Update your `.env` file with the configuration

## 🧪 Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Firebase configuration needs to be set up before the app can function
- Some components are placeholder implementations
- Authentication flow needs to be completed based on requirements

## 📞 Support

For support, please open an issue in the GitHub repository.
