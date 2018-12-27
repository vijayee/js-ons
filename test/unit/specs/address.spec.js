const Record = require('../../../src/main/record')
const Mutable = require('../../../src/main/mutable')
const Address = require('../../../src/main/address')
const OffUrl = require('../../../src/main/off-url')
const expect = require('chai').expect
describe('Test Address creation', function () {
  let url = OffUrl.parse('http://localhost:23402/offsystem/v3/offsystem/directory/7850/7sqyF9TUVbdE9UN6JPfAzC4pvUPFBsYjtXsY1m3iqDxb/4YpPRezm6uZeT6R2Mx7t85kpN81xoA7zRD71fwYtv6Hp/html5up-prologue.ofd')
  let record = new Record(url)
  let mutable = new Mutable()
  let addr
  mutable.contents = record.key
  it('Test Address Exists', function () {
    addr = new Address()
    expect(addr).to.exist
    addr.key = 'test'
    expect(addr.key).to.equal('test')
  })
  it('Test Address assignment of Record', function () {
    addr.value = record.key
    expect(record.key).to.equal(addr.value)
    expect(true).to.equal(addr.isRecord)
  })
  it('Test Address assignment of Mutable', function () {
    addr.value = mutable.key
    expect(mutable.key).to.equal(addr.value)
    expect(true).to.equal(addr.isMutable)
  })
  it('Test Address Invalid Assignment', function () {
    try {
      addr.value = 'Tupac'
    } catch (ex) {
      expect(ex).to.exist
    }
  })
})
