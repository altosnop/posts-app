import axios from 'axios';

import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css';

const refs = {
  cardsEl: document.querySelector('.cards'),
  addBtnEl: document.querySelector('.add-btn'),
  formEl: document.querySelector('.create-form'),
  editBtn: document.querySelector('.edit-btn'),
};

refs.formEl.addEventListener('submit', onFormSubmit);

getData().then(({ posts, users }) => {
  const post = createPost(posts, users);
  insertCardToHTML(post.join(' '));

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', deletePost);
  });
});

async function getData() {
  const posts = await axios.get('https://jsonplaceholder.typicode.com/posts');
  const users = await axios.get('https://jsonplaceholder.typicode.com/users');

  return {
    posts: posts.data,
    users: users.data,
  };
}
async function onFormSubmit(event) {
  event.preventDefault();

  const title = event.target.elements.title.value;
  const body = event.target.elements.body.value;
  const userId = 1;

  await axios
    .post('https://jsonplaceholder.typicode.com/posts', {
      title,
      body,
      userId,
    })
    .then(({ data }) => {
      const { title, body } = data;
      const post = addPost(title, body);
      refs.cardsEl.insertAdjacentHTML('afterbegin', post);

      document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', deletePost);
      });
    });
}
async function deletePost(event) {
  const postId = event.target.parentNode.getAttribute('data-id');

  const card = event.target.parentNode.parentNode.parentNode;

  await axios
    .delete(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((res) => {
      card.remove();
      console.log(res);
    });
}
function createPost(posts, users) {
  return posts.map(({ id, userId, title, body }) => {
    let postAuthor;

    users.map((user) => {
      if (userId === user.id) {
        postAuthor = user;
      }
    });

    const card = `
    <div class="col-sm-4 mb-3">
          <div class="card">
            <div class="card-body" data-id="${id}">
              <h5 class="card-title">${title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${postAuthor.name}</h6>
              <h6 class="card-subtitle mb-2 text-muted">${postAuthor.email}</h6>
              <p class="card-text">${body}</p>
              <button class="btn btn-primary edit-btn">Edit</button>
              <button class="btn btn-danger delete-btn">Delete</button>
            </div>
          </div>
        </div>
    `;

    return card;
  });
}
function addPost(title, body) {
  return `<div class="col-sm-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Leanne Graham</h6>
              <h6 class="card-subtitle mb-2 text-muted">Sincere@april.biz</h6>
              <p class="card-text">${body}</p>
              <button class="btn btn-primary">Edit</button>
              <button class="btn btn-danger delete-btn">Delete</button>
            </div>
          </div>
        </div>
    `;
}
function insertCardToHTML(card) {
  refs.cardsEl.insertAdjacentHTML('beforeend', card);
}
