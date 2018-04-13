let MUTE = false;

export default class Menu extends Phaser.State {
  init(mute) {
    MUTE = mute;
  }

  create() {
    if (!MUTE) {
      this.addMusic();
    }
    this.add.sprite(0, 0, `bg`);
    this.add.sprite(370, 40, `logo`);

    const instructions = this.add.sprite(this.world.centerX, this.world.centerY + 30, `instructions`);
    instructions.anchor.setTo(0.5, 0.5);
    instructions.width = instructions.width / 1.3;
    instructions.height = instructions.height / 1.3;
    const style = {font: `40px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
    this.add.text(500, 225, `INSTRUCTIONS:`, style);
    // this.createinfo();

    this.createBackButton();
  }
  addMusic() {
    this.backgroundMusic = this.add.audio(`backgroundMusic`);
    this.backgroundMusic.play();
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.loopFull();
  }

  // createinfo() {
  //   const styleTitle = {font: `30px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
  //   const style = {font: `25px arial`, fill: `#ffffff`, align: `center`};
  //
  //   this.add.text(390, 285, `Controls`, styleTitle);
  //   this.add.text(350, 330, `fire gun = click cursor`, style);
  //   this.add.text(310, 370, `move schooter = arrow keys `, style);
  //   this.add.text(474, 405, ` = ZSQD keys `, style);
  //   this.add.text(474, 440, ` = WASD keys `, style);
  //
  //   this.add.text(790, 285, `Guns`, styleTitle);
  //   this.add.text(704, 326, `there are 3 kind of guns `, style);
  //   this.add.text(784, 370, `handgun `, style);
  //   this.add.text(787, 410, `shotgun `, style);
  //   this.add.text(812, 450, `rifle`, style);
  // }

  createBackButton() {
    const style = {font: `35px aLoveOfThunder`, fill: `#ffffff`, align: `center`};

    const backButton = this.add.button(this.world.centerX, 615, `buttons`, this.backButtonClicked, this, `button_hover`, `button`);
    backButton.anchor.setTo(0.5, 0.5);
    const backButtonText = this.add.text(this.world.centerX, 615, `back`, style);
    backButtonText.anchor.setTo(0.5, 0.5);

  }

  backButtonClicked() {
    if (!MUTE) {
      this.backgroundMusic.stop();
    }
    this.state.start(`Menu`, true, false, MUTE);
  }

}
