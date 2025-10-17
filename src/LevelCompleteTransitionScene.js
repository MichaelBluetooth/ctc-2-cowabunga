export default class LevelCompleteTransitionScene extends Phaser.Scene {
  constructor() {
    super("LevelCompleteTransitionScene");
  }

  init(data) {
    // Receive info from SurfScene
    this.startX = data.x || this.scale.width / 2;
    this.startY = data.y || this.scale.height / 2;
    this.level = data.level || 1;
    this.score = data.score || 0;
    this.scrollY = data.scrollY || 0;
    this.nextScene = data.nextScene || 'SurfScene';
  }

  preload() {
    this.load.image("shore-bg", "/assets/content/background.png");
    this.load.image("player", "/assets/content/player.png");
    this.load.image("beach", "/assets/content/beach.png");
  }

  create() {
    const { width, height } = this.scale;

    // 🏖️ Add scrolling background
    this.bg = this.add.tileSprite(0, 0, width, height, 'shore-bg');
    this.bg.setOrigin(0, 0);
    this.bg.tilePositionY = this.scrollY;

    // 🏄 Add player at last known position
    this.player = this.physics.add.sprite(this.startX, this.startY, "player");
    this.player.setDepth(10);
    this.player.setScale(1);

    // Disable controls by not attaching input handlers
    this.physics.world.gravity.y = 0;

    // Apply constant downward velocity
    this.player.setVelocityY(300);

    // Optional surf animation (tiny side-to-side wobble)
    this.tweens.add({
      targets: this.player,
      x: { from: this.startX - 20, to: this.startX + 20 },
      yoyo: true,
      repeat: -1,
      duration: 300,
      ease: "Sine.inOut",
    });

    // Fade in
    // this.cameras.main.fadeIn(500, 0, 0, 0);

    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontFamily: "Arial",
      fontSize: 75,
      color: "#ffff66",
      stroke: "#000000",
      strokeThickness: 3,
    }).setDepth(1);

    // 🏄 Level display (just under the score)
    this.levelText = this.add.text(10, 100, `Level: ${this.level}`, {
      fontFamily: "Arial",
      fontSize: 75,
      color: "#ffff66",
      stroke: "#000000",
      strokeThickness: 3,
    }).setDepth(1);


    const beach = this.add.image(width, height, 'beach');
    beach.x = width / 2;

    this.tweens.add({
      targets: beach,
      y: height - 325,
      duration: 1500,
      ease: 'Sine.easeOut',
      delay: 350,
      onComplete: () => {
        //beach finished moving
      }
    });
  }

  update(time, delta) {
    // Scroll the background upward to simulate forward motion
    // this.bg.tilePositionY += 2;

    // Once player is off-screen, go to next scene
    if (this.player.y > this.scale.height + 100) {
      this.time.delayedCall(500, () => {
        this.physics.pause();
        this.cameras.main.resetFX(); // clears fade/tint effects
        this.time.removeAllEvents();
        this.cameras.main.once("camerafadeoutcomplete", () => {
          if (this.level < 5) {
            this.scene.start("LevelCompleteScene", {
              level: this.level,
              score: this.score,
            });
          } else {
            this.scene.start("GameCompleteScene", { score: this.score });
          }
        });
        this.cameras.main.fadeOut(500, 0, 0, 0);
      });
    }
  }
}
