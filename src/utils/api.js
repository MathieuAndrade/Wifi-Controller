/* eslint-env browser */

import train from './train';

const serverBaseUrl = 'http://localhost:62521';
const staticBaseUrl = `${serverBaseUrl}/static`;
const serverApiBaseUrl = `${serverBaseUrl}/api`;

const getTrainImage = async () => train;

const getImageFromUrl = async (url, img) => {
  let imgUrl = `http://${url}${img}`;

  // Use local static server if no URL provided
  if (!url) {
    imgUrl = `${staticBaseUrl}${img}`;
  }

  if (!img.startsWith('/images')) {
    imgUrl = img;
  }

  return fetch(imgUrl, {
    method: 'GET',
  }).then((response) => {
    if (
      (response.status === 500 || response.status === 404) &&
      img === '/images/train.png'
    ) {
      return getTrainImage();
    }
    return response.blob();
  });
};

const uploadFile = (url, file, fileName) => {
  const data = new FormData();
  data.append('file', file, fileName);
  let fileUrl = `http://${url}/file`;

  // Use local static server if no URL provided
  if (!url) {
    fileUrl = `${serverApiBaseUrl}/file-upload`;
  }

  return fetch(fileUrl, {
    method: 'POST',
    body: data,
  });
};

const getLocos = async (url) => {
  let urlFinal = `http://${url}/locos.json`;

  // Use local static server if no URL provided
  if (!urlFinal) {
    urlFinal = `${staticBaseUrl}/locos.json`;
  }

  return fetch(urlFinal, {
    method: 'GET',
  }).then((response) => response.json());
};

const deleteFile = (url, fileName) => {
  let urlFinal = `http://${url}/delete?name=${fileName}`;

  // Use local static server if no URL provided
  if (!url) {
    urlFinal = `${serverApiBaseUrl}/delete?name=${fileName}`;
  }

  return fetch(urlFinal, {
    method: 'DELETE',
  });
};

const openUserFolder = () =>
  fetch(`${serverApiBaseUrl}/open-user-folder`, {
    method: 'POST',
  });

const getStats = (url) =>
  fetch(`http://${url}/stats`, {
    method: 'GET',
  }).then((response) => response.json());

/*
const getParams = (url) =>
  fetch(`http://${url}/params.json`, {
    method: 'GET',
  }).then((response) => response.json());
*/

export {
  deleteFile,
  getImageFromUrl,
  getLocos,
  getStats,
  openUserFolder,
  uploadFile
};

