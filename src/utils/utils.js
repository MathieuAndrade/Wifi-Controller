/* eslint-env browser */
import { saveAs } from 'file-saver';
import { json2csv } from 'json-2-csv';
import JSZip from 'jszip';

const listOfLocoKeys = [
  'address',
  'longName',
  'shortName',
  'decoder',
  'length',
  'description',
  'mark',
  'imageUrl',
  'cvs',
  'id',
  'value',
  'defaultValue',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
];

const listOfLocoFunctions = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29,
];

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);

const toHex = (val) => {
  let hex = Number(val).toString(16);
  if (hex.length === 1) {
    hex = `0x0${hex}`;
  } else {
    hex = `0x${hex}`;
  }
  return hex;
};

const toBin = (val) => `000000000${Number(val).toString(2)}`.slice(-8);

const sortByKey = (array, key) =>
  array.sort((a, b) => {
    const x = a[key];
    const y = b[key];

    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });

const getFuncBytes = (state, func) => {
  let offset = 1;
  let byte1 = 0;
  let byte2 = 0;

  if (func <= 4) {
    byte1 += 128;
  } else if (func >= 5 && func <= 8) {
    byte1 += 176;
    offset = 5;
  } else if (func >= 9 && func <= 12) {
    byte1 += 160;
    offset = 9;
  } else if (func >= 13 && func <= 20) {
    byte2 += 222;
    offset = 13;
  } else if (func >= 21 && func <= 28) {
    byte2 += 223;
    offset = 21;
  }

  if (func < 13) {
    for (let i = offset; i <= offset + 4; i += 1) {
      byte1 += state[i] ? 2 ** (i - offset) : 0;
    }

    byte1 += func === 0 ? 16 : 0; // Special case for function 0
  }

  if (func > 12) {
    for (let j = offset; j <= offset + 8; j += 1) {
      byte2 += state[j] ? 2 ** (j - offset) : 0;
    }
  }

  return { byte1, byte2 };
};

const getDataUrl = (file) => {
  if (typeof file === 'string' && file.startsWith('data:image')) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const humanFileSize = (size) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / 1024 ** i).toFixed(2) * 1} ${
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  }`;
};

const calculateSize = (arr) => {
  let size = 0;
  arr.forEach((file) => {
    if (file.size) {
      size += file.size;
    }

    if (file.files) {
      size += calculateSize(file.files);
    }
  });

  return size;
};

const download = (name, data) => {
  const blob = new Blob([JSON.stringify(data, null, 0)], {
    type: 'application/json',
  });

  // If current navigator has Blob api, use it
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, name);
  } else {
    // else use fake html element
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = name;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
};

const getCurrentDate = () => {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = `00${d.getMonth() + 1}`.slice(-2);
  const dd = `00${d.getDate()}`.slice(-2);

  return `${dd}-${mm}-${yy}`;
};

/**
 * Zip Name: Locos
 * Zip Architecture
 * root /
 * - synthèse_des_locos /
 * -- locosData.json
 * - {locoName}.img (png, jpg, jpeg, gif)
 * - {locoName}.csv
 */
const downloadOneLocoInfoFile = (locosData, selectedLoco) => {
  if (locosData.length > 0) {
    const zip = new JSZip();

    // Add locosData to zip
    const globalDataFolder = zip.folder('synthèse_des_locos');
    globalDataFolder.file('locosData.json', JSON.stringify(locosData));
    // const imagesFolder = globalDataFolder.folder('images');

    const locoDataWithoutCvs = { ...selectedLoco };
    delete locoDataWithoutCvs.cvs;

    zip.file(
      `${selectedLoco.shortName}.csv`,
      json2csv(locoDataWithoutCvs, { emptyFields: true }),
    );

    zip.file(
      `${selectedLoco.shortName}_cvs.csv`,
      json2csv(selectedLoco.cvs, { emptyFields: true }),
    );

    const imgUrl = selectedLoco.imageUrl
      ? selectedLoco.imageUrl
      : '/images/train.png';

    const imgData = localStorage.getItem(imgUrl);
    const realImgName = imgUrl.split('/').pop();

    const base64StringFromDataURL = imgData
      .replace('data:', '')
      .replace(/^.+,/, '');

    zip.file(realImgName, base64StringFromDataURL, { base64: true });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${selectedLoco.shortName}_${getCurrentDate()}.zip`);
    });
  }
};

/**
 * Zip Name: Locos
 * Zip Architecture
 * root /
 * - locosData.json
 * - images /
 * -- all images (png, jpg, jpeg, gif)
 * - {locoName} /
 * -- {locoName}.img (png, jpg, jpeg, gif)
 * -- {locoName}.csv
 */
const downloadLocoInfosFiles = (locosData) => {
  if (locosData.length > 0) {
    const zip = new JSZip();

    // Add locosData to zip
    const globalDataFolder = zip.folder('locos');
    globalDataFolder.file('locosData.json', JSON.stringify(locosData));
    const imagesFolder = globalDataFolder.folder('images');

    locosData.forEach((loco) => {
      const locoZip = zip.folder(loco.shortName);

      const locoDataWithoutCvs = { ...loco };
      delete locoDataWithoutCvs.cvs;

      locoZip.file(
        `${loco.shortName}.csv`,
        json2csv(locoDataWithoutCvs, { emptyFields: true }),
      );

      locoZip.file(
        `${loco.shortName}_cvs.csv`,
        json2csv(loco.cvs, { emptyFields: true }),
      );

      const imgUrl = loco.imageUrl ? loco.imageUrl : '/images/train.png';
      const imgData = localStorage.getItem(imgUrl);
      const realImgName = imgUrl.split('/').pop();

      const base64StringFromDataURL = imgData
        .replace('data:', '')
        .replace(/^.+,/, '');

      locoZip.file(realImgName, base64StringFromDataURL, { base64: true });
      imagesFolder.file(realImgName, base64StringFromDataURL, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'locos.zip');
    });
  }
};

const findCvValue = (arr, id) => {
  const index = arr.findIndex((c) => c.id === id);
  if (index !== -1) {
    return arr[index].value || 0;
  }
  return 0;
};

const isValidImage = (url) => {
  if (url) {
    const res = url.match(/(jpg|jpeg|png|webp|avif|gif|svg)/gm);
    return res && res.length > 0;
  }

  return false;
};

export {
  calculateSize,
  download,
  downloadLocoInfosFiles,
  downloadOneLocoInfoFile,
  findCvValue,
  getDataUrl,
  getFuncBytes,
  humanFileSize,
  isValidImage,
  listOfLocoFunctions,
  listOfLocoKeys,
  range,
  sortByKey,
  toBin,
  toHex
};

