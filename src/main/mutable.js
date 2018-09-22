const util = require('../utility')
const bs58 = require('bs58')
let _pubKey = new WeakMap()
let _privKey = new WeakMap()
let _key = new WeakMap()
let _contents = new WeakMap()
module.exports = class Mutable {
  constructor (options) {
    if (options) {
      if (!options.contents || !Buffer.isBuffer(options.contents)) {
        throw new TypeError('Invalid Content')
      }
      if (!options.pubKey || !Buffer.isBuffer(options.pubKey)) {
        throw new TypeError('Invalid PublicKey')
      }
      _contents.set(this, options.contents)
      _pubKey.set(this, options.pubKey)
    } else {
      let keys = util.generateKeys()
      _pubKey.set(this, keys.pubKey)
      _privKey.set(this, keys.privKey)
    }
  }
  get key () {
    let key = _key.get(this)
    if (key) {
      return key
    } else {
      let pubKey = _pubKey.get(this)
      key = `${bs58.encode(util.hash(pubKey))}I`
      _key.set(this, key)
      return key
    }
  }
  get value () {
    let pubKey = _pubKey.get(this)
    let contents = _contents.get(this)
    return {contents, pubKey}
  }
  set privKey (privKey) {
    if (!Buffer.isBuffer(privKey)) {
      throw new TypeError('Invalid Private Key')
    }
    let pubKey = _pubKey.get(this)
    if (!util.isKeyPair(pubKey, privKey)) {
      throw new TypeError('Invalid Private Key')
    }
    _privKey.set(this, privKey)
  }
  get privKey () {
    let privKey = _privKey.get(this)
    return privKey.slice(0)
  }
  get contents () {
    let contents = _contents.get(this)
    if (!contents) {
      return contents
    }
    let pubKey = _pubKey.get(this)
    return util.publicDecrypt(contents, pubKey)
  }
  set contents (contents) {
    let privKey = _privKey.get(this)
    if (!privKey) {
      throw new TypeError('Invalid Private Key')
    }
    console.log(util.isRecord(contents))
    if (!contents || typeof contents !== 'string' || !util.isRecord(contents)) {
      throw new TypeError('Invalid Contents')
    }
    _contents.set(this, util.privateEncrypt(contents, privKey))
  }
  toString () {
    let pubKey = _pubKey.get(this)
    let contents = _contents.get(this)
    return util.publicDecrypt(contents, pubKey)
  }

}
