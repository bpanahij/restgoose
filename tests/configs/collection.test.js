/*
  Dependencies
 */
var vows = require('vows')
  , assert = require('assert');
/*
  What were testing, and fixtures
 */
var collection = require('../../configs/collection')
  , GooseModel = require('../../example/models/Geese');
/*
  Test Suite
 */
vows.describe('collection').addBatch({
  'functionName(var myFunc = function(){})': {
    topic: function() {
      var myFunc = function() {
      };
      return myFunc;
    },
    'returns myFunc': function(topic) {
      assert.equal(collection.functionName(topic), '');
    }
  },
  'functionName(function myFunc(){})': {
    topic: function() {
      function myFunc() {
      };
      return myFunc;
    },
    'returns myFunc': function(topic) {
      assert.equal(collection.functionName(topic), 'myFunc');
    }
  },
  'functionName(var myFunc = function myFunc(){})': {
    topic: function() {
      function myFunc() {
      };
      return myFunc;
    },
    'returns myFunc': function(topic) {
      assert.equal(collection.functionName(topic), 'myFunc');
    }
  },
  'functionName(String)': {
    topic: function() {
      return String;
    },
    'returns String': function(topic) {
      assert.equal(collection.functionName(topic), 'String');
    }
  }
})
  .addBatch({
    'getData(GooseModel, ["String"])': {
      topic: collection.getData(GooseModel, ['String']),
      'returns data': function(topic) {
        assert.deepEqual(topic, [
          { name: 'name', value: ''},
          { name: 'species', value: ''},
          { name: 'thumbnailURL', value: '' }
        ]);
      },
      'getData(GooseModel, ["Date"])': {
        topic: collection.getData(GooseModel, ['Date']),
        'returns data': function(topic) {
          assert.deepEqual(topic, [
            { name: 'birthDate', value: ''}
          ]);
        }
      }
    }
  })
  .addBatch({
    'generate("localhost", "v1", GooseModel)': {
      topic: collection.generate('localhost', 'v1', GooseModel),
      'returns...': function(topic) {
        console.log(JSON.stringify(topic, undefined, 2));
      }
    }
  })
  .addBatch({
    'generate("localhost", "v1", GooseModel)': {
      topic: collection.generate('localhost', 'v1', GooseModel, 'lookahead'),
      'returns...': function(topic) {
        console.log(JSON.stringify(topic, undefined, 2));
      }
    }
  })
  .run();