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

	addProject(body,files:FileList){
		console.log("addproject is calling");
		let formdata = new FormData();
		formdata.append('title',body.title);
		formdata.append('desc',body.description);
		formdata.append('avatar',body.avatar);
		formdata.append('pmanagerId',body.pmanagerId);
		formdata.append("uploadfile",files[0]);
		console.log("formdata===>>>",formdata);
		const httpOptions = {
			headers: new HttpHeaders({
				// 'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		console.log("body===>>>",body);
		
		return this.http.post(config.baseApiUrl+"project/add-project",formdata,httpOptions);
	}

	addProject2(body){
		console.log("addproject2 is calling");
		console.log("body====>>",body);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+"project/add-project/simple",body,httpOptions);
	}

	addData(data){
		console.log(data);
		// data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+"tasks/add-task", data, httpOptions);
	}

	updateData(data, subUrl){
		console.log(data);
		// data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+subUrl+data._id, data, httpOptions);
	}

	updateStatus(data, subUrl){
		data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+subUrl+data._id, data, httpOptions);
	}

	completeItem(data, subUrl){
		data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+subUrl+data._id, data, httpOptions);
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
}

