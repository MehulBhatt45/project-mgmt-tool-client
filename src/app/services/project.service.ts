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

	addProject(body){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+"project/addProject", body, httpOptions);
	}

	addData(data){
		console.log(data);
		var subUrl; 
		subUrl = _.includes(data.uniqueId, 'TASK')?"task/update/":'' || _.includes(data.uniqueId, 'BUG')?"bug/update/":'' || _.includes(data.uniqueId, 'ISSUE')?"issue/update/":'';
		console.log(subUrl);
		// data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+subUrl+data._id, data, httpOptions);
	}

	updateData(data){
		console.log(data);
		var subUrl; 
		subUrl = _.includes(data.uniqueId, 'TASK')?"task/update/":'' || _.includes(data.uniqueId, 'BUG')?"bug/update/":'' || _.includes(data.uniqueId, 'ISSUE')?"issue/update/":'';
		console.log(subUrl);
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
		var subUrl; 
		subUrl = _.includes(data.uniqueId, 'TASK')?"task/update/":'' || _.includes(data.uniqueId, 'BUG')?"bug/update/":'' || _.includes(data.uniqueId, 'ISSUE')?"issue/update/":'';
		console.log(subUrl);
		data['operatorId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+subUrl+data._id, data, httpOptions);
	}
}
