export class ProgressBar {
  constructor(scene, x, y, width, height, color = 0x00ff00) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Background
    this.bg = scene.add.rectangle(x, y, width, height, 0x333333).setOrigin(0, 0.5).setDepth(1000);

    // Fill bar
    this.bar = scene.add.rectangle(x, y, 0, height, color).setOrigin(0, 0.5).setDepth(1000);
  }

  setProgress(percent) {
    // Clamp between 0 and 1
    percent = Phaser.Math.Clamp(percent, 0, 1);
    this.bar.width = this.width * percent;
  }
}