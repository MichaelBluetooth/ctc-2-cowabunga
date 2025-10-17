export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    // Load any assets used on the title screen
    this.load.image("title-bg", "assets/content/title-bg.png");
    this.load.image("play-button", "assets/content/play-button.png");

    this.load.audio('bgMusic', 'assets/content/Totally_Tubular_Vibes.mp3');
  }

  create() {
    if (!this.game.globals) {
      this.game.globals = {}; // store global references
    }

    if (!this.game.globals.music) {
      this.game.globals.music = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
      this.game.globals.music.play();
    }

    const { width, height } = this.scale;

    // 🏖️ Background
    const bg = this.add.image(0, 0, "title-bg").setOrigin(0);
    bg.displayWidth = this.scale.width;
    bg.displayHeight = this.scale.height;

    // 🎮 Play button
    const playButton = this.add
      .image(width / 2, height / 1.15, "play-button")
      .setInteractive()
      .setScale(1.5);

    // Add hover feedback (optional)
    playButton.on("pointerover", () => playButton.setScale(1.6));
    playButton.on("pointerout", () => playButton.setScale(1.5));

    // Start the game
    playButton.on("pointerdown", () => {
      this.startGame();
    });

    // 🐄 Optional: “Press Space to Start”
    this.input.keyboard.on("keydown-SPACE", () => {
      this.startGame();
    });

    // Handle resizing
    this.scale.on('resize', this.resize, this);
    this.resize({ width: this.scale.width, height: this.scale.height });
  }

  startGame() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("SurfScene", { score: 0, level: 1 });
    });
  }

  resize(gameSize) {
    const { width, height } = gameSize;

    // Resize background
    if (this.background) {
      this.background.setSize(width, height);
    }
  }
}
