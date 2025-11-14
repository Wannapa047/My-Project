"use strict";

var _deviceDetectorJs = _interopRequireDefault(require("https://cdn.skypack.dev/device-detector-js@2.2.10"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// ตรวจสอบว่าใช้ Chrome หรือไม่
function testSupport(supportedDevices) {
  var deviceDetector = new _deviceDetectorJs["default"]();
  var detectedDevice = deviceDetector.parse(navigator.userAgent);

  if (!supportedDevices.some(function (device) {
    return new RegExp("^".concat(device.client, "$")).test(detectedDevice.client.name);
  })) {
    alert("This demo, running on ".concat(detectedDevice.client.name, ", is not well supported."));
  }
}

testSupport([{
  client: "Chrome"
}]); // โหลด MediaPipe

var videoElement = document.querySelector(".input_video");
var canvasElement = document.querySelector(".output_canvas");
var canvasCtx = canvasElement.getContext("2d");
var outputText = document.getElementById("outputText");
var holistic = new window.Holistic({
  locateFile: function locateFile(file) {
    return "https://cdn.jsdelivr.net/npm/@mediapipe/holistic@latest/".concat(file);
  }
});
holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.9,
  minTrackingConfidence: 0.9
});

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function detectGesture(leftHand, rightHand) {
  if (rightHand && leftHand) {
    var wristRight = rightHand[0];
    var indexRight = rightHand[8];
    var thumbRight = rightHand[4];
    var middleRight = rightHand[12];
    var wristLeft = leftHand[0];
    var indexLeft = leftHand[8];
    var thumbLeft = leftHand[4];
    var middleLeft = leftHand[12]; // ตรวจจับคำว่า "เศร้า" จากการเคลื่อนไหวมือจากหน้าผากลง

    if (wristRight.y < 0.2 && distance(indexRight, wristRight) > 0.1) {
      return "เศร้า"; // หากมือเคลื่อนจากหน้าผากลงไป
    } // ตรวจจับคำว่า "ขอโทษ" จากการยกมือขึ้นพนม


    if (wristRight.y < 0.2 && wristLeft.y < 0.2 && distance(indexRight, wristRight) < 0.05 && distance(indexLeft, wristLeft) < 0.05 && distance(thumbRight, indexRight) < 0.05 && distance(thumbLeft, indexLeft) < 0.05) {
      return "ขอโทษ"; // ตรวจจับจากการยกมือขึ้นในท่าพนมมือ
    } // เงื่อนไขท่าทางอื่นๆ ที่มีอยู่แล้ว


    if (wristRight.y < 0.3 && distance(wristRight, indexRight) < 0.05) {
      return "สวัสดี";
    }

    if (thumbRight.y < indexRight.y && indexRight.y < middleRight.y) {
      return "ใช่";
    }

    if (thumbRight.y > indexRight.y && indexRight.y > middleRight.y) {
      return "ไม่";
    }

    if (distance(thumbRight, pinkyRight) < 0.05 && distance(indexRight, pinkyRight) < 0.05) {
      return "โอเค";
    }

    if (thumbRight.y < 0.4 && wristRight.y < 0.5) {
      return "ขอบใจ";
    }

    if (distance(indexRight, middleRight) < 0.03 && distance(middleRight, ringRight) < 0.03) {
      return "เยี่ยม";
    }

    if (distance(thumbRight, indexRight) > 0.1 && distance(indexRight, middleRight) > 0.1) {
      return "รัก";
    }
  }

  return null;
}

function onResults(results) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.rightHandLandmarks) {
    results.rightHandLandmarks.forEach(function (point) {
      canvasCtx.beginPath();
      canvasCtx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 5, 0, 2 * Math.PI);
      canvasCtx.fillStyle = "blue";
      canvasCtx.fill();
    });
  }

  if (results.leftHandLandmarks) {
    results.leftHandLandmarks.forEach(function (point) {
      canvasCtx.beginPath();
      canvasCtx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 5, 0, 2 * Math.PI);
      canvasCtx.fillStyle = "red";
      canvasCtx.fill();
    });
  }

  if (results.leftHandLandmarks || results.rightHandLandmarks) {
    var gesture = detectGesture(results.leftHandLandmarks, results.rightHandLandmarks);

    if (gesture) {
      outputText.innerText = "\u0E41\u0E1B\u0E25\u0E20\u0E32\u0E29\u0E32\u0E21\u0E37\u0E2D: ".concat(gesture);
    }
  }
}

holistic.onResults(onResults);
var camera = new Camera(videoElement, {
  onFrame: function onFrame() {
    return regeneratorRuntime.async(function onFrame$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(holistic.send({
              image: videoElement
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  width: 640,
  height: 480
});
camera.start();
//# sourceMappingURL=record_data.dev.js.map
