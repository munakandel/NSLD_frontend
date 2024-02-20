const video = document.getElementById('video');
const output = document.getElementById('output');
const startVideoBtn = document.getElementById('start-video-btn');
const stopVideoBtn = document.getElementById('stop-video-btn');
let mediaRecorder;
let recordedChunks = [];

startVideoBtn.addEventListener('click', startRecording);
stopVideoBtn.addEventListener('click', stopRecording);

function startRecording() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      // Show sign that recording started
      startVideoBtn.textContent = 'Recording...';
      startVideoBtn.disabled = true;
      stopVideoBtn.disabled = false;
    })
    .catch(err => {
      console.error('Error accessing webcam:', err);
    });
}

function stopRecording() {
  mediaRecorder.stop();
  // Show sign that recording stopped
  startVideoBtn.textContent = 'Start Recording';
  startVideoBtn.disabled = false;
  stopVideoBtn.disabled = true;
}

function handleDataAvailable(event) {
  recordedChunks.push(event.data);
}

mediaRecorder.addEventListener('stop', () => {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const formData = new FormData();
  formData.append('video', blob);

  fetch('/your-backend-endpoint', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    output.textContent = 'Detected Alphabet: ' + data.alphabet;
  })
  .catch(error => {
    console.error('Error processing video:', error);
    output.textContent = 'Error processing video';
  });

  // Reset button text and enable recording button
  startVideoBtn.textContent = 'Start Recording';
  startVideoBtn.disabled = false;
  stopVideoBtn.disabled = true;
});
