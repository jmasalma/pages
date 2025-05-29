// literacy_app/js/cvc_activity.js

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) { // From auth.js; ensures user has a profile
        return; 
    }

    const activityArea = document.getElementById('activityArea');
    const imageContainer = document.getElementById('imageContainer');
    const wordOptionsContainer = document.getElementById('wordOptions');
    const feedbackText = document.getElementById('feedbackText');
    const nextButton = document.getElementById('nextButton');

    let userProfile = getUserProfile(); // From data_manager.js
    let currentWordsForActivity = []; // Words for the current session (unmastered ones)
    let currentWordIndex = 0;
    let currentCorrectWord = '';
    // Image path construction assumes 'images/placeholder_WORD.png' convention
    // const placeholderImageBase = 'images/placeholder_'; // Defined in data_manager.js (ALL_CVC_WORDS_DETAILS)


    function loadActivityState() {
        userProfile = getUserProfile(); // Refresh profile data

        if (!userProfile.quizCompleted || !userProfile.currentCVCSet || userProfile.currentCVCSet.length === 0) {
            feedbackText.textContent = "Please complete the placement quiz to get your CVC word set.";
            activityArea.style.display = 'none';
            nextButton.style.display = 'none';
            return;
        }

        // Filter out already mastered words from the current CVC set
        currentWordsForActivity = userProfile.currentCVCSet.filter(word => 
            !(userProfile.masteredCVCWords || []).includes(word)
        );
        
        if (currentWordsForActivity.length === 0) {
            feedbackText.textContent = "Congratulations! You've mastered all words in this set.";
            if (wordOptionsContainer) wordOptionsContainer.innerHTML = '';
            if (imageContainer) imageContainer.innerHTML = '';
            if (nextButton) nextButton.style.display = 'none';
            return;
        }
        
        currentWordIndex = 0;
        loadWordActivity();
    }

    function generateDistractors(correctWord) {
        // Using the same simple distractor logic as before.
        // This could be enhanced to use ALL_CVC_WORDS_DETAILS from data_manager for more varied distractors.
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z'];
        let distractors = new Set();

        if (correctWord.length === 3) {
            let attempts = 0;
            while (distractors.size < 1 && attempts < 5) {
                const newConsonant = consonants[Math.floor(Math.random() * consonants.length)];
                if (newConsonant !== correctWord[0]) {
                    distractors.add(newConsonant + correctWord.substring(1));
                }
                attempts++;
            }
            attempts = 0;
            while (distractors.size < 2 && attempts < 5) {
                const newVowel = vowels[Math.floor(Math.random() * vowels.length)];
                if (newVowel !== correctWord[1]) {
                    distractors.add(correctWord[0] + newVowel + correctWord[2]);
                }
                attempts++;
            }
        }
        const fallbacks = Object.keys(ALL_CVC_WORDS_DETAILS); // Use words from our defined list
        let i = 0;
        while(distractors.size < 2 && i < fallbacks.length) {
            if(fallbacks[i] !== correctWord && !Array.from(distractors).includes(fallbacks[i])) {
                distractors.add(fallbacks[i]);
            }
            i++;
        }
        return Array.from(distractors).slice(0, 2);
    }

    function loadWordActivity() {
        if (currentWordIndex >= currentWordsForActivity.length) {
            feedbackText.textContent = "You've completed all available words in this set!";
            if (nextButton) nextButton.style.display = 'none';
            if (wordOptionsContainer) wordOptionsContainer.innerHTML = '';
            if (imageContainer) imageContainer.innerHTML = '';
            return;
        }

        currentCorrectWord = currentWordsForActivity[currentWordIndex];
        const wordDetails = getCVCWordDetails(currentCorrectWord); // from data_manager.js
        const imagePath = wordDetails ? wordDetails.image : `images/placeholder_${currentCorrectWord}.png`; // Fallback if not in details

        if (imageContainer) imageContainer.innerHTML = `<img src="${imagePath}" alt="Image of ${currentCorrectWord}">`;
        
        const distractors = generateDistractors(currentCorrectWord);
        const options = [currentCorrectWord, ...distractors];
        shuffleArray(options);

        if (wordOptionsContainer) wordOptionsContainer.innerHTML = '';
        options.forEach(word => {
            const button = document.createElement('button');
            button.textContent = word;
            button.onclick = () => handleWordSelection(word);
            wordOptionsContainer.appendChild(button);
        });

        if (feedbackText) feedbackText.textContent = 'Match the picture to the word.';
        if (nextButton) nextButton.style.display = 'none';
        enableOptions(true);
    }

    function handleWordSelection(selectedWord) {
        enableOptions(false);
        if (selectedWord === currentCorrectWord) {
            if (feedbackText) {
                feedbackText.textContent = "Correct!";
                feedbackText.style.color = 'green';
            }
            
            // Update mastered words in userProfile (localStorage)
            if (!userProfile.masteredCVCWords.includes(currentCorrectWord)) {
                userProfile.masteredCVCWords.push(currentCorrectWord);
                saveUserProfile(userProfile); // from data_manager.js
            }
            if (nextButton) nextButton.style.display = 'block';
        } else {
            if (feedbackText) {
                feedbackText.textContent = `Not quite. The word was "${currentCorrectWord}". Try again or click Next.`;
                feedbackText.style.color = 'red';
            }
            if (nextButton) nextButton.style.display = 'block'; // Allow to proceed even if wrong
        }
    }
    
    function enableOptions(enable) {
        if (!wordOptionsContainer) return;
        const buttons = wordOptionsContainer.getElementsByTagName('button');
        for (let button of buttons) {
            button.disabled = !enable;
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentWordIndex++;
            if (currentWordIndex >= currentWordsForActivity.length) {
                // All words in the initially filtered unmastered list are done for this session.
                // Refresh the activity state from localStorage, which may show completion
                // or load new words if something changed (though unlikely in client-only).
                loadActivityState(); 
            } else {
                loadWordActivity();
            }
        });
    }

    // Initial load for the activity
    loadActivityState();
});
