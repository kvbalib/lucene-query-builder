# Lucene Query Builder

Lucene Query Builder is a utility for constructing query strings for Lucene. It provides a flexible way to build a query using an object-based approach. The library supports both function-based and class-based usage.

### Compatibility

The library is compiled to ECMAScript modules (ESM), ensuring easy integration with Webpack and front-end frameworks like React. Additionally, its compatibility extends to CommonJS, making it suitable for Node.js applications. This allows developers to utilize the library in various development environments.

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
  urlEncoded: true,
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

### Date Querying with the `query` method

Lucene Query Builder has simplified the process of constructing date-based queries using the `query` method. This enhancement aids users to seamlessly generate queries based on specific date fields or ranges.

#### `dates` Parameter:

The `dates` parameter in the `query` method is designed to handle date-based filters. To utilize this functionality, you are expected to pass an object to the `dates` parameter:

- **Keys**: Every key in the object signifies the name of a date field.
- **Values**: The corresponding value can be:
    1. A JavaScript `Date` object.
    2. A valid ISO zulu date string (e.g., `'2023-08-01T12:00:00Z'`).
    3. A tuple (an array with two elements):
        - First element is the start date which can be a `Date` object or a valid ISO zulu date string.
        - Second element can be the end date (a `Date` object or a valid ISO zulu date string) or `null`.

**Note**: It's imperative to ensure that the provided date string adheres to the zulu format. If it doesn't match this format or if it's not a valid ISO string, the `query` method will raise an exception.

#### Examples:

```typescript
import { query } from 'lucene-query-builder'

// Query with a singular date filter
const myQuery1 = query({
  phrase: 'Hello world',
  dates: { startDate: '2023-08-01T12:00:00Z' }
});

// Query filtering within a date range
const myQuery2 = query({
  phrase: 'Hello world',
  dates: { startDate: ['2023-08-01T12:00:00Z', '2023-08-10T12:00:00Z'] }
});

// Query targeting a specific date field
const myQuery3 = query({
  phrase: 'Hello world',
  dates: { customDateField: new Date('2023-08-01T12:00:00Z') }
});

// Queries for separate date fields
const myQuery4 = query({
  phrase: 'Hello world',
  dates: { start: '2023-08-01T12:00:00Z', end: '2023-08-10T12:00:00Z' }
});

// Query with multiple fields using tuple format for date ranges
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

| Option           | Default value | Description                                                                                          |
|------------------|---------------|------------------------------------------------------------------------------------------------------|
| `fuzzyLetters`   | `3`           | The number of letters in the phrase to start fuzzy matching.                                         |
| `fuzzyLevel`     | `1`           | The level of fuzzy matching.                                                                         |
| `proximity`      | `1`           | The number of words allowed between words in the phrase.                                             |
| `urlEncoded`     | `false`       | A boolean indicating whether the returned query string should be URL-encoded.                        |
| `strictDateRanges`| `false`       | Indicates whether the resulting date query should be strict (bonded with 'AND') or not (bonded with 'OR'). |

#### Option Details

##### `strictDateRanges`

When set to `true`, the date ranges within the query will be bonded together with an 'AND' clause, resulting in a stricter filtering process. This means the query will return only results that match all provided date filters.

On the other hand, when set to `false` (default behavior), the date ranges will be bonded with an 'OR' clause. This offers a more lenient filtering process, returning results that match any of the provided date filters.

##### Example Usage

```typescript
import { query } from 'lucene-query-builder'

const myQuery = query({
  phrase: 'Hello world',
  dates: { start: '2023-08-01T12:00:00Z', end: '2023-08-10T12:00:00Z' },
  options: {
    strictDateRanges: true
  }
});
```

## License
MIT