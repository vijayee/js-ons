const express = require('express')
const http = require('http')
const config = require('../config')
const util = require('../utility')
const OffUrl = require('./off-url')

module.exports = function (nr, emit) {
  let ons = express()
  ons.get(/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+)\/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+O)\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/,
    (req, res) => { // Reqest for a Record
      let key = req.params[2]
      nr.recordCache.get(key, (err, record) => {
        if (err) {
          emit('error', err)
          return res.status(500).end()
        }

      })
    })
  ons.get(/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+)\/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+I)\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/,
    (req, res) => {// Request  for a Mutable
      let key = req.params[20]
    })
  ons.get(/([\da-zA-Z]+)\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/,
    (req, res) => { // Request for and Address
      let address = req.params[20]
    })
  ons.put('/', (req, res) => {
    let recycler = req.get('recycler')
    recycler = recycler ? JSON.parse(recycler) : []
    let offRecycler = []
    let i = -1
    let next = () => {
      i++
      if (i < recycler.length) {
        let key = recycler[i]
        nr.resolve(key, (err, offUrl) => {
          if (err) {
            emit('error', err)
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
            emit('error', err)
            return res.status(500).end()
          }
          ws.setHeader('recycler', JSON.parse(recycler))
          req.pipe(ws)
        })
      }
    }
  })
  return ons
}
