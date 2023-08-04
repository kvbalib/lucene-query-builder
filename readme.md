# Lucene Query Builder

Lucene Query Builder is a utility for constructing query strings for Lucene. It provides a flexible way to build a query using an object-based approach. The library supports both function-based and class-based usage.

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
import { query } from 'lucene-query-builder'

const myQuery = query({
  phrase: 'Hello world',
  and: [{ fieldName: 'value1' }, { anotherField: ['value1', 'value2'] }],
  not: [{ fieldName: 'value2' }],
  options: {
    fuzzyLetters: 5,
    fuzzyLevel: 1,
    urlEncoded: true
  },
})

console.log(myQuery)
```

Class-based Usage

```typescript
import { QueryBuilder } from 'lucene-query-builder'

const queryBuilder = new QueryBuilder({ 
  fuzzyLetters: 5, 
  fuzzyLevel: 1, 
  urlEncoded: true 
})

const myQuery = queryBuilder.query({
  phrase: 'Hello world',
  and: [{ fieldName: 'value1' }, { anotherField: ['value1', 'value2'] }],
  not: [{ fieldName: 'value2' }],
})

console.log(myQuery)
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