import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import * as _ from 'lodash';
import { config } from '../config';

@Component({
	selector: 'app-time-log',
	templateUrl: './time-log.component.html',
	styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit {
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	projects;
	projectArr = [];
	finalArr = [];
	pmanagerArr = [];
	path = config.baseMediaUrl;
	baseMediaUrl = config.baseMediaUrl;
	pro;
	projectTeam;
	tracks:any;
	projectId:any;
	project = [];


	constructor(public _projectService: ProjectService,public _alertService: AlertService) { }

	ngOnInit() {
		console.log('curruntUser===========>',this.currentUser);
		this.getAllProjects();
		this.getEmptyTracks();
	}
	getEmptyTracks(){
		console.log("user=====================>",this.currentUser.userRole);
		if(this.currentUser.userRole == "projectManager"){

			this.tracks = [
			{
				"title": "Todo",
				"id": "to do",
				"class":"primary",
				"tasks": [

				]
			},
			{
				"title": "In Progress",
				"id": "in progress",
				"class":"info",
				"tasks": [

				]
			},
			{
				"title": "Testing",
				"id": "testing",
				"class":"warning",
				"tasks": [

				]
			},
			{
				"title": "Done",
				"id": "complete",
				"class":"success",
				"tasks": [

				]
			}
			];
			console.log("tracks====-=-_+_++",this.tracks);
			console.log("tracks response_+()()()",this.tracks.tasks);
		}
		else{
			this.tracks = [
			{
				"title": "Todo",
				"id": "to do",
				"class":"primary",
				"tasks": [

				]
			},
			{
				"title": "In Progress",
				"id": "in progress",
				"class":"info",
				"tasks": [

				]
			},
			{
				"title": "Testing",
				"id": "testing",
				"class":"warning",
				"tasks": [

				]
			}
			];

		}
	}

	getAllProjects(){
		this._projectService.getProjects().subscribe(res=>{
			console.log("all projects =====>" , res);
			var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
			console.log("current user ====>" , userId);
			// this.pro = res.userId;
			// console.log("project detail===>>>>",this.pro);
			this.projects = res;
			console.log(this.projects);
			// console.log(this.projects[0].pmanagerId._id);
			// if (projects[0].) {
				
				// }
				// console.log("team===>",this.projects[0].Teams);
				_.forEach(this.projects , (task)=>{
					_.forEach(task.pmanagerId , (project)=>{
						if(project._id == userId){

							this.projectArr.push(task);
						}
					})
				})
				for(var i=0;i<this.projectArr.length;i++){
					this.finalArr.push(this.projectArr[i]);
					console.log("response======>",this.finalArr);
					
				}	
			},err=>{	
				this._alertService.error(err);
				console.log(err);
			})
	}

	getTeamByProjectId(data){
		console.log('projectdata===========>',data);
		console.log('projectdata===========>',data._id);
		this.projectId = data._id;
		console.log('projectId==========>',this.projectId);
		this._projectService.getTeamByProjectId(data._id).subscribe((res:any)=>{
			// res.Teams.push(this.pro.pmanagerId); 
			console.log("response of team============>"  ,res.Teams);
			this.projectTeam = res.Teams;
			this.projectTeam.sort(function(a, b){
				if (a.name && b.name) {
					var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
					if (nameA < nameB) //sort string ascending
						return -1 
					if (nameA > nameB)
						return 1
					return 0 //default return value (no sorting)
					// this.projectTeam.push
					console.log("sort============>"  ,this.projectTeam);
				}
			})
		},(err:any)=>{
			console.log("err of team============>"  ,err);
		});
	}

	getTaskOfDeveloper(data){
		console.log('task Data=============>',data);
		this._projectService.getTaskById(this.projectId).subscribe((res:any)=>{
			console.log("id{}{}{}===",this.projectId);
			console.log("all response()()() ======>",res);
			this.getEmptyTracks();
			this.project = res;
			console.log("()()()() ======>",this.project);
			console.log("PROJECT=================>", this.project);
			_.forEach(this.project , (task)=>{
				// console.log("task ======>()" , task);
				_.forEach(this.tracks , (track)=>{
					// console.log("track ======>()" , track);
					if(this.currentUser.userRole!='projectManager' && this.currentUser.userRole!='admin'){
						if(task.status == track.id && task.assignTo && task.assignTo._id == this.currentUser._id){
							console.log("sorttask==()()()",task);
							track.tasks.push(task);
						}
					}else{
						if(task.status == track.id){
							track.tasks.push(task);
						}
					}
				})
			})


		})




	}
}
