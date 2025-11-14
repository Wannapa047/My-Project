// DeviceDetector.js
import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";

export default class DeviceDetectorClass {
    constructor(supportedDevices) {
        this.supportedDevices = supportedDevices;
    }

    testSupport() {
        const deviceDetector = new DeviceDetector();
        const detectedDevice = deviceDetector.parse(navigator.userAgent);
        if (!this.supportedDevices.some(device => new RegExp(`^${device.client}$`).test(detectedDevice.client.name))) {
            alert(`This demo, running on ${detectedDevice.client.name}, is not well supported.`);
        }
    }
}
