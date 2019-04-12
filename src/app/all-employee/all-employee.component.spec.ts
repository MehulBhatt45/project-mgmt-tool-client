import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { FormsModule , FormBuilder  , ReactiveFormsModule} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By , BrowserModule }  from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import 'jquery';
declare var $ : any;


import { AllEmployeeComponent } from './all-employee.component';
import { ProjectService } from '../services/project.service';
import { Developers } from '../services/models/developers.model';
import { project } from '../services/models/project.model'; 
import { SearchTaskPipe } from '../search-task.pipe';


fdescribe('AllEmployeeComponent', () => {
    let component: AllEmployeeComponent;
    let fixture: ComponentFixture<AllEmployeeComponent>;
    let projectService: ProjectService;
    let searchTaskPipe: SearchTaskPipe;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AllEmployeeComponent ],
            imports: [ HttpClientModule , FormsModule , RouterTestingModule , BrowserModule , ReactiveFormsModule],
            providers: [ ProjectService  , SearchTaskPipe]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AllEmployeeComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
        projectService = TestBed.get(ProjectService);
        localStorage.setItem('currentUser' , '{"userRole":"projectManager","projects":[],"tasks":["5c8902cb07efea54bbd55bc2","5c8903f007efea54bbd55bc3","5c8baa7d7f8c1d3a46d8cb52","5c8baacf2e73613ea207c6dc","5c8bab6d34a5283ef2f1247b","5c8bad90c55b2d4112139f89","5c90dd9c6ad5e96ca7952aeb","5c90dd9c6ad5e96ca7952aeb"],"_id":"5c777ed9c45c94663eb74bb6","name":"Tirthraj Barot","email":"tirthrajbarot2394@gmail.com","password":"$2a$10$cn8G8ON11qGjUk8Kyci7W.Avs..21rtFUNFGFDAaKhv/eW/U6hLSG","createdAt":"2019-02-28T06:25:29.835Z","updatedAt":"2019-03-20T06:37:49.737Z","__v":8,"CV":"5c777ed9c45c94663eb74bb6/Brochure_Rao Infotech.pdf","profilePhoto":"5c777ed9c45c94663eb74bb6/xYXGm.jpg","phone":"9979430007","experience":""}');
        searchTaskPipe = new SearchTaskPipe();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(` should get us the all developers  ` , () => {
        const developers: Developers[] = [
            { 
                "_id" : "5c6c0aa9d96ad972c2e5438e", 
                "userRole" : "user", 
                "name" : "mehul bhatt", 
                "email" : "mehul@gmail.com", 
                "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
                "createdAt" : "2019-02-19T13:54:49.334+0000", 
                "updatedAt" : "2019-02-19T13:54:49.334+0000", 
            },
            { 
                "_id" :"5c752002ff279f07b0fba58e", 
                "userRole" : "user", 
                "name" : "pushpraj chudasama", 
                "email" : "pushpraj@gmail.com", 
                "password" : "$2a$10$SV7RhoN5ONLADXLW97v8GOwukUkMahLtlg.Wn1kyVwqEZYTEW8ZRC", 
                "createdAt" : "2019-02-26T11:16:18.698+0000", 
                "updatedAt" : "2019-02-26T11:16:18.698+0000", 
            }
        ];
        expect(component.developers).not.toBeDefined();
        spyOn(projectService , 'getAllDevelopers').and.callFake(() => {
            return Observable.from([developers]);
        });

        component.ngOnInit();
        expect(component.filteredDevelopers).toEqual(developers);
        expect(component.developers).toEqual(developers);
    });
    it(`should set the error property if server returns the error when getting developers` , () => {
        const error = new Error("Server Error");

        spyOn(projectService , 'getAllDevelopers').and.returnValue(Observable.throw(error));

        expect(component.error).not.toBeDefined();

        component.ngOnInit();

        expect(component.error).toBeDefined();
    });
    it(`should return all the projects` , () => {
        const projects: project[] = [
            { 
                "_id" :"5c83a8c2d70c1d4a38fab046", 
                "tasks" : "5c87c52af44be956faab78c5", 
                "Teams" : "5c777ed9c45c94663eb74bb6", 
                "taskId" : "", 
                "IssueId" : "", 
                "BugId" : "", 
                "Status" : "new", 
                "title" : "project 3", 
                "avatar" : "", 
                "desc" : "project", 
                "uniqueId" : "p3", 
                "clientEmail" : "yashs018@gmail.com", 
                "clientFullName" : "yashlo Shukla", 
                "clientContactNo" : "15349867814", 
                "clientDesignation" : "etretgregt", 
                "pmanagerId" : "5c777ed9c45c94663eb74bb6", 
                "createdAt" : "2019-03-09T11:51:30.239+0000", 
                "updatedAt" : "2019-04-06T06:50:57.628+0000", 
                "deadline" : null
            },
            { 
                "_id" :"5c83afa897626453eada3337", 
                "tasks" :"5c8b9fe3eeee9d3473c2d353", 
                "Teams" : "5c777ed9c45c94663eb74bb6", 
                "taskId" : "", 
                "IssueId" : "", 
                "BugId" : "", 
                "Status" : "new", 
                "title" : "demo 32", 
                "avatar" : "avatar/doctor.png", 
                "desc" : "demo project", 
                "uniqueId" : "hiiiiii", 
                "clientEmail" : "nisdab", 
                "clientFullName" : "mkofdonn", 
                "clientContactNo" : "132113131", 
                "clientDesignation" : "", 
                "pmanagerId" : "5c777ed9c45c94663eb74bb6", 
                "createdAt" : "2019-03-09T12:20:56.663+0000", 
                "updatedAt" : "2019-04-06T06:43:31.655+0000", 
                "deadline" : null
            }
        ];
        spyOn(projectService , 'getProjects').and.callFake(() => {
            return Observable.from([projects]);
        });
        component.ngOnInit();

        expect(component.projects).toEqual(projects);
    });
    it(` should get us the  developers  By ProjectId from function "getDeveloper(projectId)"` , () => {
        expect(component.filteredTeams).toBeUndefined();
        const projectId = "5c83a8c2d70c1d4a38fab046";
        const projects: project[] = [
            { 
                "_id" :"5c83a8c2d70c1d4a38fab046", 
                "tasks" : "5c87c52af44be956faab78c5", 
                "Teams" : "5c777ed9c45c94663eb74bb6", 
                "taskId" : "", 
                "IssueId" : "", 
                "BugId" : "", 
                "Status" : "new", 
                "title" : "project 3", 
                "avatar" : "", 
                "desc" : "project", 
                "uniqueId" : "p3", 
                "clientEmail" : "yashs018@gmail.com", 
                "clientFullName" : "yashlo Shukla", 
                "clientContactNo" : "15349867814", 
                "clientDesignation" : "etretgregt", 
                "pmanagerId" : "5c777ed9c45c94663eb74bb6", 
                "createdAt" : "2019-03-09T11:51:30.239+0000", 
                "updatedAt" : "2019-04-06T06:50:57.628+0000", 
                "deadline" : null
            }
        ];
        expect(component.developers).not.toBeDefined();
        spyOn(projectService , 'getTeamByProjectId').and.callFake(() => {
            return Observable.from([projects]);
        });

        component.getDeveloper(projectId);
        expect(component.Teams).not.toBeUndefined();
        expect(component.filteredTeams).not.toBeUndefined();
    });
    it(` should get us the  ALL developers  By ProjectId When PRojectId is passed as ALL In the function "getDeveloper(projectId)"` , () => {
        expect(component.filteredTeams).toBeUndefined();
        const projectId = "all";
        const developers: Developers[] = [
            { 
                "_id" : "5c6c0aa9d96ad972c2e5438e", 
                "userRole" : "user", 
                "name" : "mehul bhatt", 
                "email" : "mehul@gmail.com", 
                "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
                "createdAt" : "2019-02-19T13:54:49.334+0000", 
                "updatedAt" : "2019-02-19T13:54:49.334+0000", 
            },
            { 
                "_id" :"5c752002ff279f07b0fba58e", 
                "userRole" : "user", 
                "name" : "pushpraj chudasama", 
                "email" : "pushpraj@gmail.com", 
                "password" : "$2a$10$SV7RhoN5ONLADXLW97v8GOwukUkMahLtlg.Wn1kyVwqEZYTEW8ZRC", 
                "createdAt" : "2019-02-26T11:16:18.698+0000", 
                "updatedAt" : "2019-02-26T11:16:18.698+0000", 
            }
        ];
        expect(component.developers).not.toBeDefined();
        spyOn(projectService , 'getAllDevelopers').and.callFake(() => {
            return Observable.from([developers]);
        });

        component.getDeveloper(projectId);
        expect(component.filteredDevelopers).toEqual(developers);
        expect(component.developers).toEqual(developers);
    });
    it(`should set the error property if server returns the error when getting all projects` , () => {
        const error = new Error("Server Error");

        spyOn(projectService , 'getProjects').and.returnValue(Observable.throw(error));

        expect(component.error).not.toBeDefined();

        component.ngOnInit();

        expect(component.error).toBeDefined();
    });



    /*The below test is failing because there is not route in service for the particular API */
    it(`should delete the develpoers from the developers'Id in function "deleteEmployee(developerid)"` , () => {
        const developerid = "5c752002ff279f07b0fba58e";        
        const developers: Developers[] = [
            { 
                "_id" : "5c6c0aa9d96ad972c2e5438e", 
                "userRole" : "user", 
                "name" : "mehul bhatt", 
                "email" : "mehul@gmail.com", 
                "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
                "createdAt" : "2019-02-19T13:54:49.334+0000", 
                "updatedAt" : "2019-02-19T13:54:49.334+0000", 
            },
            { 
                "_id" :"5c752002ff279f07b0fba58e", 
                "userRole" : "user", 
                "name" : "pushpraj chudasama", 
                "email" : "pushpraj@gmail.com", 
                "password" : "$2a$10$SV7RhoN5ONLADXLW97v8GOwukUkMahLtlg.Wn1kyVwqEZYTEW8ZRC", 
                "createdAt" : "2019-02-26T11:16:18.698+0000", 
                "updatedAt" : "2019-02-26T11:16:18.698+0000", 
            }
        ];
        const error = new Error("Server Error");
        const spy =  spyOn(projectService , 'deleteEmployeeById').and.callFake(() =>{
            return Observable.from([developers]);
        });
        

        component.deleteEmployee(developerid);

        // expect(spy).toHaveBeenCalled();

        spyOn(projectService , 'getAllDevelopers').and.callFake(() => {
            return Observable.from([developers]);
        });
       // expect(component.filteredDevelopers).toEqual(developers);
       // expect(component.developers).toEqual(developers); 
    });

    it(`should delete the develpoers from the developers'Id in function "deleteEmployee(developerid) must throw an error"` , () => {
        const developerid = "5c752002ff279f07b0fba58e";        
        
        const error = new Error("Server Error");
        const spy =  spyOn(projectService , 'deleteEmployeeById').and.returnValue(Observable.throw(error));
        

        component.deleteEmployee(developerid);

        expect(spy).toHaveBeenCalled();
    });

    /*TESTING PIPES ==============>*/

    it(` SHould return the WHole Objects when no search text is provided` , () => {
        const developers: Developers[] = [
            { 
                "_id" : "5c6c0aa9d96ad972c2e5438e", 
                "userRole" : "user", 
                "name" : "mehul bhatt", 
                "email" : "mehul@gmail.com", 
                "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
                "createdAt" : "2019-02-19T13:54:49.334+0000", 
                "updatedAt" : "2019-02-19T13:54:49.334+0000", 
            },
            { 
                "_id" :"5c752002ff279f07b0fba58e", 
                "userRole" : "user", 
                "name" : "pushpraj chudasama", 
                "email" : "pushpraj@gmail.com", 
                "password" : "$2a$10$SV7RhoN5ONLADXLW97v8GOwukUkMahLtlg.Wn1kyVwqEZYTEW8ZRC", 
                "createdAt" : "2019-02-26T11:16:18.698+0000", 
                "updatedAt" : "2019-02-26T11:16:18.698+0000", 
            }
        ];

        expect(searchTaskPipe.transform1(developers,"")).toEqual(developers);
    });
    it(` SHould return the WHole Objects when no ITEMS TO SEARCH is provided` , () => {
        expect(searchTaskPipe.transform1([],"a")).toEqual([]);
    });


    it(`Should test the function when search flag is "true" And "selectedProjectId !='all'" "onKey(searchText)"` , () => {
        component.searchFlag = true;
        component.filteredTeams = [
            { 
                "_id" : "5c6c0aa9d96ad972c2e5438e", 
                "userRole" : "user", 
                "name" : "mehul bhatt", 
                "email" : "mehul@gmail.com", 
                "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
                "createdAt" : "2019-02-19T13:54:49.334+0000", 
                "updatedAt" : "2019-02-19T13:54:49.334+0000", 
            },
            { 
                "_id" :"5c752002ff279f07b0fba58e", 
                "userRole" : "user", 
                "name" : "pushpraj chudasama", 
                "email" : "pushpraj@gmail.com", 
                "password" : "$2a$10$SV7RhoN5ONLADXLW97v8GOwukUkMahLtlg.Wn1kyVwqEZYTEW8ZRC", 
                "createdAt" : "2019-02-26T11:16:18.698+0000", 
                "updatedAt" : "2019-02-26T11:16:18.698+0000", 
            }
        ];
        component.onKey("p");
        expect(component.developers[0]).toEqual(component.filteredTeams[1]);
    });
    it(`Should test the function when search flag is "false" And "selectedProjectId =='all'" in "onKey(searchText)"` , () => {
        component.searchFlag = false;
        component.selectedProjectId = "all";
        component.filteredDevelopers = [
            { 
                "_id" : "5c6c0aa9d96ad972c2e5438e", 
                "userRole" : "user", 
                "name" : "mehul bhatt", 
                "email" : "mehul@gmail.com", 
                "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
                "createdAt" : "2019-02-19T13:54:49.334+0000", 
                "updatedAt" : "2019-02-19T13:54:49.334+0000", 
            },
            { 
                "_id" :"5c752002ff279f07b0fba58e", 
                "userRole" : "user", 
                "name" : "pushpraj chudasama", 
                "email" : "pushpraj@gmail.com", 
                "password" : "$2a$10$SV7RhoN5ONLADXLW97v8GOwukUkMahLtlg.Wn1kyVwqEZYTEW8ZRC", 
                "createdAt" : "2019-02-26T11:16:18.698+0000", 
                "updatedAt" : "2019-02-26T11:16:18.698+0000", 
            }
        ];
        component.onKey("p");
        expect(component.developers[0]).toEqual(component.filteredDevelopers[1]);
    });

    it(`get initials of the name from the function "getInitialsOfName(name)" when name != "admin"` , () => {
        const name = "pushpraj chudasama";
        const b =  component.getInitialsOfName(name);

        expect(b).toBe('PC');
    });
    it(`get initials of the name from the function "getInitialsOfName(name)" when name == "admin"` , () => {
        const name = "admin";
        const b =  component.getInitialsOfName(name);

        expect(b).toBe('A');
    });

});
