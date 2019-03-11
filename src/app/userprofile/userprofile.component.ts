import { Component, OnInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { LoginService } from '../services/login.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-userprofile',
	templateUrl: './userprofile.component.html',
	styleUrls: ['./userprofile.component.css']
})

export class UserprofileComponent implements OnInit {
	projects;
	projectArr = [];
	finalarr = [];
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	constructor(private route: ActivatedRoute,public _alertService: AlertService,
		private router: Router, public _projectService: ProjectService,) { }

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
				//console.log("tasks ===> " , task.Teams);
				_.forEach(task.Teams , (singleTask)=>{
					//console.log("Single Task ==========>" , singleTask);
					if(singleTask._id == userId){
						this.projectArr.push(task);
					}
				})

			})
			//			this.projectArr = this.projectArr[0];
			this.finalarr.push(this.projectArr[0]);

			console.log("response======>",this.finalarr);
		},err=>{
			this._alertService.error(err);
			console.log(err);
		})
	}


}


