import Phaser from "phaser";
import TitleScene from "./TitleScene.js";
import SurfScene from "./SurfScene.js";
import GameOverScene from "./GameOverScene.js";
import GameCompleteScene from "./GameCompleteScene.js";
import LevelCompleteScene from "./LevelCompleteScene.js";
import LevelCompleteTransitionScene from './LevelCompleteTransitionScene.js'

const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 720,
    backgroundColor: "#00bfff",
    physics: {
        default: "arcade",
        arcade: { debug: false },
    },
    scene: [TitleScene, SurfScene, GameOverScene, LevelCompleteScene, GameCompleteScene, LevelCompleteTransitionScene],
};

new Phaser.Game(config);
