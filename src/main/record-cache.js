const EventEmitter = require('events').EventEmitter
const Record = require('./record')
const level = require('level-rocksdb')
const collect = require('collect-stream')
const getSize = require('get-folder-size')
const pth = require('path')
const _path = new WeakMap()
const _db = new WeakMap()
const _size = new WeakMap()

module.exports = class RecordCache extends EventEmitter {
  constructor (path) {
    super()
    if (!path || typeof path !== 'string') {
      throw new TypeError('Invalid path')
    }
    path = pth.join(path, '.record-cache')
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
  get size () {
    return _size.get(this)
  }
  put (record, cb) {
    if (!(record instanceof Record)) {
      return cb(new TypeError('Invalid Record'))
    }
    let db = _db.get(this)
    db.put(record.key, record.value, cb)
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
      let record
      try {
        record = Record.fromJSON({key, value})
      } catch (ex) {
        return cb(ex)
      }
      return cb(null, record)
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
