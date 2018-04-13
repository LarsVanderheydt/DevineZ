export default class submitScoreForm extends Phaser.Group {
  constructor(game, score) {
    super(game);
    const $body = document.querySelector(`body`);

    const $formContainer = document.createElement(`div`);
    $formContainer.setAttribute(`class`, `formContainer`);
    $formContainer.style.width = `1280px`;
    $formContainer.style.height = `450px`;
    $formContainer.style.position = `absolute`;
    $formContainer.style.top = `0`;
    $formContainer.style.display = `flex`;
    $formContainer.style.justifyContent = `center`;
    $formContainer.style.alignItems = `flex-end`;

    const $form = document.createElement(`form`);
    $form.setAttribute(`action`, `index.php`);
    $form.setAttribute(`method`, `post`);
    $form.style.display = `flex`;
    $form.style.flexDirection = `column`;
    $form.style.alignItems = `center`;

    const $textInput = document.createElement(`input`);
    $textInput.setAttribute(`type`, `text`);
    $textInput.setAttribute(`name`, `name`);
    $textInput.setAttribute(`class`, `name-input`);
    $textInput.setAttribute(`placeholder`, `name`);
    $textInput.setAttribute(`maxlength`, `10`);
    $textInput.style.width = `275px`;
    $textInput.style.height = `50px`;
    $textInput.style.background = `none`;
    $textInput.style.border = `5px solid white`;
    $textInput.style.color = `white`;
    $textInput.style.fontFamily = `aLoveOfThunder`;
    $textInput.style.fontSize = `30px`;
    $textInput.style.textAlign = `center`;
    $textInput.style.marginBottom = `30px`;
    $textInput.required = true;

    const $scoreInput = document.createElement(`input`);
    $scoreInput.setAttribute(`type`, `hidden`);
    $scoreInput.setAttribute(`name`, `score`);
    $scoreInput.setAttribute(`value`, score);

    const $submit = document.createElement(`input`);
    $submit.setAttribute(`type`, `submit`);
    $submit.setAttribute(`name`, `submit`);
    $submit.setAttribute(`class`, `submit-button`);
    $submit.setAttribute(`value`, `submit score`);
    $submit.style.width = `364px`;
    $submit.style.height = `69px`;
    $submit.style.background = `url(assets/img/submit-button.png)`;
    $submit.style.border = `none`;
    $submit.style.color = `white`;
    $submit.style.fontFamily = `aLoveOfThunder`;
    $submit.style.fontSize = `30px`;
    $submit.addEventListener(`click`, e => {
      this.submitHandler(e, score, $textInput, $formContainer, $form);
    });

    $form.appendChild($textInput);
    $form.appendChild($scoreInput);
    $form.appendChild($submit);
    $formContainer.appendChild($form);
    $body.appendChild($formContainer);
  }

  submitHandler(e, score, $textInput, $formContainer, $form) {
    e.preventDefault();
    if (!$form.checkValidity()) {
      this.checkTextInput($textInput);
    } else {
      this.handleHighscore(score, $textInput, $formContainer, $form);
    }
  }

  valueMissing($field) {
    if ($field.validity.valueMissing) {
      return `true`;
    }
    return `false`;
  }

  checkTextInput($field) {
    if (this.valueMissing($field)) {
      $field.style.backgroundColor = `rgba(255,0,0,0.5)`;
    }
  }

  handleHighscore(score, $textInput, $formContainer, $form) {
    const data = new FormData();
    data.append(`action`, `add-score`);
    data.append(`player`, `${$textInput.value}`);
    data.append(`score`, `${score}`);

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
        $formContainer.style.width = `0px`;
        $formContainer.style.height = `0px`;
        $formContainer.removeChild($form);
        this.loadSubmits();
        return;
      } else {
        console.log(`error`);
      }
    });
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

}
