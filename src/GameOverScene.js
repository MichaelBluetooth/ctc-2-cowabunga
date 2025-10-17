export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        // Receive the final score from SurfScene
        this.finalScore = data.score || 0;
    }

    preload() {
        this.load.image("gameover-bg", "assets/content/gameover-bg.png");
        this.load.image("retry-button", "assets/content/retry-button.png");
    }

    create() {
        const { width, height } = this.scale;

        // 🌅 Background
        this.add.image(width / 2, height / 2, "gameover-bg").setOrigin(0.5);

        // 🧮 Show score
        this.add
            .text(width / 2, 300, `Final Score: ${this.finalScore}`, {
                fontFamily: "Impact",
                fontSize: 36,
                color: "#ffff00",
                stroke: "#000",
                strokeThickness: 6,
            })
            .setOrigin(0.5);

        // 🔁 Retry button
        const retryButton = this.add
            .image(width / 2, height / 1.3, "retry-button")
            .setInteractive()
            .setScale(.8);

        retryButton.on("pointerover", () => retryButton.setScale(.9));
        retryButton.on("pointerout", () => retryButton.setScale(.8));

        retryButton.on("pointerdown", () => {
            this.scene.stop('SurfScene');
            this.scene.start("TitleScene", { score: 0, level: 1 });
        });        

        this.input.keyboard.on("keydown-T", () => {
            this.scene.stop('SurfScene');
            this.scene.start("TitleScene", { score: 0, level: 1 });
        });
    }
}
