import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
es6Promise.polyfill();

let MUTE = false;

export default class Menu extends Phaser.State {
  init(mute) {
    MUTE = mute;
  }

  create() {
    this.loadSubmits();
    if (!MUTE) {
      this.addMusic();
    }
    this.add.sprite(0, 0, `bg`);
    this.add.sprite(370, 110, `logo`);
    this.add.sprite(390, 285, `highscores_bg`);
    const style = {font: `40px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
    this.add.text(500, 300, `HIGHSCORES:`, style);

    this.createBackButton();
  }

  addMusic() {
    this.backgroundMusic = this.add.audio(`backgroundMusic`);
    this.backgroundMusic.play();
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.loopFull();
  }

  createBackButton() {
    const style = {font: `35px aLoveOfThunder`, fill: `#ffffff`, align: `center`};

    const backButton = this.add.button(this.world.centerX, 625, `buttons`, this.backButtonClicked, this, `button_hover`, `button`);
    backButton.anchor.setTo(0.5, 0.5);
    const backButtonText = this.add.text(this.world.centerX, 625, `back`, style);
    backButtonText.anchor.setTo(0.5, 0.5);

  }

  backButtonClicked() {
    if (!MUTE) {
      this.backgroundMusic.stop();
    }
    this.state.start(`Menu`, true, false, MUTE);
  }

  createHighScoreList(data) {
    data.sort((a, b) => b.score - a.score);
    let highScoreAmount;

    if (data.length >= 5) {
      highScoreAmount = 5;
    } else {
      highScoreAmount = data.length;
    }
    const style = {font: `20px aLoveOfThunder`, fill: `#ffffff`, align: `center`};

    if (highScoreAmount === 0) {
      this.add.text(550, 425, `no highscores yet`, style);
    } else {
      for (let i = 0;i < highScoreAmount;i ++) {
        this.add.text(500, 375 + 40 * i, i + 1, style);
        this.add.text(550, 375 + 40 * i, data[i].player, style);
        this.add.text(700, 375 + 40 * i, data[i].score, style);
      }
    }
  }

  loadSubmits() {
    fetch(`index.php`, {
      headers: new Headers({
        Accept: `application/json`
      })
    })
    .then(r => r.json())
    .then(result => {

      this.createHighScoreList(result);

    });
  }
}
