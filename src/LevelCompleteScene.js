export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super("LevelCompleteScene");
  }

  init(data) {
    this.score = data.score;
    this.level = data.level;
  }

  preload() {
    this.load.image("level-bg", "assets/content/level-complete-bg.png");
    this.load.image("next-button", "assets/content/next-button.png");
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(0, 0, "level-bg").setOrigin(0);
    bg.displayWidth = width;
    bg.displayHeight = height;

    this.add
      .text(width / 2, height / 1.4, `Score: ${this.score}`, {
        fontFamily: "Impact",
        fontSize: 75,
        color: "#ffff00",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    const nextButton = this.add
      .image(width / 2, height / 1.2, "next-button")
      .setInteractive()
      .setScale(1.5);

    nextButton.on("pointerover", () => nextButton.setScale(1.6));
    nextButton.on("pointerout", () => nextButton.setScale(1.5));

    nextButton.on("pointerdown", () => {
      this.scene.start("SurfScene", {
        level: this.level + 1,
        totalScore: this.score,
      });
    });
  }
}
