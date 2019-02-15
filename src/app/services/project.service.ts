import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ProjectService {

	constructor(private http:HttpClient) { }

	getProject(){
		return this.http.get("https://my.api.mockaroo.com/project.json?key=63e0d770");
	}
}
