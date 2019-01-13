const MutableCache = require('./mutable-cache')
const RecordCache = require('./record-cache')
const AddressCache = require('./address-cache')
const http = require('http')
const util = require('../utility')
const URL = require('url')
const mkdirp = require('mkdirp')
const collect = require('collect-stream')
const OffUrl = require('./off-url')
let _mutableCache = new WeakMap()
let _recordCache = new WeakMap()
let _addressCache = new WeakMap()
module.exports = class NameRouter {
  constructor (path) {
    mkdirp.sync(path)
    _mutableCache.set(this, new MutableCache(path))
    _recordCache.set(this, new RecordCache(path))
    _addressCache.set(this, new AddressCache(path))
  }
  resolve (name, cb) {
    if (util.isMutable(name)) {
      return this.resolveMutable(name, cb)
    } else if (util.isRecord(name)) {
      return this.resolveRecord(name, cb)
    } else if (util.isAddress(name)) {
      return this.resolveAddress(name, cb)
    } else {
      return cb(new Error(`Invalid Name`))
    }
  }
  resolveMutable (key, cb) {
    this.mutableCache.get(key, (err, mutable) => {
      if (err) {
        return cb(err)
      }
      return this.resolveRecord(mutable.contents, cb)
    })
  }
  resolveRecord (key, cb) {
    this.recordCache.get(key, (err, record) => {
      if (err) {
        return cb(err)
      }
      return cb(null, record.contents)
    })
  }
  resolveAddress (key, cb) {
    this.addressCache.get(name, (err, address) => {
      if (err) {
        return cb(err)
      }
      if (address.isMutable) {
        return this.resolveMutable(address.value, cb)
      } else {
        return this.resolveRecord(address.value, cb)
      }
    })
  }
  createWriteStream (offUrl, cb) {
    let url = URL.parse(offUrl.toString())
    url.method = 'PUT'

    let ws = http.request(url)
    ws.setHeader('type', url.contentType)
    ws.setHeader('file-name', url.fileName)
    ws.setHeader('stream-length', url.streamLength)
    ws.setHeader('temporary', 'true')
    return cb(null, ws)
  }

  createReadStream (offUrl, cb) {
    let url = URL.parse(offUrl.toString())
    url.method = 'GET'

    http.get(url, (rs) => {
      if (rs.statusCode !== 200) {
        return cb(new Error(`Stream failed - Status Code: ${rs.statusCode}`))
      }
      return cb(null, rs)
    })
  }
  get mutableCache () {
    return _mutableCache.get(this)
  }
  get recordCache () {
    return _recordCache.get(this)
  }
  get addressCache () {
    return _addressCache.get(this)
  }
}
