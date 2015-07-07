foundation-apps-modal
======================

[Zurb Foundation-apps modal](http://foundation.zurb.com/apps/docs/#!/modal) with angular promises.

1. [Install](#install)
2. [Usage](#usage)

## Install

Install with Bower:

```
bower install foundation-apps-modal
```

Reference the script:

```html
<script src="bower_components\foundation-apps-modal\foundation-apps-modal.js"></script>
```

Add the module zfaModal as a dependency to your application:

```js
var app = angular.module('myapp', ['zfaModal']);
```

## Usage

#### Modal

Custom modal:

```js
app.controller('Controller', function($scope, zfaModal) {
  $scope.showModal = function() {
  	zfaModal({
        template: '<div zf-modal=""><a class="close-button" zf-close="">×</a><h4>Hello!</h4>' +
            '<a ng-click="resolve()" class="button primary">OK</a><a ng-click="reject()" class="button secondary">Cancel</a></div>'
    })
        .then(function() { /* ... */ })
        .catch(function() { /* ... */ });
  };
});
```

Modal with controller:

```js
app.controller('Controller', function($scope, zfaModal) {
  $scope.showModal = function() {
  	zfaModal({
        controller: ['$scope', 'zfaModalDefer', 'message', function($scope, zfaModalDefer, message) {
            $scope.message = message;
        
            $scope.ok = function() {
                zfaModalDefer.resolve();
            };
            
            $scope.cancel = function() {
                zfaModalDefer.reject();
            };
        }],
        template: '<div zf-modal=""><h4>{{message}}</h4><a class="close-button" zf-close="">×</a>' +
            '<a ng-click="ok()" class="button primary">OK</a><a ng-click="cancel()" class="button secondary">Cancel</a></div>',
        locals: {
            message: 'Hello!'
        }
    })
        .then(function() { /* ... */ })
        .catch(function() { /* ... */ });
  };
});
```

##### Modal options

* `controller`: Modal controller.
* `templateUrl`: Modal template url.
* `template`: Modal template.
* `locals`: Injection locals for modal controller.

#### Modal provider

Define the modal with the zfaModalProvider:

```js
app.config(['zfaModalProvider', function(zfaModalProvider) {
  zfaModalProvider('myModal', {
        controller: ['$scope', 'message', function($scope, message) {
            $scope.message = message;
        }],
        template: '<div zf-modal=""><h4>{{message}}</h4><a class="close-button" zf-close="">×</a>' +
            '<a ng-click="resolve()" class="button primary">OK</a><a ng-click="reject()" class="button secondary">Cancel</a></div>',
        locals: {
            message: 'Hello!'
        }
  });
}]);
```

Then call modal from controller:

```js
app.controller('Controller', function($scope, zfaModal) {
  $scope.showModal = function() {
  	zfaModal.myModal()
        .then(function() { /* ... */ })
        .catch(function() { /* ... */ });
  };
});
```

Overwrite locals:

```js
app.controller('Controller', function($scope, zfaModal) {
  $scope.showModal = function() {
  	zfaModal.myModal({ message: "Bye!" })
        .then(function() { /* ... */ })
        .catch(function() { /* ... */ });
  };
});
```

##### Modal provider options

* `controller`: Modal controller.
* `templateUrl`: Modal template url.
* `template`: Modal template.
* `locals`: Injection locals for modal controller.

#### Predefined modals

##### Alert

```js
zfaModal.alert({ message: "Alert!!!" })
    .then(function() { /* ... */ })
    .catch(function() { /* ... */ });
```

locals:
* `message`: Alert message.
* `ok`: Ok button text.

##### Confirm

```js
zfaModal.confirm({ message: "Confirm?" })
    .then(function() { /* ... */ })
    .catch(function() { /* ... */ });
```

locals:
* `message`: Confirm message.
* `ok`: Ok button text.
* `cancel`: Cancel button text.

##### Prompt

```js
zfaModal.prompt({ message: "Type your text:" })
    .then(function(value) { /* ... */ })
    .catch(function() { /* ... */ });
```

locals:
* `message`: Prompt message.
* `value`: Input value.
* `ok`: Ok button text.
* `cancel`: Cancel button text.
