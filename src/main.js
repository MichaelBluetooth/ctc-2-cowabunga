import Phaser from "phaser";
import TitleScene from "./TitleScene.js";
import SurfScene from "./SurfScene.js";
import GameOverScene from "./GameOverScene.js";
import GameCompleteScene from "./GameCompleteScene.js";
import LevelCompleteScene from "./LevelCompleteScene.js";
import LevelCompleteTransitionScene from './LevelCompleteTransitionScene.js'

window.addEventListener("orientationchange", () => {
    if (window.orientation === 90 || window.orientation === -90) {
        // Landscape
        document.getElementById("rotateOverlay").style.display = "flex";
    } else {
        document.getElementById("rotateOverlay").style.display = "none";
    }
});

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,   // <– dynamically match window size
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    backgroundColor: "#00bfff",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    scene: [TitleScene, SurfScene, GameOverScene, LevelCompleteScene, GameCompleteScene, LevelCompleteTransitionScene],
};

new Phaser.Game(config);
