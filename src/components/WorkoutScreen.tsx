import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Square,
  Activity,
  Timer,
  Weight,
  Info,
  X,
  Heart,
  Flame,
  Zap,
  Footprints,
  Hand,
  Target,
  Shield,
  Check,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Exercise,
  ExerciseCategory,
  getCategories,
  getExercisesByCategory,
} from "../data/exercises";

interface WorkoutScreenProps {
  onBackToDashboard: () => void;
}

interface ExerciseSet {
  setNumber: number;
  weight: number;
  reps: number;
  duration?: number;
  notes?: string;
}

interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  category: string;
  sets: ExerciseSet[];
  notes?: string;
}

interface WorkoutSession {
  exercises: WorkoutExercise[];
  notes: string;
  warmup: string;
  cooldown: string;
}

export function WorkoutScreen({ onBackToDashboard }: WorkoutScreenProps) {
  const { translate, language } = useLanguage();
  const { user } = useAuth();
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workoutStartTime, setWorkoutStartTime] = useState<number>(Date.now());
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    []
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [showSetInput, setShowSetInput] = useState(false);
  const [currentSet, setCurrentSet] = useState<ExerciseSet>({
    setNumber: 1,
    weight: 0,
    reps: 0,
  });

  // New state for the phase-based logic
  const [phase, setPhase] = useState<"categories" | "exercises" | "sets">(
    "categories"
  );
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [currentExercise, setCurrentExercise] = useState<string>("");
  const [currentSetNumber, setCurrentSetNumber] = useState(1);
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("10");
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [showWorkoutReport, setShowWorkoutReport] = useState(false);
  const [showCustomWeightModal, setShowCustomWeightModal] = useState(false);
  const [customWeightInput, setCustomWeightInput] = useState("");
  const [showCustomRepsModal, setShowCustomRepsModal] = useState(false);
  const [customRepsInput, setCustomRepsInput] = useState("");
  const [showAdditionalInfoModal, setShowAdditionalInfoModal] = useState(false);
  const [additionalInfoInput, setAdditionalInfoInput] = useState("");
  const [exerciseHistory, setExerciseHistory] = useState<{
    [key: string]: string;
  }>({});
  const [tooltipContent, setTooltipContent] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showSetFeedback, setShowSetFeedback] = useState(false);
  const [lastCompletedSet, setLastCompletedSet] = useState<any>(null);
  const [setCompleted, setSetCompleted] = useState(false);
  const [currentSetNotes, setCurrentSetNotes] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const setTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadCategories();
    loadExerciseHistory();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadExercises(selectedCategory);
    } else {
      setExercises([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (workoutStartTime && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [workoutStartTime, isPaused]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTooltip) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showTooltip]);

  const loadCategories = async () => {
    try {
      setError(null);
      const categoriesData = getCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExercises = async (categoryId: number) => {
    try {
      setError(null);
      const exercisesData = getExercisesByCategory(categoryId);
      setExercises(exercisesData || []);
    } catch (error) {
      console.error("Failed to load exercises:", error);
      setError("Failed to load exercises");
    }
  };

  const loadExerciseHistory = async () => {
    try {
      const token = localStorage.getItem("gymember_token");
      if (!token) return;

      const response = await fetch("/api/training/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExerciseHistory(data.exerciseHistory || {});
      }
    } catch (error) {
      console.error("Failed to load exercise history:", error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLastPerformedDate = (categoryOrExercise: string) => {
    const lastDate = exerciseHistory[categoryOrExercise];
    return lastDate ? formatDate(lastDate) : "";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCategorySelect = (category: ExerciseCategory) => {
    setCurrentCategory(translate(`category.${category.name_key}`));
    setSelectedCategory(category.id);
    setPhase("exercises");
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setCurrentExercise(translate(exercise.title_key || exercise.name_key));
    setCurrentSetNumber(1);
    setSetCompleted(false);
    setShowSetFeedback(false);
    setCurrentSetNotes("");
    // Keep the current weight and reps for the new exercise
    // setCurrentWeight("");
    // setCurrentReps("10");
    setPhase("sets");
  };

  const handleAddSet = () => {
    if (
      currentWeight === "" ||
      isNaN(Number(currentWeight)) ||
      Number(currentWeight) < 0
    ) {
      alert(translate("invalidWeight"));
      return;
    }

    const newSet = {
      setNumber: currentSetNumber,
      weight: Number(currentWeight),
      reps: Number(currentReps),
      duration: 0,
      notes: currentSetNotes,
    };

    setWorkoutData((prevWorkoutData) => {
      const existingExerciseIndex = prevWorkoutData.findIndex(
        (item) => item.exerciseName === currentExercise
      );

      if (existingExerciseIndex > -1) {
        const updatedWorkoutData = [...prevWorkoutData];
        updatedWorkoutData[existingExerciseIndex].sets.push(newSet);
        return updatedWorkoutData;
      } else {
        return [
          ...prevWorkoutData,
          {
            category: currentCategory,
            exerciseName: currentExercise,
            sets: [newSet],
          },
        ];
      }
    });

    // Show feedback for completed set
    setLastCompletedSet(newSet);
    setShowSetFeedback(true);
    setSetCompleted(true);
    setCurrentSetNotes(""); // Reset notes for next set

    // Set the next set's default values to the current set's values
    setCurrentSetNumber((prev) => prev + 1);
    setCurrentWeight(currentWeight); // Keep the same weight
    setCurrentReps(currentReps); // Keep the same reps
  };

  const handleNextExercise = () => {
    if (
      currentWeight !== "" &&
      !isNaN(Number(currentWeight)) &&
      Number(currentWeight) >= 0
    ) {
      handleAddSet();
    }
    setPhase("categories");
    setCurrentExercise("");
    setCurrentCategory("");
    setCurrentSetNumber(1);
    setSelectedCategory(null);
    setSetCompleted(false);
    setShowSetFeedback(false);
  };

  const handleAddAnotherSet = () => {
    setSetCompleted(false);
    setShowSetFeedback(false);
    setLastCompletedSet(null);
  };

  const handleBackToExercise = () => {
    setPhase("exercises");
    setCurrentExercise("");
    setCurrentCategory("");
    setCurrentSetNumber(1);
    setSelectedCategory(null);
    setSetCompleted(false);
    setShowSetFeedback(false);
  };

  const handleEndWorkout = async () => {
    if (
      currentWeight !== "" &&
      !isNaN(Number(currentWeight)) &&
      Number(currentWeight) >= 0
    ) {
      handleAddSet();
    }

    try {
      const token = localStorage.getItem("gymember_token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const sessionData: WorkoutSession = {
        exercises: workoutData.map((item) => ({
          exerciseId: 0,
          exerciseName: item.exerciseName,
          category: item.category,
          sets: item.sets,
        })),
        notes: "",
        warmup: "",
        cooldown: "",
      };

      const response = await fetch("/api/training/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_name: `אימון ${new Date().toLocaleDateString("he-IL")}`,
          session_data: sessionData,
          total_time: currentTime,
          notes: "",
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Mark the session as completed
        if (result.session?.id) {
          await fetch(`/api/training/sessions/${result.session.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: "completed",
              end_time: new Date().toISOString(),
            }),
          });
        }

        // Reload exercise history to show updated dates
        await loadExerciseHistory();

        setShowWorkoutReport(true);
        setSetCompleted(false);
        setShowSetFeedback(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save workout");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      setError("Failed to save workout");
    }
  };

  const generateWeightOptions = (maxWeight: number = 0) => {
    const options = new Set<number>();
    const defaultWeights = [
      0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150,
    ];

    // Use current weight if available, otherwise use maxWeight
    const baseWeight =
      currentWeight && !isNaN(Number(currentWeight))
        ? Number(currentWeight)
        : maxWeight;

    if (baseWeight && baseWeight > 0) {
      options.add(baseWeight);
      options.add(baseWeight + 2.5);
      options.add(baseWeight + 5);
      options.add(baseWeight + 10);
      options.add(Math.max(0, baseWeight - 2.5));
      options.add(Math.max(0, baseWeight - 5));
      options.add(Math.max(0, baseWeight - 10));
      options.add(Math.max(0, baseWeight - 20));
    }

    defaultWeights.forEach((w) => options.add(w));
    const sortedOptions = Array.from(options)
      .filter((w) => w >= 0)
      .sort((a, b) => a - b);
    return sortedOptions.slice(0, 8);
  };

  const generateRepsOptions = () => {
    const defaultReps = [5, 8, 10, 12, 15, 20, 25, 30];
    const options = new Set<number>(defaultReps);

    // Add current reps if it's not in the default list
    if (currentReps && !isNaN(Number(currentReps))) {
      const currentRepsNum = Number(currentReps);
      if (!defaultReps.includes(currentRepsNum)) {
        options.add(currentRepsNum);
      }
    }

    return Array.from(options)
      .sort((a, b) => a - b)
      .slice(0, 8);
  };

  const WorkoutReport = () => {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-lg mx-auto text-white border border-gray-700">
        <h3 className="text-3xl font-extrabold text-white mb-6 text-center">
          {translate("workoutReport")}
        </h3>
        <p className="text-lg mb-4 text-center text-sky-300">
          {translate("totalWorkoutDuration")} {formatTime(currentTime)}
        </p>
        <div className="max-h-96 overflow-y-auto pr-2">
          {workoutData.length > 0 ? (
            workoutData.map((ex, exIndex) => (
              <div
                key={exIndex}
                className="bg-gray-700 p-4 rounded-lg mb-4 shadow-md"
              >
                <h4 className="text-xl font-semibold text-sky-300 mb-2 flex items-center">
                  <Weight className="ml-2" size={20} /> {ex.exerciseName} (
                  {ex.category})
                </h4>
                {ex.sets.map((set: any, setIndex: number) => (
                  <p key={setIndex} className="text-gray-300 text-sm mb-1">
                    {translate("set")} {set.setNumber}: {translate("weight")}{" "}
                    {set.weight} {translate("kg")} × {set.reps}{" "}
                    {translate("reps")}
                  </p>
                ))}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">
              {translate("noExercisesInWorkout")}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setShowWorkoutReport(false);
            onBackToDashboard();
          }}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl mt-6 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between px-6"
        >
          <span>{translate("finishAndClose")}</span>
          <Check size={20} />
        </button>
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleTooltipShow = (content: string, event: React.MouseEvent) => {
    setTooltipContent(content);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setShowTooltip(true);
  };

  const handleTooltipHide = () => {
    setShowTooltip(false);
  };

  const handleTooltipToggle = (content: string, event: React.MouseEvent) => {
    if (showTooltip && tooltipContent === content) {
      setShowTooltip(false);
    } else {
      setTooltipContent(content);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
      setShowTooltip(true);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "chest":
        return <Heart className="mb-2" size={32} />;
      case "back":
        return <Shield className="mb-2" size={32} />;
      case "shoulders":
        return <Target className="mb-2" size={32} />;
      case "arms":
        return <Hand className="mb-2" size={32} />;
      case "legs":
        return <Footprints className="mb-2" size={32} />;
      case "core":
        return <Zap className="mb-2" size={32} />;
      case "cardio":
        return <Flame className="mb-2" size={32} />;
      default:
        return <Activity className="mb-2" size={32} />;
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

  if (showWorkoutReport) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
        <WorkoutReport />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white p-4">
      <h2 className="text-4xl font-extrabold mb-6 mt-4">
        {translate("activeWorkout")}
      </h2>
      <div className="text-6xl font-mono text-sky-400 mb-8 animate-pulse flex items-center">
        <Timer size={48} className="ml-4" />
        {formatTime(currentTime)}
      </div>

      {phase === "categories" && (
        <>
          <h3 className="text-3xl font-bold mb-4 text-sky-300">
            {translate("selectCategory")}
          </h3>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {categories.map((category) => {
              const lastPerformed = getLastPerformedDate(
                translate(`category.${category.name_key}`)
              );
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-5 rounded-xl text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg relative flex flex-col items-center justify-center"
                >
                  {getCategoryIcon(category.name_key)}
                  <div className="text-center">
                    <div>{translate(`category.${category.name_key}`)}</div>
                    {lastPerformed && (
                      <div className="text-xs text-gray-400 mt-1">
                        {translate("lastPerformed")} {lastPerformed}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={handleEndWorkout}
            className="w-full max-w-md bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between text-lg mt-8 px-6"
          >
            <span>{translate("endWorkout")}</span>
            <Square size={24} />
          </button>
        </>
      )}

      {phase === "exercises" && (
        <div className="w-full max-w-md text-center">
          <h3 className="text-3xl font-bold mb-4 text-sky-300">
            {translate("selectExercise")} {currentCategory}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {exercises.map((exercise) => {
              const lastPerformed = getLastPerformedDate(
                translate(exercise.title_key || exercise.name_key)
              );
              const exerciseDescription = translate(
                exercise.desc_key || exercise.name_key
              );
              const truncatedDescription = truncateText(
                exerciseDescription,
                50
              );
              const showTooltipIcon = exerciseDescription.length > 50;

              return (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg relative flex flex-col items-center justify-center"
                >
                  <Activity size={24} />
                  <div className="text-center w-full">
                    <div className="font-bold">
                      {translate(exercise.title_key || exercise.name_key)}
                    </div>
                    <div className="text-sm text-gray-300 mt-1 px-2">
                      {truncatedDescription}
                      {showTooltipIcon && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTooltipToggle(exerciseDescription, e);
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            handleTooltipToggle(exerciseDescription, e);
                          }}
                          onMouseLeave={handleTooltipHide}
                          className="ml-1 text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center"
                        >
                          <Info size={14} />
                        </button>
                      )}
                    </div>
                    {lastPerformed && (
                      <div className="text-xs text-gray-400 mt-1">
                        {translate("lastPerformed")} {lastPerformed}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPhase("categories")}
            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between"
          >
            <span>{translate("backToCategories")}</span>
            <ArrowLeft size={20} />
          </button>
        </div>
      )}

      {phase === "sets" && (
        <div className="w-full max-w-md text-center bg-gray-800 p-6 rounded-2xl shadow-xl border border-neutral-700">
          <h3 className="text-3xl font-bold mb-4 text-indigo-300 flex items-center justify-center">
            <Weight className="ml-3" size={28} />
            {currentExercise}
          </h3>

          <p className="text-2xl font-semibold mb-4 text-white">
            {translate("set")} {currentSetNumber}
          </p>

          {/* Weight Selection */}
          <div className="mb-6">
            <label
              className={`block text-neutral-300 text-lg font-medium mb-2 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("enterWeight")}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
              {generateWeightOptions().map((weight: number) => (
                <button
                  key={weight}
                  onClick={() => setCurrentWeight(weight.toString())}
                  className={`py-3 px-2 rounded-lg text-lg font-semibold transition duration-200 ${
                    currentWeight === weight.toString()
                      ? "bg-indigo-500 text-white shadow-lg scale-105"
                      : "bg-gray-700 hover:bg-gray-600 text-neutral-200"
                  }`}
                >
                  {weight}
                </button>
              ))}
              <button
                onClick={() => setShowCustomWeightModal(true)}
                className="py-3 px-2 rounded-lg text-lg font-semibold bg-gray-700 hover:bg-gray-600 text-neutral-200 transition duration-200"
              >
                {translate("other")}
              </button>
            </div>
            {currentWeight && currentWeight !== "" && (
              <p className="text-xl text-indigo-200 mt-2">
                {translate("selectedWeight")}{" "}
                <span className="font-bold">
                  {currentWeight} {translate("kg")}
                </span>
              </p>
            )}
          </div>

          {/* Reps Selection */}
          <div className="mb-6">
            <label
              className={`block text-neutral-300 text-lg font-medium mb-2 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("enterReps")}
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {generateRepsOptions().map((reps: number) => (
                <button
                  key={reps}
                  onClick={() => setCurrentReps(reps.toString())}
                  className={`py-3 px-2 rounded-lg text-lg font-semibold transition duration-200 ${
                    currentReps === reps.toString()
                      ? "bg-indigo-500 text-white shadow-lg scale-105"
                      : "bg-gray-700 hover:bg-gray-600 text-neutral-200"
                  }`}
                >
                  {reps}
                </button>
              ))}
              <button
                onClick={() => setShowCustomRepsModal(true)}
                className="py-3 px-2 rounded-lg text-lg font-semibold bg-gray-700 hover:bg-gray-600 text-neutral-200 transition duration-200"
              >
                {translate("other")}
              </button>
            </div>
            {currentReps && currentReps !== "" && (
              <p className="text-xl text-indigo-200 mt-2">
                {translate("selectedReps")}{" "}
                <span className="font-bold">
                  {currentReps} {translate("reps")}
                </span>
              </p>
            )}
          </div>

          {/* Set Notes */}
          <div className="mb-6">
            <label
              className={`block text-neutral-300 text-lg font-medium mb-2 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("setNotes")}
            </label>
            <textarea
              value={currentSetNotes}
              onChange={(e) => setCurrentSetNotes(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder={translate("setNotesPlaceholder")}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          {!setCompleted ? (
            <div className="space-y-4">
              <button
                onClick={handleAddSet}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between px-6"
              >
                <span>{translate("saveSet")}</span>
                <Weight size={24} />
              </button>
              <button
                onClick={handleBackToExercise}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between text-lg px-6"
              >
                <span>{translate("backToExercises")}</span>
                <ArrowLeft size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block"
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {translate("setCompletedFeedback")}
              </div>
              <button
                onClick={handleAddAnotherSet}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between px-6"
              >
                <span>{translate("addSet")}</span>
                <Weight size={24} />
              </button>
              <button
                onClick={handleNextExercise}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between px-6"
              >
                <span>{translate("nextExercise")}</span>
                <Weight size={24} />
              </button>
            </div>
          )}

          {/* Custom Weight Modal */}
          {showCustomWeightModal && (
            <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-neutral-700 relative">
                <h3 className="text-2xl font-bold text-indigo-300 mb-4 text-center">
                  {translate("enterCustomWeight")}
                </h3>
                <button
                  onClick={() => setShowCustomWeightModal(false)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-white transition duration-200"
                >
                  <X size={24} />
                </button>
                <input
                  type="number"
                  value={customWeightInput}
                  onChange={(e) => setCustomWeightInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4 text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={translate("enterWeight")}
                  min="0"
                  step="0.5"
                />
                <button
                  onClick={() => {
                    if (
                      customWeightInput === "" ||
                      isNaN(Number(customWeightInput)) ||
                      Number(customWeightInput) < 0
                    ) {
                      alert(translate("invalidWeight"));
                      return;
                    }
                    setCurrentWeight(Number(customWeightInput).toString());
                    setShowCustomWeightModal(false);
                    setCustomWeightInput("");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                  {translate("confirm")}
                </button>
              </div>
            </div>
          )}

          {/* Custom Reps Modal */}
          {showCustomRepsModal && (
            <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-neutral-700 relative">
                <h3 className="text-2xl font-bold text-indigo-300 mb-4 text-center">
                  {translate("enterCustomReps")}
                </h3>
                <button
                  onClick={() => setShowCustomRepsModal(false)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-white transition duration-200"
                >
                  <X size={24} />
                </button>
                <input
                  type="number"
                  value={customRepsInput}
                  onChange={(e) => setCustomRepsInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4 text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={translate("enterReps")}
                  min="1"
                  max="100"
                />
                <button
                  onClick={() => {
                    if (
                      customRepsInput === "" ||
                      isNaN(Number(customRepsInput)) ||
                      Number(customRepsInput) < 1 ||
                      Number(customRepsInput) > 100
                    ) {
                      alert(translate("invalidReps"));
                      return;
                    }
                    setCurrentReps(Number(customRepsInput).toString());
                    setShowCustomRepsModal(false);
                    setCustomRepsInput("");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                  {translate("confirm")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-50 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl text-sm max-w-xs border border-neutral-600"
          style={{
            left: Math.min(tooltipPosition.x + 10, window.innerWidth - 300),
            top: Math.max(tooltipPosition.y - 10, 10),
            transform: "translateY(-100%)",
          }}
        >
          <div className="relative">
            <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
            {tooltipContent}
          </div>
        </div>
      )}
    </div>
  );
}
