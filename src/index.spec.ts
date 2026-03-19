import 'mocha';
declare var process: {browser: boolean;};

import * as chai from 'chai';
import * as path from 'path';

const lib = process.browser ? require('../../dist/browser') :
                              require(path.join(__dirname, '../dist/node'));
const toBigIntBE = lib.toBigIntBE;
const toBigIntLE = lib.toBigIntLE;
const toBufferBE = lib.toBufferBE;
const toBufferLE = lib.toBufferLE;

// Needed for should.not.be.undefined.
/* tslint:disable:no-unused-expression */

chai.should();
const should = chai.should();

const assertEquals = (n0: BigInt, n1: BigInt) => {
  n0.toString(16).should.equal(n1.toString(16));
};

describe('Try buffer conversion (little endian)', () => {
  it('0 should equal 0n', () => {
    assertEquals(toBigIntLE(Buffer.from([0])), BigInt('0'));
  });

  it('1 should equal 1n', async () => {
    assertEquals(toBigIntLE(Buffer.from([1])), BigInt('1'));
  });

  it('0xdead should equal 0xdeadn', async () => {
    assertEquals(toBigIntLE(Buffer.from([0xad, 0xde])), BigInt(`0xdead`));
  });

  it('0xdeadbeef should equal 0xdeadbeefn', async () => {
    assertEquals(
        toBigIntLE(Buffer.from([0xef, 0xbe, 0xad, 0xde])),
        BigInt(`0xdeadbeef`));
  });

  it('0xbadc0ffee0 should equal 0xbadc0ffee0n', async () => {
    assertEquals(
        toBigIntLE(Buffer.from([0xe0, 0xfe, 0x0f, 0xdc, 0xba])),
        BigInt(`0xbadc0ffee0`));
  });

  it('0xbadc0ffee0dd should equal 0xbadc0ffee0ddn', async () => {
    assertEquals(
        toBigIntLE(Buffer.from([0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba])),
        BigInt(`0xbadc0ffee0dd`));
  });

  it('0xbadc0ffee0ddf0 should equal 0xbadc0ffee0ddf0n', async () => {
    assertEquals(
        toBigIntLE(Buffer.from([0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba])),
        BigInt(`0xbadc0ffee0ddf0`));
  });

  it('0xbadc0ffee0ddf00d should equal 0xbadc0ffee0ddf00dn', async () => {
    assertEquals(
        toBigIntLE(
            Buffer.from([0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba])),
        BigInt(`0xbadc0ffee0ddf00d`));
  });

  it('0xbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefn',
     async () => {
       assertEquals(
           toBigIntLE(Buffer.from([
             0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc,
             0xba
           ])),
           BigInt(`0xbadc0ffee0ddf00ddeadbeef`));
     });
  it('0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeefn',
     async () => {
       assertEquals(
           toBigIntLE(Buffer.from([
             0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xdd, 0xe0,
             0xfe, 0x0f, 0xdc, 0xba, 0xef, 0xbe, 0xad, 0xde,
             0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba
           ])),
           BigInt(`0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`));
     });
  it('0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeefbeef should equal 0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeefbeefn',
     async () => {
       assertEquals(
           toBigIntLE(Buffer.from([
             0xef, 0xbe, 0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xdd,
             0xe0, 0xfe, 0x0f, 0xdc, 0xba, 0xef, 0xbe, 0xad, 0xde,
             0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba
           ])),
           BigInt(`0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeefbeef`));
     });
});

describe('Try buffer conversion (big endian)', () => {
  it('0 should equal 0n', () => {
    assertEquals(toBigIntBE(Buffer.from([0])), BigInt(`0`));
  });

  it('1 should equal 1n', async () => {
    assertEquals(toBigIntBE(Buffer.from([1])), BigInt(`1`));
  });

  it('0xdead should equal 0xdeadn', async () => {
    assertEquals(toBigIntBE(Buffer.from([0xde, 0xad])), BigInt(`0xdead`));
  });

  it('0xdeadbeef should equal 0xdeadbeefn', async () => {
    assertEquals(
        toBigIntBE(Buffer.from([0xde, 0xad, 0xbe, 0xef])),
        BigInt(`0xdeadbeef`));
  });

  it('0xbadc0ffee0 should equal 0xbadc0ffee0n', async () => {
    assertEquals(
        toBigIntBE(Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0])),
        BigInt(`0xbadc0ffee0`));
  });

  it('0xbadc0ffee0dd should equal 0xbadc0ffee0ddn', async () => {
    assertEquals(
        toBigIntBE(Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd])),
        BigInt(`0xbadc0ffee0dd`));
  });

  it('0xbadc0ffee0ddf0 should equal 0xbadc0ffee0ddf0n', async () => {
    assertEquals(
        toBigIntBE(Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0])),
        BigInt(`0xbadc0ffee0ddf0`));
  });

  it('0xbadc0ffee0ddf00d should equal 0xbadc0ffee0ddf00dn', async () => {
    assertEquals(
        toBigIntBE(
            Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d])),
        BigInt(`0xbadc0ffee0ddf00d`));
  });

  it('0xbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefn',
     async () => {
       assertEquals(
           toBigIntBE(Buffer.from([
             0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d, 0xde, 0xad, 0xbe,
             0xef
           ])),
           BigInt(`0xbadc0ffee0ddf00ddeadbeef`));
     });

  it('long value should equal long val', async () => {
    assertEquals(
        toBigIntBE(Buffer.from(
            'badc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef',
            'hex')),
        BigInt(
            `0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`));
  });

  it('other long value should equal long val', async () => {
    assertEquals(
        toBigIntBE(Buffer.from(
            'd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544',
            'hex')),
        BigInt(
            `0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544`));
  });
});

describe('Try bigint conversion (little endian)', () => {
  it('0 should equal 0n', () => {
    toBufferLE(BigInt(`0`), 8).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0, 0, 0, 0
    ]));
  });

  it('1 should equal 1n', async () => {
    toBufferLE(BigInt(`1`), 8).should.deep.equal(Buffer.from([
      1, 0, 0, 0, 0, 0, 0, 0
    ]));
  });


  it('1 should equal 1n (32 byte)', async () => {
    toBufferLE(BigInt(`1`), 32)
        .should.deep.equal(Buffer.from(
            '0100000000000000000000000000000000000000000000000000000000000000',
            'hex'));
  });

  it('0xdead should equal 0xdeadn (6 byte)', async () => {
    toBufferLE(BigInt(`0xdead`), 6).should.deep.equal(Buffer.from([
      0xad, 0xde, 0, 0, 0, 0
    ]));
  });

  it('0xdeadbeef should equal 0xdeadbeef0000000000n (9 byte)', async () => {
    toBufferLE(BigInt(`0xdeadbeef`), 9).should.deep.equal(Buffer.from([
      0xef, 0xbe, 0xad, 0xde, 0, 0, 0, 0, 0
    ]));
  });

  it('0xbadc0ffee0ddf00d should equal 0xbadc0ffee0ddf00dn (8 byte)',
     async () => {
       toBufferLE(BigInt(`0xbadc0ffee0ddf00d`), 8)
           .should.deep.equal(
               Buffer.from([0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba]));
     });

  it('0xbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefn',
     async () => {
       toBufferLE(BigInt(`0xbadc0ffee0ddf00ddeadbeef`), 12)
           .should.deep.equal(Buffer.from([
             0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc,
             0xba
           ]));
     });

  it('long value should equal long val', async () => {
    toBufferLE(BigInt(`0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`), 24)
        .should.deep.equal(Buffer.from([
          0xef, 0xbe, 0xad, 0xde, 0x0d, 0xf0, 0xdd, 0xe0,
          0xfe, 0x0f, 0xdc, 0xba, 0xef, 0xbe, 0xad, 0xde,
          0x0d, 0xf0, 0xdd, 0xe0, 0xfe, 0x0f, 0xdc, 0xba
        ]));
  });
});


describe('Try bigint conversion (big endian)', () => {
  it('0 should equal 0n', () => {
    toBufferBE(BigInt(`0`), 8).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0, 0, 0, 0
    ]));
  });

  it('1 should equal 1n', async () => {
    toBufferBE(BigInt(`1`), 8).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0, 0, 0, 1
    ]));
  });

  it('1 should equal 1n (32 byte)', async () => {
    toBufferBE(BigInt(`1`), 32)
        .should.deep.equal(Buffer.from(
            '0000000000000000000000000000000000000000000000000000000000000001',
            'hex'));
  });

  it('0xdead should equal 0xdeadn (6 byte)', async () => {
    toBufferBE(BigInt(`0xdead`), 6).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0xde, 0xad
    ]));
  });

  it('0xdeadbeef should equal 0xdeadbeef0000000000n (9 byte)', async () => {
    toBufferBE(BigInt(`0xdeadbeef`), 9).should.deep.equal(Buffer.from([
      0, 0, 0, 0, 0, 0xde, 0xad, 0xbe, 0xef
    ]));
  });

  it('0xbadc0ffee0ddf00d should equal 0xbadc0ffee0ddf00dn (8 byte)',
     async () => {
       toBufferBE(BigInt(`0xbadc0ffee0ddf00d`), 8)
           .should.deep.equal(
               Buffer.from([0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d]));
     });

  it('0xbadc0ffee0ddf00ddeadbeef should equal 0xbadc0ffee0ddf00ddeadbeefn',
     async () => {
       toBufferBE(BigInt(`0xbadc0ffee0ddf00ddeadbeef`), 12)
           .should.deep.equal(Buffer.from([
             0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d, 0xde, 0xad, 0xbe,
             0xef
           ]));
     });

  it('long value should equal long val', async () => {
    toBufferBE(BigInt(`0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`), 24)
        .should.deep.equal(Buffer.from([
          0xba, 0xdc, 0x0f, 0xfe, 0xe0, 0xdd, 0xf0, 0x0d,
          0xde, 0xad, 0xbe, 0xef, 0xba, 0xdc, 0x0f, 0xfe,
          0xe0, 0xdd, 0xf0, 0x0d, 0xde, 0xad, 0xbe, 0xef
        ]));
  });
});

describe('Buffer overflow regression (SNYK-JS-BIGINTBUFFER-3364597)', () => {
  // Small BigInt into a non-aligned buffer wider than the native stack buffer.
  // Before the fix, fromBigInt compared word_count bytes (small) against the
  // stack limit, then memset the full byte_width+overflow into the undersized
  // stack buffer, causing a stack buffer overflow.

  it('toBufferBE with small bigint and non-aligned width > 32 bytes', () => {
    const buf = toBufferBE(BigInt(`0xdeadbeef`), 33);
    buf.length.should.equal(33);
    // First 29 bytes should be zero-padded, last 4 bytes hold the value
    for (let i = 0; i < 29; i++) {
      buf[i].should.equal(0, `byte ${i} should be 0`);
    }
    buf[29].should.equal(0xde);
    buf[30].should.equal(0xad);
    buf[31].should.equal(0xbe);
    buf[32].should.equal(0xef);
  });

  it('toBufferLE with small bigint and non-aligned width > 32 bytes', () => {
    const buf = toBufferLE(BigInt(`0xdeadbeef`), 33);
    buf.length.should.equal(33);
    buf[0].should.equal(0xef);
    buf[1].should.equal(0xbe);
    buf[2].should.equal(0xad);
    buf[3].should.equal(0xde);
    for (let i = 4; i < 33; i++) {
      buf[i].should.equal(0, `byte ${i} should be 0`);
    }
  });

  it('toBufferBE with small bigint and large non-aligned width (257 bytes)', () => {
    const buf = toBufferBE(BigInt(`0x1`), 257);
    buf.length.should.equal(257);
    for (let i = 0; i < 256; i++) {
      buf[i].should.equal(0, `byte ${i} should be 0`);
    }
    buf[256].should.equal(1);
  });

  it('toBufferLE with small bigint and large non-aligned width (257 bytes)', () => {
    const buf = toBufferLE(BigInt(`0x1`), 257);
    buf.length.should.equal(257);
    buf[0].should.equal(1);
    for (let i = 1; i < 257; i++) {
      buf[i].should.equal(0, `byte ${i} should be 0`);
    }
  });

  it('roundtrip BE with non-aligned width (33 bytes)', () => {
    const val = BigInt(`0xbadc0ffee0ddf00ddeadbeef`);
    const buf = toBufferBE(val, 33);
    const result = toBigIntBE(buf);
    assertEquals(result, val);
  });

  it('roundtrip LE with non-aligned width (33 bytes)', () => {
    const val = BigInt(`0xbadc0ffee0ddf00ddeadbeef`);
    const buf = toBufferLE(val, 33);
    const result = toBigIntLE(buf);
    assertEquals(result, val);
  });

  it('roundtrip BE with large non-aligned width (257 bytes)', () => {
    const val = BigInt(`0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`);
    const buf = toBufferBE(val, 257);
    const result = toBigIntBE(buf);
    assertEquals(result, val);
  });

  it('roundtrip LE with large non-aligned width (257 bytes)', () => {
    const val = BigInt(`0xbadc0ffee0ddf00ddeadbeefbadc0ffee0ddf00ddeadbeef`);
    const buf = toBufferLE(val, 257);
    const result = toBigIntLE(buf);
    assertEquals(result, val);
  });
});