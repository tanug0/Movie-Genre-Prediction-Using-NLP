/* Movie Genre AI - JavaScript Logic */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // DOM Elements
    const textarea = document.getElementById("movie-desc");
    const wordCountSpan = document.getElementById("word-count");
    const charCountSpan = document.getElementById("char-count");
    const predictBtn = document.getElementById("predict-btn");
    const clearBtn = document.getElementById("clear-btn");
    
    const resultContainer = document.getElementById("result-container");
    const loadingCard = document.getElementById("prediction-loading");
    const resultCard = document.getElementById("prediction-result");
    
    const predictedGenreName = document.getElementById("predicted-genre-name");
    const predictedGenreTagline = document.getElementById("predicted-genre-tagline");
    const genreIconWrapper = document.getElementById("genre-icon-wrapper");
    const resultTime = document.getElementById("result-time");
    const cleanedTextPreview = document.getElementById("cleaned-text-preview");
    
    const exampleBtns = document.querySelectorAll(".example-btn");
    
    // Lightbox elements
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeLightbox = document.querySelector(".close-lightbox");
    const zoomablePlots = document.querySelectorAll(".zoomable-plot");

    // Genre Details Dictionary (Icons & Taglines for a premium feel)
    const genreDetails = {
        "action": {
            icon: "swords",
            tagline: "High-octane excitement, intense battles, and thrilling stunts."
        },
        "adventure": {
            icon: "compass",
            tagline: "Epic journeys, exploration of unknown lands, and daring quests."
        },
        "animation": {
            icon: "palette",
            tagline: "Beautifully rendered animated stories for audiences of all ages."
        },
        "biography": {
            icon: "user",
            tagline: "Inspiring and detailed accounts of real people's lives and legacies."
        },
        "comedy": {
            icon: "laugh",
            tagline: "Humorous situations, witty dialogue, and lighthearted entertainment."
        },
        "crime": {
            icon: "shield-alert",
            tagline: "Intriguing mysteries, criminal minds, and law enforcement operations."
        },
        "documentary": {
            icon: "camera",
            tagline: "Real-world investigations, historical facts, and educational insights."
        },
        "drama": {
            icon: "drama",
            tagline: "Emotional depth, realistic characters, and intense personal conflicts."
        },
        "family": {
            icon: "heart",
            tagline: "Heartwarming stories suitable for parents and children to watch together."
        },
        "fantasy": {
            icon: "wand-2",
            tagline: "Magical worlds, mythical creatures, and supernatural adventures."
        },
        "history": {
            icon: "landmark",
            tagline: "Dramatizations of significant historical eras and world-changing events."
        },
        "horror": {
            icon: "ghost",
            tagline: "Chilling atmosphere, supernatural scares, and terrifying suspense."
        },
        "music": {
            icon: "music-4",
            tagline: "Films heavily focused on musical performances, artists, and sound."
        },
        "musical": {
            icon: "music-2",
            tagline: "Stories where characters express emotions through song and dance."
        },
        "mystery": {
            icon: "search",
            tagline: "Puzzling cases, hidden secrets, and suspenseful detective work."
        },
        "romance": {
            icon: "heart-handshake",
            tagline: "Love stories, emotional connections, and romantic relationships."
        },
        "sci-fi": {
            icon: "orbit",
            tagline: "Futuristic technology, space exploration, and mind-bending science concepts."
        },
        "short": {
            icon: "scissors",
            tagline: "Brief but impactful stories told in a condensed cinematic format."
        },
        "sport": {
            icon: "trophy",
            tagline: "Athletic competition, teamwork, and inspiring stories of victory."
        },
        "thriller": {
            icon: "skull",
            tagline: "Suspenseful plots, psychological tension, and unexpected twists."
        },
        "war": {
            icon: "flame",
            tagline: "Gritty portrayals of military conflicts and their human impact."
        },
        "western": {
            icon: "mountain",
            tagline: "Classic tales of cowboys, outlaws, and the rugged frontier life."
        },
        // Fallbacks for less common genres
        "adult": { icon: "eye-off", tagline: "Mature themes and adult-oriented content." },
        "game-show": { icon: "dices", tagline: "Interactive games, trivia, and competitive shows." },
        "news": { icon: "newspaper", tagline: "Broadcast journalism, current events, and reporting." },
        "reality-tv": { icon: "tv-2", tagline: "Unscripted real-life drama, competitions, and lifestyles." },
        "talk-show": { icon: "messages-square", tagline: "Celebrity interviews, discussions, and entertainment panels." }
    };

    /* --- Textarea Counter Logic --- */
    function updateCounter() {
        const text = textarea.value.trim();
        const chars = textarea.value.length;
        const words = text === "" ? 0 : text.split(/\s+/).length;
        
        wordCountSpan.textContent = `${words} ${words === 1 ? "word" : "words"}`;
        charCountSpan.textContent = `${chars} / 2000 characters`;
    }

    textarea.addEventListener("input", updateCounter);

    /* --- Clear Form --- */
    clearBtn.addEventListener("click", () => {
        textarea.value = "";
        updateCounter();
        resultContainer.classList.add("hidden");
        loadingCard.classList.add("hidden");
        resultCard.classList.add("hidden");
    });

    /* --- Prediction API Call --- */
    async function predictGenre() {
        const description = textarea.value.trim();
        
        if (!description) {
            alert("Please enter a movie description first.");
            return;
        }

        // Show loading state, hide results
        resultContainer.classList.remove("hidden");
        loadingCard.classList.remove("hidden");
        resultCard.classList.add("hidden");

        // Scroll to results so the user sees the progress
        resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });

        try {
            const response = await fetch("/api/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ description: description })
            });

            const data = await response.json();

            if (data.success) {
                // Display results with a slight delay for a smoother cinematic feel
                setTimeout(() => {
                    displayResult(data);
                }, 800);
            } else {
                showError(data.error || "An error occurred during prediction.");
            }

        } catch (error) {
            console.error("Error:", error);
            showError("Could not connect to the server. Make sure the Flask backend is running.");
        }
    }

    predictBtn.addEventListener("click", predictGenre);

    /* ------ Theme Toggle ------ */

const themeBtn = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if(savedTheme==="light"){

    document.body.classList.add("light-theme");
    themeBtn.textContent="☀️";

}else{

    themeBtn.textContent="🌙";

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("light-theme");

    if(document.body.classList.contains("light-theme")){

        themeBtn.textContent="☀️";
        localStorage.setItem("theme","light");

    }else{

        themeBtn.textContent="🌙";
        localStorage.setItem("theme","dark");

    }

});

    /* --- Display Result in UI --- */
    function displayResult(data) {
        // Hide loading card
        loadingCard.classList.add("hidden");
        
        // Format predicted genre
        const rawGenre = data.predicted_genre.toLowerCase();
        const details = genreDetails[rawGenre] || { icon: "film", tagline: "Cinematic story across various genre categories." };
        
        // Update texts
        predictedGenreName.textContent = data.predicted_genre;
        predictedGenreTagline.textContent = details.tagline;
        cleanedTextPreview.textContent = `"${data.cleaned_description}"`;
        
        // Update Timestamp
        const now = new Date();
        resultTime.textContent = `Analyzed at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

        // Update Icon
        genreIconWrapper.innerHTML = `<i data-lucide="${details.icon}" id="genre-icon"></i>`;
        
        // Re-run Lucide to render the new icon
        lucide.createIcons();

        // Show results card with animation
        resultCard.classList.remove("hidden");
    }

    /* --- Show Error --- */
    function showError(message) {
        loadingCard.classList.add("hidden");
        resultCard.classList.add("hidden");
        
        // Temporarily reuse result container to show error
        genreIconWrapper.innerHTML = `<i data-lucide="alert-triangle" style="color: var(--danger);"></i>`;
        predictedGenreName.textContent = "Error";
        predictedGenreTagline.textContent = message;
        cleanedTextPreview.textContent = "Please check your input or server logs.";
        
        lucide.createIcons();
        resultCard.classList.remove("hidden");
    }

    /* --- Quick Examples Logic --- */
    exampleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const text = btn.getAttribute("data-text");
            textarea.value = text;
            updateCounter();
            
            // Auto trigger prediction
            predictGenre();
        });
    });

    /* --- Lightbox Modal for Plots --- */
    zoomablePlots.forEach(plot => {
        plot.addEventListener("click", () => {
            const imgSrc = plot.getAttribute("src");
            const imgAlt = plot.getAttribute("alt");
            const cardHeader = plot.closest(".plot-card").querySelector(".plot-header h3").textContent;
            const cardFooter = plot.closest(".plot-card").querySelector(".plot-footer p").textContent;

            lightbox.style.display = "flex";
            lightboxImg.setAttribute("src", imgSrc);
            lightboxCaption.innerHTML = `<strong>${cardHeader}</strong><br><span style="font-size: 0.85rem; margin-top: 4px; display: inline-block;">${cardFooter}</span>`;
        });
    });

    // Close Lightbox
    closeLightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    // Handle Escape Key to Close Lightbox
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.style.display === "flex") {
            lightbox.style.display = "none";
        }
    });


    /* --- Active Navigation State --- */
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".scroll-margin");

       window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;

            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

}); 