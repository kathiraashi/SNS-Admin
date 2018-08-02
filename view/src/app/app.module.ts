import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app.routing.module';
import { ModalModule} from 'ngx-bootstrap';
import {CalendarModule} from 'primeng/calendar';

import {MatButtonModule, MatFormFieldModule, MatSelectModule, MatRadioModule} from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';

import { HeaderComponent } from './Components/Common/header/header.component';
import { LoginPageComponent } from './Components/login-page/login-page.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { MainApplicationComponent } from './Components/Applications-View/main-application/main-application.component';
import { PersonalInfoApplicationComponent } from './Components/Applications-View/SubComponents/personal-info-application/personal-info-application.component';
import { EducationInfoApplicationComponent } from './Components/Applications-View/SubComponents/education-info-application/education-info-application.component';
import { ExperienceActivitiesApplicationComponent } from './Components/Applications-View/SubComponents/experience-activities-application/experience-activities-application.component';
import { ReferenceDeclarationApplicationComponent } from './Components/Applications-View/SubComponents/reference-declaration-application/reference-declaration-application.component';
import { ViewQuestionAnswersComponent } from './Components/Question-Answers/view-question-answers/view-question-answers.component';
import { ModelEditQuestionAnswersComponent } from './Components/Models/QuestionAnswers/model-edit-question-answers/model-edit-question-answers.component';
import { DeleteConfirmationComponent } from './Components/Common/delete-confirmation/delete-confirmation.component';
import { MainPostAppliedComponent } from './Components/Settings/Post-Applied/main-post-applied/main-post-applied.component';
import { MainDepartmentComponent } from './Components/Settings/Department/main-department/main-department.component';
import { MainPersonalInfoComponent } from './Components/Settings/Personal-Info/main-personal-info/main-personal-info.component';
import { PersonalInfoNationalityComponent } from './Components/Settings/Personal-Info/SubComponents/personal-info-nationality/personal-info-nationality.component';
import { PersonalInfoReligionComponent } from './Components/Settings/Personal-Info/SubComponents/personal-info-religion/personal-info-religion.component';
import { PersonalInfoCommunityComponent } from './Components/Settings/Personal-Info/SubComponents/personal-info-community/personal-info-community.component';
import { ModelPersonalinfoCommunityComponent } from './Components/Models/Settings/personal-info/model-personalinfo-community/model-personalinfo-community.component';
import { ModelPersonalinfoReligionComponent } from './Components/Models/Settings/personal-info/model-personalinfo-religion/model-personalinfo-religion.component';
import { ModelPersonalinfoNationalityComponent } from './Components/Models/Settings/personal-info/model-personalinfo-nationality/model-personalinfo-nationality.component';
import { ModelDepartmentCreateComponent } from './Components/Models/Settings/Department/model-department-create/model-department-create.component';
import { ModelPostCreateComponent } from './Components/Models/Settings/Post-Applied/model-post-create/model-post-create.component';
import { MainEducationalInfoComponent } from './Components/Settings/Educational-Info/main-educational-info/main-educational-info.component';
import { ModelEducationalCreateComponent } from './Components/Models/Settings/educational-info/model-educational-create/model-educational-create.component';
import { ApplicationsListComponent } from './Components/applications-list/applications-list.component';









@NgModule({
  declarations: [
    AppComponent,
   HeaderComponent,
   LoginPageComponent,
   DashboardComponent,
   MainApplicationComponent,
   PersonalInfoApplicationComponent,
   EducationInfoApplicationComponent,
   ExperienceActivitiesApplicationComponent,
   ReferenceDeclarationApplicationComponent,
   ViewQuestionAnswersComponent,
   ModelEditQuestionAnswersComponent,
   DeleteConfirmationComponent,
   MainPostAppliedComponent,
   MainDepartmentComponent,
  MainPersonalInfoComponent,
   PersonalInfoNationalityComponent,
   PersonalInfoReligionComponent,
   PersonalInfoCommunityComponent,
   ModelPersonalinfoCommunityComponent,
   ModelPersonalinfoReligionComponent,
   ModelPersonalinfoNationalityComponent,
   ModelDepartmentCreateComponent,
   ModelPostCreateComponent,
   MainEducationalInfoComponent,
   ModelEducationalCreateComponent,
   ApplicationsListComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    CalendarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    NgSelectModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyAKAH7vSuRjbTP16E9AFaUf6gDa69DZ4e8'}),
  ],
  providers: [],
  entryComponents: [ModelEditQuestionAnswersComponent,
    DeleteConfirmationComponent,
   ModelPersonalinfoCommunityComponent,
    ModelPersonalinfoReligionComponent,
    ModelPersonalinfoNationalityComponent,
    ModelDepartmentCreateComponent,
    ModelPostCreateComponent,
    ModelEducationalCreateComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
