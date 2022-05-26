//Hack to make this available both frontend and to node

(function(exports) {
    function parameters_as_url(action, parameters=[], type) {
        let url = '?action=' + action;

        parameters.forEach((param) => {
            url = url + '&' + param;
        });

        url = url + '_' + type;

        return url;
    }

  exports.parameters_as_url = parameters_as_url;
})

(typeof exports === 'undefined' ? this['sharedModule'] = {}: exports);
