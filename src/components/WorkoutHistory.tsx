import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Activity,
  Eye,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { TrainingSession } from "../types";

interface WorkoutHistoryProps {
  onBackToDashboard: () => void;
}

export function WorkoutHistory({ onBackToDashboard }: WorkoutHistoryProps) {
  const { translate } = useLanguage();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] =
    useState<TrainingSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("gymember_token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(
        "/api/training/sessions?status=completed&limit=50",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      } else {
        setError("Failed to load workout history");
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
      setError("Failed to load workout history");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionStats = (session: TrainingSession) => {
    try {
      const sessionData =
        typeof session.session_data === "string"
          ? JSON.parse(session.session_data)
          : session.session_data;

      const exercises = sessionData.exercises || [];
      const totalSets = exercises.reduce(
        (sum: number, exercise: any) => sum + (exercise.sets?.length || 0),
        0
      );

      return {
        exerciseCount: exercises.length,
        totalSets,
        duration: formatDuration(session.total_time),
      };
    } catch (error) {
      console.error("Error parsing session data:", error);
      return {
        exerciseCount: 0,
        totalSets: 0,
        duration: formatDuration(session.total_time),
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 text-center">
          <div className="text-red-400 text-xl mb-4">שגיאה</div>
          <div className="text-gray-300 mb-6">{error}</div>
          <button
            onClick={onBackToDashboard}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out"
          >
            חזרה לדאשבורד
          </button>
        </div>
      </div>
    );
  }

  if (selectedSession) {
    let sessionData;
    try {
      sessionData =
        typeof selectedSession.session_data === "string"
          ? JSON.parse(selectedSession.session_data)
          : selectedSession.session_data;
    } catch (error) {
      sessionData = { exercises: [] };
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSelectedSession(null)}
              className="flex items-center text-sky-400 hover:text-sky-300 text-sm font-medium transition duration-200"
            >
              <ArrowLeft className="mr-2" size={16} />
              {translate("backToHistory")}
            </button>
            <h1 className="text-3xl font-extrabold text-white">
              {translate("workoutDetails")}
            </h1>
          </div>

          <div className="bg-gray-700 p-6 rounded-xl mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedSession.session_name ||
                `אימון ${formatDate(selectedSession.start_time)}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-gray-300">
                <Calendar className="mr-2" size={20} />
                {formatDate(selectedSession.start_time)}
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="mr-2" size={20} />
                {formatDuration(selectedSession.total_time)}
              </div>
              <div className="flex items-center text-gray-300">
                <Activity className="mr-2" size={20} />
                {sessionData.exercises?.length || 0} תרגילים
              </div>
            </div>
            {selectedSession.notes && (
              <p className="text-gray-300 italic">"{selectedSession.notes}"</p>
            )}
          </div>

          <div className="space-y-4">
            {sessionData.exercises?.length > 0 ? (
              sessionData.exercises.map((exercise: any, index: number) => (
                <div key={index} className="bg-gray-700 p-4 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {exercise.exerciseName ||
                      exercise.name ||
                      `תרגיל ${index + 1}`}
                  </h3>
                  <p className="text-gray-300 mb-3">
                    {exercise.category || "לא צוין"}
                  </p>

                  {exercise.sets?.length > 0 ? (
                    exercise.sets.map((set: any, setIndex: number) => (
                      <div
                        key={setIndex}
                        className="bg-gray-600 p-3 rounded-lg mb-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">
                            {translate("set")} {set.setNumber || setIndex + 1}
                          </span>
                          <div className="text-gray-300 text-sm">
                            {set.weight} {translate("kg")} × {set.reps} reps
                            {set.duration &&
                              ` (${formatDuration(set.duration)})`}
                          </div>
                        </div>
                        {set.notes && (
                          <p className="text-gray-400 text-sm mt-1 italic">
                            "{set.notes}"
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm italic">
                      אין סטים רשומים לתרגיל זה
                    </div>
                  )}

                  {exercise.notes && (
                    <p className="text-gray-400 text-sm mt-2 italic">
                      {translate("additionalInfo")}: {exercise.notes}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                {translate("noExercisesInWorkout")}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToDashboard}
            className="flex items-center text-sky-400 hover:text-sky-300 text-sm font-medium transition duration-200"
          >
            <ArrowLeft className="mr-2" size={16} />
            {translate("backToDashboard")}
          </button>
          <h1 className="text-3xl font-extrabold text-white">
            {translate("workoutHistory")}
          </h1>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-2xl font-bold text-gray-300 mb-2">
              {translate("noHistory")}
            </h2>
            <p className="text-gray-400">
              התחל אימון ראשון כדי לראות את ההיסטוריה שלך כאן
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const stats = getSessionStats(session);
              return (
                <div
                  key={session.id}
                  className="bg-gray-700 p-6 rounded-xl cursor-pointer hover:bg-gray-600 transition duration-200"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {session.session_name ||
                          `אימון ${formatDate(session.start_time)}`}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="mr-2" size={16} />
                          {formatDate(session.start_time)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2" size={16} />
                          {stats.duration}
                        </div>
                        <div className="flex items-center">
                          <Activity className="mr-2" size={16} />
                          {stats.exerciseCount} תרגילים, {stats.totalSets} סטים
                        </div>
                      </div>
                      {session.notes && (
                        <p className="text-gray-400 text-sm mt-2 italic">
                          "{session.notes}"
                        </p>
                      )}
                    </div>
                    <button className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-lg transition duration-200">
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
