/* eslint-disable func-names */
import { expect } from 'chai';
import fs from 'fs';
import btoa from 'btoa';
import atob from 'atob';
import { changeDpiDataUrl, changeDpiBlob, changeDpiBuffer } from '../src/index';

const FileReader = () => {};
FileReader.prototype.readAsArrayBuffer = function (buffer) {
  this.result = buffer;
  this.onload();
};
const Blob = (arrays, options) => {
  const a = Buffer.from(arrays[0]);
  const b = Buffer.from(arrays[1]);
  const newbuff = Buffer.concat([a, b]);
  newbuff.type = options.type;
  return newbuff;
};

global.Blob = Blob;
global.FileReader = FileReader;
global.btoa = btoa;
global.atob = atob;

function base64Encode(file, type) {
  // read binary data
  const bitmap = fs.readFileSync(`${__dirname}/${file}`);
  // convert binary data to base64 encoded string
  return `data:${type};base64,${bitmap.toString('base64')}`;
}

// function saveFile(dataUrl, type, name) {
//   const base64Data = dataUrl.replace(`data:${type};base64,`, '');
//   return fs.writeFileSync(`${__dirname}/${name}`, base64Data, 'base64');
// }

describe('It can convert dpi', () => {
  it('PNG conversion dataurl', () => {
    const pngat415 = base64Encode('test415.png', 'image/png');
    const pngat830 = base64Encode('test830.png', 'image/png');
    const converted = changeDpiDataUrl(pngat415, 830);
    expect(pngat830 === converted).to.equal(true);
    expect(pngat415 === converted).to.equal(false);
  });

  it('JPEG conversion dataurl', () => {
    const jpeg123 = base64Encode('jpeg123.jpg', 'image/jpeg');
    const jpeg456 = base64Encode('jpeg456.jpg', 'image/jpeg');
    const converted = changeDpiDataUrl(jpeg123, 456);
    expect(jpeg456 === converted).to.equal(true);
    expect(jpeg123 === converted).to.equal(false);
  });

  it('JPEG conversion blob', () => {
    const b = fs.readFileSync(`${__dirname}/jpeg123.jpg`);
    const a = fs.readFileSync(`${__dirname}/jpeg456.jpg`);
    b.type = 'image/jpeg';
    return changeDpiBlob(b, 456).then((blob) => {
      expect(Buffer.compare(blob, a)).to.equal(0);
      expect(Buffer.compare(blob, b)).to.not.equal(0);
    });
  });

  // it('PNG conversion blob', () => {
  //   const b = fs.readFileSync(`${__dirname}/test415.png`);
  //   const a = fs.readFileSync(`${__dirname}/test830.png`);
  //   b.type = 'image/png';
  //   a.type = 'image/png';
  //   return changeDpiBlob(b, 830).then((blob) => {
  //     fs.writeFileSync(`${__dirname}/test.png`, blob);
  //     expect(Buffer.compare(blob, a)).to.equal(0);
  //   });
  // });

  it('JPEG conversion buffer', () => {
    const jpeg123 = fs.readFileSync(`${__dirname}/jpeg123.jpg`);
    const jpeg456 = fs.readFileSync(`${__dirname}/jpeg456.jpg`);
    const converted = changeDpiBuffer(jpeg123, 456, 'image/jpeg');
    expect(Buffer.compare(converted, jpeg456)).to.equal(0);
    expect(Buffer.compare(converted, jpeg123)).to.not.equal(0);
  });

  // it('PNG conversion buffer', () => {
  //   const test415 = fs.readFileSync(`${__dirname}/test415.png`);
  //   const test830 = fs.readFileSync(`${__dirname}/test830.png`);
  //   const converted = changeDpiBuffer(test415, 830, 'image/png');
  //   expect(Buffer.compare(converted, test830)).to.equal(0);
  //   expect(Buffer.compare(converted, test415)).to.not.equal(0);
  // });
});
