'use strict';

angular.module('zfaModal',['foundation'])
    .provider('zfaModal', function () {
        var configs = {};

        function register (modalId, config) {
            if (typeof modalId === 'string') {
                config.id = modalId;
                return configs[modalId] = config;
            }else{
                throw new Error('zfaModalProvider: modalId should be defined');
            }
        }

        return {
            register: register,
            $get: ["zfaModalFactory", "FoundationApi", function (zfaModalFactory, FoundationApi) {
                return {
                    open: function (modalId, modalConfig) {
                        var newConfig = configs[modalId] || register(modalId,modalConfig);
                        newConfig.locals = angular.extend({}, newConfig.locals, modalConfig); //Overwrite old config
                        return zfaModalFactory.createModal(newConfig);
                    },
                    close: function (id) {
                        FoundationApi.publish(id, 'close');
                    }
                }

            }]
        }
    });




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
angular.module('zfaModal')
    .factory('zfaModalFactory', ["FoundationApi", "$controller", "$rootScope", "$http", "$q", "$compile", "$timeout", "$window", "$templateCache", function(FoundationApi, $controller, $rootScope, $http, $q, $compile, $timeout, $window, $templateCache) {

        function createModal(config) {

            var defer = $q.defer(), cachedTemplate;

            if(config.templateUrl) {
                cachedTemplate = $templateCache.get(config.templateUrl);

                if (cachedTemplate) {
                    defer.resolve(Array.isArray(cachedTemplate) ? cachedTemplate[1] : cachedTemplate);
                } else {
                    $http.get(config.templateUrl, {
                        cache: $templateCache
                    }).then(function(response) {
                        defer.resolve(response.data);
                    });
                }

            } else if (config.template) {
                defer.resolve(config.template);
            } else {
                throw new Error('zfaModal: template should be defined');
            }

            return defer.promise.then(function (template) {
                var defer = $q.defer();

                // Attach properties
                var id = config.id || FoundationApi.generateUuid(); //If config does not have an id yet, create one
                var element = angular.element(template).attr('id', id);

                var props = {
                    'animationIn': 'animation-in',
                    'animationOut': 'animation-out',
                    'overlay': 'overlay',
                    'overlayClose': 'overlay-close'
                };

                for (var prop in props) {
                    if (props.hasOwnProperty(prop) && config[prop] !== undefined){
                        element.attr(props[prop], config[prop]);
                    }
                }

                var container = config.container || $window.document.body;
                angular.element(container).append(element); // attach the element to the container

                var scope = $rootScope.$new();
                scope.active = true;
                scope.resolve = defer.resolve.bind(defer);
                scope.reject = defer.reject.bind(defer);

                $compile(element)(scope);

                if (config.controller) {
                    $controller(
                        config.controller,
                        angular.extend({}, config.locals, {
                            $scope: scope,
                            zfaModalDefer: defer
                        })
                    );
                }

                // Register events with foundation api
                FoundationApi.publish(id, 'show');

                FoundationApi.subscribe(id, function(msg) {
                    switch (msg) {
                        case 'toggle':
                            if (!scope.active) break;
                        case 'close':
                        case 'hide':
                            defer.reject(msg);

                            $timeout(function() {
                                element.remove();
                                scope.$destroy();
                            }, 3000);

                            FoundationApi.unsubscribe(id);
                            break;
                    }
                });

                defer.promise.finally(function() {
                    FoundationApi.publish(id, 'close');
                    FoundationApi.unsubscribe(id);
                });

                return defer.promise;
            });
        }

        return{
            createModal:createModal
        }
    }]);
