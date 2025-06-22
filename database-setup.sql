-- Create database
CREATE DATABASE IF NOT EXISTS gymember;
USE gymember;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expiry TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create training sessions table
CREATE TABLE IF NOT EXISTS training_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  session_name VARCHAR(255) NULL,
  session_data JSON NOT NULL, -- Complete training session data
  total_time INT NOT NULL, -- Total session time in seconds
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NULL,
  status ENUM('active', 'completed', 'paused', 'cancelled') DEFAULT 'active',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create workout templates table (for predefined workouts)
CREATE TABLE IF NOT EXISTS workout_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  template_data JSON NOT NULL, -- Template structure
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create exercise categories table
CREATE TABLE IF NOT EXISTS exercise_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_key VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name_key VARCHAR(100) NOT NULL UNIQUE,
  title_key VARCHAR(100) NOT NULL,
  desc_key VARCHAR(100) NOT NULL,
  instructions_key VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES exercise_categories(id) ON DELETE CASCADE
);

-- Create user exercise records table (for tracking personal bests)
CREATE TABLE IF NOT EXISTS user_exercise_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  exercise_id INT NOT NULL,
  max_weight DECIMAL(6,2) NULL,
  max_reps INT NULL,
  max_duration INT NULL, -- in seconds
  last_performed TIMESTAMP NULL,
  total_sessions INT DEFAULT 0,
  personal_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_exercise (user_id, exercise_id)
);

-- Create training goals table
CREATE TABLE IF NOT EXISTS training_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  goal_type ENUM('weight', 'reps', 'duration', 'frequency', 'custom') NOT NULL,
  target_value DECIMAL(10,2) NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  target_date DATE NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  language ENUM('en', 'he') DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  weight_unit ENUM('kg', 'lbs') DEFAULT 'kg',
  distance_unit ENUM('km', 'miles') DEFAULT 'km',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  theme ENUM('light', 'dark', 'auto') DEFAULT 'dark',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert exercise categories with translation keys
INSERT INTO exercise_categories (id, name_key) VALUES
(1, 'upper_strength'),
(2, 'lower_strength'),
(3, 'core_strength'),
(4, 'cardio'),
(5, 'flexibility');

-- Insert exercises with translation keys
INSERT INTO exercises (id, category_id, name_key, title_key, desc_key, instructions_key) VALUES
-- Upper Strength
(1, 1, 'bench_press', 'exercise.bench_press.title', 'exercise.bench_press.desc', 'exercise.bench_press.instructions'),
(2, 1, 'pull_ups', 'exercise.pull_ups.title', 'exercise.pull_ups.desc', 'exercise.pull_ups.instructions'),
(3, 1, 'shoulder_press', 'exercise.shoulder_press.title', 'exercise.shoulder_press.desc', 'exercise.shoulder_press.instructions'),

-- Lower Strength
(4, 2, 'squats', 'exercise.squats.title', 'exercise.squats.desc', 'exercise.squats.instructions'),
(5, 2, 'deadlift', 'exercise.deadlift.title', 'exercise.deadlift.desc', 'exercise.deadlift.instructions'),
(6, 2, 'lunges', 'exercise.lunges.title', 'exercise.lunges.desc', 'exercise.lunges.instructions'),
(7, 2, 'calf_raises', 'exercise.calf_raises.title', 'exercise.calf_raises.desc', 'exercise.calf_raises.instructions'),

-- Core Strength
(8, 3, 'crunches', 'exercise.crunches.title', 'exercise.crunches.desc', 'exercise.crunches.instructions'),
(9, 3, 'plank', 'exercise.plank.title', 'exercise.plank.desc', 'exercise.plank.instructions'),
(10, 3, 'crunch_advanced', 'exercise.crunch_advanced.title', 'exercise.crunch_advanced.desc', 'exercise.crunch_advanced.instructions'),
(11, 3, 'superman', 'exercise.superman.title', 'exercise.superman.desc', 'exercise.superman.instructions'),
(12, 3, 'russian_twist', 'exercise.russian_twist.title', 'exercise.russian_twist.desc', 'exercise.russian_twist.instructions'),

-- Cardio
(13, 4, 'running', 'exercise.running.title', 'exercise.running.desc', 'exercise.running.instructions'),
(14, 4, 'cycling', 'exercise.cycling.title', 'exercise.cycling.desc', 'exercise.cycling.instructions'),
(15, 4, 'jump_rope', 'exercise.jump_rope.title', 'exercise.jump_rope.desc', 'exercise.jump_rope.instructions'),
(16, 4, 'burpee', 'exercise.burpee.title', 'exercise.burpee.desc', 'exercise.burpee.instructions'),

-- Flexibility
(17, 5, 'hamstring_stretch', 'exercise.hamstring_stretch.title', 'exercise.hamstring_stretch.desc', 'exercise.hamstring_stretch.instructions'),
(18, 5, 'shoulder_stretch', 'exercise.shoulder_stretch.title', 'exercise.shoulder_stretch.desc', 'exercise.shoulder_stretch.instructions'),
(19, 5, 'back_stretch', 'exercise.back_stretch.title', 'exercise.back_stretch.desc', 'exercise.back_stretch.instructions'),
(20, 5, 'hip_stretch', 'exercise.hip_stretch.title', 'exercise.hip_stretch.desc', 'exercise.hip_stretch.instructions');

-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_reset_token ON users(reset_token);
CREATE INDEX idx_training_sessions_user_id ON training_sessions(user_id);
CREATE INDEX idx_training_sessions_start_time ON training_sessions(start_time);
CREATE INDEX idx_training_sessions_status ON training_sessions(status);
CREATE INDEX idx_workout_templates_user_id ON workout_templates(user_id);
CREATE INDEX idx_workout_templates_public ON workout_templates(is_public);
CREATE INDEX idx_exercises_category_id ON exercises(category_id);
CREATE INDEX idx_exercises_name_key ON exercises(name_key);
CREATE INDEX idx_user_exercise_records_user_id ON user_exercise_records(user_id);
CREATE INDEX idx_user_exercise_records_exercise_id ON user_exercise_records(exercise_id);
CREATE INDEX idx_training_goals_user_id ON training_goals(user_id);
CREATE INDEX idx_training_goals_status ON training_goals(status);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id); 