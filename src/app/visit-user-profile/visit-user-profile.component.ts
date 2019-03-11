import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import * as _ from 'lodash';
declare var $ : any;


@Component({
	selector: 'app-visit-user-profile',
	templateUrl: './visit-user-profile.component.html',
	styleUrls: ['./visit-user-profile.component.css']
})
export class VisitUserProfileComponent implements OnInit {
	projects;
	// developers;
	userId;
	projectArr = [];
	finalarr = [];
	
	constructor(private route: ActivatedRoute,
		private router: Router, public _projectService: ProjectService, public _alertService: AlertService, private _loginService: LoginService) { 
	}

	ngOnInit() {

		this.getAllProjects();
		
	}
	getAllProjects(){
		this._projectService.getProjects().subscribe(res=>{
			console.log("all projects =====>" , res);
			var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
			console.log("current user ====>" , userId);
			this.projects = res;
			_.forEach(this.projects , (task)=>{
				_.forEach(task.Teams , (singleTask)=>{
					if(singleTask._id == userId){
						this.projectArr.push(task);
					}
				})
			})			
			this.finalarr.push(this.projectArr[0]);
			console.log("response======>",this.finalarr);
		},err=>{
			this._alertService.error(err);
			console.log(err);
		})
	}
	

}

// this Component is created for guest-user who can visit all team members profile....
