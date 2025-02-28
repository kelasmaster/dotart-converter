// script.js

// ASCII characters from darkest to lightest
const asciiChars = '@%#*+=-:. '.split('');

document.getElementById('imageInput').addEventListener('change', handleImageUpload);

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

  // Set canvas dimensions based on image size
  const maxWidth = 100; // Max width for ASCII art
  const scale = Math.min(maxWidth / img.width, maxWidth / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Convert to ASCII
  let asciiArt = '';
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b); // Luminance formula
      const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
      asciiArt += asciiChars[charIndex];
    }
    asciiArt += '\n'; // Newline for each row
  }

  // Display ASCII art
  document.getElementById('asciiOutput').textContent = asciiArt;
}
