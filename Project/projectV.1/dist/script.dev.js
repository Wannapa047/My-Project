"use strict";

// โหลด MediaPipe Holistic แบบปกติ (ไม่ต้องใช้ import)
var videoElement = document.querySelector(".input_video");
var canvasElement = document.querySelector(".output_canvas");
var outputText = document.getElementById("outputText");
var canvasCtx = canvasElement.getContext("2d"); // โหลด Mediapipe Holistic

var holistic = new Holistic({
  locateFile: function locateFile(file) {
    return "https://cdn.jsdelivr.net/npm/@mediapipe/holistic/".concat(file);
  }
});
holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
holistic.onResults(onResults); // โหลดโมเดล TensorFlow.js

var model;

function loadModel() {
  return regeneratorRuntime.async(function loadModel$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(tf.loadLayersModel("models/model.json"));

        case 3:
          model = _context.sent;
          // แก้ path ให้ตรง
          console.log("✅ Model Loaded Successfully!");
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("❌ Failed to load model:", _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
} // ฟังก์ชันประมวลผลผลลัพธ์


function onResults(results) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.rightHandLandmarks) {
    var landmarks = results.rightHandLandmarks.map(function (point) {
      return [point.x, point.y, point.z];
    });
    predictGesture(landmarks);
  }
} // ฟังก์ชันทำนายท่าทางมือ


function predictGesture(landmarks) {
  var inputTensor, prediction, gestureIndex, gestureLabels;
  return regeneratorRuntime.async(function predictGesture$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (model) {
            _context2.next = 3;
            break;
          }

          console.warn("⚠️ Model is not loaded yet.");
          return _context2.abrupt("return");

        case 3:
          inputTensor = tf.tensor([landmarks.flat()]).reshape([1, 63]); // 21 จุด * (x, y, z)

          prediction = model.predict(inputTensor);
          gestureIndex = prediction.argMax(-1).dataSync()[0];
          gestureLabels = ["สวัสดี", "ขอบคุณ", "รัก"]; // แก้ตามชุดข้อมูลที่ใช้ train

          outputText.innerText = gestureLabels[gestureIndex] || "ไม่รู้จัก";
          inputTensor.dispose();
          prediction.dispose();

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
} // เริ่มใช้งานกล้อง


function setupCamera() {
  var camera;
  return regeneratorRuntime.async(function setupCamera$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          camera = new Camera(videoElement, {
            onFrame: function onFrame() {
              return regeneratorRuntime.async(function onFrame$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return regeneratorRuntime.awrap(holistic.send({
                        image: videoElement
                      }));

                    case 2:
                    case "end":
                      return _context3.stop();
                  }
                }
              });
            },
            width: 640,
            height: 480
          });
          camera.start();

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
} // โหลดสคริปต์ Mediapipe และ TensorFlow


function loadScripts() {
  var scripts, _loop, _i, _scripts;

  return regeneratorRuntime.async(function loadScripts$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          scripts = ["https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js", "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs", "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"];

          _loop = function _loop() {
            var src;
            return regeneratorRuntime.async(function _loop$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    src = _scripts[_i];
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                      var script = document.createElement("script");
                      script.src = src;
                      script.onload = resolve;
                      script.onerror = reject;
                      document.body.appendChild(script);
                    }));

                  case 3:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          };

          _i = 0, _scripts = scripts;

        case 3:
          if (!(_i < _scripts.length)) {
            _context6.next = 9;
            break;
          }

          _context6.next = 6;
          return regeneratorRuntime.awrap(_loop());

        case 6:
          _i++;
          _context6.next = 3;
          break;

        case 9:
          console.log("✅ All scripts loaded!");
          _context6.next = 12;
          return regeneratorRuntime.awrap(loadModel());

        case 12:
          setupCamera();

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
} // โหลดทุกอย่างเมื่อหน้าเว็บโหลดเสร็จ


window.onload = loadScripts;
//# sourceMappingURL=script.dev.js.map
