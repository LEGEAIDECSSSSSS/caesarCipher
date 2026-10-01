// Same server serves the page and the API, so a relative URL is enough.
const API_URL = "/api/encrypt";

const form = document.getElementById("encryption-form");
const textInput = document.getElementById("password");
const shiftInput = document.getElementById("shift");
const characterCount = document.getElementById("character-count");
const encryptButton = document.getElementById("encrypt-button");
const clearButton = document.getElementById("clear-button");
const copyButton = document.getElementById("copy-button");
const copyLabel = document.getElementById("copy-label");
const decreaseButton = document.getElementById("decrease-shift");
const increaseButton = document.getElementById("increase-shift");
const placeholder = document.getElementById("result-placeholder");
const resultText = document.getElementById("encrypted-result");
const visualShift = document.getElementById("visual-shift");
const originalLetters = document.getElementById("original-letters");
const shiftedLetters = document.getElementById("shifted-letters");

const MIN_SHIFT = 0;
const MAX_SHIFT = 25;
const A_CODE = 65;
const VISIBLE_LETTERS = 13;

/* ---------- Helpers ---------- */

function getShift() {
    const value = parseInt(shiftInput.value, 10);
    if (Number.isNaN(value)) return MIN_SHIFT;
    return Math.min(MAX_SHIFT, Math.max(MIN_SHIFT, value));
}

function setShift(value) {
    const clamped = Math.min(MAX_SHIFT, Math.max(MIN_SHIFT, value));
    shiftInput.value = clamped;
    renderAlphabet();
}

function renderAlphabet() {
    const shift = getShift();
    visualShift.textContent = shift;

    originalLetters.innerHTML = "";
    shiftedLetters.innerHTML = "";

    for (let i = 0; i < VISIBLE_LETTERS; i++) {
        const original = document.createElement("span");
        original.textContent = String.fromCharCode(A_CODE + i);
        originalLetters.appendChild(original);

        const shifted = document.createElement("span");
        shifted.textContent = String.fromCharCode(A_CODE + ((i + shift) % 26));
        shiftedLetters.appendChild(shifted);
    }
}

function showResult(text, isError = false) {
    placeholder.hidden = true;
    resultText.textContent = text;
    resultText.classList.toggle("error", isError);
    copyButton.disabled = isError;
}

function resetResult() {
    placeholder.hidden = false;
    resultText.textContent = "";
    resultText.classList.remove("error");
    copyButton.disabled = true;
}

/* ---------- Events ---------- */

textInput.addEventListener("input", () => {
    const count = textInput.value.length;
    characterCount.textContent = `${count} character${count === 1 ? "" : "s"}`;
});

shiftInput.addEventListener("input", renderAlphabet);
shiftInput.addEventListener("change", () => setShift(getShift()));
decreaseButton.addEventListener("click", () => setShift(getShift() - 1));
increaseButton.addEventListener("click", () => setShift(getShift() + 1));

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    encryptButton.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: textInput.value, shift: getShift() }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        showResult(data.result);
    } catch (error) {
        console.error(error);
        showResult("Could not reach the encryption server. Make sure it is running and try again.", true);
    } finally {
        encryptButton.disabled = false;
    }
});

clearButton.addEventListener("click", () => {
    form.reset();
    characterCount.textContent = "0 characters";
    renderAlphabet();
    resetResult();
});

copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(resultText.textContent);
        copyLabel.textContent = "Copied!";
        setTimeout(() => (copyLabel.textContent = "Copy"), 1500);
    } catch (error) {
        console.error(error);
        copyLabel.textContent = "Failed";
        setTimeout(() => (copyLabel.textContent = "Copy"), 1500);
    }
});

renderAlphabet();
