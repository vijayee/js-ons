const OffUrl = require('./off-url')
const util = require('../utility')
const bs58 = require('bs58')
let _offUrl = new WeakMap()
let _key = new WeakMap()
let _value = new WeakMap()
module.exports = class Record {
  constructor (options) {
    if (options instanceof OffUrl) {
      let offUrl = options
      let key = `${bs58.encode(util.hash(offUrl.fileHash))}O`
      _key.set(this, key)
      _offUrl.set(this, offUrl)
      let value = util.encrypt(offUrl.toString(), offUrl.fileHash)
      _value.set(this, value)
    } else {
      if (typeof options.key !== 'string') {
        throw new TypeError('Invalid Key')
      } else {
        _key.set(this, options.key)
      }
      if (!Buffer.isBuffer(options.value)) {
        throw new TypeError('Invalid Value')
      } else {
        _value.set(this, options.value)
      }
    }
  }
  get key () {
    let key = _key.get(this)
    return key
  }
  get value () {
    let value = _value.get(this)
    return value.slice(0)
  }
  contents (decKey) {
    let offUrl = _offUrl.get(this)
    if (offUrl) {
      return offUrl.toString()
    }
    if (decKey) {
      let value = _value.get(this)
      let url = util.decrypt(value, decKey)
      offUrl = OffUrl.parse(url.toString())
      if (offUrl.fileHash !== decKey) {
        throw new Error('Invalid Record Detected')
      }
      _offUrl.set(offUrl)
      return offUrl.toString()
    } else {
      throw new TypeError('Invalid Decryption Key')
    }
  }
  static fromString (url) {
    return new Record(OffUrl.parse(url))
  }
  static fromJSON (obj) {
    return new Record(obj)
  }
  toJSON () {
    return {key: this.key, value: this.value}
  }
}
