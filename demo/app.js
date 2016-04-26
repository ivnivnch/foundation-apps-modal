var demoApp = angular.module('demo', [
    'zfaModal',
    'foundation'
]);

demoApp.controller('demoCtrl', function ($scope, zfaModal) {

    $scope.idArray = ['myModal','alert','confirm','prompt'];

    $scope.showModal = function(id) {

        switch(id) {
            case 'myModal':
                zfaModal.open('myModal',{
                    template: '<div zf-modal=""><a class="close-button" zf-close="">X</a><h4>Hello!</h4>' +
                    '<a ng-click="resolve()" class="button primary">OK</a><a ng-click="reject()" class="button secondary">Cancel</a></div>'
                })
                    .then(function() { /* ... */ })
                    .catch(function() { /* ... */ });
                break;
            case 'alert':
                zfaModal.open('alert',{ message: "Alert!!!" })
                    .then(function() { /* ... */ })
                    .catch(function() { /* ... */ });
                break;
            case 'confirm':
                zfaModal.open('confirm',{ message: "Confirm" })
                    .then(function() { /* ... */ })
                    .catch(function() { /* ... */ });
                break;
            case 'prompt':
                zfaModal.open('prompt',{ message: "Type your text:" })
                    .then(function() { /* ... */ })
                    .catch(function() { /* ... */ });
                break;
            default:

        }

    };
});