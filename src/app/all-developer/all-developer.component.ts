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
declare var $ : any;

@Component({
	selector: 'app-all-developer',
	templateUrl: './all-developer.component.html',
	styleUrls: ['./all-developer.component.css']
})
export class AllDeveloperComponent implements OnInit {
	developers: any;
	userId;
	availableDevelopers = [];
	path = config.baseMediaUrl;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	Teams :any = [];
	projectId;
	loader:boolean = false;
	pro;
	dteam: any;
	searchText;
	developerId;

	constructor(private route: ActivatedRoute,
		private router: Router, public _projectService: ProjectService,
		public _alertService: AlertService, private _loginService: LoginService, public searchTextFilter: SearchTaskPipe) { }

	ngOnInit() {
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getProject(this.projectId);
		});

	}
	getProject(id){
		this.loader = true;
		console.log("project id======>",this.projectId);
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				this.pro = res;
				console.log("project detail===>>>>",this.pro);
				console.log("project detail===>>>>",this.pro.pmanagerId);
				setTimeout(()=>{
					console.log("PM rotate js-------------------------------------------------------------------")
					$('a.rotate-btn').click(function () {
						$(this).parents(".card-rotating").toggleClass('flipped');
					});
				},2000);
				this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
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
						setTimeout(()=>{
							console.log("TM rotate js-------------------------------------------------------------------")
							$('a.rotate-btn').click(function () {
								$(this).parents(".card-rotating").toggleClass('flipped');
							});
						},2000);
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

	
	deleteDeveloper(event){
		console.log(event);
		this.Teams.splice(_.findIndex(this.Teams, event), 1);
		console.log(this.Teams);
		console.log("this .. pro ================>" , this.pro);

		this.pro.Teams = this.Teams;	
		console.log("this .. pro ================>" , this.pro);
		this._projectService.updateProject(this.pro).subscribe((res:any)=>{
			console.log("res========+>" , res);
		},(err:any)=>{
			console.log("err" , err);
		});

		// var i = this.Teams.findIndex(e=> e._id == event);
		// if (i != -1) {
			// 	this.Teams.splice(i, 1);
			// }
		}
	}



