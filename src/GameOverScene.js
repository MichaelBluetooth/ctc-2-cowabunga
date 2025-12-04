import { POINTS } from "./Constants";
import { ScoreManager } from './ScoreManager';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        // Receive the final score from SurfScene
        this.score = data.score;
        this.progress = data.progress;
        this.cowsCaught = data.cowsCaught;
        this.objectsJumpedOver = data.objectsJumpedOver;
    }

    preload() {
        this.load.image("gameover-bg", "assets/content/gameover-bg.png");
        this.load.image("retry-button", "assets/content/retry-button.png");
    }

    updateScore(pts, eventName, evt = null) {
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
                    evt?.destroy();
                });
            },
        });
    }

    create() {
        const newScore = this.score + this.progress + (this.cowsCaught * POINTS.pointsPerCowCaught) + (this.objectsJumpedOver * POINTS.pointsPerJumpedObstacle);
        ScoreManager.addScore(newScore);

        const { width, height } = this.scale;

        const bg = this.add.image(0, 0, "gameover-bg").setOrigin(0);
        bg.displayWidth = width;
        bg.displayHeight = height;

        this.add
            .text(55, height / 1.8, `Level Progress:`, {
                fontFamily: "Impact",
                fontSize: 22,
                color: "#ffff00",
                stroke: "#000",
                strokeThickness: 6,
            });

        this.time.delayedCall(350, () => {
            this.add
                .text(235, height / 1.8, `${this.progress} of ${POINTS.levelCompletePoints}`, {
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
            this.updateScore(this.progress, 'levelCompletePointsAdded');
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
            const retryButton = this.add
                .image(width / 2, height / 1.15, "retry-button")
                .setInteractive()
                .setScale(1);

            retryButton.on("pointerover", () => retryButton.setScale(1.1));
            retryButton.on("pointerout", () => retryButton.setScale(1));

            retryButton.on("pointerdown", () => {
                this.scene.stop('SurfScene');
                this.scene.start("TitleScene");
            });
        });
    }
}
