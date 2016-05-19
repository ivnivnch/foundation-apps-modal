var demoApp = angular.module('demo', [
    'zfaModal',
    'foundation'
])
    .controller('myModalCtrl', myModalCtrl)
    .controller('demoCtrl', demoCtrl);

function myModalCtrl($scope, zfaModal, zfaModalDefer, $timeout) {

    $scope.resolve = function () {
        zfaModalDefer.resolve('OK');
    };

    $scope.cancel = function () {
        zfaModalDefer.reject('Cancel');
    };

    $timeout(function () {
        zfaModal.close('myModal');
    }, 5000);

}

function demoCtrl($scope, zfaModal) {

    $scope.idArray = ['myModal', 'alert', 'confirm', 'prompt'];

    $scope.promiseResult = "";

    var resolveHandler = function (data) {
        $scope.promiseResult = 'Promise resolved ' + (data || '');
    };

    var rejectHandler = function () {
        $scope.promiseResult = 'Promise rejected';
    };

    $scope.showModal = function (id) {

        switch (id) {
            case 'myModal':
                zfaModal.open('myModal', {
                    template: '<div zf-modal=""><a class="close-button" zf-close="">X</a><h4>Hello! This modal will be automatically close in 3s.</h4>' +
                    '<a ng-click="resolve()" class="button primary">OK</a><a ng-click="cancel()" class="button secondary">Cancel</a></div>',
                    controller: 'myModalCtrl'
                })
                    .then(resolveHandler).catch(rejectHandler);
                break;
            case 'alert':
                zfaModal.open('alert', {message: "Alert!!!"}).then(resolveHandler).catch(rejectHandler);
                break;
            case 'confirm':
                zfaModal.open('confirm', {message: "Confirm"}).then(resolveHandler).catch(rejectHandler);
                break;
            case 'prompt':
                zfaModal.open('prompt', {message: "Type your text:"}).then(resolveHandler).catch(rejectHandler);
                break;
            default:

        }
    };

}