// Fitness Test Constants
export const FITNESS_TESTS = {
  HEIGHT: {
    id: 'height',
    name: 'Height',
    testNumber: 1,
    qualityTested: null,
    unit: 'cm',
    description: 'Measure your height accurately',
    instructions: [
      'Stand straight against a wall',
      'Keep your heels together',
      'Look straight ahead',
      'Record the measurement'
    ],
    duration: 30, // seconds
    requiresVideo: false,
    requiresMeasurement: true,
  },
  WEIGHT: {
    id: 'weight',
    name: 'Weight',
    testNumber: 2,
    qualityTested: null,
    unit: 'kg',
    description: 'Measure your weight accurately',
    instructions: [
      'Stand on a weighing scale',
      'Keep your feet flat',
      'Look straight ahead',
      'Record the measurement'
    ],
    duration: 30,
    requiresVideo: false,
    requiresMeasurement: true,
  },
  SIT_AND_REACH: {
    id: 'sit_and_reach',
    name: 'Sit and Reach',
    testNumber: 3,
    qualityTested: 'Flexibility',
    unit: 'cm',
    description: 'Test your lower back and hamstring flexibility',
    instructions: [
      'Sit on the floor with legs extended',
      'Place feet against the box',
      'Reach forward slowly',
      'Hold the position for 2 seconds',
      'Record the furthest point reached'
    ],
    duration: 60,
    requiresVideo: true,
    requiresMeasurement: true,
  },
  VERTICAL_JUMP: {
    id: 'vertical_jump',
    name: 'Standing Vertical Jump',
    testNumber: 4,
    qualityTested: 'Lower Body Explosive Strength',
    unit: 'cm',
    description: 'Test your explosive leg power',
    instructions: [
      'Stand next to a wall with measuring tape',
      'Reach up and mark your standing reach',
      'Jump as high as possible',
      'Mark the highest point reached',
      'Record the difference'
    ],
    duration: 45,
    requiresVideo: true,
    requiresMeasurement: true,
  },
  BROAD_JUMP: {
    id: 'broad_jump',
    name: 'Standing Broad Jump',
    testNumber: 5,
    qualityTested: 'Lower Body Explosive Strength',
    unit: 'cm',
    description: 'Test your horizontal jumping power',
    instructions: [
      'Stand behind the starting line',
      'Jump forward as far as possible',
      'Land with both feet together',
      'Measure from starting line to heels'
    ],
    duration: 45,
    requiresVideo: true,
    requiresMeasurement: true,
  },
  MEDICINE_BALL_THROW: {
    id: 'medicine_ball_throw',
    name: 'Medicine Ball Throw',
    testNumber: 6,
    qualityTested: 'Upper Body Strength',
    unit: 'm',
    description: 'Test your upper body throwing power',
    instructions: [
      'Stand behind the throwing line',
      'Hold medicine ball with both hands',
      'Throw the ball as far as possible',
      'Measure the distance thrown'
    ],
    duration: 60,
    requiresVideo: true,
    requiresMeasurement: true,
  },
  SPRINT_30M: {
    id: 'sprint_30m',
    name: '30m Standing Start',
    testNumber: 7,
    qualityTested: 'Speed',
    unit: 'seconds',
    description: 'Test your sprinting speed',
    instructions: [
      'Stand behind the starting line',
      'Sprint 30 meters as fast as possible',
      'Record the time taken',
      'Start timing when you begin moving'
    ],
    duration: 15,
    requiresVideo: true,
    requiresTiming: true,
  },
  SHUTTLE_RUN: {
    id: 'shuttle_run',
    name: '4 x 10m Shuttle Run',
    testNumber: 8,
    qualityTested: 'Agility',
    unit: 'seconds',
    description: 'Test your agility and change of direction',
    instructions: [
      'Place markers 10m apart',
      'Run to the first marker and back',
      'Repeat 4 times (4 x 10m)',
      'Record total time taken'
    ],
    duration: 30,
    requiresVideo: true,
    requiresTiming: true,
  },
  SIT_UPS: {
    id: 'sit_ups',
    name: 'Sit Ups',
    testNumber: 9,
    qualityTested: 'Core Strength',
    unit: 'count',
    description: 'Test your abdominal muscle endurance',
    instructions: [
      'Lie on your back with knees bent',
      'Place hands behind your head',
      'Sit up until elbows touch knees',
      'Return to starting position',
      'Count completed repetitions in 1 minute'
    ],
    duration: 60,
    requiresVideo: true,
    requiresCounting: true,
  },
  ENDURANCE_RUN: {
    id: 'endurance_run',
    name: 'Endurance Run',
    testNumber: 10,
    qualityTested: 'Endurance',
    unit: 'minutes',
    description: 'Test your cardiovascular endurance',
    instructions: [
      'Run the specified distance',
      'U-12: 800m run',
      '12+ years: 1.6km run',
      'Record the time taken'
    ],
    duration: 600, // 10 minutes max
    requiresVideo: true,
    requiresTiming: true,
    distance: {
      under12: 800, // meters
      over12: 1600, // meters
    },
  },
};

// Age categories
export const AGE_CATEGORIES = {
  UNDER_12: 'under_12',
  OVER_12: 'over_12',
};

// Gender categories
export const GENDER_CATEGORIES = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

// Performance levels
export const PERFORMANCE_LEVELS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  AVERAGE: 'average',
  BELOW_AVERAGE: 'below_average',
  POOR: 'poor',
};

// Test status
export const TEST_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING_ANALYSIS: 'pending_analysis',
};

// User roles
export const USER_ROLES = {
  ATHLETE: 'athlete',
  ADMIN: 'admin',
  OFFICIAL: 'official',
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.sai-fitness-assessment.com',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  TESTS: {
    SUBMIT: '/tests/submit',
    GET_RESULTS: '/tests/results',
    GET_LEADERBOARD: '/tests/leaderboard',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile/update',
    UPLOAD_VIDEO: '/profile/upload-video',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
  },
};

// Video recording settings
export const VIDEO_SETTINGS = {
  QUALITY: '720p',
  MAX_DURATION: 300, // 5 minutes in seconds
  MIN_DURATION: 5, // 5 seconds
  FRAME_RATE: 30,
  BITRATE: 2000000, // 2 Mbps
};

// AI/ML Analysis settings
export const AI_ANALYSIS = {
  CONFIDENCE_THRESHOLD: 0.8,
  MAX_ANALYSIS_TIME: 30000, // 30 seconds
  ENABLE_CHEAT_DETECTION: true,
  ENABLE_OFFLINE_ANALYSIS: true,
};

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  TEST_RESULTS: 'test_results',
  SETTINGS: 'app_settings',
  CACHED_VIDEOS: 'cached_videos',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  PERMISSION_DENIED: 'Permission denied. Please grant required permissions.',
  VIDEO_RECORDING_FAILED: 'Failed to record video. Please try again.',
  ANALYSIS_FAILED: 'Video analysis failed. Please try again.',
  UPLOAD_FAILED: 'Failed to upload data. Please try again.',
  INVALID_CREDENTIALS: 'Invalid username or password.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful!',
  TEST_COMPLETED: 'Test completed successfully!',
  DATA_UPLOADED: 'Data uploaded successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Screen dimensions
export const SCREEN_DIMENSIONS = {
  WIDTH: '100%',
  HEIGHT: '100%',
};

// Validation rules
export const VALIDATION_RULES = {
  MIN_AGE: 8,
  MAX_AGE: 25,
  MIN_HEIGHT: 100, // cm
  MAX_HEIGHT: 250, // cm
  MIN_WEIGHT: 20, // kg
  MAX_WEIGHT: 150, // kg
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 50,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
};
