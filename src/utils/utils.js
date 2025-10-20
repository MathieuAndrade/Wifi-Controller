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

const getFuncBytes = (state, fn) => {
  let byte1 = 0;
  let byte2 = 0;

  if (fn >= 0 && fn <= 4) {
    // F0-F4
    // BYTE1 = 128 + F1*1 + F2*2 + F3*4 + F4*8 + F0*16
    byte1 =
      128 +
      state[1] * 1 +
      state[2] * 2 +
      state[3] * 4 +
      state[4] * 8 +
      state[0] * 16;
  } else if (fn >= 5 && fn <= 8) {
    // F5-F8
    // BYTE1 = 176 + F5*1 + F6*2 + F7*4 + F8*8
    byte1 = 176 + state[5] * 1 + state[6] * 2 + state[7] * 4 + state[8] * 8;
  } else if (fn >= 9 && fn <= 12) {
    // F9-F12
    // BYTE1 = 160 + F9*1 + F10*2 + F11*4 + F12*8
    byte1 = 160 + state[9] * 1 + state[10] * 2 + state[11] * 4 + state[12] * 8;
  } else if (fn >= 13 && fn <= 20) {
    // F13-F20
    // BYTE1 = 222
    // BYTE2 = F13*1 + F14*2 + F15*4 + F16*8 + F17*16 + F18*32 + F19*64 + F20*128
    byte1 = 222;
    byte2 =
      state[13] * 1 +
      state[14] * 2 +
      state[15] * 4 +
      state[16] * 8 +
      state[17] * 16 +
      state[18] * 32 +
      state[19] * 64 +
      state[20] * 128;
  } else if (fn >= 21 && fn <= 28) {
    // F21-F28
    // BYTE1 = 223
    // BYTE2 = F21*1 + F22*2 + F23*4 + F24*8 + F25*16 + F26*32 + F27*64 + F28*128
    byte1 = 223;
    byte2 =
      state[21] * 1 +
      state[22] * 2 +
      state[23] * 4 +
      state[24] * 8 +
      state[25] * 16 +
      state[26] * 32 +
      state[27] * 64 +
      state[28] * 128;
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

