
const sqlForPartialUpdate = require('../../helpers/partialUpdate');

process.env.NODE_ENV = 'test';

describe("Testing SQL partial update function", function () {

  test('function returns expected value', function () {
    let testItems = {
      item1: 'orange',
      item2: 'blue'
    }
    let table = 'testTable';
    let key = 'testKey';
    let id = 10

    let result = sqlForPartialUpdate(table, testItems, key, id);
    expect(result).toEqual({
      query: `UPDATE ${table} SET item1=$1, item2=$2 WHERE testKey=$3 RETURNING *`,
      values: ['orange', 'blue', 10]
    });
  });
});
