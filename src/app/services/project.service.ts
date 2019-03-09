import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config';
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

	getProjects(){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl+"project/all", httpOptions);
	}

	getAllDevelopers(){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl+"user/get-all-developers", httpOptions);	
	}

	getProjectById(id){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("user ID ====>" , userId);
		return this.http.get(config.baseApiUrl+"project/get-project-by-id/"+id, httpOptions);
	}

	// addProject_With_image(body,files:FileList){
	// 	console.log("addproject is calling");
	// 	let formdata = new FormData();
	// 	formdata.append('title',body.title);
	// 	formdata.append('desc',body.desc);
	// 	formdata.append('avatar',body.avatar);
	// 	formdata.append('pmanagerId',body.pmanagerId);
	// 	formdata.append("clientEmail",body.clientEmail);
	// 	formdata.append("clientFullName",body.clientFullName);
	// 	formdata.append("clientContactNo",body.clientContactNo);
	// 	formdata.append("clientDesignation",body.clientDesignation);
	// 	formdata.append("uploadfile",files[0]);
	// 	console.log("body===>>>",body);


	// 	return this.http.post(config.baseApiUrl+"project/add-project/file",formdata);
	// 	// return this.http.post(config.baseApiUrl+"project/addProject",body,httpOptions);

	// }

	addProject(body){
		console.log("addproject2 is calling");
		console.log("body====>>",body);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+"project/add-project",body);
	}

	addData(data, subUrl){
		console.log(data);
		// data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+subUrl, data, httpOptions);
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
		return this.http.put(config.baseApiUrl+subUrl+data._id, data, httpOptions);
	}

	updateStatus(data){
		data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+"tasks/update-task-status-by-id", data, httpOptions);
	}

	completeItem(data){
		data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+"tasks/update-task-status-complete", data, httpOptions);
	}

	getlogs(memberId){
		console.log("memberID =========>" , memberId);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl+"user/get-logs/"+memberId , httpOptions);
	}

	getAllDevelopersByProjectManager(){
		var body = {
			"pmId" : JSON.parse(localStorage.getItem('currentUser'))._id
		}
		console.log("projectManagerId ==>" , body);
		return this.http.post(config.baseApiUrl+"user/get-all-developers-by-project-manager" , body ); 
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
		return this.http.get(config.baseApiUrl+"user/get-logs/"+developerId , httpOptions);
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
		return this.http.put(config.baseApiUrl+"project/update/"+projectId , data , httpOptions);
	}
	getProjectByIdAndUserId(id){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("user ID ====>" , userId);
		return this.http.get(config.baseApiUrl+"project/get-project-by-id-and-by-userid/"+id+"/"+userId, httpOptions);		
	}

	addNotice_without_image(data){
		console.log(data);
		return this.http.post(config.baseApiUrl+"notice/add-notice", data);
	}

	addNotice_with_image(data,file: FileList){
		let formdata = new FormData();
		formdata.append('title',data.title);
		formdata.append('desc',data.desc);
		formdata.append('published',data.published);
		formdata.append('expireon',data.expireon);
		formdata.append('images',data.images);
		
		for(var i =0; i < file.length; i++){
			formdata.append("uploadFile",file[i]);
		}


		return this.http.post(config.baseApiUrl+"notice/add-notice/file",formdata);
	}

	getNotice(){
		return this.http.get(config.baseApiUrl+"notice/allnotice");
	}
	
	deleteProjectById(data){
		var projectId = data._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.delete(config.baseApiUrl+"project/delete/"+projectId,httpOptions);
	}

	getAllTasks(){
		return this.http.get(config.baseApiUrl+"tasks/all-task");		
	}
	updateTask(task){
		console.log("task =========>",task);
		var id = task._id;
		return this.http.put(config.baseApiUrl+"tasks/update-task-by-id/"+id, task);		
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
	deleteTaskById(data){
		var taskId = data._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.delete(config.baseApiUrl+"tasks/delete-task-by-id/"+taskId,httpOptions);
	}
	uploadFilesToFolder(data, file: FileList){
		console.log(data);
		let formData = new FormData();
		formData.append("userId",data);
		formData.append("uploadFile",file[0]);
		return this.http.post(config.baseApiUrl+"project/upload-file", formData);
	}
}

