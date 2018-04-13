export default class Boot extends Phaser.State {
  preload() {
    this.load.image(`load-background`, `assets/img/loading_bg.png`);
    this.load.spritesheet(`loader`, `assets/img/preloader.png`, 102, 102, 8);
  }
  create() {
    this.state.start(`Preload`);
  }
}
