import { useState } from "react";
import { Database, List, Activity } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getCategories, getExercisesByCategory } from "../data/exercises";

export function DebugData() {
  const { translate } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const checkLocalData = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Get categories from local data
      const categoriesData = getCategories();
      setCategories(categoriesData || []);

      // Get all exercises from local data
      const allExercises: any[] = [];
      categoriesData.forEach((category) => {
        const categoryExercises = getExercisesByCategory(category.id);
        allExercises.push(...categoryExercises);
      });
      setExercises(allExercises);

      setMessage(
        `Found ${categoriesData?.length || 0} categories and ${
          allExercises?.length || 0
        } exercises in local data`
      );
    } catch (error) {
      console.error("Error checking local data:", error);
      setMessage("Error checking local data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Debug Local Data</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={checkLocalData}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center gap-2"
        >
          <Database size={16} />
          {loading ? "Checking..." : "Check Local Data"}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <p className="text-white">{message}</p>
        </div>
      )}

      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <List size={20} />
            Categories ({categories.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="text-white font-medium">
                  ID: {category.id} -{" "}
                  {translate(`category.${category.name_key}`)}
                </div>
                <div className="text-gray-300 text-sm">
                  Key: {category.name_key}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {exercises.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={20} />
            Exercises ({exercises.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="text-white font-medium">
                  {translate(exercise.title_key)}
                </div>
                <div className="text-gray-300 text-sm">
                  {translate(exercise.desc_key)}
                </div>
                <div className="text-gray-400 text-xs mt-2">
                  Category: {exercise.category_id} | Key: {exercise.name_key}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
