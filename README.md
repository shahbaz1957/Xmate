# Xmate AI - Your Personal Science Tutor

Xmate AI is an intelligent, AI-powered educational platform designed specifically for Class 9 and 10 students. It serves as a personal Science tutor, helping students understand complex concepts in Physics, Chemistry, and Biology through interactive, conversational learning.


## 🚀 Features

* **AI-Powered Tutoring**: Powered by Google's Gemini API, customized to answer only Science-related questions for Class 9 & 10.
* **Interactive Chat Interface**: A modern, ChatGPT-like interface with a unified, clean design.
* **Context-Aware**: Remembers conversation history to handle follow-up questions and maintain context.
* **Smart Fallbacks**: Uses vector database (Pinecone) for specific knowledge retrieval and falls back to general AI knowledge when needed.
* **User Authentication**: Secure login and signup functionality with JWT authentication.
* **Chat History**: Automatically saves and organizes chat sessions by date.
* **Theme Support**: Fully supported Light and Dark modes with a seamless toggle.
* **Responsive Design**: Optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend

* **Framework**: React (with TypeScript)
* **Build Tool**: Vite
* **Styling**: Tailwind CSS, Shadcn UI
* **Icons**: Lucide React
* **State Management**: React Hooks (Context API for Theme)
* **Routing**: React Router DOM

### Backend

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (for user data and chat history)
* **Vector Database**: Pinecone (for semantic search and context retrieval)
* **AI Model**: Google Gemini (via `@google/generative-ai`)
* **Authentication**: JSON Web Tokens (JWT) & Bcrypt

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher)

* [MongoDB](https://www.mongodb.com/) (Local or Atlas)
* [Google Gemini API Key](https://ai.google.dev/)
* [Pinecone API Key](https://www.pinecone.io/)

## ⚙️ Installation & Setup

### 1.Clone the Repository

```bash
git clone https://github.com/yourusername/xmate-ai.git
cd xmate-ai
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/xmate_db  # Or your MongoDB Atlas URL
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
PINECONE_CONTROLLER_URL=your_pinecone_controller_url
```

Start the backend server:

```bash
npm run dev
```

The server will start running on `http://localhost:3000`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash

cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## 📖 Usage

1. Open your browser and go to `http://localhost:5173`.
2. **Sign Up** for a new account.
3. Once logged in, you will be directed to the chat interface.
4. Start asking questions like:
    * "Explain Newton's Second Law of Motion."
    * "What is the difference between acids and bases?"
    * "Describe the structure of a plant cell."
5. Use the **Sidebar** to view past conversations or start a new chat.
6. Toggle between **Light** and **Dark** mode using the button in the sidebar menu.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.


