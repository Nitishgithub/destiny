'use strict';

//Products service used for products REST endpoint
angular.module('mean.products').factory('Products', ['$resource',
  function($resource) {
    return $resource('products/:productId', {
      productId: '@_id',
      selection: '@selection',
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);




