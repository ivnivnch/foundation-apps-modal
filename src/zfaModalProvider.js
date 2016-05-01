angular.module('zfaModal', ['foundation'])
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
            $get: function (zfaModalFactory, FoundationApi) {
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

            }
        }
    });



