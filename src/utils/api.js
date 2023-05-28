/* eslint-env browser */

import train from './train';

const getTrainImage = async () => train;

const getImageFromUrl = async (url, img) => {
  let imgUrl = `http://${url}${img}`;

  if (!img.startsWith('/images')) {
    imgUrl = img;
  }

  return fetch(imgUrl, {
    method: 'GET',
  }).then((response) => {
    if (response.status === 500 && img === '/images/train.png') {
      return getTrainImage();
    }
    return response.blob();
  });
};

const uploadFile = (url, file, fileName) => {
  const data = new FormData();
  data.append('file', file, fileName);

  return fetch(`http://${url}/file`, {
    method: 'POST',
    body: data,
  });
};

const getLocos = (url) =>
  fetch(`http://${url}/locos.json`, {
    method: 'GET',
  }).then((response) => response.json());

const deleteFile = (url, fileName) =>
  fetch(`http://${url}/delete?name=${fileName}`, {
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

export { getImageFromUrl, uploadFile, deleteFile, getLocos, getStats };
