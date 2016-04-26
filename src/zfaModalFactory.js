angular.module('zfaModal')
    .factory('zfaModalFactory', function(FoundationApi, $controller, $rootScope, $http, $q, $compile, $timeout, $window, $templateCache) {

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
    });