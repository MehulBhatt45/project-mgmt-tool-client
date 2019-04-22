import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
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
	path = config.baseMediaUrl;
	baseMediaUrl = config.baseMediaUrl;
	projectTeam;
	tracks:any;
	projectId:any;
	project = [];
	tasks = [];
	displayTable:boolean = false;
	


	constructor(public _projectService: ProjectService,public _alertService: AlertService,
		private route: ActivatedRoute) { 
		this.route.params.subscribe(param=>{
			this.projectId = param.id;	
			this.getTeamByProjectId(this.projectId)		
		});
	}

	ngOnInit() {
		console.log('curruntUser===========>',this.currentUser);
		// this.getAllProjects();
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

	

	getTeamByProjectId(id){

		console.log('projectdata===========>',id);
		// console.log('projectdata===========>',data._id);
		// this.projectId = data._id;
		console.log('projectId==========>',this.projectId);
		this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
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
	console.log('task Data=============>',data._id);
	if(data !='all'){
		this.tasks =[];
		console.log('this.tasks=========>',this.tasks);
		this.displayTable = true;
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
					// if(this.currentUser.userRole ='projectManager' && this.currentUser.userRole!='admin'){
						if(task.status == track.id && task.assignTo && task.assignTo._id == data){
							console.log("sorttask==()()()",task);
							this.tasks.push(task);
						}

					})
			})
			
		})
	}

}
	getHHMMTime(difference){
		difference = difference.split("T");
		difference = difference[1];
		difference = difference.split(".");
		difference = difference[0];
		difference = difference.split(":");
		var diff1 = difference[0];
		var diff2 = difference[1];
		
		 difference = diff1 +":"+diff2;
		return difference;

	}
}
