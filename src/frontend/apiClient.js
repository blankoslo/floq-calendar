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
            if (data && method == 'get') {
                console.log(data);
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
            //req.setRequestHeader('Authorization', token);
            req.send(data ? JSON.stringify(data) : null);
        }); 
    };

    const xhrGet = (url, data) => xhr('get', url, data);
    const xhrPost = (url, data) => xhr('post', url, data);
    const xhrPut = (url, data) => xhr('put', url, data);
    const xhrDelete = (url, data) => xhr('delete', url, data);

    function loadAbsenceTypes() {
        return xhrGet('/absence_types', null);
    };

    // TODO: Does not support filtering on employee or date range yet.
    function loadAbsenceDays(employee, from, to) {
        return xhrGet('/absence_days', {
            employee,
            from: utils.dateToISO8601Date(from),
            to: utils.dateToISO8601Date(to)
        });
    };

    function createAbsenceDay(type, date) {
        return xhrPost('/absence_days', {
            // TODO: Don't hardcode
            employee: 1,
            type: type,
            date: utils.dateToISO8601Date(date)
        });
    };

    function updateAbsenceDay(selected, absenceDay) {
        absenceDay.type = selected;
        return xhrPut('/absence_days', absenceDay);
    };

    function deleteAbsenceDay(absenceDay) {
        return xhrDelete('/absence_days', {
            id: Array.isArray(absenceDay.id) ? absenceDay.id : [absenceDay.id]
        });
    };

    return {
        loadAbsenceTypes,
        loadAbsenceDays,
        createAbsenceDay,
        updateAbsenceDay,
        deleteAbsenceDay
    };
}

module.exports = apiClient;
