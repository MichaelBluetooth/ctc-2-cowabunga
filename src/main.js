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

const GAME_HEIGHT = 915;
const GAME_WIDTH = 412;

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#00bfff",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [TitleScene, SurfScene, GameOverScene, LevelCompleteScene, GameCompleteScene, LevelCompleteTransitionScene],
};

new Phaser.Game(config);
