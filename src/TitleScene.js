import { SettingsManager } from "./SettingsManager";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("title-bg", "assets/content/title-bg.png");
    this.load.image("play-button", "assets/content/play-button.png");
    this.load.image("enable-music-button", "assets/content/enable-music-button.png");
    this.load.image("disable-music-button", "assets/content/disable-music-button.png");

    this.load.audio('bgMusic', 'assets/content/Totally_Tubular_Vibes.mp3');
  }

  create() {
    if (!this.game.globals) {
      this.game.globals = {};
      this.game.globals.tiltAvailable = false;
    }

    const initialSettings = SettingsManager.loadSettings();

    if (!this.game.globals.music) {
      this.game.globals.music = this.sound.add('bgMusic', { loop: true, volume: 0.5 });

      this.game.globals.music.play();
      if (!initialSettings.musicEnabled) {
        this.game.globals.music.pause();
      }
    }

    this.game.events.on(Phaser.Core.Events.BLUR, () => {
      this.game.globals.music.pause();
    });
    this.game.events.on(Phaser.Core.Events.FOCUS, () => {
      const settings = SettingsManager.loadSettings();
      if (settings.musicEnabled) {
        this.game.globals.music.play();
      }
    });

    //handles some events where user rapidly switches apps
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.game.globals.music.pause();
      } else {
        const settings = SettingsManager.loadSettings();
        if (settings.musicEnabled) {
          this.game.globals.music.play();
        }
      }
    });

    const { width, height } = this.scale;

    // 🏖️ Background
    const bg = this.add.image(0, 0, "title-bg").setOrigin(0);
    bg.displayWidth = this.scale.width;
    bg.displayHeight = this.scale.height;

    const playButton = this.add
      .image(width / 2, height / 1.2, "play-button")
      .setInteractive()
      .setScale(1);


    const musicButtonScale = .30
    const musicButton = this.add
      .image(width - 35, 35, initialSettings.musicEnabled ? "enable-music-button" : "disable-music-button")
      .setInteractive()
      .setScale(musicButtonScale);

    musicButton.on('pointerdown', () => {
      const musicEnabled = SettingsManager.toggleMusic();
      if (musicEnabled) {
        musicButton.setTexture("enable-music-button").setScale(musicButtonScale);
        this.game.globals.music.resume();
      } else {
        musicButton.setTexture("disable-music-button").setScale(musicButtonScale);
        this.game.globals.music.pause();
      }
    });

    // Add hover feedback (optional)
    playButton.on("pointerover", () => playButton.setScale(1.1));
    playButton.on("pointerout", () => playButton.setScale(1));
    musicButton.on("pointerover", () => musicButton.setScale(musicButtonScale + .1));
    musicButton.on("pointerout", () => musicButton.setScale(musicButtonScale));

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


    this.setupMotionControls();
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

  setupMotionControls() {
    // Check for API availability
    if (typeof DeviceOrientationEvent === "undefined") {
      alert("DeviceOrientationEvent not supported.");
      return;
    }

    // iOS 13+ requires explicit permission
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      const permissionBtn = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Enable Motion Controls",
        { fontSize: "24px", color: "#fff", backgroundColor: "#000", padding: 10 }
      ).setOrigin(0.5).setInteractive();

      permissionBtn.on("pointerdown", async () => {
        try {
          const response = await DeviceOrientationEvent.requestPermission();
          if (response === "granted") {
            permissionBtn.destroy();
            this.activateTiltListener();
          } else {
            console.warn("Motion access denied.");
          }
        } catch (err) {
          console.error("Error requesting permission:", err);
        }
      });
    } else {
      // Android or older iOS — directly activate
      this.activateTiltListener();
    }
  }

  activateTiltListener() {
    this.game.globals.tiltAvailable = true;
    console.log("✅ Motion controls enabled!");
  }
}
