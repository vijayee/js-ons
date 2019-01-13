const util = require('./src/utility')
const Record = require('./src/main/record')
const OffUrl = require('./src/main/off-url')
const Mutable = require('./src/main/mutable')
const Address = require('./src/main/address')
const NameRouter = require('./src/main/name-router')
const Server = require('./src/main/server')
const collect = require('collect-stream')
const http = require('http')
const fs = require('fs')
let ctext = util.encrypt('http://localhost:23402/offsystem/v3/offsystem/directory/7850/7sqyF9TUVbdE9UN6JPfAzC4pvUPFBsYjtXsY1m3iqDxb/4YpPRezm6uZeT6R2Mx7t85kpN81xoA7zRD71fwYtv6Hp/html5up-prologue.ofd', 'password')
//let text = util.decrypt(ctext, 'password')
//console.log(text.toString())

let url = OffUrl.parse('http://localhost:23402/offsystem/v3/offsystem/directory/7850/7sqyF9TUVbdE9UN6JPfAzC4pvUPFBsYjtXsY1m3iqDxb/4YpPRezm6uZeT6R2Mx7t85kpN81xoA7zRD71fwYtv6Hp/html5up-prologue.ofd')
let record = new Record(url)

//console.log(record.content())
//console.log(util.decrypt(record.value, url.fileHash))
let obj = {key: record.key, value: record.value}
let record2 = new Record(obj)

let mutable = new Mutable()
console.log(record.key)
mutable.contents = record.key
console.log(mutable.contents)
let mutable2 = new Mutable(mutable.value)
console.log(mutable2.contents)
mutable2.privKey = mutable.privKey
mutable2.contents = record2.key
console.log(mutable2.key)
console.log(mutable.key)
let addr = new Address()
addr.key = 'Coppernicus'
addr.value = mutable2.key
console.log(addr.value)
let nameRouter = new NameRouter('./testing')
let server = new Server(nameRouter)
let port = 33402
console.log(`Listening on Port ${port}`)
server.listen(port)
let path = './testing/854453169.jpg'
fs.stat(path, (err, stats) => {
  if (err) {
    return console.error(err)
  }
  let headers = {}
  headers['stream-length'] = stats.size
  headers['file-name'] = '854453169.jpg'
  headers['type'] = 'image/jpeg'
  let req = http.request(`http://localhost:${port}`, {headers}, (res) => {
    if (res.statusCode !== 200) {
      return console.error('shit fucked up')
    }
    collect(res, (err, data) => {
      if (err) {
        return console.error(err)
      }
      console.log(data.toString())
    })
  })
  let rs = fs.createReadStream(path)
  req.once('error', console.error)
  rs.pipe(req)
})