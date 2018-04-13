export default class Player extends Phaser.Sprite {
  constructor(game, x, y, frame) {
    super(game, x, y, `player`, frame);
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(175, 175, 45, 10);
    this.anchor.setTo(0.5, 0.5);
    this.health = 100;

    this.animations.add(`walk`, [
      `survivor-move_handgun_0`,
      `survivor-move_handgun_1`,
      `survivor-move_handgun_2`,
      `survivor-move_handgun_3`,
      `survivor-move_handgun_4`,
      `survivor-move_handgun_5`,
      `survivor-move_handgun_6`,
      `survivor-move_handgun_7`,
      `survivor-move_handgun_8`,
      `survivor-move_handgun_9`,
      `survivor-move_handgun_10`,
      `survivor-move_handgun_11`,
      `survivor-move_handgun_12`,
      `survivor-move_handgun_13`,
      `survivor-move_handgun_14`,
      `survivor-move_handgun_15`,
      `survivor-move_handgun_16`,
      `survivor-move_handgun_17`,
      `survivor-move_handgun_18`,
      `survivor-move_handgun_19`,
    ], 20, true);

    this.animations.add(`shoot`, [
      `survivor-shoot_handgun_0`,
      `survivor-shoot_handgun_1`,
      `survivor-shoot_handgun_2`
    ], 12, true);

    this.animations.play(`walk`);

    this.scale.set(0.25);
  }

  healthSetup() {
    this.healthBarFrame = this.game.add.sprite(this.game.width - 372, 53, `healthBarFrame`);
    this.healthBar = this.game.add.sprite(this.game.width - 70, 55, `healthBarFull`);
    this.healthBar.height = 50;
    this.healthBartext = this.game.add.text(this.healthBar.x - this.healthBar.width + 20, this.healthBar.y + 20, this.health, {font: `20px aLoveOfThunder`, fill: `#ffffff`, align: `center`});
  }

  healthUpdate() {
    this.healthBar.width = - this.health * 3;
    this.healthBartext.setText(`Health: ${this.health}`);
  }

  removeHealthBar() {
    this.healthBar.destroy();
    this.healthBarFrame.destroy();
    this.healthBartext.destroy();
  }

  resumeAnimation() {
  }

  pauseAnimation() {
  }

}
