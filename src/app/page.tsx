"use client";

import { useState } from "react";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Dashboard } from "../components/Dashboard";
import { AuthScreen } from "../components/AuthScreen";
import { WorkoutScreen } from "../components/WorkoutScreen";
import { WorkoutHistory } from "../components/WorkoutHistory";
import { Modal } from "../components/Modal";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

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
    default:
      return (
        <Dashboard
          onStartWorkout={handleStartWorkout}
          onViewHistory={handleViewHistory}
          userId={user.id.toString()}
          userName={user.name}
        />
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
