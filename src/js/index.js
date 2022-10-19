import axios from 'axios';

import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css';

const refs = {
  cardsEl: document.querySelector('.cards'),
  addBtnEl: document.querySelector('.add-btn'),
  createPostModal: document.querySelector('#createPostModal'),
  titleInputEl: document.querySelector('#post-title'),
};

refs.createPostModal.addEventListener('show.bs.modal', (event) => {
  refs.titleInputEl.focus();
});

getData().then(({ posts, users }) => {
  const post = createPost(posts, users);
  insertCardToHTML(post.join(' '));
});

async function getData() {
  const posts = await axios.get('https://jsonplaceholder.typicode.com/posts');
  const users = await axios.get('https://jsonplaceholder.typicode.com/users');

  return {
    posts: posts.data,
    users: users.data,
  };
}
function createPost(posts, users) {
  return posts.map(({ userId, title, body }) => {
    let postAuthor;

    users.map((user) => {
      if (userId === user.id) {
        postAuthor = user;
      }
    });

    const card = `
    <div class="col-sm-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${postAuthor.name}</h6>
              <h6 class="card-subtitle mb-2 text-muted">${postAuthor.email}</h6>
              <p class="card-text">${body}</p>
              <button class="btn btn-primary">Edit</button>
              <button class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
    `;

    return card;
  });
}
function insertCardToHTML(card) {
  refs.cardsEl.insertAdjacentHTML('beforeend', card);
}
