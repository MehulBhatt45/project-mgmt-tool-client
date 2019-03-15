/*this componant is created for all team member of project*/

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import {SearchTaskPipe} from '../search-task.pipe';
import {config} from '../config';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as _ from 'lodash';

@Component({
	selector: 'app-all-developer',
	templateUrl: './all-developer.component.html',
	styleUrls: ['./all-developer.component.css']
})
export class AllDeveloperComponent implements OnInit {
	developers;
	userId;
	path = config.baseMediaUrl;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	Teams;
	projectId;
	loader:boolean = false;
	pro;
	searchText;

	constructor(private route: ActivatedRoute,
		private router: Router, public _projectService: ProjectService,
		public _alertService: AlertService, private _loginService: LoginService, public searchTextFilter: SearchTaskPipe) { }

	ngOnInit() {
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getProject(this.projectId);
		});
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getProjectManager(this.projectId);
		});

	}



	getProject(id){
		this.loader = true;
		console.log("project id======>",this.projectId);
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				this.pro = res;
				console.log("project detail===>>>>",this.pro);
				this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
					//this.projectTeam = res.team;

					// res.Teams.push(this.pro.pmanagerId); 
					console.log("response of team============>"  ,res.Teams);
					this.Teams = res.Teams;
					this.Teams.sort(function(a, b){
						var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
						if (nameA < nameB) //sort string ascending
							return -1 
						if (nameA > nameB)
							return 1
						return 0 //default return value (no sorting)
						this.projectTeam.push
						console.log("response of team============>"  ,this.projectTeam);
					})


				},(err:any)=>{
					console.log("err of project============>"  ,err);
				});


				this.loader = false;
			},err=>{
				console.log(err);
				this.loader = false;
			})
		},1000);
		function custom_sort(a, b) {
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}


	}
	getProjectManager(id){
		this.loader = true;
		console.log("project id======>",this.projectId);
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				this.pro = res;
				console.log("project detaill===>>>>",this.pro);
				},err=>{
				console.log(err);
				this.loader = false;
			})
		},1000);
	}

	onKey(searchText){
		console.log("searchText",searchText);
		console.log(this.Teams);
		var dataToBeFiltered = [this.Teams];
		var team = this.searchTextFilter.transform(dataToBeFiltered, searchText);
		console.log('tasks =======>', team);
		// console.log("In Component",task);
		// this.getEmptyTracks();
		_.forEach(team, (content)=>{
			_.forEach(this.Teams, (team)=>{
				team.Teams.push(content);
			});
		});
	}

}
// getUserById(id){
	// 	this._projectService.getAllDevelopers().subscribe(res=>{
		// 		this.developers = res;
		// 		this.developers.sort(function(a, b){
			// 			var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
			// 			if (nameA < nameB) //sort string ascending
			// 				return -1 
			// 			if (nameA > nameB)
			// 				return 1
			// 			return 0 //default return value (no sorting)
			// 		})
			// 		console.log("Developers",this.developers);
			// 	},err=>{
				// 		console.log("Couldn't get all developers ",err);
				// 		this._alertService.error(err);
				// 	})
					// }


