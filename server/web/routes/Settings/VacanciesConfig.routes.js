module.exports = function(app) {

   var Controller = require('./../../controller/Settings/VacanciesConfig.controller.js');


   app.post('/API/Settings/VacanciesConfig/VacanciesConfig_AsyncValidate', Controller.VacanciesConfig_AsyncValidate);
   app.post('/API/Settings/VacanciesConfig/VacanciesConfig_Create', Controller.VacanciesConfig_Create);
   app.post('/API/Settings/VacanciesConfig/VacanciesConfig_List', Controller.VacanciesConfig_List);
   app.post('/API/Settings/VacanciesConfig/VacanciesConfig_Update', Controller.VacanciesConfig_Update);
   app.post('/API/Settings/VacanciesConfig/VacanciesConfig_Hide', Controller.VacanciesConfig_Hide);
   app.post('/API/Settings/VacanciesConfig/VacanciesConfig_UnHide', Controller.VacanciesConfig_UnHide);
   // app.post('/API/Settings/VacanciesConfig/Demo_Upload', Controller.Demo_Upload);

};