'use strict';

angular.module('mean.products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Global', 'Products','ProductCategoryLists','CategorizedProducts',
  function($scope, $stateParams, $location, Global, Products, ProductCategoryLists, CategorizedProducts) {
    $scope.global = Global;
    $scope.images = [];
    $scope.productImages = null;
    $scope.hasAuthorization = function(product) {
      if (!product || !product.user) return false;
      return $scope.global.isAdmin || product.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {

      if (isValid) {
        
        if(typeof $scope.images[0] !== 'undefined'){
          $scope.productImages =
            {
              name: $scope.images[0].name,
              src: $scope.images[0].src,
              size: $scope.images[0].size,
              type: $scope.images[0].type,
              created: Date.now()
            };
        }
        
       var product = new Products({
          title: this.title,
          description: this.description,
          tag: this.tag,
          color: this.color,
          category: this.category,
          images: $scope.productImages,
        });

        
        product.$save(function(response) {
        $location.path('products/' + response._id);
        });
     
      } else {
        $scope.submitted = true;

      }

        this.title = '';
        this.description = '';
        this.tag = '';
        this.color = '';

    };

    $scope.remove = function(product) {
      if (product) {
        product.$remove();

        for (var i in $scope.products) {
          if ($scope.products[i] === product) {
            $scope.products.splice(i, 1);
          }
        }
        $location.path('products');
      } else {
        $scope.product.$remove(function(response) {
          $location.path('products');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        
        var product = $scope.product;
        if (!product.updated) {
          product.updated = [];
        }

        if(typeof $scope.images[0] !== 'undefined'){
        
          product.images.name = $scope.images[0].name;
          product.images.src = $scope.images[0].src ;
          product.images.size = $scope.images[0].size ;
          product.images.type = $scope.images[0].type;
          product.images.created = Date.now();
        }
        product.category= this.category;

        product.updated.push(new Date().getTime());
        product.$update(function() {
        $location.path('products/' + product._id);
        });
        
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Products.query(function(products) {
        $scope.products = products;
      });
    };

    $scope.findProductCategory = function() {
      $scope.defaultCategory = '54634e05a92d436556ae189a' ;
      ProductCategoryLists.query(function(productCategory) {
        $scope.productCategory = productCategory;
        
      });
    };

    $scope.findOne = function() {
      Products.get({
        productId: $stateParams.productId
      }, function(product) {
         $scope.product = product;
         $scope.images.push(product.images);

         });
    };



 $scope.deleteImage = function() {
      $scope.images = [];
      $scope.errorMessages = ' ' ;
     $scope.slides = [];
     };


    $scope.uploadFileCallback = function(file) {
    $scope.errorMessages = [];
       console.log('length images'+ $scope.images.length);


      if ($scope.images.length === 0 && file.type.indexOf('image') !== -1) {
          $scope.errorMessages = '' ;
          $scope.images.push(file);
          $scope.addSlide(file.src);
          }
      else if ($scope.images.length === 1 && file.type.indexOf('image') !== -1) {
          $scope.errorMessages.push('More Than One Image Not Allowed');
          } else {
            $scope.errorMessages.push('File Type Not Allowed');
           //  $scope.images=[];
                  }

   console.log('length images at exit'+ $scope.images.length);
    };

    $scope.uploadFinished = function(files) {
      console.log(files);
    };

    $scope.findCategorizedProduct = function() {

      CategorizedProducts.query(
        {
          categoryId: $stateParams.categoryId
        },
      function(products) {
        console.log('something unexpected 3');
        $scope.categorizedProducts = products;
      });
          
    };

    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function(url) {
// var newWidth = 600 + slides.length;
       slides.push({
         image: url
       });
    };

  }
]);
