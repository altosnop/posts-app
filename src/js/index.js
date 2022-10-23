import axios from 'axios';
import { Modal } from 'bootstrap';

import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css';

const refs = {
  cardsEl: document.querySelector('.cards'),
  addBtnEl: document.querySelector('.add-btn'),
  createCloseBtnEl: document.querySelector('.create-closeBtn'),
  editCloseBtnEl: document.querySelector('.edit-closeBtn'),
  modalEl: document.querySelector('#createPostModal'),
  editModalEl: document.querySelector('#editPostModal'),
  formEl: document.querySelector('.create-form'),
  editFormEl: document.querySelector('.edit-form'),
};

let postId;
let currentCard;

const modal = new Modal(refs.modalEl);
const editModal = new Modal(refs.editModalEl);

refs.addBtnEl.addEventListener('click', () => modal.show());
refs.createCloseBtnEl.addEventListener('click', () => modal.hide());
refs.editCloseBtnEl.addEventListener('click', () => editModal.hide());

refs.formEl.addEventListener('submit', onCreatePost);
refs.editFormEl.addEventListener('submit', onEditPost);

getData().then(({ posts, users }) => {
  const post = createPost(posts, users);

  insertCardToHTML(post.join(' '), 'beforeend');

  addListenerToBtn('.delete-btn', onDeletePost);
  addListenerToBtn('.edit-btn', openEditPost);
});

async function onCreatePost(event) {
  event.preventDefault();

  const button = event.target.querySelector('button');
  const title = event.target.elements.title.value;
  const body = event.target.elements.body.value;
  const userId = 1;

  setSpinner(button);

  if (title !== '' && body !== '') {
    await axios
      .post('https://jsonplaceholder.typicode.com/posts', {
        title,
        body,
        userId,
      })
      .then(({ data }) => {
        const { id, title, body, userId } = data;

        const posts = [
          {
            id,
            title,
            body,
            userId,
          },
        ];
        const users = [
          {
            id: 1,
            name: 'Leanne Graham',
            email: 'Sincere@april.biz',
          },
        ];

        const post = createPost(posts, users);

        insertCardToHTML(post.join(' '), 'afterbegin');

        addListenerToBtn('.delete-btn', onDeletePost);
        addListenerToBtn('.edit-btn', openEditPost);

        event.target.reset();
        modal.hide();

        removeSpinner(button, 'Create post');
      });
  } else {
    alert('Please fill the inputs');
  }
}
async function onDeletePost(event) {
  const postId = event.target.parentNode.getAttribute('data-id');

  setSpinner(event.target);

  const card = event.target.parentNode.parentNode.parentNode;

  await axios
    .delete(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((res) => {
      card.remove();
    });
}
async function onEditPost(event) {
  event.preventDefault();

  const button = event.target.querySelector('button');
  const newTitle = event.target.elements.title.value;
  const newBody = event.target.elements.body.value;

  setSpinner(button);

  if (newTitle !== '' && newBody !== '') {
    await axios
      .put(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        newTitle,
        newBody,
      })
      .then(({ data }) => {
        const { newTitle, newBody } = data;

        currentCard.querySelector('.card-title').innerText = newTitle;
        currentCard.querySelector('.card-text').innerText = newBody;

        addListenerToBtn('.delete-btn', onDeletePost);
        addListenerToBtn('.edit-btn', openEditPost);

        editModal.hide();

        removeSpinner(button, 'Edit post');
      });
  } else {
    alert('Please fill the inputs');
  }
}

function openEditPost(event) {
  editModal.show();

  const title = event.target.parentNode.querySelector('.card-title').innerText;
  const body = event.target.parentNode.querySelector('.card-text').innerText;

  postId = event.target.parentNode.getAttribute('data-id');
  currentCard = event.target.parentNode;

  refs.editFormEl.elements.title.value = title;
  refs.editFormEl.elements.body.value = body;
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
            <div class="card-body" data-id="${id}" data-user-id="${userId}">
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

function insertCardToHTML(card, place) {
  refs.cardsEl.insertAdjacentHTML(place, card);
}
function addListenerToBtn(className, fnc) {
  document.querySelectorAll(className).forEach((btn) => {
    btn.addEventListener('click', fnc);
  });
}
function setSpinner(button) {
  button.setAttribute('disabled', 'true');
  button.innerHTML = `
    <span
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true">
    </span>`;
}
function removeSpinner(button, text) {
  button.removeAttribute('disabled');
  button.innerHTML = `${text}`;
}

async function getData() {
  const posts = await axios.get('https://jsonplaceholder.typicode.com/posts');
  const users = await axios.get('https://jsonplaceholder.typicode.com/users');

  return {
    posts: posts.data,
    users: users.data,
  };
}
