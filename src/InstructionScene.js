import { SettingsManager } from "./SettingsManager";

export default class InstructionScene extends Phaser.Scene {
  constructor() {
    super("InstructionScene");
  }

  preload() {
    this.load.image("how-to-play-bg", "assets/content/how-to-play-bg.png");
    this.load.image("jump", "assets/content/jump.png");
    this.load.image("hold-flat", "assets/content/hold-flat.png");
    this.load.image("tilt", "assets/content/tilt.png");
    this.load.image("cow1", "assets/content/bonus_points/surfing_cow_2.png");
    this.load.image("cow2", "assets/content/bonus_points/lazy_cow_3.png");
    this.load.image("obstacle1", "assets/content/obstacles/buoy.png");
    this.load.image("obstacle2", "assets/content/obstacles/chad_surfer_3.png");
    this.load.image("obstacle3", "assets/content/obstacles/lazy_person_3.png");
    this.load.image("play-button", "assets/content/play-button.png");
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(0, 0, "how-to-play-bg").setOrigin(0);
    bg.displayWidth = this.scale.width;
    bg.displayHeight = this.scale.height;

    const playButton = this.add
      .image(width / 2, height / 1.2, "play-button")
      .setInteractive()
      .setScale(1);

    playButton.on("pointerover", () => playButton.setScale(1.1));
    playButton.on("pointerout", () => playButton.setScale(1));

    // Start the game
    playButton.on("pointerdown", () => {
      this.startGame();
    });

    this.add.text(width / 2, 170, "Hold you phone FLAT", {
      fontFamily: "Impact",
      fontSize: 25,
      color: "#ffff00",
      stroke: "#000",
      strokeThickness: 6,
    }).setOrigin(.5);
    this.add.image(width / 2, 230, 'hold-flat').setOrigin(.5).setScale(.8);
    this.add.image(width / 4, 320, 'tilt').setScale(.8);
    this.add.image(width / 1.32, 320, 'jump').setScale(.8);

    this.add.text(width / 2, 400, "Evade Obstacles", {
      fontFamily: "Impact",
      fontSize: 25,
      color: "#ffff00",
      stroke: "#000",
      strokeThickness: 6,
    }).setOrigin(.5);

    this.add.image(width / 2, 460, 'obstacle1').setOrigin(.5).setScale(.5);
    this.add.image(width / 4, 460, 'obstacle2').setScale(.5);
    this.add.image(width / 1.32, 460, 'obstacle3').setScale(.5);

    this.add.text(width / 2, 540, "Catch the Cows", {
      fontFamily: "Impact",
      fontSize: 25,
      color: "#ffff00",
      stroke: "#000",
      strokeThickness: 6,
    }).setOrigin(.5);

    this.add.image(width / 3, 600, 'cow1').setScale(.5);
    this.add.image(width / 1.58, 600, 'cow2').setScale(.5);

    SettingsManager.howToPlayViewed(true);
  }

  startGame() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("SurfScene", { score: 0, level: 1 });
    });
  }
}
