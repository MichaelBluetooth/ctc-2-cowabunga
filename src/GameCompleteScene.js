export default class GameCompleteScene extends Phaser.Scene {
    constructor() {
        super("GameCompleteScene");
    }

    init(data) {
        // Receive the final score from SurfScene
        this.finalScore = data.score || 0;
    }

    preload() {
        this.load.image("gamecomplete-bg", "/assets/content/gamecomplete-bg.png");
        this.load.image("retry-button", "/assets/content/play-button.png");
    }

    create() {
        const { width, height } = this.scale;

        // 🌅 Background
        const bg = this.add.image(0, 0, "gamecomplete-bg").setOrigin(0);
        bg.displayWidth = this.scale.width;
        bg.displayHeight = this.scale.height;

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
            this.scene.start("TitleScene");
        });

        this.input.keyboard.on("keydown-T", () => {
            this.scene.start("TitleScene");
        });
    }
}
