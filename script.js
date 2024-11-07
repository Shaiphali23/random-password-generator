// Variables
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const dataCopy = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const lengthSlider = document.querySelector("[data-lengthSlider]");
const upperLetter = document.querySelector("#uppercase");
const lowerLetter = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const dataIndicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = "!@#$%^&*()_+/><]:{}[-+=?.,";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// set password length
function handleSlider() {
  lengthSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  dataIndicator.style.backgroundColor = color;
  // shadow
  dataIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Generates a random integer between `min` and `max`
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Generates a random number (0-9)
function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

// Generates a random lowercase letter
function generateLowerCase() {
  // ASCII Values of lowercase letter - 'a' to 'z'
  return String.fromCharCode(getRandomInteger(97, 123));
}

// Generates a random uppercase letter
function generateUpperCase() {
  // ASCII Values of uppercase letter - 'A' to 'Z'
  return String.fromCharCode(getRandomInteger(65, 91));
}

// Generates a random symbol from the `symbol` string
function generateSymbol() {
  const randNum = getRandomInteger(0, symbol.length);
  return symbol.charAt(randNum);
}

// Calculates the strength of the generated password based on selected options
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (upperLetter.checked) hasUpper = true;
  if (lowerLetter.checked) hasLower = true;
  if (numbers.checked) hasNum = true;
  if (symbols.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // Strong password (green)
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0"); // Medium strength (yellow)
  } else {
    setIndicator("#f00"); // Weak password (red)
  }
}

// Copies the generated password to clipboard
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

// Shuffles the generated password characters to increase randomness
function sufflePassword(array) {
  //Fisher-Yates Algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function handleCheckBoxChange() {
  checkCount = Array.from(allCheckBox).filter(
    (checkbox) => checkbox.checked
  ).length;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

//update checkCount
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

lengthSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

dataCopy.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

//Generates a new password when the generate button is clicked
generateButton.addEventListener("click", () => {
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  //password Initialization
  password = "";
  let funcArr = [];

  if (upperLetter.checked) funcArr.push(generateUpperCase);
  if (lowerLetter.checked) funcArr.push(generateLowerCase);
  if (numbers.checked) funcArr.push(generateRandomNumber);
  if (symbols.checked) funcArr.push(generateSymbol);

  // Ensures each selected type is included at least once
  funcArr.forEach((func) => (password += func()));

  //remaining characters
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //shuffle the password
  password = sufflePassword(Array.from(password));

  //display the password
  passwordDisplay.value = password;
  calcStrength();
});
