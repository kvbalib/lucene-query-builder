import express from 'express'
import bodyParser from 'body-parser'
import { LuceneBuilder } from '../../src'
import { CloudSearchDomainClient, SearchCommand } from '@aws-sdk/client-cloudsearch-domain'

const app = express()
const PORT = 3000

app.use(bodyParser.json())

/**
 * Replace the following with your own CloudSearchDomainClient instance.
 * You can fill in credentials here, but preferred way to use AWS credentials is to
 * load from the shared credentials file.
 * https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html
 */
const client = new CloudSearchDomainClient({
  region: '<REGION>',
  endpoint: '<ENDPOINT>',
})

const luceneBuilder = new LuceneBuilder()

app.get('<PATH>', async (req: express.Request, res: express.Response) => {
  const { q, ...rest } = req.query

  if (!q || typeof q !== 'string') {
    res.json([])
    return
  }

  const queryFilters = Object.entries(rest).map(([key, value]) => ({ [key]: String(value) }))

  const command = new SearchCommand({
    query: luceneBuilder.query({ phrase: q }),
    queryParser: 'lucene',
    return: '_all_fields',
    filterQuery: luceneBuilder.fq([{ type: ['rundate', 'activity'] }]),
  })

  const { hits } = await client.send(command)

  res.json({ command, ...hits })
})

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Lucene Query Builder API!',
    usage: {
      search: {
        description: 'Search using Lucene Query.',
        endpoint: '/search',
        method: 'GET',
        parameters: {
          q: "The query phrase. E.g., 'apple'",
          otherParams: 'Additional query filters in key-value pairs. E.g., type=fruit',
        },
        example: 'GET /search?q=apple&type=fruit',
      },
    },
    note: 'This is a simple API. For full documentation, please refer to the repository README or the official documentation.',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
