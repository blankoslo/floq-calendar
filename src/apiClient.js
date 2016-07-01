var utils = require('./utils.js');

var apiClient = function(rootUri) {
    function xhr(method, url, data, token) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onload = () => {
                if (!(req.status >= 200 && req.status < 400)) {
                    reject(req)
                    return;
                };

                var res = req.responseText ? JSON.parse(req.responseText) : {};
                resolve(res);
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
            req.setRequestHeader('Authorization', `Bearer ${token}`);
            req.setRequestHeader('Prefer', 'return=representation');
            req.send(data ? JSON.stringify(data) : null);
        });
    };

    const xhrGet = (url, data, token) => xhr('get', url, data, token);
    const xhrPost = (url, data, token) => xhr('post', url, data, token);
    const xhrPut = (url, data, token) => xhr('put', url, data, token);
    const xhrPatch = (url, data, token) => xhr('PATCH', url, data, token);
    const xhrDelete = (url, data, token) => xhr('delete', url, data, token);

    function getLoggedInEmployee(mail, token) {
        return xhrGet(`/employees?email=ilike.${mail}`, null, token);
    };

    function loadEmployees(token) {
        return xhrGet('/employees', null, token);
    };

    function loadAbsenceTypes(token) {
        return xhrGet('/projects', null, token);
    };

    function loadAbsenceDays(employee, from, to, token) {

        var requestPath = `/staffing?select=employee,project{id,name,billable}, date&date=gte.${utils.dateToISO8601Date(from)} &date=lte.${utils.dateToISO8601Date(to)}`;

        if(employee) requestPath += `&employee=eq.${employee}`;

        return xhrGet(requestPath, null, token);
    };

    function createAbsenceDay(employee, type, date, token) {
        return xhrPost('/staffing?select=employee,project{id,name,billable},date',
            {'employee': employee, 'project' : type, 'date' : utils.dateToISO8601Date(date)  }
            , token);
    };

    function updateAbsenceDay(selectedProjectId, absenceDay, token) {
        var employeeId = absenceDay.employee;
        var date = absenceDay.date;

        return xhrPatch(`/staffing?select=employee,project{id,name,billable}, date&employee=eq.${employeeId}&date=eq.${date}`, {'project' : selectedProjectId}, token);
    };

    function deleteAbsenceDay(absenceDay, token) {
        var employeeId = absenceDay.employee;
        var date = absenceDay.date;

        return xhrDelete(`/staffing?employee=eq.${employeeId}&date=eq.${date}`, {}, token);
    };

    return {
        getLoggedInEmployee,
        loadEmployees,
        loadAbsenceTypes,
        loadAbsenceDays,
        createAbsenceDay,
        updateAbsenceDay,
        deleteAbsenceDay
    };
}

module.exports = apiClient;
