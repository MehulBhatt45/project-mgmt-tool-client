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
		return this.http.get(config.baseApiUrl+"project/get-project-by-id/"+id, httpOptions);
	}

	addProject(body,files:FileList){
		let formdata = new FormData();
		formdata.append('title',body.title);
		formdata.append('description',body.description);
		formdata.append('avatar',body.avatar);
		formdata.append('pmanagerId',body.pmanagerId);
		formdata.append("uploadfile",files[0]);
		console.log("formdata===>>>",formdata);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		console.log("body===>>>",body);
		
		return this.http.post(config.baseApiUrl+"project/addProject",formdata,httpOptions);
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
	uploadFiles(formData){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+"project/upload-file",formData);
	}

	getAllFilesInfolder(id){
		var obj = { projectId: id };
		return this.http.post(config.baseApiUrl+"project/get-all-files", obj);
	}

	deleteSelectedFile(data){
		return this.http.post(config.baseApiUrl+"project/delete-file", data);	
	}
}
