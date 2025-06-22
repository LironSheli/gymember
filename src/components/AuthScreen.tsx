import { useState } from "react";
import {
  LogIn,
  UserPlus,
  Lock,
  ArrowLeft,
  Mail,
  Globe,
  Key,
  Shield,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

export function AuthScreen() {
  const { translate, language, setLanguage } = useLanguage();
  const { signIn, signUp, resetPassword, error, clearError } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "reset" | "forgot">(
    "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleLanguage = () => {
    setLanguage(language === "he" ? "en" : "he");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();
    setSuccessMessage("");

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error(translate("passwordsDoNotMatch"));
        }
        await signUp(email, password, name);
      } else if (mode === "reset") {
        if (newPassword !== confirmNewPassword) {
          throw new Error(translate("passwordsDoNotMatch"));
        }
        await resetPassword(email, newPassword);
        // Show success message and go back to login
        setMode("login");
        setNewPassword("");
        setConfirmNewPassword("");
      } else if (mode === "forgot") {
        // Send forgot password request
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to send reset email");
        }

        setSuccessMessage(data.message);
        // Stay in forgot mode to show success message
      }
    } catch (err) {
      // Error is handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setName("");
    clearError();
    setSuccessMessage("");
  };

  const goToLogin = () => {
    setMode("login");
    resetForm();
  };

  const goToRegister = () => {
    setMode("register");
    resetForm();
  };

  const goToReset = () => {
    setMode("reset");
    resetForm();
  };

  const goToForgot = () => {
    setMode("forgot");
    resetForm();
  };

  const renderForm = () => {
    if (mode === "forgot") {
      return (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className={`block text-gray-300 text-sm font-medium mb-1 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{translate("sendResetLink")}</span>
                <Mail className="ml-2" size={20} />
              </>
            )}
          </button>
        </form>
      );
    }

    if (mode === "reset") {
      return (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className={`block text-gray-300 text-sm font-medium mb-1 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className={`block text-gray-300 text-sm font-medium mb-1 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("newPassword")}
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmNewPassword"
              className={`block text-gray-300 text-sm font-medium mb-1 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("confirmPassword")}
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between px-6"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{translate("resetPassword")}</span>
                <Lock size={20} className="ml-2" />
              </>
            )}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className={`block text-gray-300 text-sm font-medium mb-1 ${
              language === "he" ? "text-right" : "text-left"
            }`}
          >
            {translate("email")}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
            required
          />
        </div>
        {mode === "register" && (
          <div>
            <label
              htmlFor="name"
              className={`block text-gray-300 text-sm font-medium mb-1 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("name")}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              required
            />
          </div>
        )}
        <div>
          <label
            htmlFor="password"
            className={`block text-gray-300 text-sm font-medium mb-1 ${
              language === "he" ? "text-right" : "text-left"
            }`}
          >
            {translate("password")}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
            required
          />
        </div>
        {mode === "register" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className={`block text-gray-300 text-sm font-medium mb-1 ${
                language === "he" ? "text-right" : "text-left"
              }`}
            >
              {translate("confirmPassword")}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200"
              required
            />
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-between px-6"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>
                {mode === "login" ? translate("signIn") : translate("signUp")}
              </span>
              {mode === "login" ? (
                <LogIn size={20} className="ml-2" />
              ) : (
                <UserPlus size={20} className="ml-2" />
              )}
            </>
          )}
        </button>
      </form>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-xl transition duration-300 ease-in-out flex items-center"
          >
            {language === "he" ? "English" : "עברית"}
            <Globe className="ml-2" size={20} />
          </button>
        </div>

        {(mode === "reset" || mode === "forgot") && (
          <button
            onClick={goToLogin}
            className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-medium transition duration-200 mb-4"
          >
            {translate("backToLogin")}
            <ArrowLeft className="ml-2" size={16} />
          </button>
        )}

        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          {mode === "login"
            ? translate("login")
            : mode === "register"
            ? translate("register")
            : mode === "reset"
            ? translate("resetPassword")
            : translate("forgotPasswordTitle")}
        </h2>

        {error && (
          <p className="text-rose-500 text-center mb-4 text-sm">{error}</p>
        )}

        {successMessage && (
          <p className="text-emerald-500 text-center mb-4 text-sm">
            {successMessage}
          </p>
        )}

        {renderForm()}

        <div className="mt-6 text-center space-y-2">
          {mode === "login" && (
            <>
              <button
                onClick={goToRegister}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition duration-200 block"
              >
                {translate("noAccount")}
              </button>
              <button
                onClick={goToForgot}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition duration-200 block"
              >
                {translate("forgotPassword")}
              </button>
            </>
          )}
          {mode === "register" && (
            <button
              onClick={goToLogin}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition duration-200"
            >
              {translate("alreadyHaveAccount")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
