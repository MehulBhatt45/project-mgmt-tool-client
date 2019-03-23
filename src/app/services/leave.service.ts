import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class LeaveService {

	constructor(private http:HttpClient) { }


	addLeave(form){
		console.log("formmmmmmmmmmmmmmmmmm",form);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(config.baseApiUrl+"leave/add-leave",form);
	}


	pendingLeaves(){
		// console.log("apppppppppssssssssssss",apps);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token' : JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl+"leave/get-pendingLeave");
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



	leaveApproval(req, body){
		var body = body;
		var id = req;
		console.log("req=============",req);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'x-access-token': JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.put(config.baseApiUrl+"leave/update-status-by-id/"+id,body);
	}


approvedLeaves(){
	const httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'x-access-token': JSON.parse(localStorage.getItem('token'))
		})
	};
	return this.http.get(config.baseApiUrl+"leave/approvedLeaves");

}
rejectedLeaves(){
	const httoOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'x-access-token': JSON.parse(localStorage.getItem('token'))
		})
	};
	return this.http.get(config.baseApiUrl+"leave/rejectedLeaves");
}



	getAllDevelopers(){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'x-access-token':  JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(config.baseApiUrl+"user/get-all-developers");	
	}


}
