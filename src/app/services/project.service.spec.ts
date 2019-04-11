import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule  , HttpTestingController} from '@angular/common/http/testing';
import { config } from '../config';
import { HttpClientModule } from '@angular/common/http';

import { project } from './models/project.model';

import { ProjectService } from './project.service';
// import { Developers } from './models/developers.model';
import { Developers } from './models/developers.model';
fdescribe('ProjectService', () => {

	let projectService: ProjectService;
	let httpMock: HttpTestingController;	
	let user: any;
	beforeEach(() => TestBed.configureTestingModule({
		providers: [ProjectService],
		imports: [
		HttpClientModule,		
		HttpClientTestingModule,
		]
	}));

	beforeEach(() => {
		projectService = TestBed.get(ProjectService);
		httpMock = TestBed.get(HttpTestingController);
		localStorage.setItem('currentUser' , '{"userRole":"projectManager","projects":[],"tasks":["5c8902cb07efea54bbd55bc2","5c8903f007efea54bbd55bc3","5c8baa7d7f8c1d3a46d8cb52","5c8baacf2e73613ea207c6dc","5c8bab6d34a5283ef2f1247b","5c8bad90c55b2d4112139f89","5c90dd9c6ad5e96ca7952aeb","5c90dd9c6ad5e96ca7952aeb"],"_id":"5c777ed9c45c94663eb74bb6","name":"Tirthraj Barot","email":"tirthrajbarot2394@gmail.com","password":"$2a$10$cn8G8ON11qGjUk8Kyci7W.Avs..21rtFUNFGFDAaKhv/eW/U6hLSG","createdAt":"2019-02-28T06:25:29.835Z","updatedAt":"2019-03-20T06:37:49.737Z","__v":8,"CV":"5c777ed9c45c94663eb74bb6/Brochure_Rao Infotech.pdf","profilePhoto":"5c777ed9c45c94663eb74bb6/xYXGm.jpg","phone":"9979430007","experience":""}');
		
	});
	it('should be created', () => {
		
		expect(projectService).toBeTruthy();
	});
	it(`should retrive developers from the api via GET` , ()=>{
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
		projectService.getAllDevelopers().subscribe(Developers => {
			console.log("developes in test ===>" , Developers);
			expect(Developers.length).toBe(2);
		});
		const request = httpMock.expectOne(`${config.baseApiUrl}user/get-all-developers`);

		expect(request.request.method).toBe('GET');

		request.flush(developers);
	});

	it(`Should get all the projects from api via GET` , () => {
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
		projectService.getProjects().subscribe(projects => {
			console.log("projects in test ===>" , projects);
			expect(projects.length).toBe(2);
		});
		


		const request = httpMock.expectOne(`${config.baseApiUrl}project/all`);

		expect(request.request.method).toBe('GET');
		request.flush(projects);	
	});	
	
	it(`should give the project bY id from api via GET ` , () => {
		const dummyProjects  =
		{
			_id: "5c90d96e9e93bc65dbc84f3d",
			title:"title",
			desc:"desc",
			pmanagerId:"pmanagerId",
			tasks:"tasks",
			Teams:"Teams",
			taskId:"taskId",
			IssueId:"IssueId",
			BugId:"BugId",
			Status:"Status",
			avatar:"avatar",
			uniqueId:"uniqueId",
			createdBy:"createdBy",
			clientEmail:"clientEmail",
			clientFullName:"clientFullName",
			clientContactNo:"clientContactNo",
			clientDesignation:"clientDesignation",
		};		

		const id = "5c90d96e9e93bc65dbc84f3d";
		projectService.getProjectById(id).subscribe((projects:any) => {
			console.log("projectsBy id in test ===>" , projects);
			expect(projects._id).toContain("5c90d96e9e93bc65dbc84f3d");
		});
		console.log(`${config.baseApiUrl}project/get-project-by-id/${id}`);
		const request1 = httpMock.expectOne(`${config.baseApiUrl}project/get-project-by-id/${id}`);
		console.log("request1 ===>" , request1.request);
		expect(request1.request.method).toBe('GET');
		expect(request1.request.urlWithParams).toContain('5c90d96e9e93bc65dbc84f3d');
		request1.flush(dummyProjects);	
		httpMock.verify();
	});
	it(`should add project from api via GET ` , () => {
		projectService.addProject({titel: 'createNew' , desc: 'testing' , pmanagerId: '5c77db951c552a74e9ae9120'})
		.subscribe((response) => {
			console.log("response ===>" , response);
			expect(response).toEqual(jasmine.objectContaining({
				title: 'createNew',
				desc: 'testing',
				pmanagerId: '5c77db951c552a74e9ae9120',
				Status: 'new2'
			}));
		});
		const response = {
			title: 'createNew',
			desc: 'testing',
			pmanagerId: '5c77db951c552a74e9ae9120',
			Status: 'new2'
		};
		//console.log(`${config.baseApiUrl}project/add-project`,body);
		const request1 = httpMock.expectOne(`${config.baseApiUrl}project/add-project`);
		
		//console.log("request 1 ===>" , request1);
		expect(request1.request.method).toBe('POST');
		request1.flush(response);
		httpMock.verify();
	});

	it(`should put the correct data in update task by id from api via PUT` , ()=>{
		const data = {
			type: "type", 
			title: "title", 
			desc: "desc",
			assignTo: "assignTo", 
			projectId: "projectId",
			status: "status", 
			comment: "comment",
			priority: "priority", 
			uniqueId: "uniqueId", 
			timelog: "timelog",
			createdBy: "createdBy",
			startDate: "startDate", 
			completedAt: "completedAt", 
			dueDate: "dueDate"
		};
		
		projectService.updateStatus(data).subscribe((response:any) => {
			console.log("put method response ===>" , response);
			expect(response).toEqual(jasmine.objectContaining({
				type: "type", 
				title: "title", 
				desc: "desc",
				assignTo: "assignTo", 
				projectId: "projectId",
				status: "status", 
				comment: "comment",
				priority: "priority", 
				uniqueId: "uniqueId", 
				timelog: "timelog",
				createdBy: "createdBy",
				startDate: "startDate", 
				completedAt: "completedAt", 
				dueDate: "dueDate"		
			}));
		});

		const request = httpMock.expectOne(`${config.baseApiUrl}tasks/update-task-status-by-id`);

		expect(request.request.method).toBe('PUT');

		request.flush(data);

		httpMock.verify();
	});
	it(`should put the Complete status in complelte task by id from api via PUT` , ()=>{
		const data = {
			type: "type", 
			title: "title", 
			desc: "desc",
			assignTo: "assignTo", 
			projectId: "projectId",
			status: "status", 
			comment: "comment",
			priority: "priority", 
			uniqueId: "uniqueId", 
			timelog: "timelog",
			createdBy: "createdBy",
			startDate: "startDate", 
			completedAt: "completedAt", 
			dueDate: "dueDate"
		};
		
		projectService.completeItem(data).subscribe((response:any) => {
			console.log("put method response ===>" , response);
			expect(response).toEqual(jasmine.objectContaining({
				type: "type", 
				title: "title", 
				desc: "desc",
				assignTo: "assignTo", 
				projectId: "projectId",
				status: "status", 
				comment: "comment",
				priority: "priority", 
				uniqueId: "uniqueId", 
				timelog: "timelog",
				createdBy: "createdBy",
				startDate: "startDate", 
				completedAt: "completedAt", 
				dueDate: "dueDate"		
			}));
		});

		const request = httpMock.expectOne(`${config.baseApiUrl}tasks/update-task-status-complete`);

		expect(request.request.method).toBe('PUT');

		request.flush(data);

		httpMock.verify();
	});

	it(`should getAllDevelopersByProjectManager ` , ()=>{
		const ExpectedResponse = {
			createdAt: "2019-03-25T09:38:07.900Z",
			email: "pushpraj4132@gmail.com",
			name: "pushpraj chudasama",
			password: "$2a$10$PksIvnlWmz9w3gAJF10m3.Cw6zaePUNEGSC35j2jLKAQ4S3D6h0F6",
			tasks: [],
			updatedAt: "2019-03-25T09:38:07.900Z",
			userRole: "user",
			_id: "5c98a17f0ca6684d78077cef",
		};

		projectService.getAllDevelopersByProjectManager().subscribe((response:any) => {
			console.log("getAllDevelopersByProjectManager =====>" , response);
			expect(response).toBe(ExpectedResponse);
		});

		const request = httpMock.expectOne(`${config.baseApiUrl}user/get-all-developers-by-project-manager`);

		expect(request.request.method).toBe('POST');

		request.flush(ExpectedResponse);
		httpMock.verify();
	});
	it(`should delete project  from api via POST ` , () => {
		const dummyProjects  = {
			_id: "5c90d96e9e93bc65dbc84f3d",
			title:"title",
			desc:"desc",
			pmanagerId:"pmanagerId",
			tasks:"tasks",
			Teams:"Teams",
			taskId:"taskId",
			IssueId:"IssueId",
			BugId:"BugId",
			Status:"Status",
			avatar:"avatar",
			uniqueId:"uniqueId",
			createdBy:"createdBy",
			clientEmail:"clientEmail",
			clientFullName:"clientFullName",
			clientContactNo:"clientContactNo",
			clientDesignation:"clientDesignation",
		};
		projectService.deleteProjectById(dummyProjects).subscribe((response:any) => {
			console.log("delete project RESPONSE =====>" , response);
			expect(response).toBe(dummyProjects);
		});
		var projectId = "5c90d96e9e93bc65dbc84f3d";
		const request = httpMock.expectOne(`${config.baseApiUrl}project/delete/${projectId}`);

		expect(request.request.method).toBe('DELETE');
		console.log("request.request.url" , request.request.params);
		expect(request.request.url).toContain('5c90d96e9e93bc65dbc84f3d');
		request.flush(dummyProjects);
		httpMock.verify();	
	});
})
