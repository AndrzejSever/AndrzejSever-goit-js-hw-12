export const createMarkupItem = images => {
    return images
      .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
          return `
            <li class="gallery-item">
              <a class="gallery-link" href="${largeImageURL}">
                <img
                  class="gallery-image"
                  src="${webformatURL}"
                  alt="${tags}"                />
              </a>
              <div class="small-content">
                <small class="text-body-likes"><span class="text-body">Likes:</span> <span class="quantity">${likes}</span></small>
                <small class="text-body-views"><span class="text-body">Views:</span> <span class="quantity">${views}</span></small>
                <small class="text-body-comments"><span class="text-body">Comments:</span> <span class="quantity">${comments}</span></small>
                <small class="text-body-downloads"><span class="text-body">Downloads:</span> <span class="quantity">${downloads}</span></small>
              </div>
            </li>
          `;
        }
      )
      .join('');
  };