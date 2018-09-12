import 'mocha';
declare var process: {browser: boolean;};

import * as chai from 'chai';
import * as path from 'path';

const lib = process.browser ?
    require('./browser') :
    require(path.join(__dirname, '../build/src/node'));
const BEToBigInt = lib.BEToBigInt;
const LEToBigInt = lib.LEToBigInt;
const ToBEBuffer = lib.ToBEBuffer;
const ToLEBuffer = lib.ToLEBuffer;

// Needed for should.not.be.undefined.
/* tslint:disable:no-unused-expression */

chai.should();
const should = chai.should();

const assertEquals = (n0: BigInt, n1: BigInt) => {
  n0.toString(16).should.equal(n1.toString(16));
};

describe('Try buffer conversion (little endian)', () => {
  it('0 should equal 0n', () => {
    assertEquals(LEToBigInt(Buffer.from([0])), BigInt('0'));
  });

  it('1 should equal 1n', async () => {
    assertEquals(LEToBigInt(Buffer.from([1])), BigInt('1'));
  });

  it('0xdead should equal 0xdeadn', async () => {
    assertEquals(LEToBigInt(Buffer.from([0xad, 0xde])), BigInt(`0xdead`));
  });

  it('0xdeadbeef should equal 0xdeadbeefn', async () => {
    assertEquals(
        LEToBigInt(Buffer.from([0xef, 0xbe, 0xad, 0xde])),
        BigInt(`0xdeadbeef`));
  });

  it('0xbadc0ffee0 should equal 0xbadc0ffee0n', async () => {
    assertEquals(
        LEToBigInt(Buffer.from([0xe0, 0xfe, 0x0f, 0xdc, 0xba])),
        BigInt(`0xbadc0ffee0`));
  });

  it('0xbadc0ffee0dd should equal 0xbadc0ffee0ddn', async () => {
    assertEquals(
        LEToBigInt(Buffer.from([0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba])),
        BigInt(`0xbadc0ffee0dd`));
  });

  it('0xbadc0ffee0ddf0 should equal 0xbadc0ffee0ddf0n', async () => {
    assertEquals(
        LEToBigInt(Buffer.from([0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba])),
        BigInt(`0xbadc0ffee0ddf0`));
  });

  it('0xbadc0ffee0ddf00d should equal 0xbadc0ffee0ddf00dn', async () => {
    assertEquals(
        LEToBigInt(
            Buffer.from([0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba])),
        BigInt(`0xbadc0ffee0ddf00d`));
  });

  it('0xbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefn',
     async () => {
       assertEquals(
           LEToBigInt(Buffer.from([
             0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc,
             0xba
           ])),
           BigInt(`0xbadc0ffee0ddf00ddeadbeef`));
     });
});

describe('Try buffer conversion (big endian)', () => {
  it('0 should equal 0n', () => {
    assertEquals(BEToBigInt(Buffer.from([0])), BigInt(`0`));
  });

  it('1 should equal 1n', async () => {
    assertEquals(BEToBigInt(Buffer.from([1])), BigInt(`1`));
  });

  it('0xdead should equal 0xdeadn', async () => {
    assertEquals(BEToBigInt(Buffer.from([0xde, 0xad])), BigInt(`0xdead`));
  });

  it('0xdeadbeef should equal 0xdeadbeefn', async () => {
    assertEquals(
        BEToBigInt(Buffer.from([0xde, 0xad, 0xbe, 0xef])),
        BigInt(`0xdeadbeef`));
  });

  it('0xbadc0ffee0 should equal 0xbadc0ffee0n', async () => {
    assertEquals(
        BEToBigInt(Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0])),
        BigInt(`0xbadc0ffee0`));
  });

  it('0xbadc0ffee0dd should equal 0xbadc0ffee0ddn', async () => {
    assertEquals(
        BEToBigInt(Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd])),
        BigInt(`0xbadc0ffee0dd`));
  });

  it('0xbadc0ffee0ddf0 should equal 0xbadc0ffee0ddf0n', async () => {
    assertEquals(
        BEToBigInt(Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0])),
        BigInt(`0xbadc0ffee0ddf0`));
  });

  it('0xbadc0ffee0ddf00d should equal 0xbadc0ffee0ddf00dn', async () => {
    assertEquals(
        BEToBigInt(
            Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d])),
        BigInt(`0xbadc0ffee0ddf00d`));
  });

  it('0xbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefn',
     async () => {
       assertEquals(
           BEToBigInt(Buffer.from([
             0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d, 0xde, 0xad, 0xbe,
             0xef
           ])),
           BigInt(`0xbadc0ffee0ddf00ddeadbeef`));
     });

  it('long value should equal long val', async () => {
    assertEquals(
        BEToBigInt(Buffer.from(
            'badc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef',
            'hex')),
        BigInt(
            `0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`));
  });
});

describe('Try bigint conversion (little endian)', () => {
  it('0 should equal 0n', () => {
    ToLEBuffer(BigInt(`0`), 8).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0, 0, 0, 0
    ]));
  });

  it('1 should equal 1n', async () => {
    ToLEBuffer(BigInt(`1`), 8).should.deep.equal(Buffer.from([
      1, 0, 0, 0, 0, 0, 0, 0
    ]));
  });

  it('0xdead should equal 0xdeadn (6 byte)', async () => {
    ToLEBuffer(BigInt(`0xdead`), 6).should.deep.equal(Buffer.from([
      0xad, 0xde, 0, 0, 0, 0
    ]));
  });

  it('0xdeadbeef should equal 0xdeadbeef0000000000n (9 byte)', async () => {
    ToLEBuffer(BigInt(`0xdeadbeef`), 9).should.deep.equal(Buffer.from([
      0xef, 0xbe, 0xad, 0xde, 0, 0, 0, 0, 0
    ]));
  });

  it('0xbadc0ffee0ddf00d should equal 0xbadc0ffee0ddf00dn (8 byte)',
     async () => {
       ToLEBuffer(BigInt(`0xbadc0ffee0ddf00d`), 8)
           .should.deep.equal(
               Buffer.from([0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba]));
     });

  it('0xbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefn',
     async () => {
       ToLEBuffer(BigInt(`0xbadc0ffee0ddf00ddeadbeef`), 12)
           .should.deep.equal(Buffer.from([
             0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc,
             0xba
           ]));
     });

  it('long value should equal long val', async () => {
    ToLEBuffer(BigInt(`0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`), 24)
        .should.deep.equal(Buffer.from([
          0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xdd, 0xe0,
          0xfe, 0x0f, 0xdc, 0xba, 0xef, 0xbe, 0xad, 0xde,
          0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba
        ]));
  });
});


describe('Try bigint conversion (big endian)', () => {
  it('0 should equal 0n', () => {
    ToBEBuffer(BigInt(`0`), 8).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0, 0, 0, 0
    ]));
  });

  it('1 should equal 1n', async () => {
    ToBEBuffer(BigInt(`1`), 8).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0, 0, 0, 1
    ]));
  });

  it('0xdead should equal 0xdeadn (6 byte)', async () => {
    ToBEBuffer(BigInt(`0xdead`), 6).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0xde, 0xad
    ]));
  });

  it('0xdeadbeef should equal 0xdeadbeef0000000000n (9 byte)', async () => {
    ToBEBuffer(BigInt(`0xdeadbeef`), 9).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0, 0xde, 0xad, 0xbe, 0xef
    ]));
  });

  it('0xbadc0ffee0ddf00d should equal 0xbadc0ffee0ddf00dn (8 byte)',
     async () => {
       ToBEBuffer(BigInt(`0xbadc0ffee0ddf00d`), 8)
           .should.deep.equal(
               Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d]));
     });

  it('0xbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefn',
     async () => {
       ToBEBuffer(BigInt(`0xbadc0ffee0ddf00ddeadbeef`), 12)
           .should.deep.equal(Buffer.from([
             0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d, 0xde, 0xad, 0xbe,
             0xef
           ]));
     });

  it('long value should equal long val', async () => {
    ToBEBuffer(BigInt(`0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`), 24)
        .should.deep.equal(Buffer.from([
          0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d,
          0xde, 0xad, 0xbe, 0xef, 0xba, 0xdc, 0x0f, 0xfe,
          0xe0, 0xdd, 0xf0, 0x0d, 0xde, 0xad, 0xbe, 0xef
        ]));
  });
});