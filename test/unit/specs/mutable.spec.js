const Record = require('../../../src/main/record')
const Mutable = require('../../../src/main/mutable')
const OffUrl = require('../../../src/main/off-url')
const expect = require('chai').expectnpm
describe('Test Mutable creation', function () {
  let url = OffUrl.parse('http://localhost:23402/offsystem/v3/offsystem/directory/7850/7sqyF9TUVbdE9UN6JPfAzC4pvUPFBsYjtXsY1m3iqDxb/4YpPRezm6uZeT6R2Mx7t85kpN81xoA7zRD71fwYtv6Hp/html5up-prologue.ofd')
  let record = new Record(url)
  let mutable
  it('Test Mutable Exists', function () {
    mutable = new Mutable()
    expect(mutable).to.exist
  })
  it('Test Mutable assignment', function () {
    mutable.content = record.key
    expect(mutable.content).to.equal(record.key)
  })
  it('Test Mutable Reassignment', function () {
    let mutable2 = new Mutable(mutable.value)
    expect(mutable2.content).to.equal(record.key)
    let url2 = 'http://localhost:23402/offsystem/v3/offsystem/directory/7852/6LmAiRhsePn7EbR5umkKpRpqPHKgAz8dPDDKaYiBgk3T/3gRXxNxR8tW8xCLVXabRsfqfUfHbQVkZkNnbDJBLNGB9/html5up-prologue.ofd#'
    let record2 = new Record(url2)
    try {
      mutable2.content = record2.key
    } catch (ex) {
      expect(ex).to.exist
    }
    mutable2.privKey = mutable2.privKey
    mutable2.content = record2.key
    expect(mutable2.content).to.equal(record2.key)
  })
})
