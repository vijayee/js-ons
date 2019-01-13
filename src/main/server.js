const EventEmitter = require('events').EventEmitter
const express = require('express')
const OffUrl = require('./off-url')
const Record = require('./record')
const extend = require('extend')
const collect = require('collect-stream')
module.exports = function (nr) {
  let ons = express()
  extend(true, ons, new EventEmitter())
  ons.get(/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,45}O)\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/,
    (req, res) => { // Reqest for a Record
      let key = req.params[2]
      nr.resolveRecord(key, (err, url) => {
        if (err) {
          this.emit('error', err)
          return res.status(500).end()
        }
        nr.createReadStream(url, (err, rs) => {
          if (err) {
            this.emit('error', err)
            return res.status(500).end()
          }
          return rs.pipe(res)
        })
      })
    })
  ons.get(/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,45}I)\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/,
    (req, res) => { // Request  for a Mutable
      let key = req.params[20]
      nr.resolveMutable(key, (err, url) => {
        if (err) {
          this.emit('error', err)
          return res.status(500).end()
        }
        nr.createReadStream(url, (err, rs) => {
          if (err) {
            this.emit('error', err)
            return res.status(500).end()
          }
          return rs.pipe(res)
        })
      })
    })
  ons.get(/([\da-zA-Z]{1, 255})\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/,
    (req, res) => { // Request for and Address
      let address = req.params[20]
      nr.resolveAddress(key, (err, url) => {
        if (err) {
          this.emit('error', err)
          return res.status(500).end()
        }
        nr.createReadStream(url, (err, rs) => {
          if (err) {
            this.emit('error', err)
            return res.status(500).end()
          }
          return rs.pipe(res)
        })
      })
    })
  ons.put('/', (req, res) => {
    let recycler = req.get('recycler')
    recycler = recycler ? JSON.parse(recycler) : []
    if (!Array.isArray(recycler)) {
      this.emit('error', new TypeError('Invalid Recycler'))
      return res.status(500).end()
    }
    let offRecycler = []
    let i = -1
    let next = () => {
      i++
      if (i < recycler.length) {
        let key = recycler[i]
        nr.resolve(key, (err, offUrl) => {
          if (err) {
            this.emit('error', err)
            return res.status(500).end()
          }
          offRecycler.push(offUrl)
          return next()
        })
      } else {
        let url = new OffUrl()
        url.serverAddress = req.get('server-address') || url.serverAddress
        url.contentType = req.get('type')
        url.fileName = req.get('file-name')
        url.streamLength = parseInt(req.get('stream-length'))
        nr.createWriteStream(url, (err, ws) => {
          if (err) {
            this.emit('error', err)
            return res.status(500).end()
          }
          ws.once('response', (res) => {
            if (res.statusCode !== 200) {
              return cb(new Error(`Stream failed - Status Code: ${ws.statusCode}`))
            }

            collect(res, (err, data) => {
              if (err) {
                return ws.emit('error', err)
              }
              try {
                let url = OffUrl.parse(data.toString())
                let record = new Record(url)
                nr.recordCache.put(record, (err) => {
                  if (err) {
                    this.emit('error', err)
                    return res.status(500).end()
                  }
                  res.write(record.key)
                  res.end()
                  http.request
                })
              } catch (err) {
                this.emit('error', err)
                return res.status(500).end()
              }
            })
          })
          ws.setHeader('recycler', JSON.stringify(offRecycler))
          ws.once('error', (err) => {
            this.emit('error', err)
            return res.status(500).end()
          })
          req.pipe(ws)
        })
      }
    }
    next()
  })
  // Create a Mutable From A record
  ons.put(/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,45}O)/, (req, res) => {

  })
  // Modify Mutable
  ons.post(/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,45}I)\/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,45}O)/, (req, res) => {

  })

  return ons
}
