import axios from 'axios';

import cardTpl from '../templates/card.handlebars';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css';

let data = {};

const refs = {
  cardsEl: document.querySelector('.cards'),
  addBtnEl: document.querySelector('.add-btn'),
};

getData().then((res) => {
  data = res;
  const cards = cardTpl(data.posts);
  insertCardToHTML(cards);
});

async function getData() {
  const posts = await axios.get('https://jsonplaceholder.typicode.com/posts');
  const users = await axios.get('https://jsonplaceholder.typicode.com/users');

  return {
    posts: posts.data,
    users: users.data,
  };
}

function insertCardToHTML(card) {
  refs.cardsEl.insertAdjacentHTML('beforeend', card);
}
