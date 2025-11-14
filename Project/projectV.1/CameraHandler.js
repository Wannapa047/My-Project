// CameraHandler.js
export default class CameraHandler {
    constructor(videoElement, canvasElement, canvasCtx, holistic) {
      this.videoElement = videoElement;
      this.canvasElement = canvasElement;
      this.canvasCtx = canvasCtx;
      this.holistic = holistic;
    }
  
    start() {
      const camera = new window.Camera(this.videoElement, {
        onFrame: async () => {
          await this.holistic.send({ image: this.videoElement });
        },
        width: 640,
        height: 480
      });
      camera.start();
    }
  }
  