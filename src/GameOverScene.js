export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        // Receive the final score from SurfScene
        this.finalScore = data.score || 0;
    }

    preload() {
        this.load.image("gameover-bg", "/assets/content/gameover-bg.png");
        this.load.image("retry-button", "/assets/content/retry-button.png");
    }

    create() {
        const { width, height } = this.scale;

        // 🌅 Background
        const bg = this.add.image(0, 0, "gameover-bg").setOrigin(0);
        bg.displayWidth = width;
        bg.displayHeight = height;

        // 🧮 Show score
        this.add
            .text(width / 2, height / 1.4, `Score: ${this.finalScore}`, {
                fontFamily: "Impact",
                fontSize: 75,
                color: "#ffff00",
                stroke: "#000",
                strokeThickness: 6,
            })
            .setOrigin(0.5);


        const retryButton = this.add
            .image(width / 2, height / 1.2, "retry-button")
            .setInteractive()
            .setScale(1.5);

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
