export default class Bullets extends Phaser.Group {
  constructor(game) {
    super(game);
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.createMultiple(100, `bullet`);
    this.setAll(`anchor.x`, 0.5);
    this.setAll(`anchor.y`, 0.1);
    this.setAll(`outOfBoundsKill`, true);
    this.setAll(`checkWorldBounds`, true);
    this.forEach(bullet => {
      bullet.body.setSize(10, 10);
    });
  }
}
