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

	addProject(data){
		return this.http.post("http://132.140.160.68:4000/project/addProject",data);
	}
}
