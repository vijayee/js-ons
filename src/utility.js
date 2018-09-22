'use strict'
const crypto = require('crypto')
const Elliptic = require('elliptic').ec
const ECIES = require('bitcore-ecies')
let util = {}

util.hash = (data) => {
  let hash = crypto.createHash('sha256', { digestLength: 34 })
  hash.update(data)
  return hash.digest()
}
util.encrypt = (data, encKey) => {
  let iv = crypto.randomBytes(16)
  let sha512 = crypto.createHash('sha512')
  sha512.update(encKey)
  let digest = sha512.digest().slice(0, 32)
  let cipher = crypto.createCipheriv('aes-256-ctr', digest, iv)
  cipher.setAutoPadding(false)

  let ciphertext = cipher.update(data)
  return Buffer.concat([iv, ciphertext, cipher.final()])
}
util.decrypt = (data, decKey) => {
  if (data.length < 16) {
    throw new Error('Invalid Data Length')
  }
  let iv = data.slice(0, 16)
  let sha512 = crypto.createHash('sha512')
  sha512.update(decKey)
  let digest = sha512.digest().slice(0, 32)
  let decipher = crypto.createDecipheriv('aes-256-ctr', digest, iv)
  decipher.setAutoPadding(false)

  let ciphertext = data.slice(16)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()])
}
util.generateKeys = () => {
  let curve = new Elliptic('curve25519')
  let key = curve.genKeyPair()
  let pubKey = Buffer.from(key.getPublic('hex'), 'hex')
  let privKey = Buffer.from(key.getPrivate('hex'), 'hex')
  console.log(pubKey, privKey)
  return {pubKey, privKey}
}
util.privateEncrypt = (data, privKey) => {
  if (!Buffer.isBuffer(data)) {
    data = Buffer.from(data)
  }
  let curve = new Elliptic('curve25519', {priv: privKey.toString('hex')})
  let key = curve.genKeyPair()
  privKey = key.getPrivate()
  let pubKey = key.getPublic()
  return ECIES().privateKey(privKey).publicKey(pubKey).encrypt(privKey)
}
util.publicDecrypt = (data, pubKey) => {
  return crypto.publicDecrypt(pubKey, data)
}
util.isKeyPair = (pubKey, privKey) => {
  let curve = crypto.createECDH('prime256v1')
  curve.setPrivateKey(privKey)
  let key = curve.getPublicKey()
  return key.equals(pubKey)
}
util.isMutable = (text) => {
  return /([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+I)\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/.test(text)
}
util.isRecord = (text) => {
  return /([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+O)\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/.test(text)
}
util.isAddress = (text) => {
  return /([\da-zA-Z]+)/.test(text)
}
module.exports = util
