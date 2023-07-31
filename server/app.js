const recruit = require('./crawling/crawling_recruit')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/search', async (req, res) => {
  const keyword = req.query.q
  const recruits = await recruit.getRecruit(keyword)
  
  res.status(200).send(recruits)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
