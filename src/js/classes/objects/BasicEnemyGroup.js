// const ENEMY_SPEED = 50;
const ENEMY_HEALTH_INCREASE_AT_SCORE = 100;

export default class BasicEnemyGroup extends Phaser.Group {
  constructor(game, parent, enemyCount) {
    super(game);
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.createMultiple(enemyCount, `enemy`);
    this.setAll(`outOfBoundsKill`, true);
    this.setAll(`checkWorldBounds`, true);
    this.setAll(`body.immovable`, true);
    this.setAll(`anchor.x`, 0.45);
    this.setAll(`anchor.y`, 0.55);
    this.forEach(enemy => {
      enemy.animations.add(`walk`);
      enemy.animations.add(`hit`);
      enemy.animations.play(`walk`, 20, true);
      enemy.scale.set(0.25);
      enemy.body.setSize(50, 50, 30, 75);
    });

    this.health = 1;
    this.nextEnemyAt = 0;
    this.enemyDelay = 500;
    this.enemyHealthIncrease = ENEMY_HEALTH_INCREASE_AT_SCORE;

  }

  enemyFollow(player) {
    this.forEach(enemy => {
      if (enemy.alive) {
        // enemy moves to the player
        this.game.physics.arcade.moveToObject(enemy, player, 50);
        // enemy rotates to the player
        enemy.rotation = this.game.physics.arcade.angleBetween(enemy, player);
      }
    });
  }

  enemySpawn(player, score) {
    if (this.nextEnemyAt > this.game.time.now) return;
    if (this.countDead() === 0) return;

    const enemy = this.getFirstExists(false);
    const enemySpawnPosition = this.getPosition();

    // reset enemies on x and y from pos array
    // if the score is less than needed reset enemy at position with 1 health
    if (score <= this.enemyHealthIncrease) {
      enemy.reset(enemySpawnPosition[0], enemySpawnPosition[1], this.health);
    }

    // if the score is higher or same as needed to `level up` then update the enemy health with +1 and reset level to score +10
    if (score >= this.enemyHealthIncrease) {
      this .health ++;
      this.enemyHealthIncrease += ENEMY_HEALTH_INCREASE_AT_SCORE;
      enemy.reset(enemySpawnPosition[0], enemySpawnPosition[1], this.health);
    }

    this.nextEnemyAt = this.game.time.now + this.enemyDelay;
  }

  getPosition() {
    // array where zombies can spawn
    const pos = [
      [0, 0],
      [0, this.game.height],
      [this.game.width, 0],
      [this.game.width, this.game.height],
      [this.game.width / 2, 0],
      [this.game.width / 2, this.game.height],
      [this.game.width, this.game.height / 2]
    ];

    // take 1 array from pos array to use in reset
    const randomPos = pos[Math.floor(Math.random() * 7)];

    return randomPos;
  }
}
