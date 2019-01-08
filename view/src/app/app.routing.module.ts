import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginPageComponent } from './Components/Common/login-page/login-page.component';
import { ApplicationsListComponent } from './Components/Applications/applications-list/applications-list.component';
import { MainApplicationComponent } from './Components/Applications/applications-view/main-application/main-application.component';
import { ViewQuestionAnswersComponent } from './Components/Question-Answers/view-question-answers/view-question-answers.component';
import { MainPostAppliedComponent } from './Components/Settings/Post-Applied/main-post-applied/main-post-applied.component';
import { MainDepartmentComponent } from './Components/Settings/Department/main-department/main-department.component';
import { MainPersonalInfoComponent } from './Components/Settings/Personal-Info/main-personal-info/main-personal-info.component';
import { MainEducationalInfoComponent } from './Components/Settings/Educational-Info/main-educational-info/main-educational-info.component';
import { UserManagementListComponent } from './Components/Settings/UserManagement/user-management-list/user-management-list.component';
import { InstitutionListComponent } from './Components/Settings/Institutions/institution-list/institution-list.component';
import { CategoriesListComponent } from './Components/Settings/Categories/categories-list/categories-list.component';
import { ExamConfigListComponent } from './Components/Settings/ExamConfig/exam-config-list/exam-config-list.component';
import { ExamDetailsListComponent } from './Components/Settings/Exam_Details/exam-details-list/exam-details-list.component';
import { DesignationListComponent } from './Components/Settings/Designation/designation-list/designation-list.component';
import { VacanciesConfigListComponent } from './Components/Settings/VacanciesConfig/vacancies-config-list/vacancies-config-list.component';



const appRoutes: Routes = [
   { path: '',
      component: LoginPageComponent,
      data: {
         animation: { value: 'Login', }
      }
   },
   { path: 'Login',
      component: LoginPageComponent,
      data: {
         animation: { value: 'Login', }
      }
   },
   { path: 'Dashboard',
      component: DashboardComponent,
      data: {
         animation: { value: 'Dashboard', }
      }
   },
   { path: 'Applications',
      component: ApplicationsListComponent,
      data: {
         animation: { value: 'Applications', }
      }
   },
   { path: 'Applications/:Candidate_Id',
      component: MainApplicationComponent,
      data: {
         animation: { value: 'Applications', }
      }
   },
   { path: 'view_Q/A',
      component: ViewQuestionAnswersComponent,
      data: {
         animation: { value: 'view_Q/A', }
      }
   },
   { path: 'Post_Applied',
      component: MainPostAppliedComponent,
      data: {
         animation: { value: 'Post_Applied', }
      }
   },
   { path: 'Departments',
      component: MainDepartmentComponent,
      data: {
         animation: { value: 'Departments', }
      }
   },
   { path: 'Institutions',
      component: InstitutionListComponent,
      data: {
         animation: { value: 'Institutions', }
      }
   },
   { path: 'Categories',
      component: CategoriesListComponent,
      data: {
         animation: { value: 'Categories', }
      }
   },
   { path: 'Designation',
      component: DesignationListComponent,
      data: {
         animation: { value: 'Designation', }
      }
   },
   { path: 'ExamConfig',
      component: ExamConfigListComponent,
      data: {
         animation: { value: 'ExamConfig', }
      }
   },
   { path: 'VacanciesConfig',
      component: VacanciesConfigListComponent,
      data: {
         animation: { value: 'VacanciesConfig', }
      }
   },
   { path: 'ExamDetails',
      component: ExamDetailsListComponent,
      data: {
         animation: { value: 'ExamDetails', }
      }
   },
   { path: 'Personal_Info',
      component: MainPersonalInfoComponent,
      data: {
         animation: { value: 'Personal_Info', }
      }
   },
   { path: 'Educational_Info',
      component: MainEducationalInfoComponent,
      data: {
         animation: { value: 'Educational_Info', }
      }
   },
   { path: 'User_Management',
      component: UserManagementListComponent,
      data: {
         animation: { value: 'User_Management', }
      }
   }



];

@NgModule({
   declarations: [ ],
   imports: [ RouterModule.forRoot(appRoutes,
      { enableTracing: true }
   )],
   providers: [],
   bootstrap: []
})
  export class AppRoutingModule { }
