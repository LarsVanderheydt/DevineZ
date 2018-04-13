import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import * as d3 from 'd3';
es6Promise.polyfill();

const $date1 = document.querySelector(`.date1`);
const $date2 = document.querySelector(`.date2`);
const $submitButton = document.querySelector(`input[type="submit"]`);

let selectedResults = [];

export default () => {
  $submitButton.addEventListener(`click`, loadSubmits);
};

const loadSubmits = e => {
  e.preventDefault();

  fetch(`index.php?page=stats`, {
    headers: new Headers({
      Accept: `application/json`
    }),
    method: `post`,
  })
  .then(r => r.json())
  .then(result => {
    const submitsResultEl = document.querySelector(`.submits-result`);
    const chart = document.querySelector(`.chart`);
    selectedResults = [];

    removeChildren(submitsResultEl);
    removeChildren(chart);
    if (!result || result.length === 0) {
      submitsResultEl.innerHTML = `<p>No submits In Database</p>`;
      return;
    }
    // if (submit.created >= $date1.value && submit.created <= $date2.value) {

    const $ol = document.createElement(`ol`);
    result.forEach(submit => {
      if (submit.created >= $date1.value) {
        if (submit.created <= $date2.value) {
          selectedResults.push(submit.score);

          const $li = document.createElement(`li`);

          if (selectedResults.length !== 0) {
            $li.innerHTML = `${submit.duration}  -  ${submit.score}   -   ${submit.created}`;
            $li.style.height = `32px`;
          } else {
            $li.innerHTML = `No submits In Database`;
          }
          $ol.appendChild($li);

          d3.select(`.chart`)
            .selectAll(`div`)
              .data(selectedResults)
            .enter().append(`div`)
              .style(`width`, function(d) { return (d) + `px`; })
              .style(`height`, `32px`)
              .style(`background`, `#82b3ca`)
              .style(`font-style`, `Arial`)
              .style(`font-size`, `1rem`)
              .style(`text-align`, `left`)
              .style(`color`, `#161e31`)
              .style(`margin`, `1px`)

              .text(`score`)
              .text(function(d) { return  d; });
        }
      }
    });
    submitsResultEl.appendChild($ol);
  });
};

const removeChildren = $element => {
  while ($element.firstChild) {
    $element.removeChild($element.firstChild);
  }
};
