import { POINTS } from './Constants';

export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super("LevelCompleteScene");
  }

  init(data) {
    this.score = data.score;
    this.level = data.level;

    this.objectsJumpedOver = data.objectsJumpedOver;
    this.cowsCaught = data.cowsCaught;
  }

  preload() {
    this.load.image("level-bg", "assets/content/level-complete-bg.png");
    this.load.image("next-button", "assets/content/next-button.png");
  }

  updateScore(pts, eventName) {
    this.score = this.score + pts;
    this.scoreText.setText(`SCORE: ${this.score}`);
    const originalScale = this.scoreText.scale;
    this.tweens.add({
      targets: this.scoreText,
      scale: originalScale * 1.4,
      duration: 550,
      yoyo: true,
      ease: "Back.easeOut",
      onStart: () => this.scoreText.setTint(0xffff00),
      onComplete: () => {
        this.scoreText.clearTint();
        this.time.delayedCall(50, () => {
          this.events.emit(eventName);
        });
      },
    });
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(0, 0, "level-bg").setOrigin(0);
    bg.displayWidth = width;
    bg.displayHeight = height;

    this.add
      .text(55, height / 1.8, `Level Complete:`, {
        fontFamily: "Impact",
        fontSize: 22,
        color: "#ffff00",
        stroke: "#000",
        strokeThickness: 6,
      });

    this.time.delayedCall(350, () => {
      this.add
        .text(235, height / 1.8, POINTS.levelCompletePoints, {
          fontFamily: "Impact",
          fontSize: 22,
          color: "#ffff00",
          stroke: "#000",
          strokeThickness: 6,
        });
    });

    this.scoreText = this.add
      .text(width / 2, height / 1.35, `SCORE: ${this.score}`, {
        fontFamily: "Impact",
        fontSize: 45,
        color: "#ffff00",
        stroke: "#000",
        strokeThickness: 6,
      }).setScale(1).setOrigin(0.5);

    this.time.delayedCall(750, () => {
      this.updateScore(POINTS.levelCompletePoints, 'levelCompletePointsAdded');
    });

    this.events.once('levelCompletePointsAdded', () => {
      this.add
        .text(235, height / 1.68, `${POINTS.pointsPerCowCaught} x ${this.cowsCaught}`, {
          fontFamily: "Impact",
          fontSize: 22,
          color: "#ffff00",
          stroke: "#000",
          strokeThickness: 6,
        });
      this.time.delayedCall(450, () => {
        this.updateScore(POINTS.pointsPerCowCaught * this.cowsCaught, 'cowsCaughtPointsAdded');
      });
    });

    this.events.once('cowsCaughtPointsAdded', () => {
      this.add
        .text(235, height / 1.58, `${POINTS.pointsPerJumpedObstacle} x ${this.objectsJumpedOver}`, {
          fontFamily: "Impact",
          fontSize: 22,
          color: "#ffff00",
          stroke: "#000",
          strokeThickness: 6,
        });
      this.time.delayedCall(450, () => {
        this.updateScore(POINTS.pointsPerJumpedObstacle * this.objectsJumpedOver, 'obstaclesJumpedPointsAdded');
      });
    });

    this.add
      .text(78, height / 1.68, `Cows Caught:`, {
        fontFamily: "Impact",
        fontSize: 22,
        color: "#ffff00",
        stroke: "#000",
        strokeThickness: 6,
      });

    this.add
      .text(32, height / 1.58, `Obscales Jumped:`, {
        fontFamily: "Impact",
        fontSize: 22,
        color: "#ffff00",
        stroke: "#000",
        strokeThickness: 6,
      });

    this.events.once('obstaclesJumpedPointsAdded', () => {
      const nextButton = this.add
        .image(width / 2, height / 1.15, "next-button")
        .setInteractive()
        .setScale(1);

      nextButton.on("pointerover", () => nextButton.setScale(1.1));
      nextButton.on("pointerout", () => nextButton.setScale(1));

      nextButton.on("pointerdown", () => {
        this.scene.start("SurfScene", {
          level: this.level + 1,
          score: this.score
        });
      });
    });
  }
}
