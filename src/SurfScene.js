import { BONUS_POINTS, BONUS_POINTS_DOWN, BONUS_POINTS_UP, OBSTACLES, OBSTACLES_DOWN, OBSTACLES_UP } from "./Assets";

export default class SurfScene extends Phaser.Scene {
    constructor() {
        super("SurfScene");
    }

    init(data) {
        this.level = data.level || 1;
        this.score = data.score || 0;
        this.totalScore = data.totalScore || 0;

        this.levelCompleteTriggered = false;
        this.allowSpriteSpawns = true;
    }

    preload() {
        for (const bonus of BONUS_POINTS) {
            this.load.image(bonus.name, bonus.file);
        }

        for (const obst of OBSTACLES) {
            this.load.image(obst.name, obst.file);
        }

        this.load.image("background", "assets/content/background.png");
        this.load.image("player", "assets/content/player.png");
        this.load.image("player_jump", "assets/content/player_jump.png");
        this.load.image("player_celebrate", "assets/content/player_celebrate.png");
    }

    create() {
        const { width, height } = this.scale;
        this.maxLevelScore = 750;
        this.scoreActive = true;
        this.allowMovement = true;
        this.bonusPointsValue = 250;

        if (this.game.globals.tiltAvailable) {
            window.addEventListener("deviceorientation", (event) => {
                // event.gamma is left/right tilt in degrees (-90 to +90)
                this.tiltX = event.gamma || 0;
                this.tiltY = event.beta || 0;
            });

            let lastX, lastY, lastZ;
            let lastUpdate = 0;
            let shakeThreshold = 15; // adjust for sensitivity
            let shakeCooldown = 1000; // minimum time between shakes in ms
            let lastShakeTime = 0;
            window.addEventListener('devicemotion', (event) => {
                const acceleration = event.accelerationIncludingGravity;

                if (!acceleration.x || !acceleration.y || !acceleration.z) return;

                const currentTime = Date.now();
                const deltaTime = currentTime - lastUpdate;

                if (deltaTime > 100) { // update roughly every 100ms
                    const deltaX = Math.abs(acceleration.x - (lastX || 0));
                    const deltaY = Math.abs(acceleration.y - (lastY || 0));
                    const deltaZ = Math.abs(acceleration.z - (lastZ || 0));

                    if ((deltaX + deltaY + deltaZ) > shakeThreshold) {
                        if (currentTime - lastShakeTime > shakeCooldown) {
                            lastShakeTime = currentTime;
                            this.startJump();
                        }
                    }

                    lastX = acceleration.x;
                    lastY = acceleration.y;
                    lastZ = acceleration.z;
                    lastUpdate = currentTime;
                }
            });
        }

        // Tilt setup
        this.tiltX = 0; // current tilt value
        this.tiltY = 0; // current tilt value
        this.smoothedTiltX = 0; // smoothed for stability
        this.smoothedTiltY = 0; // smoothed for stability

        // 🎚️ Level modifiers
        this.playerSpeedModifier = 1.5 + (this.level - 1) * 0.05;
        this.obstacleSpeedModifier = 1.5 + (this.level - 1) * 0.25;
        this.bonusPointsSpeedModifier = 1.5 + (this.level - 1) * 0.15;

        this.scoreText = this.add.text(10, 10, `Score: ${this.score + this.totalScore}`, {
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

        this.bg = this.add
            .tileSprite(0, 0, width, height, "background")
            .setOrigin(0)
            .setDepth(0)
            .setScrollFactor(0);

        // Player setup
        this.player = this.physics.add.sprite(width / 2, height * 0.2, "player");
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);
        this.player.setAngle(180); // facing downward
        this.player.setDepth(10);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Obstacles
        this.obstacles = this.physics.add.group();

        // Bonus Points
        this.bonusPoints = this.physics.add.group();

        // Spawn timer
        this.obstacleSpawnTimer = this.time.addEvent({
            delay: 1200, //todo: how to make this delay somewhat random?
            callback: () => {
                if (this.allowSpriteSpawns) {
                    this.spawnObstacle();
                }
            },
            callbackScope: this,
            loop: true,
        });

        this.bonusPointsSpawnTimer = this.time.addEvent({
            delay: 1600, //todo: how to make this delay somewhat random?
            callback: () => {
                if (this.allowSpriteSpawns) {
                    this.spawnBonusPoints();
                }
            },
            callbackScope: this,
            loop: true,
        });

        // Use overlap instead of collider (prevents freezing)
        this.physics.add.overlap(
            this.player,
            this.obstacles,
            this.handleCollision,
            null,
            this
        );
        this.physics.add.overlap(
            this.player,
            this.bonusPoints,
            this.handlePointsCollision,
            null,
            this
        );

        // Jump state
        this.isJumping = false;
        this.jumpDuration = 1500;

        // UI
        this.score = 0;
        this.scoreText.setScrollFactor(0);

        this.gameOverText = this.add
            .text(width / 2, height / 2, "", {
                fontSize: "32px",
                fill: "#fff",
                fontFamily: "sans-serif",
            })
            .setOrigin(0.5);
    }

    spawnObstacle() {
        //Randomly decide direction: up or down
        const goingDown = Phaser.Math.Between(0, 1) === 1;

        const obstaclesBag = goingDown ? OBSTACLES_DOWN : OBSTACLES_UP;
        const obstacleName = obstaclesBag[Phaser.Math.Between(0, obstaclesBag.length - 1)].name;

        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const obstacle = this.obstacles.create(x, -50, obstacleName);

        //Base speed and direction
        const baseSpeed = Phaser.Math.Between(150, 250) * this.obstacleSpeedModifier;
        const velocityY = goingDown ? baseSpeed : -baseSpeed;

        // Adjust spawn position based on direction
        obstacle.y = goingDown ? -50 : this.scale.height + 50;

        obstacle.setVelocityY(velocityY);
        obstacle.setScale(1);
        // obstacle.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));
        obstacle.setDepth(1);

        obstacle.isGoingDown = goingDown;
    }

    spawnBonusPoints() {
        //Randomly decide direction: up or down                
        const goingDown = Phaser.Math.Between(0, 1) === 1;

        const bonusBag = goingDown ? BONUS_POINTS_DOWN : BONUS_POINTS_UP;
        const bonusPtsName = bonusBag[Phaser.Math.Between(0, bonusBag.length - 1)].name;

        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const bonusPointsObj = this.bonusPoints.create(x, -50, bonusPtsName);

        //Base speed and direction
        const baseSpeed = Phaser.Math.Between(150, 250) * this.bonusPointsSpeedModifier;
        const velocityY = goingDown ? baseSpeed : -baseSpeed;

        // Adjust spawn position based on direction
        bonusPointsObj.y = goingDown ? -50 : this.scale.height + 50;

        bonusPointsObj.setVelocityY(velocityY);
        bonusPointsObj.setScale(1);
        // bonusPointsObj.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));
        bonusPointsObj.setDepth(1);

        bonusPointsObj.isGoingDown = goingDown;
    }

    handleCollision(player, obstacle) {
        if (this.isJumping) return; // ignore during jump

        this.scoreActive = false;
        this.allowMovement = false;
        this.physics.pause();
        player.setTint(0xff0000);
        this.gameOverText.setText("COWABUNGA! You wiped out!");
        this.time.delayedCall(2000, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("GameOverScene", { score: this.score + this.totalScore });
            });
        });
    }

    handlePointsCollision(player, bonusPointsObj) {
        if (this.isJumping) return; // ignore during jump

        this.bonusPoints.remove(bonusPointsObj, true, true);
        this.totalScore = this.totalScore + this.bonusPointsValue;
        player.setTexture("player_celebrate");
        this.time.delayedCall(350, () => {
            player.setTexture("player");
        });
    }

    update(time, delta) {
        const { width, height } = this.scale;

        // Background scroll — scaled by global speed
        this.bg.tilePositionY -= 2 * this.obstacleSpeedModifier;

        // Jump key
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && !this.isJumping) {
            this.startJump();
        }

        // Player movement (disabled during jump)
        if (!this.isJumping && this.allowMovement) {
            const speed = 200 * this.playerSpeedModifier;
            this.player.setVelocity(0);

            if (this.game.globals.tiltAvailable) {
                this.smoothedTiltX = Phaser.Math.Linear(this.smoothedTiltX, this.tiltX, 0.1);
                this.smoothedTiltY = Phaser.Math.Linear(this.smoothedTiltY, this.tiltY, 0.1);
                const tiltSensitivityX = 0.5; // adjust for feel
                const tiltSensitivityY = 0.3; // adjust for feel
                let moveX = this.smoothedTiltX * tiltSensitivityX;
                let moveY = this.smoothedTiltY * tiltSensitivityY;

                this.player.x += moveX * this.playerSpeedModifier;
                this.player.x = Phaser.Math.Clamp(this.player.x, 40, this.scale.width - 40);

                this.player.y += moveY * this.playerSpeedModifier;
                this.player.y = Phaser.Math.Clamp(this.player.y, 40, this.scale.height - 40);
            } else {
                if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
                else if (this.cursors.right.isDown) this.player.setVelocityX(speed);

                if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
                else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
            }
        }

        // Keep player in bounds
        this.player.y = Phaser.Math.Clamp(this.player.y, 0, height);

        // Subtle surf wobble (not during jump)
        if (!this.isJumping) {
            this.player.rotation = Math.sin(time / 300) * 0.1;
        }

        // Increment score
        if (this.scoreActive) {
            this.score += 1;
        }
        this.scoreText.setText(`Score: ${this.score + this.totalScore}`);

        this.levelText.setText(`Level: ${this.level}`);

        if (!this.levelCompleteTriggered && this.score >= this.maxLevelScore) {
            this.startLevelCompletion();
        }

        if (this.levelCompleteTriggered && this.obstacles.countActive(true) === 0 && this.bonusPoints.countActive(true) === 0) {
            this.finishLevel();
        }

        this.obstacles.children.each((obstacle) => {
            if (obstacle.active && (obstacle.y > this.scale.height + 50 || obstacle.y < -50)) {
                obstacle.destroy();
            }
        });

        this.bonusPoints.children.each((bonusObj) => {
            if (bonusObj.active && (bonusObj.y > this.scale.height + 50 || bonusObj.y < -50)) {
                bonusObj.destroy();
            }
        });
    }

    startJump() {
        this.isJumping = true;
        this.player.body.checkCollision.none = true; // disable collisions

        // Change sprite to jump pose
        this.player.setTexture("player_jump");

        // Stop movement
        this.player.setVelocity(0);

        // Tween for scaling (jump “arc”)
        this.tweens.add({
            targets: this.player,
            scale: 1.6,
            duration: this.jumpDuration / 2,
            yoyo: true,
            ease: "Sine.easeInOut",
            onComplete: () => {
                this.endJump();
            },
        });

        // Visual hop (up & down)
        this.tweens.add({
            targets: this.player,
            y: this.player.y - 50,
            duration: this.jumpDuration / 2,
            yoyo: true,
            ease: "Quad.easeOut",
        });
    }

    endJump() {
        this.isJumping = false;
        this.player.body.checkCollision.none = false;
        this.player.setTexture("player");
        this.player.setScale(1);
    }


    startLevelCompletion() {
        this.scoreActive = false;
        this.levelCompleteTriggered = true;
        this.allowSpriteSpawns = false;
        // Optional: play "surf off" music or animation
    }

    finishLevel() {
        console.log("All obstacles cleared, moving to next level!");

        // Clean up timers
        if (this.obstacleSpawnTimer) {
            this.obstacleSpawnTimer.remove();
        }

        if (this.bonusPointsSpawnTimer) {
            this.bonusPointsSpawnTimer.remove();
        }

        // Transition to LevelCompleteScene
        this.scene.start("LevelCompleteTransitionScene", {
            x: this.player.x,
            y: this.player.y,
            level: this.level,
            score: this.score + this.totalScore,
            scrollY: this.bg.tilePositionY
        });
    }
}