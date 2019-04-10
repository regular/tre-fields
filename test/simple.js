const test = require('tape')
const Fields = require('..')

function SSBMock() {
  return {}
}

function msg(content) {
  return {
    key: 'fake',
    value: { content }
  }
}

test('no previewObs provided in ctx', t => {
  const fields = Fields(SSBMock())

  const m = fields(msg({foo:'bar'}), {})
  t.equal(m.get('foo')(), 'bar', 'returns observable that resolves to value')
  t.end()
})
