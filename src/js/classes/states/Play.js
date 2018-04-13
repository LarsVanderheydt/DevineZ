import Player from '../objects/player';
import BasicEnemyGroup from '../objects/BasicEnemyGroup';
import StrongEnemyGroup from '../objects/StrongEnemyGroup';
import FastEnemyGroup from '../objects/FastEnemyGroup';
import Bullets from '../objects/BulletGroup';
import pauseMenu from '../objects/pauseMenu';

const PLAYER_SPEED = 300;
const BULLET_SPEED = 700;
const PLAYER_HIT_ANIM_DURATION = 1000;
const POWERUP_DURATION = 3000;
const BASICENEMYDAMAGE = 10;
const STRONGENEMYDAMAGE = 20;

let SHOT_DELAY;
let GUN;
let DURATION;

const POWERUPS = [`healthDrop`, `handgun`, `shotgun`, `rifle`, `bomb`];

export default class Play extends Phaser.State {

  init(mute) {
    this.mute = mute;
    GUN = `handgun`;
    DURATION = 0;
    SHOT_DELAY = 300;
    this.physics.arcade.isPaused = false;
  }

  create() {
    this.add.sprite(0, 0, `bg`);
    this.addAudio();
    this.createInput();
    this.enemySetup();
    this.scoreSetup();
    this.bulletSetup();
    this.playerSetup();
    this.createPauseButton();
    this.startGeneratingPowerUps();
    this.displayCurrentGun();
    this.startDurationTimer();
  }

  displayCurrentGun() {
    const gunTextStyle = {font: `30px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
    this.gunText = this.add.text(50, this.game.height - 50, `CURRENTLY USING: `, gunTextStyle);
    this.gunText.anchor.setTo(0, 0.5);
    this.currentGun = this.add.sprite(375, this.game.height - 50, `${GUN}Drop`);
    this.currentGun.anchor.setTo(0, 0.5);
    this.currentGun.width = this.currentGun.width * 1.3;
    this.currentGun.height = this.currentGun.height * 1.3;
  }

  addAudio() {
    this.backgroundMusic = this.add.audio(`backgroundMusic`);
    this.zombieMoans = this.add.audio(`zombieMoans`);
    this.shotSound = this.add.sound(`shoot`);
    this.healthCollectAudio = this.add.sound(`healthCollectAudio`);
    this.gunCollect = this.add.sound(`gunCollect`);
    this.explosion = this.add.sound(`explosion`);
    if (!this.mute) {
      this.playAudio();
    }
  }

  playAudio() {
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.play();
    this.backgroundMusic.loopFull();
    this.zombieMoans.play();
    this.zombieMoans.loopFull();
    this.shotSound.volume = 0.3;
    this.gunCollect.volume = 0.7;
    this.explosion.volume = 0.7;
  }

  createPauseButton() {
    this.pauseButton = this.game.add.text(this.game.width - 75, 125, `Pauze`, {font: `20px aLoveOfThunder`, fill: `#ffffff`, align: `center`});
    this.pauseButton.inputEnabled = true;
    this.pauseButton.anchor.setTo(1, 0.5);
    this.pauseButton.events.onInputUp.add(this.pauseButtonPressed, this);
  }

  pauseButtonPressed() {
    if (this.physics.arcade.isPaused) {
      this.play();
    } else {
      this.pause();
    }
  }

  pause() {
    this.pauseMenu = new pauseMenu(this);
    this.add.existing(this.pauseMenu);
    this.physics.arcade.isPaused = true;
    this.powerupGenerator.timer.pause();
    this.durationTimer.timer.pause();

    this.pauseButton.setText(`Resume`);
    if (!this.mute) {
      this.zombieMoans.pause();
    }
    this.player.pauseAnimation();
  }

  play() {
    this.physics.arcade.isPaused = false;
    this.powerupGenerator.timer.resume();
    this.durationTimer.timer.resume();

    this.pauseMenu.remove();

    this.pauseButton.setText(`Pause`);
    if (!this.mute) {
      this.zombieMoans.resume();
    }
    this.player.resumeAnimation();
  }

  bulletSetup() {
    this.bulletPool = new Bullets(this.game, this.bullets);
    this.nextShotAt = 0;
  }

  enemySetup() {
    this.enemyLevel = 500;
    this.groupFinished = this.enemyLevel;
    this.wave = 3;
    this.strongWave = 1;
    this.basicEnemyGroup = new BasicEnemyGroup(this.game, this.basicEnemyGroup, this.enemyLevel, this.player);
    this.strongEnemyGroup = new StrongEnemyGroup(this.game, this.strongEnemyGroup, this.enemyLevel, this.player);
    this.fastEnemyGroup = new FastEnemyGroup(this.game, this.fastEnemyGroup, this.enemyLevel, this.player);
  }

  playerSetup() {
    this.player = new Player(this.game, 640, 550, 25);
    this.add.existing(this.player);
    this.player.healthSetup();
    this.player.animations.play(`walk`);
    this.playerHitAnimDuration = PLAYER_HIT_ANIM_DURATION;
  }

  scoreSetup() {
    this.score = 0;
    const scoreTextStyle = {font: `40px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
    const scoreTextNumberStyle = {font: `40px aLoveOfThunder`, fill: `#c51616`, align: `center`};
    this.scoreText = this.add.text(80, 50, `SCORE: `, scoreTextStyle);
    this.scoreTextNumber = this.add.text(230, 50, this.score, scoreTextNumberStyle);
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.KeyCode.Z,
      upQwerty: Phaser.KeyCode.W,
      down: Phaser.KeyCode.S,
      left: Phaser.KeyCode.Q,
      leftQwerty: Phaser.KeyCode.A,
      right: Phaser.KeyCode.D,
      pause: Phaser.KeyCode.P
    });
  }

  startGeneratingPowerUps() {
    this.powerupGenerator = this.time.events.loop(Phaser.Timer.SECOND * 6, this.createPowerUps, this);
    this.powerupGenerator.timer.start();
  }

  createPowerUps() {
    const random = this.rnd.integerInRange(0, 4);
    const powerUp = POWERUPS[random];

    switch (powerUp) {
    case `healthDrop`:
      this.createHealthDrop();
      break;
    case `handgun`:
      this.createHandgunDrop();
      break;
    case `shotgun`:
      this.createShotgunDrop();
      break;
    case `rifle`:
      this.createRifleDrop();
      break;
    case `bomb`:
      this.createBombDrop();
      break;
    default:
      break;
    }
  }

  createHealthDrop() {
    this.healthDrop = this.add.sprite(this.rnd.integerInRange(100, this.game.width - 100), this.rnd.integerInRange(100, this.game.height - 100), `healthDrop`);
    this.game.physics.arcade.enableBody(this.healthDrop);
    this.healthDrop.width = 50;
    this.healthDrop.height = 50;
    this.time.events.add(POWERUP_DURATION, () => {
      this.powerUpReset(this.healthDrop);
    }, this);
  }

  createHandgunDrop() {
    this.handgunDrop = this.add.sprite(this.rnd.integerInRange(100, this.game.width - 100), this.rnd.integerInRange(100, this.game.height - 100), `handgunDrop`);
    this.game.physics.arcade.enableBody(this.handgunDrop);
    this.time.events.add(POWERUP_DURATION, () => {
      this.powerUpReset(this.handgunDrop);
    }, this);
  }

  createShotgunDrop() {
    this.shotgunDrop = this.add.sprite(this.rnd.integerInRange(100, this.game.width - 100), this.rnd.integerInRange(100, this.game.height - 100), `shotgunDrop`);
    this.game.physics.arcade.enableBody(this.shotgunDrop);
    this.time.events.add(POWERUP_DURATION, () => {
      this.powerUpReset(this.shotgunDrop);
    }, this);
  }

  createRifleDrop() {
    this.rifleDrop = this.add.sprite(this.rnd.integerInRange(100, this.game.width - 100), this.rnd.integerInRange(100, this.game.height - 100), `rifleDrop`);
    this.game.physics.arcade.enableBody(this.rifleDrop);
    this.time.events.add(POWERUP_DURATION, () => {
      this.powerUpReset(this.rifleDrop);
    }, this);
  }

  createBombDrop() {
    this.bombDrop = this.add.sprite(this.rnd.integerInRange(100, this.game.width - 100), this.rnd.integerInRange(100, this.game.height - 100), `bomb`);
    this.bombDrop.width = 50;
    this.bombDrop.height = 50;
    this.game.physics.arcade.enableBody(this.bombDrop);
    this.time.events.add(POWERUP_DURATION, () => {
      this.powerUpReset(this.bombDrop);
    }, this);
  }

  powerUpReset(powerUp) {
    powerUp.kill();
  }

  startDurationTimer() {
    this.durationTimer = this.time.events.loop(Phaser.Timer.SECOND, this.updateDuration, this);
  }

  updateDuration() {
    DURATION ++;
  }

  update() {
    this.inputControl();
    // this.displayCurrentGun();
    this.player.healthUpdate();
    this.collisionHandling();
    this.basicEnemyGroup.enemyFollow(this.player);
    this.strongEnemyGroup.enemyFollow(this.player);
    this.fastEnemyGroup.enemyFollow(this.player);

    // first check if the player is alive so no enemies spawn when you`re dead
    // if the score == wave then multiply the wave by a random nr of 0 - 5
    if (this.player.alive === true) {
      if (this.score === (Math.floor(this.wave)) * 3) {
        this.wave += Math.floor(Math.random() * 3);
        this.strongWave += 1;
      } else {
        this.enemySpawnHandler();
      }
    }
    // if the player is hit, after 1 second set the alpha at 1 again
    if (this.player.alpha === 0.5) {
      this.time.events.add(this.playerHitAnimDuration, this.alphaPlayerReset, this);
    }

    // if player should reach the end of the first group, make another group so the game is really endless
    if (this.basicEnemyGroup.countLiving === this.groupFinished) {
      new BasicEnemyGroup(this.game, this.basicEnemyGroup, this.enemyLevel, this.player);
      this.groupFinished += this.enemyLevel;
    }
    if (this.strongEnemyGroup.countLiving === this.groupFinished) {
      new StrongEnemyGroup(this.game, this.strongEnemyGroup, this.enemyLevel, this.player);
      this.groupFinished += this.enemyLevel;
    }
    if (this.fastEnemyGroup.countLiving === this.groupFinished) {
      new FastEnemyGroup(this.game, this.fastEnemyGroup, this.enemyLevel, this.player);
      this.groupFinished += this.enemyLevel;
    }
  }

  alphaPlayerReset() {
    this.player.alpha = 1;
    this.player.body.checkCollision.none = false;
  }

  collisionHandling() {
    this.physics.arcade.collide(this.bulletPool, this.basicEnemyGroup, this.enemyHit, null, this);
    this.physics.arcade.collide(this.bulletPool, this.strongEnemyGroup, this.enemyHit, null, this);
    this.physics.arcade.collide(this.bulletPool, this.fastEnemyGroup, this.enemyHit, null, this);
    this.physics.arcade.collide(this.player, this.basicEnemyGroup, this.playerHit, null, this);
    this.physics.arcade.collide(this.player, this.strongEnemyGroup, this.playerHit, null, this);
    this.physics.arcade.collide(this.player, this.fastEnemyGroup, this.playerHit, null, this);
    this.physics.arcade.collide(this.player, this.healthDrop, this.healthCollect, null, this);
    this.physics.arcade.collide(this.player, this.handgunDrop, this.handgunCollect, null, this);
    this.physics.arcade.collide(this.player, this.shotgunDrop, this.shotgunCollect, null, this);
    this.physics.arcade.collide(this.player, this.rifleDrop, this.rifleCollect, null, this);
    this.physics.arcade.collide(this.player, this.bombDrop, this.bombCollect, null, this);
  }

  enemySpawnHandler() {
    // if there are less enemies then the wave counts then spawn enemies
    // so no more enemies can spawn than the wave counts
    if (this.basicEnemyGroup.countLiving() !== Math.floor(this.wave)) {
      this.basicEnemyGroup.enemySpawn(this.player, this.score);
    }
    if (this.strongEnemyGroup.countLiving() !== Math.floor(this.strongWave)) {
      this.strongEnemyGroup.enemySpawn(this.player, this.score);
    }
    if (this.fastEnemyGroup.countLiving() !== Math.floor(this.strongWave)) {
      this.fastEnemyGroup.enemySpawn(this.player, this.score);
    }
  }

  playerHit(player, enemy) {
    if (enemy.key === `enemy2`) {
      player.damage(STRONGENEMYDAMAGE);
    } else {
      player.damage(BASICENEMYDAMAGE);
    }
    this.player.alpha = 0.5;
    this.player.body.checkCollision.none = true;
    if (!this.player.alive) {
      this.gameOver();
    }
    enemy.kill();
  }

  enemyHit(bullet, enemy) {
    bullet.kill();
    enemy.damage(1);
    // score only updates if enemy is death
    if (enemy.alive === false) {
      this .score ++;
      this.scoreTextNumber.setText(this.score);
    }
  }

  healthCollect() {
    this.healthDrop.kill();
    if (this.player.health < 100) {
      this.player.damage(- 10);
    }
    if (!this.mute) {
      this.healthCollectAudio.play();
    }
  }

  handgunCollect() {
    this.handgunDrop.kill();
    SHOT_DELAY = 300;
    GUN = `handgun`;
    this.currentGun.kill();
    this.displayCurrentGun();
    if (!this.mute) {
      this.gunCollect.play();
    }
  }

  shotgunCollect() {
    this.shotgunDrop.kill();
    SHOT_DELAY = 500;
    GUN = `shotgun`;
    this.currentGun.kill();
    this.displayCurrentGun();
    if (!this.mute) {
      this.gunCollect.play();
    }
  }

  rifleCollect() {
    this.rifleDrop.kill();
    SHOT_DELAY = 100;
    GUN = `rifle`;
    this.currentGun.kill();
    this.displayCurrentGun();
    if (!this.mute) {
      this.gunCollect.play();
    }
  }

  bombCollect() {
    this.explosion.play();
    this.bombDrop.kill();
    this.basicEnemyGroup.forEach(enemy => {
      enemy.kill();
    });
    this.strongEnemyGroup.forEach(enemy => {
      enemy.kill();
    });
    this.fastEnemyGroup.forEach(enemy => {
      enemy.kill();
    });
  }

  fire() {
    if (this.nextShotAt > this.time.now) return;
    if (this.bulletPool.countDead() === 0) return;

    this.nextShotAt = this.time.now + SHOT_DELAY;

    if (GUN === `shotgun`) {
      for (let i = - 1;i < 2;i ++) {
        const bullet = this.bulletPool.getFirstExists(false);
        this.player.animations.play(`shoot`);
        bullet.reset(this.player.x, this.player.y);

        bullet.rotation = this.physics.arcade.moveToPointer(bullet, BULLET_SPEED) + 100 * i;
      }
    } else {
      const bullet = this.bulletPool.getFirstExists(false);
      this.player.animations.play(`shoot`);
      bullet.reset(this.player.x, this.player.y);

      bullet.rotation = this.physics.arcade.moveToPointer(bullet, BULLET_SPEED);
    }

    if (!this.mute) {
      this.shotSound.play();
    }
  }

  inputControl() {
    // player rotates to pointer
    this.player.rotation = this.physics.arcade.angleToPointer(this.player);
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.right.isDown || this.keys.right.isDown) {
      this.player.body.velocity.x += PLAYER_SPEED;
    }
    if (this.cursors.left.isDown || this.keys.left.isDown || this.keys.leftQwerty.isDown) {
      this.player.body.velocity.x -= PLAYER_SPEED;
    }
    if (this.cursors.down.isDown || this.keys.down.isDown) {
      this.player.body.velocity.y += PLAYER_SPEED;
    }
    if (this.cursors.up.isDown || this.keys.up.isDown || this.keys.upQwerty.isDown) {
      this.player.body.velocity.y -= PLAYER_SPEED;
    }
    if (this.keys.pause.downDuration(1)) {
      this.pauseButtonPressed();
    }
    if (this.input.activePointer.isDown) {
      if (!this.physics.arcade.isPaused) {
        this.fire();
      }
    } else {
      this.player.animations.play(`walk`);
    }
  }

  gameOver() {
    this.gameOverRemoveElements();
    if (!this.mute) {
      this.backgroundMusic.stop();
    }
    this.state.start(`Gameover`, true, false, this.score, DURATION, this.mute);
  }

  gameOverRemoveElements() {
    this.removeInput();
    this.basicEnemyGroup.destroy();
    this.strongEnemyGroup.destroy();
    this.fastEnemyGroup.destroy();
    this.bulletPool.destroy();
    this.scoreText.destroy();
    this.scoreTextNumber.destroy();
    this.pauseButton.destroy();
    this.player.removeHealthBar();
    this.powerupGenerator.timer.stop();
    this.durationTimer.timer.stop();
    if (!this.mute) {
      this.zombieMoans.stop();
    }
  }

  removeInput() {
    this.game.input.keyboard.removeKey(Phaser.KeyCode.Z);
    this.game.input.keyboard.removeKey(Phaser.KeyCode.W);
    this.game.input.keyboard.removeKey(Phaser.KeyCode.S);
    this.game.input.keyboard.removeKey(Phaser.KeyCode.Q);
    this.game.input.keyboard.removeKey(Phaser.KeyCode.A);
    this.game.input.keyboard.removeKey(Phaser.KeyCode.D);
    this.game.input.keyboard.removeKey(Phaser.KeyCode.P);
  }

  render() {
    // this.game.debug.body(this.player);
    // this.basicEnemyGroup.forEach(enemy => {
    //   this.game.debug.body(enemy);
    // });
  }
}
