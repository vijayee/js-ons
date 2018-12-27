const Record = require('../../../src/main/record')
const OffUrl = require('../../../src/main/off-url')
const expect = require('chai').expectnpm
describe('Test Record Creation', function () {
  let url = OffUrl.parse('http://localhost:23402/offsystem/v3/offsystem/directory/7850/7sqyF9TUVbdE9UN6JPfAzC4pvUPFBsYjtXsY1m3iqDxb/4YpPRezm6uZeT6R2Mx7t85kpN81xoA7zRD71fwYtv6Hp/html5up-prologue.ofd')
  let record = new Record(url)
  it('Test Record Exists', function () {
    expect(record).to.exist
  })
  it('Test Record Created From Object', function () {
    let obj = {key: record.key, value: record.value}
    let record2 = new Record(obj)
    expect(record2).to.exist
    expect(record.contents(url.fileHash)).to.equal(url.toString())
    expect(record.contents(url.fileHash)).to.equal(record2.contents(url.fileHash))
  })
})
