// script.js

// ASCII character sets for different styles
const asciiStyles = {
  basic: '@%#*+=-:. '.split(''),
  outline: '██▓▒░ '.split(''),
  simplified: '#*.- '.split(''),
  'no-dithering': '█░ '.split('')
};

document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('copyButton').addEventListener('click', copyAsciiArt);

let currentStyle = 'basic';
let precisionLevel = 128;
let outputWidth = 50;
let invertBackground = false;

document.getElementById('style').addEventListener('change', (e) => {
  currentStyle = e.target.value;
  updateAsciiArt();
});

document.getElementById('precision').addEventListener('input', (e) => {
  precisionLevel = parseInt(e.target.value);
  updateAsciiArt();
});

document.getElementById('width').addEventListener('input', (e) => {
  outputWidth = parseInt(e.target.value);
  updateAsciiArt();
});

document.getElementById('invert').addEventListener('change', (e) => {
  invertBackground = e.target.checked;
  updateAsciiArt();
});

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function () {
      processImage(img);
    };
  };
  reader.readAsDataURL(file);
}

function processImage(img) {
  const canvas = document.getElementById('imageCanvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions based on selected width
  const scale = outputWidth / img.width;
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Generate ASCII art
  updateAsciiArt();
}

function updateAsciiArt() {
  const canvas = document.getElementById('imageCanvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const asciiChars = asciiStyles[currentStyle];
  let asciiArt = '';

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b); // Luminance formula

      // Apply precision level
      const adjustedBrightness = Math.min(brightness, precisionLevel);

      // Map brightness to ASCII characters
      const charIndex = Math.floor((adjustedBrightness / 255) * (asciiChars.length - 1));
      asciiArt += asciiChars[charIndex];
    }
    asciiArt += '\n'; // Newline for each row
  }

  // Invert background if enabled
  if (invertBackground) {
    asciiArt = asciiArt.replace(/./g, (char) => char === ' ' ? '█' : char);
  }

  // Display ASCII art
  document.getElementById('asciiOutput').textContent = asciiArt;
}

function copyAsciiArt() {
  const asciiOutput = document.getElementById('asciiOutput');
  const textToCopy = asciiOutput.textContent;

  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('ASCII art copied to clipboard!');
  }).catch((err) => {
    console.error('Failed to copy ASCII art: ', err);
    alert('Failed to copy ASCII art. Please try again.');
  });
}
