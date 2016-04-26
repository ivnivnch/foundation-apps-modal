angular.module('zfaModal')
    .config(['zfaModalProvider', function(zfaModalProvider) {

    var modalSamples = [
        {
            id:'alert',
            config: {
                controller: ['$scope', 'ok', 'message', function($scope, ok, message) {
                    $scope.ok = ok;
                    $scope.message = message;
                }],
                template: '<div zf-modal="" overlay="true" overlay-close="true" class="tiny dialog"><a class="close-button" zf-close="">x</a><h4>{{message}}</h4><a class="button primary" ng-click="resolve()">{{ok}}</a></div>',
                locals: {
                    ok: "OK",
                    message: ""
                }
            }
        },
        {
            id:'confirm',
            config: {
                controller: ['$scope', 'ok', 'cancel', 'message', function($scope, ok, cancel, message) {
                    $scope.ok = ok;
                    $scope.cancel = cancel;
                    $scope.message = message;
                }],
                template: '<div zf-modal="" overlay="true" overlay-close="true" class="tiny dialog"><a class="close-button" zf-close="">x</a><h4>{{message}}</h4><a class="button primary" ng-click="resolve()">{{ok}}</a><a class="button secondary" ng-click="reject()">{{cancel}}</a></div>',
                locals: {
                    ok: "OK",
                    cancel: "Cancel",
                    message: ""
                }
            }
        },
        {
            id:'prompt',
            config: {
                controller: ['$scope', 'ok', 'cancel', 'message', 'value', function($scope, ok, cancel, message, value) {
                    $scope.ok = ok;
                    $scope.cancel = cancel;
                    $scope.message = message;
                    $scope.value = value;
                }],
                template: '<div zf-modal="" overlay="true" overlay-close="true" class="tiny dialog"><a class="close-button" zf-close="">x</a><h4>{{message}}</h4><label><input type="text" ng-model="value"></label><a class="button primary" ng-click="resolve(value)">{{ok}}</a><a class="button secondary" ng-click="reject()">{{cancel}}</a></div>',
                locals: {
                    ok: "OK",
                    cancel: "Cancel",
                    message: "",
                    value: ""
                }
            }
        }
    ];

    for(var i = 0;i<modalSamples.length;i++){
        zfaModalProvider.register(modalSamples[i].id,modalSamples[i].config)
    }
}]);