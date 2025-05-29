document.addEventListener('DOMContentLoaded', async () => {
    checkAuth(); // From auth.js

    const activityArea = document.getElementById('activityArea');
    const imageContainer = document.getElementById('imageContainer');
    const wordOptionsContainer = document.getElementById('wordOptions');
    const feedbackText = document.getElementById('feedbackText');
    const nextButton = document.getElementById('nextButton');

    let currentWords = [];
    let currentWordIndex = 0;
    let currentCorrectWord = '';
    let placeholderImageBase = 'images/placeholder_'; // Base for image names

    async function fetchUserProgressAndLoadActivity() {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/user_progress`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch user progress");
            }

            const progress = await response.json();
            if (progress.current_cvc_set && progress.current_cvc_set.length > 0) {
                currentWords = progress.current_cvc_set.filter(word => 
                    !(progress.mastered_cvc_words || []).includes(word)
                ); // Load words not yet mastered
                
                if (currentWords.length === 0 && progress.current_cvc_set.length > 0) {
                    feedbackText.textContent = "Congratulations! You've mastered all words in this set.";
                    nextButton.style.display = 'none';
                    wordOptionsContainer.innerHTML = '';
                    imageContainer.innerHTML = '';
                    // Potentially offer to go to next level or repeat
                    return;
                } else if (currentWords.length === 0) {
                     feedbackText.textContent = "No words loaded. Please check with your teacher or try the placement quiz again.";
                     return;
                }
                
                currentWordIndex = 0;
                loadWordActivity();
            } else {
                feedbackText.textContent = "No CVC word set assigned. Please complete the placement quiz.";
                activityArea.style.display = 'none';
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
            feedbackText.textContent = error.message || "Error loading activity. Please try again.";
            activityArea.style.display = 'none';
        }
    }

    function generateDistractors(correctWord) {
        // Simple CVC distractor generation. This should be more sophisticated.
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z'];
        let distractors = new Set(); // Use a Set to avoid duplicate distractors

        // Try changing first letter
        if (correctWord.length === 3) {
            let attempts = 0;
            while (distractors.size < 1 && attempts < 5) {
                const newConsonant = consonants[Math.floor(Math.random() * consonants.length)];
                if (newConsonant !== correctWord[0]) {
                    distractors.add(newConsonant + correctWord.substring(1));
                }
                attempts++;
            }
            // Try changing vowel
            attempts = 0;
            while (distractors.size < 2 && attempts < 5) {
                const newVowel = vowels[Math.floor(Math.random() * vowels.length)];
                if (newVowel !== correctWord[1]) {
                    distractors.add(correctWord[0] + newVowel + correctWord[2]);
                }
                attempts++;
            }
        }
        // Fallback: if not enough distractors, add some generic CVC words
        const fallbacks = ['top', 'cat', 'sun', 'pin', 'bug', 'map', 'hen', 'lip', 'fog', 'cup'];
        let i = 0;
        while(distractors.size < 2 && i < fallbacks.length) {
            if(fallbacks[i] !== correctWord && !Array.from(distractors).includes(fallbacks[i])) {
                distractors.add(fallbacks[i]);
            }
            i++;
        }
        return Array.from(distractors).slice(0, 2); // Return 2 distractors
    }


    function loadWordActivity() {
        if (currentWordIndex >= currentWords.length) {
            feedbackText.textContent = "You've completed all available words in this set!";
            nextButton.style.display = 'none';
            wordOptionsContainer.innerHTML = '';
            imageContainer.innerHTML = '';
            // TODO: Potentially trigger moving to a new set or level
            return;
        }

        currentCorrectWord = currentWords[currentWordIndex];
        imageContainer.innerHTML = `<img src="${placeholderImageBase}${currentCorrectWord}.png" alt="Image of ${currentCorrectWord}">`;
        
        const distractors = generateDistractors(currentCorrectWord);
        const options = [currentCorrectWord, ...distractors];
        shuffleArray(options); // Shuffle to randomize button order

        wordOptionsContainer.innerHTML = ''; // Clear previous options
        options.forEach(word => {
            const button = document.createElement('button');
            button.textContent = word;
            button.onclick = () => handleWordSelection(word);
            wordOptionsContainer.appendChild(button);
        });

        feedbackText.textContent = 'Match the picture to the word.';
        nextButton.style.display = 'none';
        enableOptions(true);
    }

    function handleWordSelection(selectedWord) {
        enableOptions(false); // Disable buttons after selection
        if (selectedWord === currentCorrectWord) {
            feedbackText.textContent = "Correct!";
            feedbackText.style.color = 'green';
            submitAnswer(currentCorrectWord, true); // Mark as mastered
            nextButton.style.display = 'block';
        } else {
            feedbackText.textContent = `Not quite. The word was "${currentCorrectWord}". Try again or click Next.`;
            feedbackText.style.color = 'red';
            submitAnswer(currentCorrectWord, false); // Mark as attempted, not mastered
            nextButton.style.display = 'block'; // Allow to proceed even if wrong for MVP
        }
    }
    
    async function submitAnswer(word, isCorrect) {
        if (!isCorrect) { // For MVP, we only mark mastered words.
            console.log(`Attempted: ${word}, Correct: ${isCorrect}`);
            return; // Don't send to backend if not mastered, or backend handles this logic
        }
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/submit_cvc_answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ word: word, mastered: isCorrect }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to submit answer:", errorData.message);
                // Don't alert, just log for now, as it might be disruptive
            } else {
                const result = await response.json();
                console.log("Answer submitted:", result.message);
                // Update local list of mastered words if needed, or rely on next fetchUserProgress
            }
        } catch (error) {
            console.error("Error submitting CVC answer:", error);
        }
    }


    function enableOptions(enable) {
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

    nextButton.addEventListener('click', () => {
        currentWordIndex++;
        if (currentWordIndex >= currentWords.length) {
            // All words in the initially fetched UNMASTERED list are done.
            // Re-fetch progress to see if there are new words or if the set is truly complete.
            feedbackText.textContent = "Checking for more words...";
            fetchUserProgressAndLoadActivity(); 
        } else {
            loadWordActivity();
        }
    });

    // Initial load
    fetchUserProgressAndLoadActivity();
});
