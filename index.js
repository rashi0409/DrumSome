// Enhanced Drum Kit JavaScript 

// Global variables
let audio = null;
let recording = [];
let isRecording = false;
let playbackInterval = null;

// Event listeners for button clicks (drum sounds)
for (let i = 0; i < document.querySelectorAll(".drum").length; i++) {
    document.querySelectorAll("button")[i].addEventListener("click", function () {
        playSound(this.innerHTML);
        buttonAnimation(this.innerHTML);
        if (isRecording) {
            recording.push({ key: this.innerHTML, time: Date.now() });
        }
    });
}

// Event listener for keydown (keyboard interaction)
document.addEventListener("keydown", function (event) {
    playSound(event.key);
    buttonAnimation(event.key);
    if (isRecording) {
        recording.push({ key: event.key, time: Date.now() });
    }
});

// Function to play the corresponding sound based on the key/button pressed
function playSound(key) {
    if (audio) {
        audio.pause(); // Stop the previous sound
    }

    switch (key) {
        case "w":
            audio = new Audio("./sounds/tom-1.mp3");
            break;
        case "a":
            audio = new Audio("./sounds/tom-2.mp3");
            break;
        case "s":
            audio = new Audio("./sounds/tom-3.mp3");
            break;
        case "d":
            audio = new Audio("./sounds/tom-4.mp3");
            break;
        case "j":
            audio = new Audio("./sounds/crash.mp3");
            break;
        case "k":
            audio = new Audio("./sounds/kick-bass.mp3");
            break;
        case "l":
            audio = new Audio("./sounds/snare.mp3");
            break;
        default:
            console.log("Unsupported key: " + key);
            return;
    }

    // Set volume and check mute state
    audio.volume = document.getElementById("volume").value;
    if (!isMuted) {
        audio.play();
    }
}

// Function to add animation to the button pressed
function buttonAnimation(key) {
    const activeButton = document.querySelector("." + key);
    if (activeButton) {
        activeButton.classList.add("pressed");
        setTimeout(() => activeButton.classList.remove("pressed"), 500);
    }
}

// Volume control for drum sounds
const volumeControl = document.getElementById("volume");
volumeControl.addEventListener("input", function () {
    if (audio) {
        audio.volume = volumeControl.value;
    }
});

// Mute functionality
let isMuted = false;
document.getElementById("muteButton").addEventListener("click", function () {
    isMuted = !isMuted;
    const muteIcon = document.getElementById("muteIcon");
    muteIcon.classList.toggle("fa-volume-up", !isMuted);
    muteIcon.classList.toggle("fa-volume-mute", isMuted);
});

// Recording functionality
document.getElementById("recordButton").addEventListener("click", function () {
    isRecording = !isRecording;
    this.textContent = isRecording ? "Stop Recording" : "Start Recording";
    if (!isRecording) {
        recording = recording.map((item, index, array) => {
            if (index === 0) {
                return { ...item, timeOffset: 0 };
            }
            return { ...item, timeOffset: item.time - array[0].time };
        });
    } else {
        recording = [];
    }
});

// Playback functionality
document.getElementById("playbackButton").addEventListener("click", function () {
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
        this.textContent = "Play Recording";
        return;
    }
    this.textContent = "Stop Playing Recording";
    let startTime = Date.now();
    let index = 0;
    playbackInterval = setInterval(() => {
        if (index >= recording.length) {
            clearInterval(playbackInterval);
            playbackInterval = null;
            this.textContent = "Play Recording";
            return;
        }
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        if (elapsed >= recording[index].timeOffset) {
            playSound(recording[index].key);
            index++;
        }
    }, 10);
});

// Theme toggle with icon
document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    const isDarkMode = document.body.classList.contains("dark-theme");
    this.textContent = isDarkMode ? "Light Mode" : "Dark Mode";

    // Adjust mute/unmute icon visibility
    const muteIcon = document.getElementById("muteIcon");
    muteIcon.classList.toggle("dark-theme-icon", isDarkMode);

    // Adjust text visibility in Light and Dark Modes
    const drumButtons = document.querySelectorAll(".drum");
    drumButtons.forEach((button) => {
        if (isDarkMode) {
            if (["j", "k", "l"].includes(button.innerHTML)) {
                button.style.color = "pink"; // Pink for j, k, l in Dark Mode
            } else {
                button.style.color = "#ecf0f1"; // Light text for other buttons
            }
        } else {
            button.style.color = "pink"; // All buttons pink in Light Mode
        }
    });
});

// Background music toggle
let bgMusic = new Audio("./sounds/background-music.mp3");
bgMusic.loop = true;

document.getElementById("bgMusicToggle").addEventListener("click", function () {
    if (bgMusic.paused) {
        bgMusic.play();
        this.textContent = "Stop Background Music";
    } else {
        bgMusic.pause();
        this.textContent = "Play Background Music";
    }
});
volumeControl.addEventListener("input", function () {
    bgMusic.volume = this.value;
});
