import { Component, OnInit, HostListener,EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
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
import Swal from 'sweetalert2';


@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

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
	project;
	comment;
	projectId;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	editTaskForm;
	developers: any;
	loader : boolean = false;
	developerId;
	currentDate = new Date();
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	pro;
	allcompleteproject;
	projectTeam;
	Teams;
	myresponse:any;
	selectedProjectId = "all";
	selectedDeveloperId = "all";
	Team;
	completedTask ;
	projectLength;
	total:any;
	round:any;
	path = config.baseMediaUrl;
	activeSprint:any;
	sprintInfo:any;
	sprints;
	newSprint = [];
	currentsprintId;
	spId;

	
	constructor(public _projectService: ProjectService, private route: ActivatedRoute) {

		

		this.route.params.subscribe(param=>{
			this.projectId = param.id;
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

	getSprint(projectId){
		this._projectService.getSprint(projectId).subscribe((res:any)=>{
			console.log("sprints in project detail=====>>>>",res);
			this.sprints = res;
			_.forEach(this.sprints, (sprint)=>{
				console.log(sprint._id);
				this.spId = sprint._id;
				if(sprint.status == 'Active'){
					this.activeSprint = sprint;
					this.sprintInfo = sprint;
					this.sprintInfo.startDate = moment(sprint.startDate).format('DD MMM YYYY');  
					this.sprintInfo.endDate = moment(sprint.endDate).format('DD MMM YYYY'); 
				}
				console.log("Active Sprint=========>>>>",this.activeSprint);
			})
			console.log("ActiveSprint startdate",this.activeSprint.endDate);
			var currendate = moment(); 
			var sprintEndDate = this.activeSprint.endDate; 
			var date3 = moment(sprintEndDate);
			var duration = date3.diff(currendate,'days');
			this.activeSprint.remainingDays = duration;
			console.log("currendate=======>>>",currendate);
			console.log("sprint end date=======>>>",sprintEndDate);
			console.log("remaining Days",duration);
		},(err:any)=>{
			console.log(err);
		});
	}

	filterTracks(sprintId){
		console.log("shds",sprintId);
		console.log("project is ====>" , this.pro);
		console.log("project team is ====>" , this.projectTeam);
		console.log("project task is ====>" , this.project);
		console.log("sprint id",this.spId);
			_.filter(this.project, function(o) { if (o._id == sprintId ) return o }).length;
		console.log(this.project);

		// _.forEach(this.project, (taskId)=>{
		// 	console.log("task id is",taskId._id);
		// })

	}

	
	getProject(id){
		this.loader = true;
		setTimeout(()=> {
			this._projectService.getProjectById(id).subscribe((res:any)=>{

				console.log("id-=-=-=-()()()",id);
				this.pro=res;
				console.log("title{}{}{}{}",this.pro);

				this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
					res.Teams.push(this.pro); 
					console.log("response of team============>"  ,res.Teams);
					this.projectTeam = res.Teams;
					console.log("projectTeam=-{}{}{}{}",this.projectTeam);
					this.projectTeam.sort(function(a, b){
						if (a.name && b.name) {
							var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
							if (nameA < nameB) 
								return -1 
							if (nameA > nameB)
								return 1
							return 0 
							this.projectTeam.push
						}

					})
				},(err:any)=>{
					console.log("err of team============>"  ,err);
				});
			},(err:any)=>{
				console.log("err of project============>"  ,err);
			});

			this._projectService.getTaskById(id).subscribe((res:any)=>{123412
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
					console.log("==================================TimeOUT===========================================");
					var completedTask=this.getCompletedTask("complete");
					console.log("completed{{}}___+++",completedTask);

					var projectLength=this.project.length;
					console.log("plength==-=-=-=",projectLength);

					var allcompleteproject = completedTask*100/projectLength;
					console.log("allcompleteproject=-=-={}{}{}",allcompleteproject);

					this.total=allcompleteproject;
					console.log("total()()++++++++++++++++",this.total);

					this.round = Math.round(this.total);
					console.log("round()()+++++++++++++++++",this.round);


					var ctx = document.getElementById("myChart");
					var myChart = new Chart(ctx, {
						type: 'bar',
						data: {
							labels: ["to do", "In Progress", "testing", "Complete"],
							datasets: [{
								label: '# of Tasks',
								// data:[7,14,43,33],
								data: [this.tracks[0].tasks.length, this.tracks[1].tasks.length, this.tracks[2].tasks.length,this.tracks[3].tasks.length],
								backgroundColor: [
								'rgba(255, 99, 132, 0.2)',
								'rgba(54, 162, 235, 0.2)',
								'rgba(255, 206, 86, 0.2)',
								'rgba(75, 192, 192, 0.2)'

								],
								borderColor: [
								'rgba(255,99,132,1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 206, 86, 1)',
								'rgba(75, 192, 192, 1)'

								],
								borderWidth: 1
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
								data: [this.tracks[0].tasks.length, this.tracks[1].tasks.length, this.tracks[2].tasks.length,this.tracks[3].tasks.length],
								
								backgroundColor: ["#ff0000", "#ff8100", "#ffee21", "#0087ff"],
								hoverBackgroundColor: ["lightgray", "lightgray", "gray", "gray"]
							}]
						},
						options: {
							responsive: true,
							legend:{
								position:"left",
								labels:{

									boxwidth:12
								}


							}
						}
					});
				},1000);
			},err=>{
				console.log(err);
				this.loader = false;
			});


},1000);
function custom_sort(a, b) {
	return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}
}

getTaskCount(userId, status){

	
	return _.filter(this.project, function(o) { if (o.assignTo._id == userId && o.status == status) return o }).length;
}

getCompletedTask(status){
	return _.filter(this.project, function(o) { if (o.status == status) return o }).length;
}


getTaskPriority(priority, tracks){
	var count = [];
	_.forEach(tracks, track=>{
		count.push(_.filter(this.project, function(o) { if (o.priority == priority && o.status == track.id ) return o }).length);
	});
	console.log(count);
	return count;
}


}