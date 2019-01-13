const extend = require('util')._extend
const fs = require('fs')
const path = require('path')
const kb = 1000
const mb = 1000000
const gb = 1000000000
let defaults = {
  address: 3,
  record: 1,
  mutable: 2,
  scale: 2,
  filterSize: 20000,
  fingerprintSize: 8,
  bucketSize: 4,
  httpPort: 33402,
  startPort: 9600,
  numPortTries: 2,
  nodeCount: 10, // how many nodes to find in or query in total
  concurrency: 3, // how many nodes to query simultaneously
  kbucketSize: 20, // size of each k bucket
  storeCount: 1, // how many nodes to store new data at
  maxFillRate: 72, // in hours
  redundancy: 0.30, // 30% network redundancy target
  batchConcurrency: 10,
  cacheLocation: null,
  offsHost: 'localhost',
  offsPort: 23402,
  bootstrap: [
    {id: '8fHecNZCiTxavnfnskySbeAYCd1bcv1SAVyi1mcZqurH', ip: '73.135.22.132', port: 8200},
    {id: 'GgA9QwCDRgKt9tKLQVjyjnv9wvt7FaeAJo91JWWWmXuK', ip: '73.135.22.132', port: 8201}
  ]
}

class Config {
  constructor () {
  }
  save (pth) {
    if (!pth) {
      pth = _path.get(this)
    }
    _path.set(this, pth)
    fs.writeFile(path.join(pth, 'config'), JSON.stringify(this.toJSON()), (err) => {
      if (err) {
        console.error(err)
        // TODO Dunno what to do with this error
      }
    })
  }
  load (pth) {
    try {
      let config = JSON.parse(fs.readFileSync(path.join(pth, 'config')))
    } catch (ex) {
      return ex
    }
  }
  loadDefaults () {

  }

  get blockPath () {
    return _blockPath.get(this)
  }

  get miniPath () {
    return _miniPath.get(this)
  }

  get miniPath () {
    return _miniPath.get(this)
  }

  get blockPath () {
    return _blockPath.get(this)
  }

  get miniPath () {
    return _miniPath.get(this)
  }

  get nanoPath () {
    return _nanoPath.get(this)
  }

  get blockCacheSize () {
    return _blockCacheSize.get(this)
  }

  set blockCacheSize (value) {
    if (!Number.isInteger(+value)) {
      throw new TypeError('Invalid Block Cache Size')
    }
    if (value < 300) {
      throw new TypeError('Block Cache Size Is Too Small')
    }
    if (value > (1000000 * mb)) {
      throw new TypeError('Block Cache Size Is Too Large')
    }
    _blockCacheSize.set(this, value)
    this.save()
  }

  get miniBlockCacheSize () {
    return _miniBlockCacheSize.get(this)
  }

  set miniBlockCacheSize (value) {
    if (!Number.isInteger(+value)) {
      throw new TypeError('Invalid Mini Block Cache Size')
    }
    if (value < 300) {
      throw new TypeError('Mini Block Cache Size Is Too Small')
    }
    if (value > (1000000 * mb)) {
      throw new TypeError('Mini Block Cache Size Is Too Large')
    }
    _miniBlockCacheSize.set(this, value)
    this.save()
  }

  get nanoBlockCacheSize () {
    return _nanoBlockCacheSize.get(this)
  }

  set nanoBlockCacheSize (value) {
    if (!Number.isInteger(+value)) {
      throw new TypeError('Invalid Nano Block Cache Size')
    }
    if (value < 300) {
      throw new TypeError('Nano Block Cache Size Is Too Small')
    }
    if (value > (1000000 * mb)) {
      throw new TypeError('Nano Block Cache Size Is Too Large')
    }
    _nanoBlockCacheSize.set(this, value)
    this.save()
  }

  get nano () {
    return _nano.get(this)
  }

  get block () {
    return _block.get(this)
  }

  get mini () {
    return _mini.get(this)
  }

  get tupleSize () {
    return _tupleSize.get(this)
  }

  get blockSize () {
    return _blockSize.get(this)
  }

  get miniBlockSize () {
    return _miniBlockSize.get(this)
  }

  get nanoBlockSize () {
    return _nanoBlockSize.get(this)
  }

  get descriptorPad () {
    return _descriptorPad.get(this)
  }

  get scale () {
    return _scale.get(this)
  }

  get filterSize () {
    return _filterSize.get(this)
  }

  get fingerprintSize () {
    return _fingerprintSize.get(this)
  }

  get hitBoxSize () {
    return _hitBoxSize.get(this)
  }

  get bucketSize () {
    return _bucketSize.get(this)
  }

  get httpPort () {
    return _httpPort.get(this)
  }

  set httpPort (value) {
    if (!Number.isInteger(+value)) {
      throw new TypeError('Invalid HTTP Port')
    }
    _httpPort.set(this, value)
    this.save()
  }

  get startPort () {
    return _startPort.get(this)
  }

  set startPort (value) {
    if (!Number.isInteger(+value)) {
      throw new TypeError('Invalid Port Number')
    }
    _startPort.set(this, value)
    this.save()
  }

  get numPortTries () {
    return _numPortTries.get(this)
  }

  set numPortTries (value) {
    if (!Number.isInteger(+value)) {
      throw new TypeError('Invalid Number of Port Tries')
    }
    _numPortTries.set(this, value)
    this.save()
  }

  get nodeCount () {
    return _nodeCount.get(this)
  }

  get concurrency () {
    return _concurrency.get(this)
  }

  get kbucketSize () {
    return _kbucketSize.get(this)
  }

  get storeCount () {
    return _storeCount.get(this)
  }

  get maxFillRate () {
    return _maxFillRate.get(this)
  }

  get redundancy () {
    return _redundancy.get(this)
  }

  get batchConcurrency () {
    return _redundancy.get(this)
  }

  get cacheLocation () {
    return _cacheLocation.get(this)
  }

  set cacheLocation (value) {
    _cacheLocation.set(this, value)
    this.save()
  }

  get bootstrap () {
    let peers = []
    _bootstrap.get(this).forEach((peer) => {
      let cpy = {}
      extend(cpy, peer)
      peers.push(cpy)
    })
    return peers
  }
  set bootstrap (value) {
    if (!Array.isArray(value)) {
      throw new TypeError('Invalid Boostsrap Peer Array')
    }
    _bootstrap.set(this, value)
    this.save()
  }
  get ofdTimeout () {
    return _ofdTimeout.get(this)
  }
  get temporaryTimeout () {
    return _temporaryTimeout.get(this)
  }
  toJSON () {
    return {
      blockPath: this.blockPath,
      miniPath: this.miniPath,
      nanoPath: this.nanoPath,
      blockCacheSize: this.blockCacheSize,
      miniBlockCacheSize: this.miniBlockCacheSize,
      nanoBlockCacheSize: this.nanoBlockCacheSize,
      nano: this.nano,
      block: this.block,
      mini: this.mini,
      tupleSize: this.tupleSize,
      blockSize: this.blockSize,
      miniBlockSize: this.miniBlockSize,
      nanoBlockSize: this.nanoBlockSize,
      descriptorPad: this.descriptorPad,
      scale: this.scale,
      filterSize: this.filterSize,
      fingerprintSize: this.fingerprintSize,
      hitBoxSize: this.hitBoxSize,
      bucketSize: this.bucketSize,
      httpPort: this.httpPort,
      startPort: this.startPort,
      numPortTries: this.numPortTries,
      nodeCount: this.nodeCount,
      concurrency: this.concurrency,
      kbucketSize: this.kbucketSize,
      storeCount: this.storeCount,
      maxFillRate: this.maxFillRate,
      redundancy: this.redundancy,
      batchConcurrency: this.batchConcurrency,
      cacheLocation: this.cacheLocation,
      bootstrap: this.bootstrap
    }
  }
}
module.exports = new Config()
