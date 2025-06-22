"use client";

import { useState } from "react";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Dashboard } from "../components/Dashboard";
import { AuthScreen } from "../components/AuthScreen";
import { WorkoutScreen } from "../components/WorkoutScreen";
import { WorkoutHistory } from "../components/WorkoutHistory";
import { DebugData } from "../components/DebugData";
import { Modal } from "../components/Modal";
import { Settings, Bug } from "lucide-react";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showDebug, setShowDebug] = useState(false);

  const handleStartWorkout = () => {
    setCurrentPage("workout");
  };

  const handleViewHistory = () => {
    setCurrentPage("history");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  // Render different components based on current page
  switch (currentPage) {
    case "workout":
      return <WorkoutScreen onBackToDashboard={handleBackToDashboard} />;
    case "history":
      return <WorkoutHistory onBackToDashboard={handleBackToDashboard} />;
    case "debug":
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleBackToDashboard}
                className="text-sky-400 hover:text-sky-300 text-sm font-medium"
              >
                ← חזרה לדאשבורד
              </button>
              <h1 className="text-3xl font-extrabold text-white">
                בדיקת נתונים
              </h1>
            </div>
            <DebugData />
          </div>
        </div>
      );
    default:
      return (
        <div>
          <Dashboard
            onStartWorkout={handleStartWorkout}
            onViewHistory={handleViewHistory}
            userId={user.id.toString()}
            userName={user.name}
          />
          {showDebug && (
            <div className="fixed bottom-4 right-4 z-50">
              <button
                onClick={() => setCurrentPage("debug")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out"
              >
                בדיקת נתונים
              </button>
            </div>
          )}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="fixed bottom-4 left-4 z-50 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out flex items-center gap-2"
          >
            <Bug size={16} />
            {showDebug ? "הסתר" : "הצג"} בדיקה
          </button>
        </div>
      );
  }
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
