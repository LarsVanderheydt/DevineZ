import Boot from './states/Boot';
import Preload from './states/Preload';
import Menu from './states/Menu';
import Play from './states/Play';
import Highscores from './states/Highscores';
import Instructions from './states/Instructions';
import Gameover from './states/Gameover';

export default class Game extends Phaser.Game {
  constructor() {
    super(1280, 720, Phaser.AUTO);
    this.state.add(`Boot`, Boot);
    this.state.add(`Preload`, Preload);
    this.state.add(`Menu`, Menu);
    this.state.add(`Play`, Play);
    this.state.add(`Highscores`, Highscores);
    this.state.add(`Instructions`, Instructions);
    this.state.add(`Gameover`, Gameover);
    this.state.start(`Boot`);
  }
}
