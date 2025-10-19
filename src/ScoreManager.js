const STORAGE_KEY = "cowabunga_highscores";

export class ScoreManager {
  static loadScores() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  static saveScores(scores) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }

  static addScore(newScore) {
    const scores = this.loadScores();
    scores.push(newScore);
    scores.sort((a, b) => b - a); // highest first
    const top5 = scores.slice(0, 5);
    this.saveScores(top5);
    return top5;
  }

  static getTopScores() {
    return this.loadScores();
  }

  static clearScores() {
    localStorage.removeItem(STORAGE_KEY);
  }
}