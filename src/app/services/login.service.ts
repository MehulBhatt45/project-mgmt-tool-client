import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
	providedIn: 'root'
})
export class LoginService {

	constructor(public http: HttpClient) { }

	login(body){
		return this.http.get("");
	}	
}
