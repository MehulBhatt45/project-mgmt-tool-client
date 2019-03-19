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

@Component({
	selector: 'app-user-summary',
	templateUrl: './user-summary.component.html',
	styleUrls: ['./user-summary.component.css']
})
export class UserSummaryComponent implements OnInit {
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

	constructor(public _projectService: ProjectService, private route: ActivatedRoute, private activatedRoute: ActivatedRoute) {
		
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.userId = param.id;
			this.getProject(this.projectId,this.userId);
			this.userId = param.id;
			// this.getTaskByUserId(this.projectId,this.userId)
			this.getEmptyTracks();

		});
		
		this.createEditTaskForm();	


	}

	ngOnInit() {

	}
	getEmptyTracks(){
		console.log("user=====================>",this.currentUser.userRole);
		if(this.currentUser.userRole == "user"){

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

	getProject(projectId,userId){
		this.loader = true;
		console.log("project id is ===>",projectId);
		setTimeout(()=>{
			this._projectService.getProjectById(projectId).subscribe((res:any)=>{
				console.log(" Project id is ==========>",projectId);
				this.pro=res;
				console.log(" project details ==================>",this.pro);
				
				// this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
					// 	// this.projectTeam = res.team;
					// 	res.Teams.push(this.pro); 
					// 	this.projectTeam = res.Teams;
					// 	console.log("project allTeam================>",this.projectTeam);
					// 	this.projectTeam.sort(function(a,b){
						// 		var nameA = a.name,
						// 		nameB = b.name
						// 		if (nameA < nameB)
						// 			return -1
						// 		if (nameA > nameB)
						// 			return 1
						// 		return 0 
						// 		this.projectTeam.push
						// 	})
						// },(err:any)=>{
							// 	console.log("err of team============>"  ,err);
							// });
						},(err:any)=>{
							console.log("err of project============>"  ,err);
						});
			
			
		},1000);
		function custom_sort(a, b) {
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}
	}
	getTaskByUserId(userId){
		this._projectService.getTaskById(userId).subscribe((res:any)=>{
			console.log("Project Id is =====>",userId);
			this.getEmptyTracks();
			this.project = res;
			// this.project.sort(custom_sort);
			this.project.reverse();
			_.forEach(this.project , (task)=>{

				_.forEach(this.tracks , (track)=>{

					if(this.currentUser.userRole!='projectManager' && this.currentUser.userRole!='admin'){
						if(task.status == track.id && task.assignTo && task.assignTo._id == this.currentUser._id){
							console.log("sorttask==========>",task);
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
		},err=>{
			console.log(err);
			this.loader = false;
		})

	}
	getTaskCount(userId, status){
		return _.filter(this.project, function(o) { if (o.assignTo._id == userId && o.status == status) return o }).length;
	}

	getTaskPriority(priority, status){
		var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
		// console.log(typeof priority , "user Id " , userId);
		return _.filter(this.project, function(o) {
			// console.log("oo =====>" , o);
			if (o.priority == priority && o.status == status && o.assignTo._id == userId){
				// console.log("found log =====>" , o)	
				return o 
			}
		}).length;

	}
	// 
	// getTaskPriority(priority,status){
		// 					// console.log(priority,status);
		// 					return _.filter(this.project, function(o) { if (o.priority == priority && o.status == status) return o }).length;
		// 				}

	}
