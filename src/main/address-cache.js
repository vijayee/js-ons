const EventEmitter = require('events').EventEmitter
const Address = require('./address')
const level = require('level-rocksdb')
const collect = require('collect-stream')
const getSize = require('get-folder-size')
const pth = require('path')
const _path = new WeakMap()
const _db = new WeakMap()
const _size = new WeakMap()

module.exports = class AddressCache extends EventEmitter {
  constructor (path) {
    super()
    if (!path || typeof path !== 'string') {
      throw new TypeError('Invalid path')
    }
    path = pth.join(path, '.address-cache')
    _path.set(this, path)
    let db = level(path)
    _db.set(this, db)
    this.dirty = true
  }
  set dirty (value) {
    let path = _path.get(this)
    getSize(path, (err, size) => {
      if (err) {
        return _size.set(this, 0)
      }
      _size.set(this, size)
      this.emit('capacity', this.capacity)
      if (this.full) {
        this.emit('full')
      }
    })
  }

  put (address, cb) {
    if (!(address instanceof Address)) {
      return cb()
    }
    let db = _db.get(this)
    db.put(address.key, address.value, cb)
    this.dirty = true
  }

  get (key, cb) {
    if (typeof key !== 'string') {
      return cb(new Error('Invalid Key'))
    }
    let db = _db.get(this)
    db.get(key, (err, value) => {
      if (err) {
        return cb(err)
      }
      let address
      try {
        address = Address({key, value})
      } catch (ex) {
        return cb(ex)
      }
      return cb(null, address)
    })
  }
  remove (key, cb) {
    if (typeof key !== 'string') {
      return cb(new Error('Invalid Key'))
    }
    let db = _db.get(this)
    db.del(key, cb)
    this.dirty = true
  }
  contains (key, cb) {
    this.get(key, (err, value) => {
      if (err || !value) {
        return cb(err, false)
      }
      return cb(err, true)
    })
  }
  contents (cb) {
    let db = _db.get(this)
    let rs = db.createKeyStream()
    collect(rs, cb)
  }
}
