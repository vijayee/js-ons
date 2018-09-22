const express = require('express')
const http = require('http')
module.exports = function (nr, emit) {
  let ons = express()
  ons.get(/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+)\/([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+O)\/{0,1}([^ !$`&*()+]*|\\[ !$`&*()+]*)*/,
    (req, res) => { // Reqest for a Record
      let key = req.params[20]
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

  })
}