import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
es6Promise.polyfill();

import submitScoreForm from '../objects/submitScoreForm';


let MUTE = false;
let SCORE;
let DURATION;

export default class Gameover extends Phaser.State {

  init(score, duration, mute) {
    MUTE = mute;
    SCORE = score;
    DURATION = duration;
  }

  create() {
    this.add.sprite(0, 0, `bg`);
    this.createText();
    this.createButtons();
    this.handleData();
    if (!MUTE) {
      this.addMusic();
    }

    if (SCORE > 0) {
      this.submitScoreForm = new submitScoreForm(this, SCORE);
      this.add.existing(this.submitScoreForm);
    } else {
      this.loadSubmits();
    }
  }

  addMusic() {
    this.gameOverSong = this.add.audio(`gameOverSong`);
    this.gameOverSong.play();
    this.gameOverSong.loopFull();
  }

  createText() {
    const styleWhite = {font: `60px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
    const styleRed = {font: `60px aLoveOfThunder`, fill: `#c51616`, align: `center`};

    this.add.text(500, 80, `You`, styleWhite);
    this.add.text(650, 80, `DIED!`, styleRed);
    this.add.text(400, 150, `Your Score is:`, styleWhite);
    this.add.text(870, 150, SCORE, styleRed);
  }

  createButtons() {
    const style = {font: `35px aLoveOfThunder`, fill: `#ffffff`, align: `center`};

    const backButton = this.add.button(this.world.centerX, 600, `buttons`, this.backButtonClicked, this, `button_hover`, `button`);
    backButton.anchor.setTo(0.5, 0.5);
    const backButtonText = this.add.text(this.world.centerX, 600, `back to menu`, style);
    backButtonText.anchor.setTo(0.5, 0.5);

    const playAgainButton = this.add.button(this.world.centerX, 520, `buttons`, this.playAgainButtonClicked, this, `button_hover`, `button`);
    playAgainButton.anchor.setTo(0.5, 0.5);
    const playAgainButtonText = this.add.text(this.world.centerX, 520, `play again`, style);
    playAgainButtonText.anchor.setTo(0.5, 0.5);
  }

  createHighScoreList(data) {
    data.sort((a, b) => b.score - a.score);
    let highScoreAmount;

    if (data.length >= 3) {
      highScoreAmount = 3;
    } else {
      highScoreAmount = data.length;
    }
    const style = {font: `20px aLoveOfThunder`, fill: `#ffffff`, align: `center`};
    const highscoresTitleStyle = {font: `30px aLoveOfThunder`, fill: `#ffffff`, align: `center`};

    this.game.add.text(500, 250, `highscores:`, highscoresTitleStyle);

    if (highScoreAmount === 0) {
      this.game.add.text(550, 425, `no highscores yet`, style);
    } else {
      for (let i = 0;i < highScoreAmount;i ++) {
        this.game.add.text(500, 325 + 40 * i, i + 1, style);
        this.game.add.text(550, 325 + 40 * i, data[i].player, style);
        this.game.add.text(700, 325 + 40 * i, data[i].score, style);
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

  playAgainButtonClicked() {
    if (SCORE !== 0) {
      document.querySelector(`body`).removeChild(document.querySelector(`.formContainer`));
    }
    if (!MUTE) {
      this.gameOverSong.stop();
    }
    this.state.start(`Play`, true, false, MUTE);
  }

  backButtonClicked() {
    if (SCORE !== 0) {
      document.querySelector(`body`).removeChild(document.querySelector(`.formContainer`));
    }
    if (!MUTE) {
      this.gameOverSong.stop();
    }
    this.state.start(`Menu`, true, false, MUTE);
  }

  handleData() {
    const data = new FormData();
    data.append(`action`, `add-data`);
    data.append(`player`, `anonimous`);
    data.append(`duration`, `${DURATION}`);
    if (SCORE === 0) {
      //wordt in database afgerond naar 0, voorlopige oplossing van error
      data.append(`score`, `0.1`);
    } else {
      data.append(`score`, `${SCORE}`);
    }

    fetch(`index.php?t=${Date.now()}`, {
      headers: new Headers({
        Accept: `application/json`
      }),
      method: `post`,
      body: data
    })

    .then(r => r.json())
    .then(result => {
      if (result.result === `ok`) {
        return;
      } else {
        console.log(`error`);
      }
    });
  }
}
