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
import { AppRoutingModule } from './app.routing.module';
import { ModalModule} from 'ngx-bootstrap';
import { CalendarModule } from 'primeng/calendar';

import { MatButtonModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';

import { HeaderComponent } from './Components/Common/header/header.component';
import { LoginPageComponent } from './Components/Common/login-page/login-page.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { MainApplicationComponent } from './Components/Applications/applications-view/main-application/main-application.component';
import { PersonalInfoApplicationComponent } from './Components/Applications/applications-view/SubComponents/personal-info-application/personal-info-application.component';
import { EducationInfoApplicationComponent } from './Components/Applications/applications-view/SubComponents/education-info-application/education-info-application.component';
import { ExperienceActivitiesApplicationComponent } from './Components/Applications/applications-view/SubComponents/experience-activities-application/experience-activities-application.component';
import { ReferenceDeclarationApplicationComponent } from './Components/Applications/applications-view/SubComponents/reference-declaration-application/reference-declaration-application.component';
import { ViewQuestionAnswersComponent } from './Components/Question-Answers/view-question-answers/view-question-answers.component';
import { ModelEditQuestionAnswersComponent } from './Models/QuestionAnswers/model-edit-question-answers/model-edit-question-answers.component';
import { DeleteConfirmationComponent } from './Components/Common/delete-confirmation/delete-confirmation.component';
import { MainPostAppliedComponent } from './Components/Settings/Post-Applied/main-post-applied/main-post-applied.component';
import { MainDepartmentComponent } from './Components/Settings/Department/main-department/main-department.component';
import { MainPersonalInfoComponent } from './Components/Settings/Personal-Info/main-personal-info/main-personal-info.component';
import { PersonalInfoNationalityComponent } from './Components/Settings/Personal-Info/SubComponents/personal-info-nationality/personal-info-nationality.component';
import { PersonalInfoReligionComponent } from './Components/Settings/Personal-Info/SubComponents/personal-info-religion/personal-info-religion.component';
import { PersonalInfoCommunityComponent } from './Components/Settings/Personal-Info/SubComponents/personal-info-community/personal-info-community.component';
import { ModelPersonalinfoCommunityComponent } from './Models/Settings/personal-info/model-personalinfo-community/model-personalinfo-community.component';
import { ModelPersonalinfoReligionComponent } from './Models/Settings/personal-info/model-personalinfo-religion/model-personalinfo-religion.component';
import { ModelPersonalinfoNationalityComponent } from './Models/Settings/personal-info/model-personalinfo-nationality/model-personalinfo-nationality.component';
import { ModelDepartmentCreateComponent } from './Models/Settings/Department/model-department-create/model-department-create.component';
import { ModelPostCreateComponent } from './Models/Settings/Post-Applied/model-post-create/model-post-create.component';
import { MainEducationalInfoComponent } from './Components/Settings/Educational-Info/main-educational-info/main-educational-info.component';
import { ModelEducationalCreateComponent } from './Models/Settings/educational-info/model-educational-create/model-educational-create.component';
import { ApplicationsListComponent } from './Components/Applications/applications-list/applications-list.component';
import { ModelExcelUploadsViewComponent } from './Models/QuestionAnswers/model-excel-uploads-view/model-excel-uploads-view.component';
import { UserManagementListComponent } from './Components/Settings/UserManagement/user-management-list/user-management-list.component';
import { ModelUserCreateUserManagementComponent } from './Models/Settings/UserManagement/model-user-create-user-management/model-user-create-user-management.component';
import { InstitutionListComponent } from './Components/Settings/Institutions/institution-list/institution-list.component';
import { ModelInstitutionCreateComponent } from './Models/Settings/Institutions/model-institution-create/model-institution-create.component';
import { CategoriesListComponent } from './Components/Settings/Categories/categories-list/categories-list.component';
import { ModelCategoryCreateComponent } from './Models/Settings/Categories/model-category-create/model-category-create.component';
import { ExamConfigListComponent } from './Components/Settings/ExamConfig/exam-config-list/exam-config-list.component';
import { ModelExamConfigCreateComponent } from './Models/Settings/ExamConfig/model-exam-config-create/model-exam-config-create.component';
import { ConfirmationComponent } from './Components/Common/confirmation/confirmation.component';
import { ExamDetailsComponent } from './Components/Applications/applications-view/SubComponents/exam-details/exam-details.component';
import { ExamDetailsListComponent } from './Components/Settings/Exam_Details/exam-details-list/exam-details-list.component';
import { ModelExamDetailsCreateComponent } from './Models/Settings/Exam_Details/model-exam-details-create/model-exam-details-create.component';






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
   ModelExcelUploadsViewComponent,
   UserManagementListComponent,
   ModelUserCreateUserManagementComponent,
   InstitutionListComponent,
   ModelInstitutionCreateComponent,
   CategoriesListComponent,
   ModelCategoryCreateComponent,
   ExamConfigListComponent,
   ModelExamConfigCreateComponent,
   ConfirmationComponent,
   ExamDetailsComponent,
   ExamDetailsListComponent,
   ModelExamDetailsCreateComponent
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
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgSelectModule
  ],
  providers: [],
  entryComponents: [ModelEditQuestionAnswersComponent,
    DeleteConfirmationComponent,
   ModelPersonalinfoCommunityComponent,
    ModelPersonalinfoReligionComponent,
    ModelPersonalinfoNationalityComponent,
    ModelDepartmentCreateComponent,
    ModelPostCreateComponent,
    ModelEducationalCreateComponent,
    ModelExcelUploadsViewComponent,
    ModelUserCreateUserManagementComponent,
    ModelInstitutionCreateComponent,
    ModelCategoryCreateComponent,
    ModelExamConfigCreateComponent,
    ConfirmationComponent,
    ModelExamDetailsCreateComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
