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

    this.add.image(width / 2, height / 2, "level-bg").setOrigin(0.5);

    this.add
      .text(width / 2, 340, `Score: ${this.score}`, {
        fontFamily: "Impact",
        fontSize: 36,
        color: "#ffff00",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    const nextButton = this.add
      .image(width / 2, height / 1.3, "next-button")
      .setInteractive()
      .setScale(.8);

    nextButton.on("pointerover", () => nextButton.setScale(.9));
    nextButton.on("pointerout", () => nextButton.setScale(.8));

    nextButton.on("pointerdown", () => {
      this.scene.start("SurfScene", {
        level: this.level + 1,
        totalScore: this.score,
      });
    });
  }
}
