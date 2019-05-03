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
	sprints;
	activeSprint:any;
	sprintInfo:any;
	


	constructor(public _projectService: ProjectService, private route: ActivatedRoute, private activatedRoute: ActivatedRoute) {
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
		this.getSprint(this.projectId);
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
				},(err:any)=>{
					console.log("err of team============>"  ,err);
				});
			},(err:any)=>{
				console.log("err of project============>"  ,err);
			});

			this._projectService.getTaskById(id).subscribe((res:any)=>{
				console.log("all response ======>" , res);
				this.getEmptyTracks();
				this.project = res;
				// this.project.sort(custom_sort);
				// this.project.reverse();
				console.log("PROJECT=================>", this.project);
				_.forEach(this.project , (task)=>{
					// Rconsole.log("task ======>" , task);
					_.forEach(this.tracks , (track)=>{
						// Rconsole.log("tracks==-=-=-=-",this.tracks);
						if(this.currentUser.userRole!='projectManager' && this.currentUser.userRole!='admin'){
							if(task.status == track.id && task.assignTo && task.assignTo._id == this.currentUser._id){
								track.tasks.push(task);
							}
						}else{
							if(task.status == track.id){
								track.tasks.push(task);
							}
						}
					})
				})


				var ctx = document.getElementById("myChart");
				var myChart = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: ["to do", "In Progress", "testing", "Complete"],
						datasets: [{
							label: '# of Tasks',

							data: this.getTaskCountEachTrack(this.tracks),
							backgroundColor: [
								'rgba(24, 17, 35, 0.2)',
								'rgba(57, 152, 197, 0.2)',
								'rgba(145, 185, 204, 0.2)',
								'rgba(202, 203, 204, 0.2)'

								],
								borderColor: [
								'rgba(24, 17, 35,1)',
								'rgba(57, 152, 197, 1)',
								'rgba(145, 185, 204, 1)',
								'rgba(202, 203, 204, 1)'

								],
								borderWidth: 1,
								hoverBackgroundColor: ["gray", "gray", "gray", "gray"]
						}]
					},
					options: {

						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}
				});


				var ctxL = document.getElementById("lineChart")
				var myLineChart = new Chart(ctxL, {														
					type: 'line',
					data: {
						labels: ["To Do", "In Progress", "Testing", "Complete"],
						datasets: [{
							label: "Highest Priority",
							data: this.getTaskPriority(1,this.tracks),

							borderColor: [
							'#DC143C',
							],
							borderWidth: 2
						}

						]
					},
					options: {
						responsive: true
					}
				});

				var ctxL = document.getElementById("lineChart1")
				var myLineChart = new Chart(ctxL, {
					type: 'line',
					data: {
						labels: ["To Do", "In Progress", "Testing", "Complete"],
						datasets: [{
							label: "High Priority",
							data: this.getTaskPriority(2,this.tracks),

							borderColor: [
							'#ff8100',
							],
							borderWidth: 2
						}

						]
					},
					options: {
						responsive: true
					}
				});

				var ctxP = document.getElementById("pieChart5");
				var myPieChart = new Chart(ctxP, {
					type: 'pie',
					data: {
						labels: ["To Do", "In Progress", "Testing", "Complete"],
						datasets: [{
							data: this.getTaskCountEachTrack(this.tracks),

							backgroundColor: ["#181123", "#3998c5", "#91b9cc", "#cacbcc"],
							hoverBackgroundColor: ["gray", "gray", "gray", "gray"]
						}]
					},
					options: {
						responsive: true,
						legend:{
							position:"left",


						}
					}
				});

				this.loader = false;

			},err=>{
				console.log(err);
				this.loader = false;
			});

		},1000);

	}

	getTaskCountEachTrack(tracks){

		var userId = this.userId;

		var count1 = [];
		_.forEach(tracks,(track)=>{

			count1.push(_.filter(this.project, function(o) { if (o.assignTo._id == userId && o.status == track.id) return o }).length);
		});
		console.log("count1---------==========",count1);
		return count1;


	}

	getTask(){

		var userId = this.userId;

		return _.filter(this.project,function(o) { if (o.assignTo._id == userId) return o }).length;
	}




	getTaskPriority(priority,tracks){
		var userId = this.userId;
		var count = [];
		_.forEach(tracks, track=>{
			count.push(_.filter(this.project, function(o) { if (o.priority == priority && o.status == track.id && o.assignTo._id == userId) return o }).length);
		});
		console.log("cnt=-=-===============",count);
		return count;
	}

	getSprint(projectId){
		this._projectService.getSprint(projectId).subscribe((res:any)=>{
			console.log("sprints in project detail=====>>>>",res);
			this.sprints = res;
			_.forEach(this.sprints, (sprint)=>{
				console.log(sprint._id);
				if(sprint.status == 'Active'){
					this.activeSprint = sprint;
					console.log("active sprint",this.activeSprint._id);
					this.sprintInfo = sprint;
					this.sprintInfo.startDate = moment(sprint.startDate).format('DD MMM YYYY');  
					this.sprintInfo.endDate = moment(sprint.endDate).format('DD MMM YYYY'); 
				}
			})
		},(err:any)=>{
			console.log(err);
		});
	}
}