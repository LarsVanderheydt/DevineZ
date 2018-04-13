import Player from '../objects/player';

let MUTE = false;

export default class Menu extends Phaser.State {
  init(mute) {
    MUTE = mute;
  }

  create() {
    this.add.sprite(0, 0, `bg`);
    this.add.sprite(370, 110, `logo`);
    // if (!MUTE) {
    this.addMusic();
    // }
    this.createButtons();

    this.player = new Player(this.game, 640, 630, 25);
    this.add.existing(this.player);
  }

  addMusic() {
    this.backgroundMusic = this.add.audio(`backgroundMusic`);
    this.backgroundMusic.play();
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.loopFull();
  }

  createButtons() {
    const style = {font: `35px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
    // const styleHover = {font: `35px aLoveOfThunder`, fill: `#c51616`, align: `center`};

    const playButton = this.add.button(this.world.centerX, 300, `buttons`, this.playButtonClicked, this, `button_hover`, `button`);
    playButton.anchor.setTo(0.5, 0.5);
    const playButtonText = this.add.text(this.world.centerX, 300, `play`, style);
    playButtonText.anchor.setTo(0.5, 0.5);

    const highscoresButton = this.add.button(this.world.centerX, 380, `buttons`, this.highscoresButtonClicked, this, `button_hover`, `button`);
    highscoresButton.anchor.setTo(0.5, 0.5);
    const highscoresButtonText = this.add.text(this.world.centerX, 380, `highscores`, style);
    highscoresButtonText.anchor.setTo(0.5, 0.5);

    const instructionButton = this.add.button(this.world.centerX, 460, `buttons`, this.instructionButtonClicked, this, `button_hover`, `button`);
    instructionButton.anchor.setTo(0.5, 0.5);
    const instructionButtonText = this.add.text(this.world.centerX, 460, `instructions`, style);
    instructionButtonText.anchor.setTo(0.5, 0.5);


    const muteSoundButton = this.add.button(this.world.centerX, 540, `buttons`, this.muteSoundButtonClicked, this, `button_hover`, `button`);
    muteSoundButton.anchor.setTo(0.5, 0.5);

    if (MUTE) {
      this.muteSoundButtonText = this.add.text(this.world.centerX, 540, `unmute sound`, style);
    } else {
      this.muteSoundButtonText = this.add.text(this.world.centerX, 540, `mute sound`, style);
    }
    this.muteSoundButtonText.anchor.setTo(0.5, 0.5);

  }

  update() {
    this.player.rotation = this.physics.arcade.angleToPointer(this.player);
  }
  playButtonClicked() {
    this.backgroundMusic.stop();
    this.state.start(`Play`, true, false, MUTE);
  }
  highscoresButtonClicked() {
    this.backgroundMusic.stop();
    this.state.start(`Highscores`, true, false, MUTE);
  }
  instructionButtonClicked() {
    this.backgroundMusic.stop();
    this.state.start(`Instructions`, true, false, MUTE);
  }
  muteSoundButtonClicked() {
    if (MUTE) {
      this.backgroundMusic.resume();
      this.muteSoundButtonText.setText(`Mute sound`);
      MUTE = false;
    } else {
      this.backgroundMusic.pause();
      this.muteSoundButtonText.setText(`unmute sound`);
      MUTE = true;
    }
  }
}
