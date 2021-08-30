const express = require('express')
const cron = require('node-cron')
const Check = require('./models/Check')
const fetch = require('node-fetch')

require('./db')()

const app = express()

const port = process.env['PORT'] || 3000

app.use(express.json({ extended: false }))

app.use('/api/users', require('./routes/users'))
app.use('/api/verification', require('./routes/verification'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/check', require('./routes/check'))

app.get('/', (req, res) => res.send('Healthy and running!'))

function getPortFromProtocol(protocol) {
  switch (protocol) {
    case 'http':
      return 80
    case 'https':
      return 443
    default:
      throw new Error('Port undefined')
  }
}

function checkWebsiteStates(check) {
  const { protocol, url } = check
  const port = check.port || getPortFromProtocol(protocol)
  const fullURL = protocol + '://' + url + ':' + port
  return fetch(fullURL, { method: 'HEAD' })
}

async function monitorURL() {
  // Get all the checks from the database
  const checks = await Check.find({}).select('protocol url port')

  // Check website state
  const res = await Promise.all(checks.map(checkWebsiteStates))
  res.forEach((cur, index) => {   checks[index].data.push(cur)  } )
  console.log(res)
}

cron.schedule('*/1 * * * * *', monitorURL)

app.listen(port, () =>
  console.log(`Bosta app listening at http://localhost:${port}`)
)
