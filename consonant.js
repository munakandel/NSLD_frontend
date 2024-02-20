const video = document.getElementById('video');
const output = document.getElementById('output');
const captureButton = document.getElementById('capture-btn');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Error accessing webcam:', err);
  });

captureButton.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const imgDataUrl = canvas.toDataURL('image/jpeg');

  // Send image data to the backend for processing
  fetch('/your-backend-endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: imgDataUrl })
  })
  .then(response => response.json())
  .then(data => {
    output.textContent = 'Detected Text: ' + data.alphabet;
  })
  .catch(error => {
    console.error('Error processing image:', error);
    output.textContent = 'Error processing image';
  });
});
