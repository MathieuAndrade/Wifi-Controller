const messagesType = {
  powerOn: () => '<1>',
  powerOff: () => '<0>',
  current: () => '<c>',
  readCv: (cv, id) => `<R ${cv} ${id} ${id}>`,
  writeCv: (cv, value, id) => `<W ${cv} ${value} ${id} ${id}>`,
  speed: (reg, addr, speed, dir) =>
    `<t ${reg} ${addr} ${Math.round((speed * 126) / 160)} ${dir}>`,
  function: (addr, byte1, byte2) => `<f ${addr} ${byte1} ${byte2}>`,
  accessory: (addr, dir) => `<T ${addr} ${dir}>`,
};

const parseMessage = (msg) => {
  const type = msg.replace(/<|>/g, '').charAt(0);
  const parts = msg.split(' ');

  const result = {
    raw: msg,
    isResponse: false,
    category: 'unknown',
    address: null,
    instructionType: 'Non défini',
    instruction: null,
  };

  switch (type) {
    case 'p':
      result.category = 'system';
      result.instructionType = 'Alimentation';
      result.instruction = msg === '<p1>' ? 'Power On' : 'Power Off';
      break;
    case 'H':
      result.category = 'accessory';
      result.instructionType = 'Accessoire';
      result.instruction = `Adresse: ${parseInt(parts[1], 10)}, Direction: ${
        parts[2] === '0>' ? 'Droit' : 'Déviée'
      }`;
      result.address = parseInt(parts[1], 10);
      break;
    case 'F':
      result.category = 'function';
      result.address = parseInt(parts[1], 10);
      result.instructionType = 'Fonctions de train';
      result.instruction = 'Activation des fonctions';
      break;
    case 'o':
      result.category = 's88';
      result.instructionType = 'S88';
      result.instruction = 'Initialisation S88';
      break;
    case 'y':
      result.category = 's88';
      result.instructionType = 'S88';
      result.instruction = 'Notification S88';
      break;
    case 'T':
      result.category = 'train';
      result.address = parseInt(parts[1], 10);
      result.instructionType = 'Vitesse de train';
      result.instruction = `Direction: ${
        parts[3] === '1' ? 'Avant' : 'Arrière'
      }, Vitesse: ${Math.round((parseInt(parts[2], 10) * 160) / 126)}`;
      break;
    default:
      if (msg.startsWith('<iDCCpp') || msg.startsWith('<N SERIAL')) {
        result.category = 'system';
        result.instructionType = 'Système';
        result.instruction = 'Information système';
      }
      break;
  }

  return result;
};

export { parseMessage };

export default messagesType;
