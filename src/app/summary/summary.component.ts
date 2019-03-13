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


@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

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

	currentDate = new Date();
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	pro;

	projectTeam;
	Teams;
	myresponse:any;
	// myproject=this.project[0];
	
	constructor(public _projectService: ProjectService, private route: ActivatedRoute) {

		

		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getEmptyTracks();
			this.getProject(this.projectId);
		});
		this.createEditTaskForm();	
	}

	ngOnInit() {

		
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
		this.loader = true;
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				console.log("id-=-=-=-()()()",id);
				this.pro = res.pmanagerId;
				console.log("project detail===>>>>",this.pro);
				this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
					// this.projectTeam = res.team;
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
						console.log(" team============()()()",this.projectTeam);
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
					// console.log("task ======>" , task);
					_.forEach(this.tracks , (track)=>{
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


}
