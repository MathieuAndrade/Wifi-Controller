const messagesType = {
  powerOn: () => '<1>',
  powerOff: () => '<0>',
  current: () => '<c>',
  readCv: (cv, id) => `<R ${cv} ${id} ${id}>`,
  writeCv: (cv, value, id) => `<W ${cv} ${value} ${id} ${id}>`,
  speed: (reg, addr, speed, dir) =>
    `<t ${reg} ${addr} ${Math.round((speed * 126) / 160)} ${dir}>`,
  function: (addr, byte1, byte2) => `<f ${addr} ${byte1} ${byte2}>`,
};

export default messagesType;
