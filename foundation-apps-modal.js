(function() {
    'use strict';
    
    angular.module('zfaModal', ['foundation'])
        .provider('zfaModal', function() {
            var configs = {};

            function provider(id, config) {
                if (typeof id != 'string') throw new Error("zfaModalProvider: id should be defined");
                configs[id] = config;
            }

            provider.$get = function(FoundationApi, $controller, $rootScope, $http, $q, $compile, $timeout, $window, $templateCache) {
                for (var id in configs) {
                    if (!configs.hasOwnProperty(id)) continue;
                    if (modalFactory[id]) throw new Error("zfaModal: forbidden id: " + id);

                    modalFactory[id] = function(_config, locals) {
                        var config = angular.extend({}, _config);
                        config.locals = angular.extend({}, config.locals, locals);
                        return modalFactory(config);
                    }.bind(null, configs[id]);
                }

                return modalFactory;

                function modalFactory(config) {
                    config = angular.extend({}, config);

                    var defer = $q.defer();

                    if(config.templateUrl) {
                        if ($templateCache.get(config.templateUrl)) {
                            defer.resolve($templateCache.get(config.templateUrl));
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
                        throw new Error("zfaModal: template should be defined");
                    }

                    return defer.promise
                        .then(function(template) {
                            var defer = $q.defer();

                            var id = FoundationApi.generateUuid();

                            var element = angular.element(template)
                                .attr('id', id);

                            var props = {
                                'animationIn': 'animation-in',
                                'animationOut': 'animation-out',
                                'overlay': 'overlay',
                                'overlayClose': 'overlay-close'
                            };

                            for (var prop in props) {
                                if (!props.hasOwnProperty(prop)) continue;
                                if(config[prop] !== undefined) element.attr(props[prop], config[prop]);
                            }

                            var container = angular.element(config.container || $window.document.body) ;
                            container.append(element);

                            var scope = $rootScope.$new();
                            scope.active = true;
                            scope.resolve = defer.resolve.bind(defer);
                            scope.reject = defer.reject.bind(defer);

                            $compile(element)(scope);

                            if (config.controller) {
                                $controller(config.controller, angular.extend({}, config.locals, { $scope: scope, zfaModalDefer: defer }));
                            }

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
                };
            };

            provider.$get.$inject = ['FoundationApi', '$controller', '$rootScope', '$http', '$q', '$compile', '$timeout', '$window', '$templateCache'];

            return provider;
        })
        .config(['zfaModalProvider', function(zfaModalProvider) {
            zfaModalProvider('alert', {
                controller: ['$scope', 'ok', 'message', function($scope, ok, message) {
                    $scope.ok = ok;
                    $scope.message = message;
                }],
                template: '<div zf-modal="" overlay="false" overlay-close="false" class="tiny dialog"><a class="close-button" zf-close="">×</a><h4>{{message}}</h4><a class="button primary" ng-click="resolve()">{{ok}}</a></div>',
                locals: {
                    ok: "OK",
                    message: ""
                }
            });
        }])
        .config(['zfaModalProvider', function(zfaModalProvider) {
            zfaModalProvider('confirm', {
                controller: ['$scope', 'ok', 'cancel', 'message', function($scope, ok, cancel, message) {
                    $scope.ok = ok;
                    $scope.cancel = cancel;
                    $scope.message = message;
                }],
                template: '<div zf-modal="" overlay="false" overlay-close="false" class="tiny dialog"><a class="close-button" zf-close="">×</a><h4>{{message}}</h4><a class="button primary" ng-click="resolve()">{{ok}}</a><a class="button secondary" ng-click="reject()">{{cancel}}</a></div>',
                locals: {
                    ok: "OK",
                    cancel: "Cancel",
                    message: ""
                }
            });
        }])
        .config(['zfaModalProvider', function(zfaModalProvider) {
            zfaModalProvider('prompt', {
                controller: ['$scope', 'ok', 'cancel', 'message', 'value', function($scope, ok, cancel, message, value) {
                    $scope.ok = ok;
                    $scope.cancel = cancel;
                    $scope.message = message;
                    $scope.value = value;
                }],
                template: '<div zf-modal="" overlay="false" overlay-close="false" class="tiny dialog"><a class="close-button" zf-close="">×</a><h4>{{message}}</h4><label><input type="text" ng-model="value"></label><a class="button primary" ng-click="resolve(value)">{{ok}}</a><a class="button secondary" ng-click="reject()">{{cancel}}</a></div>',
                locals: {
                    ok: "OK",
                    cancel: "Cancel",
                    message: "",
                    value: ""
                }
            });
        }]);
})();
