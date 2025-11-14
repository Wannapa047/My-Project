export const landmarkMap = {
    wristRight: 16, wristLeft: 15,
    thumbRight: 4, thumbLeft: 4,
    indexRight: 8, indexLeft: 8,
    middleRight: 12, middleLeft: 12,
    ringRight: 16, ringLeft: 16,
    pinkyRight: 20, pinkyLeft: 20,
  
    // Pose landmarks
    nose: 0,
    leftEye: 2,
    rightEye: 5,
    leftShoulder: 11,
    rightShoulder: 12,
  
    // Face landmarks (common keypoints)
    leftEar: 234,
    rightEar: 454,
    mouthCenter: 13,
    chin: 152
  };
  
  export function distance(p1, p2) {
    if (!p1 || !p2) return Infinity;
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }
  