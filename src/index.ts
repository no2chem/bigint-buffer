
interface ConverterInterface {
  toBigInt(buf: Buffer, bigEndian?: boolean): BigInt;
  fromBigInt(num: BigInt, buf: Buffer, bigEndian?: boolean): Buffer;
}

declare var process: {browser: boolean;};

let converter: ConverterInterface;

if (!process.browser) {
  try {
    converter = require('bindings')('bigint_buffer');
  } catch (e) {
    console.warn('bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)');
  }
}

/**
 * Convert a little-endian buffer into a BigInt.
 * @param buf The little-endian buffer to convert
 * @returns A BigInt with the little-endian representation of buf.
 */
export function LEToBigInt(buf: Buffer): BigInt {
  if (process.browser || converter === undefined) {
    const reversed = Buffer.from(buf);
    reversed.reverse();
    return BigInt(`0x${reversed.toString('hex')}`);
  }
  return converter.toBigInt(buf, false);
}

/**
 * Convert a big-endian buffer into a BigInt
 * @param buf The big-endian buffer to convert.
 * @returns A BigInt with the big-endian representation of buf.
 */
export function BEToBigInt(buf: Buffer): BigInt {
  if (process.browser || converter === undefined) {
    return BigInt(`0x${buf.toString('hex')}`);
  }
  return converter.toBigInt(buf, true);
}

/**
 * Convert a BigInt to a little-endian buffer.
 * @param num   The BigInt to convert.
 * @param width The number of bytes that the resulting buffer should be.
 * @returns A little-endian buffer representation of num.
 */
export function ToLEBuffer(num: BigInt, width: number): Buffer {
  if (process.browser || converter === undefined) {
    const hex = num.toString(16);
    const buffer =
        Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
    buffer.reverse();
    return buffer;
  }
  // Allocation is done here, since it is slower using napi in C
  return converter.fromBigInt(num, Buffer.allocUnsafe(width), false);
}

/**
 * Convert a BigInt to a big-endian buffer.
 * @param num   The BigInt to convert.
 * @param width The number of bytes that the resulting buffer should be.
 * @returns A big-endian buffer representation of num.
 */
export function ToBEBuffer(num: BigInt, width: number): Buffer {
  if (process.browser || converter === undefined) {
    const hex = num.toString(16);
    return Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
  }
  return converter.fromBigInt(num, Buffer.allocUnsafe(width), true);
}