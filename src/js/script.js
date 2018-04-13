import Game from './classes/Game';
import stats from './stats/stats';

const $dataSection = document.querySelector(`#data`);

const init = () => {
  console.log(`SCRIPT.JS UITGEV.`);


  if ($dataSection) {
    stats($dataSection);
  } else {
    new Game();
  }

    // if (get(`page`) === `stats`) {
    //   stats;
    // }

};


init();
