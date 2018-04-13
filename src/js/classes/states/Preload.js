export default class Preload extends Phaser.State {
  preload() {
    this.add.sprite(0, 0, `load-background`);
    this.loader = this.add.sprite(580, 350, `loader`);
    this.loader.animations.add(`load`);
    this.loader.animations.play(`load`, 9, true);

    const style = {font: `30px aLoveOfThunder`, fill: `#8d8d8d`, align: `center`};
    this.add.text(560, 290, `Loading...`, style);

    this.load.spritesheet(`player-handgun-shoot`, `assets/img/soldier_handgun_shoot.png`, 255, 215, 3);
    this.load.spritesheet(`enemy`, `assets/img/zombie_move.png`, 288, 311, 17);
    this.load.spritesheet(`enemy2`, `assets/img/zombie_group2_move.png`, 288, 311, 17);
    this.load.spritesheet(`enemy3`, `assets/img/zombie_group3_move.png`, 288, 311, 17);
    this.load.image(`bullet`, `assets/img/bullet.png`);
    this.load.image(`bomb`, `assets/img/bomb.png`);
    this.load.image(`bg`, `assets/img/devinez_bg.png`);
    this.load.image(`highscores_bg`, `assets/img/highscores_bg.png`);
    this.load.image(`instructions`, `assets/img/instructions.png`);
    this.load.image(`healthBar`, `assets/img/healthBar.png`);
    this.load.image(`healthBarFull`, `assets/img/healthBarFull.png`);
    this.load.image(`healthBarFrame`, `assets/img/healthBarFrame.png`);
    this.load.image(`healthDrop`, `assets/img/healthDrop.png`);
    this.load.image(`handgunDrop`, `assets/img/handgun.png`);
    this.load.image(`shotgunDrop`, `assets/img/shotgun.png`);
    this.load.image(`rifleDrop`, `assets/img/rifle.png`);
    this.load.image(`powerups`, `assets/img/powerups.png`, `assets/img/powerups.json`);
    this.load.audio(`shoot`, `assets/sound/shoot.wav`);
    this.load.audio(`backgroundMusic`, `assets/sound/POL-cyber-soldier-short.wav`);
    this.load.audio(`gameOverSong`, `assets/sound/funeral-march.mp3`);
    this.load.audio(`zombieMoans`, `assets/sound/zombie-moans.mp3`);
    this.load.audio(`gunCollect`, `assets/sound/gun_sound.mp3`);
    this.load.audio(`healthCollectAudio`, `assets/sound/collect-sound.mp3`);
    this.load.audio(`explosion`, `assets/sound/explosion.mp3`);
    this.load.atlasJSONHash(`player`, `assets/img/soldier.png`, `assets/img/soldier.json`);

    this.load.image(`logo`, `assets/img/logo.png`);
    this.load.atlasJSONHash(`buttons`, `assets/img/buttons.png`, `assets/img/buttons.json`);
  }
  create() {
    this.state.start(`Menu`);
  }
}
