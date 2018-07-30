import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginPageComponent } from './Components/login-page/login-page.component';
import { MainApplicationComponent } from './Components/Applications/main-application/main-application.component';
import { ViewQuestionAnswersComponent } from './Components/Question-Answers/view-question-answers/view-question-answers.component';
import { MainPostAppliedComponent } from './Components/Settings/Post-Applied/main-post-applied/main-post-applied.component';
import { MainDepartmentComponent } from './Components/Settings/Department/main-department/main-department.component';
import { MainPersonalInfoComponent } from './Components/Settings/Personal-Info/main-personal-info/main-personal-info.component';
import { MainEducationalInfoComponent } from './Components/Settings/Educational-Info/main-educational-info/main-educational-info.component';

const appRoutes: Routes = [
   { path: '',
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
   { path: 'Department',
      component: MainDepartmentComponent,
      data: {
         animation: { value: 'Department', }
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
