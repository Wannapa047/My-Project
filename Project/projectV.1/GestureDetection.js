import SignDictionary from './SignDictionary.js';

class GestureDetection {
  constructor() {
    this.signDictionary = new SignDictionary();
    this.rules = [];
  }

  async init() {
    await this.signDictionary.load();
    const dict = this.signDictionary.dictionary;
    if (!Array.isArray(dict) || dict.length === 0) {
      console.error("❌ Dictionary is empty or not loaded correctly");
      return;
    }

    console.log("📝 Dictionary Loaded:", dict);

    this.rules = dict.map(item => {
      const fn = item.conditions.map(condition => {
        const parsedFn = this.signDictionary.parseCondition(condition);
        if (typeof parsedFn !== 'function') {
          console.error(`❌ Condition parse error: ${condition} is not a function`);
          return null;
        }
        return parsedFn;
      }).filter(fn => fn !== null);

      return {
        name: item.word,
        meaning: item.meaning,
        conditions: item.conditions,
        fn: fn,
      };
    });
  }

  detectGesture(leftHand, rightHand, poseLandmarks, faceLandmarks) {
    let bestMatch = null;
    let highestScore = 0;

    for (const rule of this.rules) {
      let matchedCount = 0;
      let total = rule.fn.length;

      for (const fn of rule.fn) {
        if (typeof fn !== 'function') continue;
        if (fn(leftHand, rightHand, poseLandmarks, faceLandmarks)) {
          matchedCount++;
        }
      }

      const confidence = matchedCount / total;
      if (confidence > highestScore) {
        highestScore = confidence;
        bestMatch = {
          name: rule.name,
          meaning: rule.meaning,
          confidence: confidence.toFixed(2)
        };
      }
    }

    if (bestMatch && highestScore >= 0.5) {
      console.log(`✅ Gesture matched: ${bestMatch.name} (Confidence: ${bestMatch.confidence})`);
      return bestMatch;
    }

    console.log("❌ No gesture matched");
    return null;
  }
}

export default GestureDetection;
