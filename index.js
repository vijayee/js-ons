const util = require('./src/utility')
const Record = require('./src/main/record')
const OffUrl = require('./src/main/off-url')
const Mutable = require('./src/main/mutable')
let ctext = util.encrypt('http://localhost:23402/offsystem/v3/offsystem/directory/7850/7sqyF9TUVbdE9UN6JPfAzC4pvUPFBsYjtXsY1m3iqDxb/4YpPRezm6uZeT6R2Mx7t85kpN81xoA7zRD71fwYtv6Hp/html5up-prologue.ofd', 'password')
let text = util.decrypt(ctext, 'password')
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
console.log(mutable.contents)