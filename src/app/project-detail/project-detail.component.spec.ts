/*import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import { HttpModule } from '@angular/http';
import { DebugElement } from '@angular/core';
import { By , BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule ,FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { PushNotificationOptions, PushNotificationService } from 'ngx-push-notifications';
import { of } from 'rxjs';
import { HttpClientTestingModule  , HttpTestingController} from '@angular/common/http/testing';
import { config } from '../config';
// import { Developers } from '../models/developers.model';
declare var $ : any;
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectService } from '../services/project.service';
import { ChildComponent } from '../child/child.component';
import {LeaveComponent} from '../leave/leave.component';



fdescribe('ProjectDetailComponent', () => {
     let component: ProjectDetailComponent;
     let fixture: ComponentFixture<ProjectDetailComponent>;
     let projectService: ProjectService;
     let DebugElement: DebugElement;
     let user: any;
     let pro1: DebugElement;
     let loader: any;
     let httpMock: HttpTestingController;
     beforeEach(async(() => {
          TestBed.configureTestingModule({
               declarations: [ 
               ProjectDetailComponent,
               ChildComponent,
               LeaveComponent
               ],
               providers: [ProjectService , PushNotificationService ],

               imports: [ 
               // HttpModule,
               HttpClientModule,
               RouterTestingModule,
               BrowserModule,
               ReactiveFormsModule,
               FormsModule,
               CKEditorModule,
               DragDropModule,
               MatCardModule,
               HttpClientTestingModule
               // Observable,
               ] 
          })
          .compileComponents();
     }));

     beforeEach(() => {
          fixture = TestBed.createComponent(ProjectDetailComponent);
          component = fixture.componentInstance;

          pro1 = fixture.debugElement.query(By.css('#ptag')); 
          
          projectService = TestBed.get(ProjectService);
          httpMock = TestBed.get(HttpTestingController); 
          user = {
               "userRole":"projectManager",
               "projects":[],
               "tasks":["5c8902cb07efea54bbd55bc2","5c8903f007efea54bbd55bc3","5c8baa7d7f8c1d3a46d8cb52","5c8baacf2e73613ea207c6dc","5c8bab6d34a5283ef2f1247b","5c8bad90c55b2d4112139f89","5c90dd9c6ad5e96ca7952aeb","5c90dd9c6ad5e96ca7952aeb"],
               "_id":"5c777ed9c45c94663eb74bb6",
               "name":"Tirthraj Barot",
               "email":"tirthrajbarot2394@gmail.com",
               "password":"$2a$10$cn8G8ON11qGjUk8Kyci7W.Avs..21rtFUNFGFDAaKhv/eW/U6hLSG",
               "createdAt":"2019-02-28T06:25:29.835Z",
               "updatedAt":"2019-03-20T06:37:49.737Z",
               "__v":8,
               "CV":"5c777ed9c45c94663eb74bb6/Brochure_Rao Infotech.pdf",
               "profilePhoto":"5c777ed9c45c94663eb74bb6/xYXGm.jpg",
               "phone":"9979430007",
               "experience":""
          }; 

     });

     it('should create', () => {
          expect(component).toBeTruthy();
     });
     /*it(`should change the value of developers by calling the function and service ` , async(()=>{

          console.log("after ==>" , pro1.nativeElement.textContent);
          console.log("pro ===> " , component.pro);

          console.log("try ===>" , component.pro);
          localStorage.setItem('currentUser', JSON.stringify(user));
          const id = "5c77db951c552a74e9ae9118";
          component.getProject(id);
          fixture.whenStable().then(() => {
               fixture.detectChanges();
               expect(pro1.nativeElement.textContent).toEqual(component.pro.title);
               console.log("pro ===> " , component.pro.title);
               console.log("coming == ." , pro1.nativeElement.textContent);

          });
          
     }));*/

     /*it(`should retrive developers from the api via GET` , ()=>{
          const dummyDevelopers: Developers[]   = [
               {
                    name:  "pushpraj",
                    userRole: "Develpoers",
                    email: "xyz@gmail.com",
                    password: "asd",
                    
               },
               {
                    name:  "vivek",
                    userRole: "Develpoers",
                    email: "xyz@gmail.com",
                    password: "asd",
                    
               }
          ];
         projectService.getAllDevelopers().subscribe(Developers => {
              console.log("developes in test ===>" , Developers);
               expect(Developers.length).toBe(2);
          });
         const request = httpMock.expectOne(`${config.baseApiUrl}user/get-all-developers`);

         expect(request.request.method).toBe('GET');

         request.flush(dummyDevelopers);
     });*/

});


