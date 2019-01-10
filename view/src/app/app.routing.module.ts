import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


import { AuthGuard } from './Authentication/auth.guard';


import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginPageComponent } from './Components/Common/login-page/login-page.component';
import { ApplicationsListComponent } from './Components/Applications/applications-list/applications-list.component';
import { MainApplicationComponent } from './Components/Applications/applications-view/main-application/main-application.component';
import { ViewQuestionAnswersComponent } from './Components/Question-Answers/view-question-answers/view-question-answers.component';
import { MainDepartmentComponent } from './Components/Settings/Department/main-department/main-department.component';
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
      data: {}

   },
   { path: 'Login',
      component: LoginPageComponent,
      data: {}

   },
   { path: 'Dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'Applications',
      component: ApplicationsListComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'Applications/:Candidate_Id',
      component: MainApplicationComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'view_Q/A',
      component: ViewQuestionAnswersComponent,
      canActivate: [AuthGuard],
      data: {}
   },
   { path: 'Departments',
      component: MainDepartmentComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'Institutions',
      component: InstitutionListComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'Categories',
      component: CategoriesListComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'Designation',
      component: DesignationListComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'ExamConfig',
      component: ExamConfigListComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'VacanciesConfig',
      component: VacanciesConfigListComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'ExamDetails',
      component: ExamDetailsListComponent,
      canActivate: [AuthGuard],
      data: {}

   },
   { path: 'User_Management',
      component: UserManagementListComponent,
      canActivate: [AuthGuard],
      data: {}

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
