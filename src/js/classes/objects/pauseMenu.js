export default class pauseMenu extends Phaser.Group {
  constructor(game) {
    super(game);

    this.pauseBackground = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 25, `highscores_bg`);
    this.pauseBackground.anchor.setTo(0.5, 0.5);
    this.pauseBackground.width = this.pauseBackground.width * 2;
    this.pauseBackground.height = this.pauseBackground.height * 1.6;

    const stylePaused = {font: `45px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
    const style = {font: `35px aLoveOfThunder`, fill: `#ffffff`, align: `center`};

    this.pausetext = this.game.add.text(this.game.world.centerX, 220, `game is paused`, stylePaused);
    this.pausetext.anchor.setTo(0.5, 0.5);

    this.resumeButton = this.game.add.button(this.game.world.centerX, 535, `buttons`, this.play, this, `button_hover`, `button`);
    this.resumeButton.anchor.setTo(0.5, 0.5);
    this.resumeButtonText = this.game.add.text(this.game.world.centerX, 535, `resume`, style);
    this.resumeButtonText.anchor.setTo(0.5, 0.5);

    this.quitButton = this.game.add.button(this.game.world.centerX, 435, `buttons`, this.quit, this, `button_hover`, `button`);
    this.quitButton.anchor.setTo(0.5, 0.5);
    this.quitButtonText = this.game.add.text(this.game.world.centerX, 435, `quit game`, style);
    this.quitButtonText.anchor.setTo(0.5, 0.5);

    this.muteButton = this.game.add.button(this.game.world.centerX, 335, `buttons`, this.muteSoundButtonClicked, this, `button_hover`, `button`);
    this.muteButton.anchor.setTo(0.5, 0.5);
    if (this.game.mute) {
      this.muteButtonText = this.game.add.text(this.game.world.centerX, 335, `unmute sound`, style);
    } else {
      this.muteButtonText = this.game.add.text(this.game.world.centerX, 335, `mute sound`, style);
    }
    this.muteButtonText.anchor.setTo(0.5, 0.5);

  }

  remove() {
    this.pauseBackground.destroy();
    this.pausetext.destroy();
    this.resumeButton.destroy();
    this.resumeButtonText.destroy();
    this.quitButton.destroy();
    this.quitButtonText.destroy();
    this.muteButton.destroy();
    this.muteButtonText.destroy();
  }

  play() {
    this.game.physics.arcade.isPaused = false;
    this.game.powerupGenerator.timer.resume();
    this.game.durationTimer.timer.resume();

    this.remove();

    this.game.pauseButton.setText(`Pause`);
    if (!this.game.mute) {
      this.game.zombieMoans.resume();
      this.game.shotSound.resume();
      this.game.gunCollect.resume();
      this.game.healthCollectAudio.resume();
    }
    this.game.player.resumeAnimation();
  }

  quit() {
    if (!this.game.mute) {
      this.game.backgroundMusic.stop();
      this.game.zombieMoans.stop();
    }
    this.game.state.start(`Menu`, true, false, this.game.mute);
  }

  muteSoundButtonClicked() {
    if (this.game.mute) {
      this.game.backgroundMusic.resume();
      this.muteButtonText.setText(`Mute sound`);
      this.game.addAudio();
      this.game.mute = false;
    } else {
      this.game.backgroundMusic.pause();
      this.muteButtonText.setText(`unmute sound`);
      this.game.mute = true;
    }
  }

}
