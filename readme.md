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
  and: [
    { fieldName: 'value1' },
    { anotherField: ['value1', 'value2'] } // Array of values will be joined with 'OR'
  ],
  not: [{ fieldName: 'value3' }],
})

const myFilterQuery = fq([
  { fieldName: 'value1' },
  { anotherField: ['value1', 'value2'] } // Array of values will be joined with 'OR'
])

const command = new SearchCommand({
  query: myQuery,
  queryParser: 'lucene',
  return: '_all_fields',
  filterQuery: myFilterQuery,
})

const { hits, status } = await client.send(command)
```

### Date Querying with the query method
When constructing a query using the query method, you can now include date-based filtering with ease. The method provides a seamless integration for generating queries based on specific date fields or date ranges.

`dates` Parameter:

The dates parameter allows you to pass date-based filters to the query. The input for this parameter should be an object where:

Each key represents a field name. The corresponding value can be:

1. A Date object
2. A valid ISO zulu date string
3. An array/tuple with two items:
First item as the start date (can be Date object or valid ISO zulu date string)
Second item as the end date or null (can be Date object, valid ISO zulu date string, or null)
If the provided string date is not in the zulu format, or it's not a valid ISO string, the query method will throw an error.

```typescript
import { query } from 'lucene-query-builder'

// Query with a single date filter
const myQuery1 = query({
  phrase: 'Hello world',
  dates: { startDate: '2023-08-01T12:00:00Z' }
});

// Query with a date range filter
const myQuery2 = query({
  phrase: 'Hello world',
  dates: { startDate: ['2023-08-01T12:00:00Z', '2023-08-10T12:00:00Z'] }
});

// Query with a specific field's date filter
const myQuery3 = query({
  phrase: 'Hello world',
  dates: { customDateField: new Date('2023-08-01T12:00:00Z') }
});

// Query with a separate fields date range filter
const myQuery4 = query({
  phrase: 'Hello world',
  dates: { start: '2023-08-01T12:00:00Z', end: '2023-08-10T12:00:00Z' }
});

// Query with a separate fields date range filter tuple
const myQuery5 = query({
  phrase: 'Hello world',
  dates: { start: ['2023-08-01T12:00:00Z', '2023-08-10T12:00:00Z'], end: [null, '2023-08-10T12:00:00Z'] }
});
```

## Function Parameters and Options

| Parameter | Description                                                                                                                      | 
|-----------|----------------------------------------------------------------------------------------------------------------------------------|
| `phrase`  | The phrase to search for.                                                                                                        |
| `and`     | An array of terms to be included in the query. Each term is an object with the field name as key and the corresponding values.   |
| `not`     | An array of terms to be excluded from the query. Each term is an object with the field name as key and the corresponding values. |
| `dates`   | An object containing date-based filters. See `Date Querying with the query method` for more details.                                                             |
| `options` | An object containing various options for query building. See below for more details.                                             |

### Options

| Option        | Default value | Description                                                                   |
|---------------|---------------|-------------------------------------------------------------------------------|
| `fuzzyLetters`| `5`           | The number of letters in the phrase to start fuzzy matching.                  |
| `fuzzyLevel`  | `1`           | The level of fuzzy matching.                                                  |
| `urlEncoded`  | `false`       | A boolean indicating whether the returned query string should be URL-encoded. |

## License
MIT