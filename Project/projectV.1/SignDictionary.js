import { landmarkMap, distance } from './landmarkMap.js';

export default class SignDictionary {
  constructor() {
    this.dictionary = [];
  }

  async load() {
    const response = await fetch("sign_dictionary.json");
    if (!response.ok) {
      console.error("Failed to load sign dictionary");
      return [];
    }
    this.dictionary = await response.json();
  }

  parseCondition(ruleInput) {
    let rule = ruleInput.trim();
    const matchDistance = rule.match(/distance\((\w+),\s*(\w+)\)\s*(<=|>=|<|>|==|!=)\s*(\d+\.?\d*)/);
    if (matchDistance) {
      const [_, point1, point2, operator, value] = matchDistance;
      return (left, right, pose, face) => {
        const p1 = this.getPoint(point1, left, right, pose, face);
        const p2 = this.getPoint(point2, left, right, pose, face);
        if (!p1 || !p2) return false;
        const dist = distance(p1, p2);
        return this.compare(dist, operator, parseFloat(value));
      };
    }
  
    const matchPosition = rule.match(/(\w+)\.(x|y|z)\s*(<=|>=|<|>|==|!=)\s*(\d+\.?\d*)/);
    if (matchPosition) {
      const [_, point, axis, operator, value] = matchPosition;
      return (left, right, pose, face) => {
        const p = this.getPoint(point, left, right, pose, face);
        if (!p) return false;
        return this.compare(p[axis], operator, parseFloat(value));
      };
    }
  
    return () => {
      console.error(`❌ Unsupported condition: ${ruleInput}`);
      return false;
    };
  }
  
  compare(a, operator, b) {
    switch (operator) {
      case "<": return a < b;
      case ">": return a > b;
      case "<=": return a <= b;
      case ">=": return a >= b;
      case "==": return a == b;
      case "!=": return a != b;
      default: return false;
    }
  }
  
  recognize(left, right, pose, face) {
    for (const gesture of this.dictionary) {
      const groupMatched = gesture.conditions.some(group =>
        group.every(cond => {
          const fn = this.parseCondition(cond);
          return fn(left, right, pose, face);
        })
      );
      if (groupMatched) return gesture.word;
    }
    return null;
  }
  
  
  getPoint(point, left, right, pose, face) {
    const idx = landmarkMap[point];
    if (idx == null) return null;
    return (
      left?.[idx] ||
      right?.[idx] ||
      pose?.[idx] ||
      face?.[idx] ||
      null
    );
  }
}
