import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config';
import { Developers } from './models/developers.model';
import { project } from './models/project.model';
import { users } from './models/users.model';
import { tasks } from './models/tasks.model';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ProjectService {
	
	constructor(private http:HttpClient) { }

	getAllStatus() {
		return config.statuslist;
	}

	getAllProtity() {
		return config.priorityList;
	}

	/**/getProjects(){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get<project[]>(config.baseApiUrl+"project/all");
	}
	
	/**/getAllDevelopers(){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get<Developers[]>(config.baseApiUrl+"user/get-all-developers");	
	}

	/**/getProjectById(id){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		// var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
		var id = id;
		console.log("user ID ====>" , id);

		return this.http.get<project[]>(config.baseApiUrl+"project/get-project-by-id/"+id);
	}

	/*Left refer line-191 in its spec file*/getDeveloperOfProject(id){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		/*var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("user ID ====>" , userId);*/
		return this.http.get<users[]>(config.baseApiUrl+"project/get-developer-of-project"+id);
	}
	leavesById(email){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		// var email = JSON.parse(localStorage.getItem('currentUser')).email;
		return this.http.post(config.baseApiUrl+"leave/leavesByEmail", email);
	}

	

	/**/addProject(body){
		console.log("addproject2 is calling");
		console.log("body====>>",body);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post<project[]>(config.baseApiUrl+"project/add-project",body);
	}

	/*addData(data, subUrl){
		console.log(data);
		// data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+subUrl, data,);
	}

	updateData(data, subUrl){
		console.log("data ====>" , data);
		// data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+subUrl+data._id, data,);
	}*/

	/**/updateStatus(data){
		data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put<tasks[]>(config.baseApiUrl+"tasks/update-task-status-by-id", data);
	}

	completeItem(data){
		data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put<tasks[]>(config.baseApiUrl+"tasks/update-task-status-complete", data);
	}


	getlogs(memberId){
		console.log("memberID =========>" , memberId);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl+"user/get-logs/"+memberId);
	}

	/**/getAllDevelopersByProjectManager(){
		var body = {
			"pmId" : JSON.parse(localStorage.getItem('currentUser'))._id
		}
		console.log("projectManagerId ==>" , body);
		return this.http.post<Developers[]>(config.baseApiUrl+"user/get-all-developers-by-project-manager" , body ); 
	}
	uploadFiles(formData){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+"project/upload-file",formData);
	}
	getLogs(developerId){
		console.log("developer ID in project service ===> " , developerId);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl+"user/get-logs/"+developerId);
	}
	getAllFilesInfolder(id){
		var obj = { projectId: id };
		return this.http.post(config.baseApiUrl+"project/get-all-files", obj);
	}

	deleteSelectedFile(data){
		return this.http.post(config.baseApiUrl+"project/delete-file", data);	
	}
	updateProject(data){
		console.log("updated Data in project servie" , data);
		var projectId = data._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+"project/update/"+projectId , data);
	}
	getProjectByIdAndUserId(id){
		console.log("id is==========>",id);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("user ID ====>" , userId);
		return this.http.get(config.baseApiUrl+"project/get-project-by-id-and-by-userid/"+id+"/"+userId);		
	}

	addNotice(data){
		console.log(data);
		return this.http.post(config.baseApiUrl+"notice/add-notice", data);
	}

	getNotice(){
		return this.http.get(config.baseApiUrl+"notice/allnotice");
	}

	getNoticeById(noticeid){
		return this.http.get(config.baseApiUrl+"notice/noticebyid/"+noticeid);
	}


	/**/deleteProjectById(data){
		var projectId = data._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.delete<project[]>(config.baseApiUrl+"project/delete/"+projectId);
	}

	getAllTasks(){
		return this.http.get(config.baseApiUrl+"tasks/all-task");		
	}

	updateTask(id, task){
		console.log("task =========>",task);
		// var id = task._id;
		return this.http.put(config.baseApiUrl+"tasks/update-task-by-id/"+id, task);		
	}

	updateNotice(notice){
		console.log("notice data in service==>>",notice);
		var id = notice._id;
		return this.http.put(config.baseApiUrl+"notice/update-notice-by-id/"+id, notice);	
	}

	deleteNotice(id){
		console.log("notice data in service==>>",id);
		return this.http.delete(config.baseApiUrl+"notice/delete-notice-by-id/"+id);	
	}

	addTask(data){
		console.log(data);
		// data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+"tasks/add-task", data);
	}
	getTaskById(id){
		var id = id;
		return this.http.get(config.baseApiUrl+"tasks/get-task-by-id/"+id);		
	}

	getTeamByProjectId(id){
		var projectId = id;
		return this.http.get<Developers[]>(config.baseApiUrl+"project/get-developer-of-project/"+id);	
	}	
	addUser_with_file(body,files:any){
		console.log("fhvg=>",files);
		console.log("bodyyyyyyyyy===>",body);
		let formdata = new FormData();
		formdata.append('fname',body.fname);
		formdata.append('lname',body.lname);
		formdata.append('email',body.email);
		formdata.append('userRole',body.userRole);
		formdata.append('password',body.password);
		formdata.append('joiningDate',body.date);
		formdata.append('phone',body.mobile);
		formdata.append('experience',body.experience);
		formdata.append('profilePhoto',files[0]);
		formdata.append("profilePhoto",files[1]);
		// for(var i =0; i < files.length; i++){
			// 	formdata.append("uploadFile",files[i]);
			// }
			console.log("body===>>>",body);



			return this.http.post(config.baseApiUrl+"user/signup",formdata);

		}
		addProject_Without_file(body){
			console.log("addproject2 is calling");
			console.log("body====>>",body);
			const httpOptions = {
				headers: new HttpHeaders({
					'Content-Type':  'application/json',
					'x-access-token':  JSON.parse(localStorage.getItem('token'))
				})
			};
			return this.http.post(config.baseApiUrl+"user/signup_without_file",body);

		}
		deleteTaskById(data){
			var taskId = data._id;
			const httpOptions = {
				headers: new HttpHeaders({
					'Content-Type':  'application/json',
					'x-access-token':  JSON.parse(localStorage.getItem('token'))
				})
			};
			return this.http.delete(config.baseApiUrl+"tasks/delete-task-by-id/"+taskId);
		}
		uploadFilesToFolder(data, file: FileList){
			console.log(data);
			let formData = new FormData();
			formData.append("userId",data);
			formData.append("uploadFile",file[0]);
			return this.http.post(config.baseApiUrl+"project/upload-file", formData);
		}
		//update employee profile (allemployee.component.ts) -adminSide
		updateUserById(data){
			var id = data._id;
			const httpOptions = {
				headers: new HttpHeaders({
					'Content-Type':  'application/json',
					'x-access-token':  JSON.parse(localStorage.getItem('token'))
				})
			};
			return this.http.put(config.baseApiUrl+"user/update-details/"+id, data);
		}

		getUsersNotInProject(id){
			return this.http.get(config.baseApiUrl+"user/get-user-not-in-project-team/"+id);
		}

		deleteEmployeeById(developerid){
			console.log("devloperId{}{}{}-===",developerid);
			return this.http.delete(config.baseApiUrl+"user/deleteEmp/"+developerid);
		}


		changeNoticePicture(files: any, data){
			console.log("file is=================>",files);
			console.log("data is ============>",data);
			let formdata = new FormData();
			formdata.append("noticeid",data);
			formdata.append("profilePhoto",files[0]);
			console.log("file is===>>>",files[0]);
			return this.http.put(config.baseApiUrl+"notice/change-photo/"+data,formdata);
		}
	}



//Below Code is on pending because there is no matching route on the server side in my PC

	/*it(`should return the developer of project by id from api via GET ` , ()=>{
		var id = "5c90d96e9e93bc65dbc84f3d";
		projectService.getDeveloperOfProject({id: "5c90d96e9e93bc65dbc84f3d"}).subscribe((developers:any)=>{
			console.log("getDeveloperOfProject ===>" , developers);
			expect(developers.length).toBe(1);	
		})


		const response = {
			createdAt: "2019-03-25T09:38:07.900Z",
			email: "pushpraj4132@gmail.com",
			name: "pushpraj chudasama",
			password: "$2a$10$PksIvnlWmz9w3gAJF10m3.Cw6zaePUNEGSC35j2jLKAQ4S3D6h0F6",
			tasks: [],
			updatedAt: "2019-03-25T09:38:07.900Z",
			userRole: "user",
			_id: "5c98a17f0ca6684d78077cef",
		};

		const request = httpMock.expectOne(`${config.baseApiUrl}project/get-developer-of-project/${id}`);
		expect(request.request.method).toBe('GET');
		request.flush(response);
		httpMock.verify();
	})*/	