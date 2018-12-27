const util = require('../utility')
const bs58 = require('bs58')
let _pubKey = new WeakMap()
let _privKey = new WeakMap()
let _key = new WeakMap()
let _contents = new WeakMap()
let _signature = new WeakMap()
let _nonce = new WeakMap()
module.exports = class Mutable {
  constructor (options) {
    if (options) {
      if (!options.contents || typeof options.contents !== 'string') {
        throw new TypeError('Invalid Content')
      }
      if (!options.pubKey || !Buffer.isBuffer(options.pubKey)) {
        throw new TypeError('Invalid PublicKey')
      }
      if (!options.signature || !Buffer.isBuffer(options.signature)) {
        throw new TypeError('Invalid Signature')
      }
      if (!options.nonce || !Number.isInteger(options.nonce)) {
        throw new TypeError('Invalid Nonce')
      }
      if (!util.publicVerify(options.contents, options.signature, options.nonce, options.pubKey)) {
        throw new Error('Invalid Signature')
      }
      _contents.set(this, options.contents)
      _pubKey.set(this, options.pubKey)
      _signature.set(this, options.signature)
    } else {
      let keys = util.generateKeys()
      _pubKey.set(this, keys.pubKey)
      _privKey.set(this, keys.privKey)
    }
  }
  get nonce () {
    return _nonce.get(this)
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
    let signature = _signature.get(this)
    let nonce = _nonce.get(this)
    return {contents, pubKey, signature, nonce}
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
    if (privKey) {
      return privKey.slice(0)
    } else {
      return undefined
    }
  }
  get contents () {
    let contents = _contents.get(this)
    return contents
  }
  set contents (contents) {
    let privKey = _privKey.get(this)
    if (!privKey) {
      throw new TypeError('Invalid Private Key')
    }
    if (!contents || typeof contents !== 'string' || !util.isRecord(contents)) {
      throw new TypeError('Invalid Contents')
    }
    let {signature, nonce} = util.privateSign(contents, privKey)
    _signature.set(this, signature)
    _nonce.set(this, nonce)
    _contents.set(this, contents)
  }
}
