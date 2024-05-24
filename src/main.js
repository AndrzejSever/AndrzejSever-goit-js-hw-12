import { createMarkupItem } from './js/render-functions.js';
import { fetchPhotosByQuery } from './js/pixabay-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const galleryEl = document.querySelector('.js-gallery');
const searchFormEl = document.querySelector('.js-search-form');
const loadMoreBtnEl = document.querySelector('.js-load-more');
const loaderEl = document.querySelector('.js-loader');

let currentPage = 1;
let currentQuery = '';
const perPage = 15;
let lightbox = new SimpleLightbox('.js-gallery a');
let totalHits = 0;

function showError(message) {
  iziToast.error({
    title: 'Error',
    message,
    position: 'topRight',
    timeout: 2000,
  });
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function toggleLoader(show) {
  loaderEl.classList.toggle('is-hidden', !show);
}

async function onSearchFormSubmit(event) {
  event.preventDefault();
  currentQuery = event.target.elements.searchKeyword.value.trim();

  if (!currentQuery) {
    clearGallery();
    event.target.reset();
    showError('Illegal operation');
    return;
  }

  currentPage = 1;
  totalHits = 0;
  clearGallery();
  loadMoreBtnEl.classList.add('is-hidden');
  toggleLoader(true);

  try {
    const imagesData = await fetchPhotosByQuery(currentQuery, currentPage, perPage);
    totalHits = imagesData.totalHits;

    if (totalHits === 0) {
      showError('Sorry, there are no images matching your search query. Please try again!');
    } else {
      galleryEl.innerHTML = createMarkupItem(imagesData.hits);
      lightbox.refresh();

      if (imagesData.hits.length < perPage || totalHits <= currentPage * perPage) {
        showError("We're sorry, but you've reached the end of search results.");
      } else {
        loadMoreBtnEl.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    showError('Failed to fetch images. Please try again later.');
  } finally {
    event.target.reset();
    toggleLoader(false);
  }
}

async function onLoadMoreClick() {
  currentPage += 1;
  toggleLoader(true);
  loadMoreBtnEl.classList.add('is-hidden');

  try {
    const imagesData = await fetchPhotosByQuery(currentQuery, currentPage, perPage);
    galleryEl.insertAdjacentHTML('beforeend', createMarkupItem(imagesData.hits));
    lightbox.refresh();

    if (imagesData.hits.length === 0 || totalHits <= currentPage * perPage) {
      showError("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    showError('Failed to fetch images. Please try again later.');
  } finally {
    toggleLoader(false);
  }
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreClick);