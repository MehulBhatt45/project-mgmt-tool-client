import { Component, OnInit, HostListener,EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { AlertService } from '../services/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {SearchTaskPipe} from '../search-task.pipe';
import { ChildComponent } from '../child/child.component';
import { config } from '../config'
import {LeaveComponent} from '../leave/leave.component';
declare var $ : any;
import * as _ from 'lodash';
import { CommentService } from '../services/comment.service';
import * as moment from 'moment';
import { Chart } from 'chart.js';


@Component({
	selector: 'app-user-summary',
	templateUrl: './user-summary.component.html',
	styleUrls: ['./user-summary.component.css']
})
export class UserSummaryComponent implements OnInit {
	chart = []; 
	tracks:any;
	modalTitle;
	comments:any;

	public model = {
		editorData: 'Enter comments here'
	};
	url;
	searchText;
	newTask;
	task;
	tasks;
	projects: any;
	project = [];
	comment;
	projectId;
	currentUserId;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	editTaskForm;
	developers: any;
	loader : boolean = false;
	developerId;
	currentDate = new Date();
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	pro;
	userId;
	projectTeam;
	Teams;
	myresponse:any;
	selectedProjectId = "all";
	selectedDeveloperId = "all";
	Team;
	uid;
	pid;
	


	constructor(public _projectService: ProjectService, private route: ActivatedRoute, private activatedRoute: ActivatedRoute) {
		

		// this.activatedRoute.queryParams.subscribe(params => {
			// 	this.uid = params['key1'];
			// 	console.log("uid============>",this.uid);
			// 	this.pid = params['key2'];
			// 	console.log("pid============>",this.pid);
			// });
			this.route.params.subscribe(param=>{
				console.log("params=======-=-=-=-=-",param);
				this.projectId = param.projectId;
				console.log("projectid--=-=-=+++",this.projectId);
				this.userId = param.userId;
				console.log("currentUserId--=-=-=+++",this.userId);	

				this.getEmptyTracks();
				this.getProject(this.projectId);
			});
			this.createEditTaskForm();	


		}

		ngOnInit() {

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
				this.myresponse=this.tracks.tasks;
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
		getPriorityClass(priority){
			switch (Number(priority)) {
				case 4:
				return {class:"primary", title:"Low"}
				break;

				case 3:
				return {class:"warning", title:"Medium"}
				break;

				case 2:
				return {class:"success", title:"High"}
				break;


				case 1:
				return {class:"danger", title:"Highest"}
				break;

				default:
				return ""
				break;
			}
		}

		createEditTaskForm(){
			this.editTaskForm = new FormGroup({
				title : new FormControl('', Validators.required),
				desc : new FormControl('', Validators.required),
				assignTo : new FormControl('', Validators.required),
				priority : new FormControl('', Validators.required),
				dueDate : new FormControl('',Validators.required),
				status : new FormControl({value: '', disabled: true}, Validators.required)
			})
		}

		getProject(id){
			console.log("id{}{}---",id);
			this.loader = true;

			setTimeout(()=>{
				this._projectService.getProjectById(id).subscribe((res:any)=>{

					console.log("id-=-=-=-()()()",id);
					this.pro=res;
					console.log("title{}{}{}{}",this.pro);
					// this.pro = res.pmanagerId;
					// console.log("project detail===>>>>",this.pro);
					this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
						this.projectTeam = res.team;
						res.Teams.push(this.pro); 
						console.log("response of team============>"  ,res.Teams);
						this.projectTeam = res.Teams;
						console.log("projectTeam=-{}{}{}{}",this.projectTeam);
						this.projectTeam.sort(function(a, b){
							var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
							if (nameA < nameB) //sort string ascending
								return -1 
							if (nameA > nameB)
								return 1
							return 0 //default return value (no sorting)
							this.projectTeam.push

						})

					},(err:any)=>{
						console.log("err of team============>"  ,err);
					});
				},(err:any)=>{
					console.log("err of project============>"  ,err);
				});

				this._projectService.getTaskById(id).subscribe((res:any)=>{
					console.log("id{}{}{}===",id);
					console.log("all response()()() ======>",res);
					this.getEmptyTracks();
					this.project = res;
					console.log("()()()() ======>",this.project);
					this.project.sort(custom_sort);
					this.project.reverse();
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

					this.loader = false;
					setTimeout(()=>{


						var ctxP = document.getElementById("pieChart1");
						var myPieChart = new Chart(ctxP, {
							type: 'pie',
							data: {
								labels: ["To Do", "In Progress", "Testing", "Complete"],
								datasets: [{
									// data:[10,20,30,40],
									data: this.getTaskPriority(1,this.tracks),
									backgroundColor: ["#ff0000", "#ff8100", "#ffee21", "#0087ff"],
									// backgroundColor: ["#77abb7", "#0075f6", "#ff9d76", "#a4f6a5"],
									hoverBackgroundColor: ["lightgray", "lightgray", "gray", "gray"]
								}]
							},
							options: {
								responsive: true,
								legend:{
									position:"bottom"
								}
							}
						});



						var ctxP = document.getElementById("pieChart2");
						var myPieChart = new Chart(ctxP, {
							type: 'pie',
							data: {
								labels: ["To Do", "In Progress", "Testing", "Complete"],
								datasets: [{
									data: this.getTaskPriority(2,this.tracks),
									// data: [this.getTaskPriority(this.project.priority,this.tracks.title)],
									backgroundColor: ["#ff0000", "#ff8100", "#ffee21", "#0087ff"],
									// backgroundColor: ["#77abb7", "#0075f6", "#ff9d76", "#a4f6a5"],
									hoverBackgroundColor: ["lightgray", "lightgray", "gray", "gray"]
								}]
							},
							options: {
								responsive: true,
								legend:{
									position:"bottom"
								}
							}
						});


						var ctxP = document.getElementById("pieChart3");
						var myPieChart = new Chart(ctxP, {
							type: 'pie',
							data: {
								labels: ["To Do", "In Progress", "Testing", "Complete"],
								datasets: [{
									data: this.getTaskPriority(3,this.tracks),
									// data: [this.getTaskPriority(this.project.priority,this.tracks.title)],
									// backgroundColor: ["#77abb7", "#0075f6", "#ff9d76", "#a4f6a5"],
									backgroundColor: ["#ff0000", "#ff8100", "#ffee21", "#0087ff"],
									hoverBackgroundColor: ["lightgray", "lightgray", "gray", "gray"]
								}]
							},
							options: {
								responsive: true,
								legend:{
									position:"bottom"
								}
							}
						});


						var ctxP = document.getElementById("pieChart4");
						var myPieChart = new Chart(ctxP, {
							type: 'pie',
							data: {
								labels: ["To Do", "In Progress", "Testing", "Complete"],
								datasets: [{
									data: this.getTaskPriority(4,this.tracks),
									// data: [this.getTaskPriority(this.project.priority,this.tracks.title)],
									// backgroundColor: ["#77abb7", "#0075f6", "#ff9d76", "#a4f6a5"],
									backgroundColor: ["#ff0000", "#ff8100", "#ffee21", "#0087ff"],
									hoverBackgroundColor: ["lightgray", "lightgray", "gray", "gray"]
								}]
							},
							options: {
								responsive: true,
								legend:{
									position:"bottom",


								}
							}
						});
					},1000);







				},err=>{
					console.log(err);
					this.loader = false;
				})

			},1000);
function custom_sort(a, b) {
	return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}
}

getTaskCountEachTrack(status){

	var userId = this.userId;
	// console.log("uid+_+_+{}{}====",userId);

	return _.filter(this.project, function(o) { if (o.assignTo._id == userId && o.status == status) return o }).length;
	// var count1 = [];
	// _.forEach(tracks,track=>{

		// 	count1.push(_.filter(this.project, function(o) { if (o.assignTo._id == userId && o.status == track.id) return o }).length);
		// });
		// console.log("count1---------==========",count1);
		// return count1;


	}
	getTaskCount(){
		// console.log("userId===-=-={}{}{}{}{}",userId);
		var userId = this.userId;
		return _.filter(this.project, function(o) { if (o.assignTo._id == userId) return o }).length;
	}

	getCompletedTask(status){
		// console.log("userId===-=-={}{}{}{}{}",userId);
		return _.filter(this.project, function(o) { if (o.status == status) return o }).length;
	}

	// getTaskPriority(priority, status){
		// 	// console.log(priority, status);
		// 	return _.filter(this.project, function(o) { if (o.priority == priority && o.status == status) return o }).length;
		// }

		getTaskPriority(priority,tracks){
			var userId = this.userId;

			// return _.filter(this.project, function(o) { if (o.priority == priority && o.status == status && o.assignTo._id == userId) return o }).length;
			// console.log("currentUserId--=-=-=+++",this.userId);	
			// console.log("userId=-==-=-{}{}{}{}{}",userId);
			var count = [];
			_.forEach(tracks, track=>{
				count.push(_.filter(this.project, function(o) { if (o.priority == priority && o.status == track.id && o.assignTo._id == userId) return o }).length);
			});
			console.log("cnt=-=-===============",count);
			return count;
		}
	}