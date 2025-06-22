import { LogOut, LayoutDashboard, Play, BarChart3, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

interface DashboardProps {
  onStartWorkout: () => void;
  onViewHistory: () => void;
  userId: string;
  userName?: string;
}

export function Dashboard({
  onStartWorkout,
  onViewHistory,
  userId,
  userName,
}: DashboardProps) {
  const { language, setLanguage, translate } = useLanguage();
  const { signOut } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === "he" ? "en" : "he");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-700">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-xl transition duration-300 ease-in-out flex items-center"
          >
            <Globe className="mr-2" size={20} />
            {language === "he" ? "English" : "עברית"}
          </button>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-8">
          {translate("welcome")}
        </h1>
        <div className="space-y-6">
          <button
            onClick={onStartWorkout}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between text-lg px-6"
          >
            <span>{translate("startWorkout")}</span>
            <Play size={24} />
          </button>
          <button
            onClick={onViewHistory}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between text-lg px-6"
          >
            <span>{translate("workoutHistory")}</span>
            <BarChart3 size={24} />
          </button>
          <button
            onClick={handleSignOut}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between text-lg px-6"
          >
            <span>{translate("signOut")}</span>
            <LogOut size={24} />
          </button>
        </div>
        <p className="mt-8 text-gray-400 text-sm">
          {translate("userName")} {userName}
        </p>
      </div>
    </div>
  );
}
