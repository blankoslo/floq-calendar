var utils = require('./utils.js');

var apiClient = function(rootUri) {
    function xhr(method, url, data, token) {
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
            if (data && method == 'get') {
                url += '?' + Object.keys(data)
                        .filter((key) => data[key] !== null)
                        .map((key) => {
                            return key + '=' + data[key];
                        }).join('&');
                data = null;
            }
            req.open(method, rootUri + url);
            if (data && !(method == 'get')) {
                req.setRequestHeader('Content-Type', 'application/json');
            }
            req.setRequestHeader('Authorization', token);
            req.send(data ? JSON.stringify(data) : null);
        }); 
    };

    const xhrGet = (url, data, token) => xhr('get', url, data, token);
    const xhrPost = (url, data, token) => xhr('post', url, data, token);
    const xhrPut = (url, data, token) => xhr('put', url, data, token);
    const xhrDelete = (url, data, token) => xhr('delete', url, data, token);

    function getLoggedInEmployee(token) {
        return xhrGet('/employees/loggedin', null, token);
    }

    function loadAbsenceTypes(token) {
        return xhrGet('/absence_types', null, token);
    };

    // TODO: Does not support filtering on employee or date range yet.
    function loadAbsenceDays(employee, from, to, token) {
        return xhrGet('/absence_days', {
            employee,
            from: utils.dateToISO8601Date(from),
            to: utils.dateToISO8601Date(to)
        }, token);
    };

    function createAbsenceDay(type, date, token) {
        return xhrPost('/absence_days', {
            // TODO: Don't hardcode
            employee: 1,
            type: type,
            date: utils.dateToISO8601Date(date)
        }, token);
    };

    function updateAbsenceDay(selected, absenceDay, token) {
        absenceDay.type = selected;
        return xhrPut('/absence_days', absenceDay, token);
    };

    function deleteAbsenceDay(absenceDay, token) {
        return xhrDelete('/absence_days', {
            id: Array.isArray(absenceDay.id) ? absenceDay.id : [absenceDay.id]
        }, token);
    };

    return {
        getLoggedInEmployee,
        loadAbsenceTypes,
        loadAbsenceDays,
        createAbsenceDay,
        updateAbsenceDay,
        deleteAbsenceDay
    };
}

module.exports = apiClient;
