// app.js
import DeviceDetector from './DeviceDetector.js';
import GestureDetection from './GestureDetection.js';
import CameraHandler from './CameraHandler.js';

// ตรวจสอบว่าเบราว์เซอร์รองรับ
const deviceDetector = new DeviceDetector([{ client: "Chrome" }]);
deviceDetector.testSupport();

const videoElement = document.querySelector(".input_video");
const canvasElement = document.querySelector(".output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const outputText = document.getElementById("outputText");

const holistic = new window.Holistic({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@latest/${file}`
});

holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

const gestureDetection = new GestureDetection();

async function onResults(results) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  // ใช้ drawing_utils แทนการวาดเอง
  if (results.poseLandmarks) {
    window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { lineWidth: 2, color: 'green' });
    window.drawLandmarks(canvasCtx, results.poseLandmarks, { lineWidth: 1, color: 'red' });
  }

  if (results.rightHandLandmarks) {
    window.drawConnectors(canvasCtx, results.rightHandLandmarks, window.HAND_CONNECTIONS, { lineWidth: 2, color: 'blue' });
    window.drawLandmarks(canvasCtx, results.rightHandLandmarks, { lineWidth: 1, color: 'blue' });
  }

  if (results.leftHandLandmarks) {
    window.drawConnectors(canvasCtx, results.leftHandLandmarks, window.HAND_CONNECTIONS, { lineWidth: 2, color: 'red' });
    window.drawLandmarks(canvasCtx, results.leftHandLandmarks, { lineWidth: 1, color: 'red' });
  }

  if (results.faceLandmarks) {
    window.drawLandmarks(canvasCtx, results.faceLandmarks, { lineWidth: 1, color: 'yellow' });
  }

  // คงส่วนตรวจจับ gesture ไว้เหมือนเดิม
  if (results.rightHandLandmarks || results.leftHandLandmarks) {
    const gesture = await gestureDetection.detectGesture(
      results.leftHandLandmarks,
      results.rightHandLandmarks,
      results.poseLandmarks,
      results.faceLandmarks
    );     
    if (gesture) {
      console.log("Gesture:", gesture);
      outputText.innerText = `แปลภาษามือ: ${gesture.name} - ${gesture.meaning}`;
    } else {
      console.log("No matching gesture detected");
      outputText.innerText = "ไม่พบท่าทางที่ตรงกับคำศัพท์";
    }
  }
}


// ฟังก์ชันเริ่มต้นแอป
async function startApp() {
  await gestureDetection.init(); // โหลด dictionary ก่อน
  holistic.onResults(onResults);
  const cameraHandler = new CameraHandler(videoElement, canvasElement, canvasCtx, holistic);
  cameraHandler.start();
}

startApp();
