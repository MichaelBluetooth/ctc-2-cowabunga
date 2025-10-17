import { getDimensions } from './utils';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    // Load any assets used on the title screen
    this.load.image("title-bg", "assets/content/title-bg.png");
    this.load.image("play-button", "assets/content/play-button.png");
  }

  create() {
    const dim = getDimensions();
    const { width, height } = this.scale;

    // 🏖️ Background
    this.add.image(width / 2, height / 2, "title-bg").setOrigin(0.5);

    // 🎮 Play button
    const playButton = this.add
      .image(width / 2, height / 1.4, "play-button")
      .setInteractive()
      .setScale(.8);

    // Add hover feedback (optional)
    playButton.on("pointerover", () => playButton.setScale(.9));
    playButton.on("pointerout", () => playButton.setScale(.8));

    // Start the game
    playButton.on("pointerdown", () => {
      this.startGame();
    });

    // 🐄 Optional: “Press Space to Start”
    this.input.keyboard.on("keydown-SPACE", () => {
      this.startGame();
    });
  }

  startGame() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("SurfScene", { score: 0, level: 1 });
    });
  }
}
