var utils = require('./utils.js');

var apiClient = function(rootUri) {
    function xhr(method, url, data) {//, token) {
        const isSuccess = n => n >= 200 && n < 400;
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onload = () => {
                if (!(req.status >= 200 && req.status < 400)) {
                    reject(req)
                    return;
                };
                
                var res = JSON.parse(req.responseText);
                if (!res.success) {
                    reject(res);
                    return
                }

                resolve(res.data);
            }
            req.onerror = () => reject(req);
            req.open(method, rootUri + url);
            //req.setRequestHeader('Authorization', token);
            if (data) {
                req.setRequestHeader('Content-Type', 'application/json');
            }
            req.send(data ? JSON.stringify(data) : null);
        }); 
    };

    const xhrGet = (url, data) => xhr('get', url, data);
    const xhrPost = (url, data) => xhr('post', url, data);
    const xhrPut = (url, data) => xhr('put', url, data);
    const xhrDelete = (url) => xhr('delete', url);

    function loadAbsenceTypes() {
        return xhrGet('/absence_types', null);
    };

    // TODO: Does not support filtering on employee or date range yet.
    function loadAbsenceDays(employee) {
        return xhrGet('/absence_days', null);
    };

    function createAbsenceDay(date) {
        return xhrPost('/absence_days', {
            // TODO: Don't hardcode
            employee: 1,
            // TODO: Don't hardcode
            absence_type: 1,
            date: utils.dateToISO8601Date(date)
        });
    };

    return {loadAbsenceDays, createAbsenceDay};
}

module.exports = apiClient;
