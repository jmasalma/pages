// literacy_app/js/data_manager.js

const APP_PREFIX = 'literacyApp_';

// --- Data Structure Defaults ---
const DEFAULT_USER_PROFILE = {
    username: '',
    isLoggedIn: false, // Indicates if a user profile is active
    quizCompleted: false,
    placementLevel: null, // e.g., "CVC_Level_1_Beginner"
    currentCVCSet: [],   // e.g., ["cat", "hat", "bat"]
    masteredCVCWords: [] // e.g., ["cat"]
};

// --- Core Data Functions ---

/**
 * Retrieves the current user profile from localStorage.
 * If no profile exists, it can optionally create and return a default one.
 * @returns {object} The user profile object.
 */
function getUserProfile() {
    let profile = localStorage.getItem(APP_PREFIX + 'userProfile');
    if (profile) {
        return JSON.parse(profile);
    } else {
        // If no profile, create a default one but don't save it yet.
        // The calling function should decide when to save (e.g., after "login" or "profile creation")
        return {...DEFAULT_USER_PROFILE}; 
    }
}

/**
 * Saves the user profile object to localStorage.
 * @param {object} profile The user profile object to save.
 */
function saveUserProfile(profile) {
    if (!profile) {
        console.error("Attempted to save an undefined or null profile.");
        return;
    }
    try {
        localStorage.setItem(APP_PREFIX + 'userProfile', JSON.stringify(profile));
    } catch (e) {
        console.error("Error saving user profile to localStorage:", e);
        // Potentially alert the user if storage is full or unavailable
        alert("Could not save your progress. Your browser storage might be full or disabled.");
    }
}

/**
 * Clears all application-specific data from localStorage.
 * Effectively logs the user out and resets their state.
 */
function clearUserData() {
    // Instead of removing item by item, we can re-initialize the profile
    // to a logged-out state, or remove it entirely if preferred.
    // For simplicity, let's re-initialize to default logged-out state.
    const defaultProfile = {...DEFAULT_USER_PROFILE, username: '', isLoggedIn: false};
    saveUserProfile(defaultProfile); 
    // If other localStorage items specific to the app exist, remove them too.
    // Example: localStorage.removeItem(APP_PREFIX + 'someOtherData');
    console.log("User data cleared from localStorage.");
}


// --- CVC Word Data (Example - could be expanded or moved to its own JSON) ---
// This data would have previously come from the backend.
// Now it's defined client-side or could be fetched from a static JSON file.

const CVC_LEVELS = {
    "CVC_Level_1_Beginner": ["cat", "hat", "bat", "mat", "pat"],
    "CVC_Level_1_Review": ["cot", "hot", "dot", "pot", "lot"],
    "CVC_Level_2_Intermediate": ["sun", "run", "fun", "bun", "nun"],
    // Add more levels and words as needed
};

const ALL_CVC_WORDS_DETAILS = {
    // This structure helps associate words with images and potential distractors
    // if we make distractor generation more robust or specific.
    // For now, images are placeholder_WORD.png
    "cat": { image: "images/placeholder_cat.png" },
    "hat": { image: "images/placeholder_hat.png" },
    "bat": { image: "images/placeholder_bat.png" },
    "mat": { image: "images/placeholder_mat.png" },
    "pat": { image: "images/placeholder_pat.png" },
    "cot": { image: "images/placeholder_cot.png" },
    "hot": { image: "images/placeholder_hot.png" },
    "dot": { image: "images/placeholder_dot.png" },
    "pot": { image: "images/placeholder_pot.png" },
    "lot": { image: "images/placeholder_lot.png" },
    "sun": { image: "images/placeholder_sun.png" },
    "run": { image: "images/placeholder_run.png" },
    "fun": { image: "images/placeholder_fun.png" },
    "bun": { image: "images/placeholder_bun.png" },
    "nun": { image: "images/placeholder_nun.png" },
    // Add all CVC words from the quiz and activity here if needed for image paths etc.
    "pin": { image: "images/placeholder_pin.png" },
    "top": { image: "images/placeholder_top.png" },
    "bug": { image: "images/placeholder_bug.png" },
    // ... and any distractors if defined explicitly:
    "dog": { image: "images/placeholder_dog.png" },
    "moon": { image: "images/placeholder_moon.png" },
    "star": { image: "images/placeholder_star.png" },
    "bin": { image: "images/placeholder_bin.png" },
    "pen": { image: "images/placeholder_pen.png" },
    "mop": { image: "images/placeholder_mop.png" },
    "cop": { image: "images/placeholder_cop.png" },
    "rug": { image: "images/placeholder_rug.png" },
    "jug": { image: "images/placeholder_jug.png" },
    "map": { image: "images/placeholder_map.png" }, // Example from distractor list
    "hen": { image: "images/placeholder_hen.png" }, // Example from distractor list
    "lip": { image: "images/placeholder_lip.png" }, // Example from distractor list
    "fog": { image: "images/placeholder_fog.png" }, // Example from distractor list
    "cup": { image: "images/placeholder_cup.png" }  // Example from distractor list
};


/**
 * Gets the CVC word list for a given placement level.
 * @param {string} level The placement level.
 * @returns {string[]} An array of CVC words, or empty if level not found.
 */
function getCVCSetForLevel(level) {
    return CVC_LEVELS[level] || [];
}

/**
 * Gets details for a specific CVC word (e.g., image path).
 * @param {string} word The CVC word.
 * @returns {object|null} Details for the word or null if not found.
 */
function getCVCWordDetails(word) {
    return ALL_CVC_WORDS_DETAILS[word] || null;
}

// Make functions accessible if this script is included in HTML pages.
// No explicit export needed for simple global script includes.
// If using modules in future, would use `export { getUserProfile, saveUserProfile, ... }`
