
#define NAPI_EXPERIMENTAL
#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <limits.h> 

#define BIT_MASK(__TYPE__, __ONE_COUNT__) \
    ((__TYPE__) (-((__ONE_COUNT__) != 0))) \
    & (((__TYPE__) -1) >> ((sizeof(__TYPE__) * CHAR_BIT) - (__ONE_COUNT__)))

// The maximum size we'll store on the stack. If we need a larger temporary
// buffer malloc will be called.
const size_t BUFFER_STACK_SIZE = 32;

/**
 * Converts a Buffer to bigint.
 * node param 0: buffer
 * node param 1: big_endian (optional boolean)
 * 
 * returns bigint
 */
napi_value toBigInt (napi_env env, napi_callback_info info) {
  napi_value argv[2];
  napi_status status;
  size_t argc = 2;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  assert(status == napi_ok);

  if (argc < 1) {
    napi_throw_error(env, "EINVAL", "Too few arguments");
    return NULL;
  }

  bool big_endian;
  status = napi_get_value_bool(env, argv[1], &big_endian);
  if (status == napi_boolean_expected) { big_endian = false; }

  uint8_t* buffer;
  size_t len;
  status = napi_get_buffer_info(env, argv[0], (void**) &buffer, &len);
  assert(status == napi_ok);

  // If len is not divisible by 8 bytes, we'll need to copy
  bool not_64_aligned = len & 7;
  bool fits_in_stack = len <= BUFFER_STACK_SIZE;
  size_t overflow_len = (8 - (len & 7));
  size_t aligned_len = len + overflow_len;
  if (not_64_aligned) {
      uint8_t copy[BUFFER_STACK_SIZE];
      uint8_t* bufTemp = fits_in_stack ? copy : malloc(aligned_len);
      memset(bufTemp + len, 0, overflow_len);
      memcpy(bufTemp, buffer, len);
      buffer = bufTemp;
  }

  napi_value out;
  size_t len_in_words = (len >> 3) // Right Shift 3 === Divide by 8
  + ((len & 7) ? 1 : 0); // len & 7 === len % 8 === 0?

  // swap
  if (big_endian) {
    uint64_t* buffer64 = (uint64_t*) buffer;
    size_t overflow_in_bits = overflow_len << 3; // == overflow_len * 8
    if (len_in_words == 1) {
        buffer64[0] = not_64_aligned ? __builtin_bswap64(buffer64[0]) >> overflow_in_bits :  __builtin_bswap64(buffer64[0]);
    } else {
        uint64_t temp;
        size_t last_word = len_in_words - 1;
        size_t end_ptr = last_word;
        for (uint32_t offset = 0; offset < len_in_words / 2; offset++) {
            temp = buffer64[offset];
            buffer64[offset] = buffer64[end_ptr];
            buffer64[end_ptr] = temp;
            end_ptr--;
        } 
        uint64_t prev_overflow = 0;
        for (int32_t offset = last_word; offset >= 0; offset--) {
            uint64_t as_little_endian = __builtin_bswap64(buffer64[offset]);
            uint64_t overflow = as_little_endian & BIT_MASK(uint64_t, overflow_in_bits); //top?
            buffer64[offset] = (as_little_endian >> overflow_in_bits) | prev_overflow;
            prev_overflow = overflow << (64 - overflow_in_bits);
        }
    }
  }

  status = napi_create_bigint_words(env, 0, len_in_words, (uint64_t*) buffer , &out);
  assert(status == napi_ok);

  if (not_64_aligned && !fits_in_stack) {
      free(buffer);
  }

  return out;
}

/**
 * Converts a BigInt to a Buffer
 * node param 0: BigInt
 * node param 1: buffer
 * node param 2: big_endian (optional boolean)
 * 
 * returns bigint
 */
napi_value fromBigInt (napi_env env, napi_callback_info info) {
  napi_value argv[3];
  napi_status status;
  size_t argc = 3;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  assert(status == napi_ok);

  if (argc < 1) {
    napi_throw_error(env, "EINVAL", "Too few arguments");
    return NULL;
  }

  size_t byte_width;
  bool big_endian;
  status = napi_get_value_bool(env, argv[2], &big_endian);
  if (status == napi_boolean_expected) { big_endian = false; }

  size_t word_count;
  status = napi_get_value_bigint_words(env, argv[0], NULL, &word_count, NULL);
  assert(status == napi_ok);

  uint8_t* raw_buffer;
  status = napi_get_buffer_info(env, argv[1], (void**) &raw_buffer, &byte_width);
  assert(status == napi_ok);

  if (word_count == 0) {
      memset(raw_buffer, 0, byte_width);
      return argv[1];
  }

  int sign_bit = 0;
  
  bool not_64_aligned = byte_width & 7;
  size_t overflow_len = byte_width & 7;
  size_t word_width = (byte_width >> 3) + (not_64_aligned ? 1 : 0);
  size_t original_word_width = word_width;
  if (word_count > word_width) {
      word_count = word_width;
  }
  bool fits_in_stack = (word_count << 3) <= BUFFER_STACK_SIZE;

  uint64_t* conv_buffer = (uint64_t*) raw_buffer;
  if (not_64_aligned) {
      uint64_t stack_buffer[BUFFER_STACK_SIZE];
      conv_buffer = fits_in_stack ? stack_buffer : malloc(byte_width + overflow_len);
      memset(conv_buffer, 0, byte_width);
  }
  status = napi_get_value_bigint_words(env, argv[0], &sign_bit, &word_count, conv_buffer);
  assert(status == napi_ok);

  if (big_endian) {
        uint64_t temp;
        size_t conv_words = original_word_width;
        size_t last_word = conv_words - 1;
        size_t end_ptr = last_word;
        
        for (uint32_t offset = 0; offset < conv_words / 2; offset++) {
            temp = __builtin_bswap64(conv_buffer[offset]);
            conv_buffer[offset] = __builtin_bswap64(conv_buffer[end_ptr]);
            conv_buffer[end_ptr] = temp;
            end_ptr--;
        } 
        if (conv_words & 1) {
            conv_buffer[conv_words / 2] = __builtin_bswap64(conv_buffer[conv_words / 2]);;
        }
  }
  if (not_64_aligned) {
      memcpy(raw_buffer, big_endian ? (uint64_t*)(((uint8_t*)conv_buffer) + (8-(byte_width & 7))) : conv_buffer, byte_width);
      if (!fits_in_stack) {
          free(conv_buffer);
      }
  }
  return argv[1];
}

napi_value init_all (napi_env env, napi_value exports) {
  napi_value bigint_fn;
  napi_value frombigint_fn;

  napi_create_function(env, NULL, 0, toBigInt, NULL, &bigint_fn);
  napi_create_function(env, NULL, 0, fromBigInt, NULL, &frombigint_fn);

  napi_set_named_property(env, exports, "toBigInt", bigint_fn);
  napi_set_named_property(env, exports, "fromBigInt", frombigint_fn);

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init_all);