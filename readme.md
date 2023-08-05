# Lucene Query Builder

Lucene Query Builder is a utility for constructing query strings for Lucene. It provides a flexible way to build a query using an object-based approach. The library supports both function-based and class-based usage.

Tested with AWS CloudSearch.

## Installation

Install Lucene Query Builder with npm:

```shell
npm install lucene-query-builder
```

```shell
yarn add lucene-query-builder
```

## Usage

Function-based Usage

```typescript
import { fq, query } from 'lucene-query-builder'

const myQuery = query({
  phrase: 'Hello world',
  and: [{ fieldName: 'value1' }, { anotherField: ['value1', 'value2'] }],
  not: [{ fieldName: 'value3' }],
  options: {
    fuzzyLetters: 5,
    fuzzyLevel: 1,
    urlEncoded: true
  },
})

const myFilterQuery = fq([{ fieldName: 'value1' }, { anotherField: ['value1', 'value2'] }])
```

Class-based Usage

```typescript
import { LuceneBuilder } from 'lucene-query-builder'

const queryBuilder = new LuceneBuilder({ 
  fuzzyLetters: 5, 
  fuzzyLevel: 1, 
  urlEncoded: true 
})

const myQuery = queryBuilder.query({
  phrase: 'Hello world',
  and: [{ fieldName: 'value1' }, { anotherField: ['value1', 'value2'] }],
  not: [{ fieldName: 'value3' }],
})

const myFilterQuery = queryBuilder.fq([{ fieldName: 'value1' }, { anotherField: ['value1', 'value2'] }])
```

Basic usage with AWS CloudSearch

```typescript
import { CloudSearchDomainClient, SearchCommand } from '@aws-sdk/client-cloudsearch-domain'
import { fq, query } from 'lucene-query-builder'

const client = new CloudSearchDomainClient({
  region: '<region>',
  endpoint: '<endpoint>',
  credentials: {
    accessKeyId: '<accessKeyId>',
    secretAccessKey: '<secretAccessKey>',
  },
})

const myQuery = query({
  phrase: 'Hello world',
  and: [{ fieldName: 'value1' }, { anotherField: ['value1', 'value2'] }],
  not: [{ fieldName: 'value3' }],
})

const myFilterQuery = fq([{ fieldName: 'value1' }, { anotherField: ['value1', 'value2'] }])

const command = new SearchCommand({
  query: myQuery,
  queryParser: 'lucene',
  return: '_all_fields',
  filterQuery: myFilterQuery,
})

const { hits, status } = await client.send(command)
```

## Function Parameters and Options

| Parameter    | Description                                                                                   | 
|--------------|-----------------------------------------------------------------------------------------------|
| `phrase`     | The phrase to search for.                                                                     |
| `and`        | An array of terms to be included in the query. Each term is an object with the field name as key and the corresponding values. |
| `not`        | An array of terms to be excluded from the query. Each term is an object with the field name as key and the corresponding values. |
| `options`    | An object containing various options for query building. See below for more details.          |

### Options

| Option        | Default value | Description                                                                   |
|---------------|---------------|-------------------------------------------------------------------------------|
| `fuzzyLetters`| `5`           | The number of letters in the phrase to start fuzzy matching.                  |
| `fuzzyLevel`  | `1`           | The level of fuzzy matching.                                                  |
| `urlEncoded`  | `false`       | A boolean indicating whether the returned query string should be URL-encoded. |

## License
MIT