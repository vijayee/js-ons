'use strict'
const crypto = require('crypto')
const EC = require('elliptic').ec
const ec = 'ed25519'
const stamp = require('nonce')()

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
  let curve = new EC(ec)
  let keys = curve.genKeyPair()
  let pubKey = Buffer.from(keys.getPublic('hex'), 'hex')
  let privKey = Buffer.from(keys.getPrivate('hex'), 'hex')
  return {pubKey, privKey}
}
util.privateSign = (data, privKey) => {
  let nonce = stamp()
  let hash = Buffer.concat([util.hash(data), Buffer.from(`${nonce}`)])
  let curve = new EC(ec)
  let key = curve.keyFromPrivate(privKey.toString('hex'), 'hex')
  let sig = key.sign(hash.toString('hex'), 'hex')
  return {signature: Buffer.from(sig.toDER(), 'hex'), nonce}
}
util.publicVerify = (data, signature, nonce, pubKey) => {
  let hash = Buffer.concat([util.hash(data), Buffer.from(`${nonce}`)])
  let curve = new EC(ec)
  let key = curve.keyFromPublic(pubKey.toString('hex'), 'hex')
  return key.verify(hash, signature.toString('hex'))
}
util.isKeyPair = (pubKey, privKey) => {
  let curve = new EC(ec)
  let keys = curve.keyFromPrivate(privKey.toString('hex'), 'hex')
  let pub = Buffer.from(keys.getPublic('hex'), 'hex')
  return pub.equals(pubKey)
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
