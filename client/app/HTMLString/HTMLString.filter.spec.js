'use strict';

describe('Filter: HTMLString', function () {

  // load the filter's module
  beforeEach(module('portfolioApp'));

  // initialize a new instance of the filter before each test
  var HTMLString;
  beforeEach(inject(function ($filter) {
    HTMLString = $filter('HTMLString');
  }));

  it('should return the input prefixed with "HTMLString filter:"', function () {
    var text = 'angularjs';
    expect(HTMLString(text)).toBe('HTMLString filter: ' + text);
  });

});
