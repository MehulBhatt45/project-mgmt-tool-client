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
	totalTime:any  = 0;
	diff1;
	diff2;
	


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
					// _.forEach(this.tracks , (track)=>{
						// console.log("track ======>()" , track);
						// if(this.currentUser.userRole ='projectManager' && this.currentUser.userRole!='admin'){
							if(task.status == 'complete' && task.assignTo && task.assignTo._id == data._id){
								console.log("sorttask==()()()",task);
								this.tasks.push(task);
							}
							// })
						})
				console.log(this.tasks);
				_.forEach(this.tasks,(task)=>{
					console.log('task========================>',this.getHHMMTime(task.timelog1.difference));
					// this.totalTime = +this.totalTime + +this.getHHMMTime(task.timelog1.difference);
					this.addTimes(this.totalTime,this.getHHMMTime(task.timelog1.difference))
					// console.log(this.totalTime);	
					
				})
			})
		}

	}
	
	getHHMMTime(difference){
		// console.log("ave che kai ke nai",difference);
		if(difference != '00:00'){
			difference = difference.split("T");
			difference = difference[1];
			difference = difference.split(".");
			difference = difference[0];
			difference = difference.split(":");
			var diff1 = difference[0];
			// console.log("ahi j zero mde che",diff1);
			var diff2 = difference[1];
			difference = diff1 +":"+diff2;
			return difference;
		}
		return '00:00';
	}
	addTimes (startTime, endTime){
		console.log(startTime,endTime);
		var times = [ 0, 0 ];
		var max = times.length;
		var a = (startTime || '').split(':');
		var b = (endTime || '').split(':');
		for (var i = 0; i < max; i++) {
			a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
			b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
		}
		for (var i = 0; i < max; i++) {
			times[i] = a[i] + b[i]
		}
		var hours = times[0]
		var minutes = times[1]
		if (minutes >= 60) {
			var h = (minutes / 60) << 0
			hours += h
			minutes -= 60 * h
		}
		this.totalTime =  ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) ;
		console.log(this.totalTime);
	}

}
