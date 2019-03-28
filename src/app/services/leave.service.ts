import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../config';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class LeaveService {

	constructor(private http:HttpClient) { }


	addLeave(form,files:any){
		console.log("fikeeeeeeeeeeeeeeesssss",files);
		console.log("formmmmmmmmmmmmmmmmmm",form);
		let formData = new FormData();
		formData.append('name',form.name);
		formData.append('email',form.email);
		formData.append('endingDate',form.endingDate);

		formData.append('leaveDuration',form.leaveDuration);

		formData.append('noOfDays',form.noOfDays);

		formData.append('reasonForLeave',form.reasonForLeave);

		formData.append('singleDate',form.singleDate);

		formData.append('startingDate',form.startingDate);

		formData.append('typeOfLeave',form.typeOfLeave);

		formData.append('attechment',files[0]);
		// const httpOptions = {
		// 	headers: new HttpHeaders({
		// 		'Content-Type': 'application/json',
		// 		'x-access-token': JSON.parse(localStorage.getItem('token'))
		// 	})
		// };
		return this.http.post(config.baseApiUrl+"leave/add-leave",formData);
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
