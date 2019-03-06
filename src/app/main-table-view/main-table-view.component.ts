import { Component, OnInit, HostListener } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var $ : any;
import * as _ from 'lodash';
@Component({
	selector: 'app-main-table-view',
	templateUrl: './main-table-view.component.html',
	styleUrls: ['./main-table-view.component.css']
})
export class MainTableViewComponent implements OnInit {
	checkProjectId = "null";
	checkDeveloperId = "null";
	tracks:any;
	modalTitle;
	task;
	trackChangeProjectWise;
	trackChangeDeveloperWise;
	projects;
	projectId;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	editTaskForm;
	developers;
	newTracks:any;
	loader:boolean = false;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	url;
	constructor(public _projectService: ProjectService, private route: ActivatedRoute, public _alertService: AlertService) { 
		this.route.url.subscribe(url=>{
			this.url = url[0].path;
		})
		this.getProject();
		this.createEditTaskForm();
	}
	getEmptyNewTracks(){
		this.newTracks = [
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
	}
	getEmptyTracks(){
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
	}

	createEditTaskForm(){
		this.editTaskForm = new FormGroup({
			title : new FormControl('', Validators.required),
			desc : new FormControl('', Validators.required),
			assignTo : new FormControl('', Validators.required),
			priority : new FormControl('', Validators.required),
			startDate : new FormControl('', Validators.required),
			dueDate : new FormControl('', Validators.required),
			status : new FormControl({value: '', disabled: true}, Validators.required)
		})
	}

	ngOnInit() {
		this.getAllDevelopers();
	}

	getAllDevelopers(){
		this._projectService.getAllDevelopers().subscribe(res=>{
			this.developers = res;	
			this.developers.sort(function(a, b){
				var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
				if (nameA < nameB) //sort string ascending
					return -1 
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			})
			console.log("developers list ================>" , this.developers);
		},err=>{
			this._alertService.error(err);
		})
	}

	getProject(){
		this.loader = true;
		setTimeout(()=>{
			this.getEmptyTracks();
			this._projectService.getProjects().subscribe((res:any)=>{
				console.log("working ===>" ,res);
				this.projects = res;
				if(this.currentUser.userRole!='projectManager'){
					_.forEach(this.projects, (project)=>{
						console.log(project);
						_.forEach([...project.taskId, ...project.IssueId, ...project.BugId], (content)=>{
							_.forEach(this.tracks, (track)=>{
								if(content.status == track.id && content.assignTo && content.assignTo._id == this.currentUser._id){
									track.tasks.push(content);
								}
							})
						})
					})
				}else{
					this.projects = res;
					console.log("hello");
					_.forEach(this.projects, (project)=>{
						console.log(project);
						_.forEach([...project.taskId, ...project.IssueId, ...project.BugId], (content)=>{
							_.forEach(this.tracks, (track)=>{
								if(content.status == track.id ){
									track.tasks.push(content);
								}
							})
						})
					})
				}
				console.log("this.tracks of get project ======>" , this.tracks);
				localStorage.setItem("trackChangeProjectWise" , JSON.stringify(false));
				this.trackChangeProjectWise = false;
				localStorage.setItem("trackChangeDeveloperWise" , JSON.stringify(false));
				this.trackChangeDeveloperWise = false;
				this.loader = false;
			},err=>{
				console.log(err);
				this.loader = false;
			})
		},1000);
	}

	get trackIds(): string[] {
		return this.tracks.map(track => track.id);
	}

	onTalkDrop(event: CdkDragDrop<any>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex);
			console.log(event.container.id, event.container.data[0]);
			this.updateStatus(event.container.id, event.container.data[0]);
		}
	}

	onTrackDrop(event: CdkDragDrop<any>) {
		// console.log(event);
		moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
	}

	updateStatus(newStatus, data){
		if(newStatus=='complete'){
			var subUrl; 
			subUrl = _.includes(data.uniqueId, 'TASK')?"task/complete/":'' || _.includes(data.uniqueId, 'BUG')?"bug/complete/":'' || _.includes(data.uniqueId, 'ISSUE')?"issue/complete/":'';
			console.log(subUrl);
			data.status = newStatus;
			this._projectService.completeItem(data, subUrl).subscribe(res=>{
				console.log(res);
			},err=>{
				console.log(err);
			})
		}else{
			data.status = newStatus;
			var subUrl; 
			subUrl = _.includes(data.uniqueId, 'TASK')?"task/update-status/":'' || _.includes(data.uniqueId, 'BUG')?"bug/update-status/":'' || _.includes(data.uniqueId, 'ISSUE')?"issue/update-status/":'';
			console.log(subUrl);
			this._projectService.updateStatus(data, subUrl).subscribe(res=>{
				console.log(res);
			},err=>{
				console.log(err);
			})
		}
	}

	getTitle(name){
		var str = name.split(' ');
		return str[0].charAt(0).toUpperCase() + str[0].slice(1) + ' ' + str[1].charAt(0).toUpperCase() + str[1].slice(1);
	}

	getInitialsOfName(name){
		var str = name.split(' ')[0][0]+name.split(' ')[1][0];
		return str.toUpperCase();
		// return name.split(' ')[0][0]+name.split(' ')[1][0];
	}

	getColorCodeOfPriority(priority) {
		for (var i = 0; i < this.allPriorityList.length; i++) {
			if (this.allPriorityList[i].value == priority) {
				return this.allPriorityList[i].colorCode;
			}
		}

	}

	openModel(task){
		console.log(task);
		this.task = task;
		$('#fullHeightModalRight').modal('show');
	}

	updateTask(task){
		console.log(task);
		var subUrl; 
		subUrl = _.includes(task.uniqueId, 'TSK')?"task/update/":'' || _.includes(task.uniqueId, 'BUG')?"bug/update/":'' || _.includes(task.uniqueId, 'ISSUE')?"issue/update/":'';
		console.log(subUrl);
		this._projectService.updateData(task, subUrl).subscribe((res:any)=>{
			$('#editModel').modal('hide');
		},err=>{
			console.log(err);
		})
	}

	editTask(task){
		this.task = task;
		this.modalTitle = 'Edit Item'
		$('.datepicker').pickadate();
		$('#editModel').modal('show');
	}

	addItem(option){
		this.loader = true;
		setTimeout(()=>{
			this.task = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' };
			this.modalTitle = 'Add '+option;
			$('.datepicker').pickadate();
			$('#editModel').modal('show');
			this.loader = false;
		},1000);
	}

	saveTheData(task){
		//console.log("task =====>" , task);
		task['projectId']= this.projectId; 
		task['uniqueId']= _.includes(this.modalTitle, 'Task')?'TSK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
		task.startDate = $("#startDate").val();
		task.dueDate = $("#dueDate").val();
		console.log(task);
		var subUrl; 
		subUrl = _.includes(task.uniqueId, 'TSK')?"task/add-task/":'' || _.includes(task.uniqueId, 'BUG')?"bug/add-bug/":'' || _.includes(task.uniqueId, 'ISSUE')?"issue/add-issue/":'';
		console.log(subUrl);
		this._projectService.addData(task, subUrl).subscribe((res:any)=>{
			$('#editModel').modal('hide');
			this.getProject();
		},err=>{
			console.log(err);
		})
	}
	filterByProjectId(projectId){
		console.log("Developer ID ====>" , projectId);
		//xconsole.log("Project ID ====>" , projectId);
		this.checkProjectId = projectId;
		console.log("this.checkProjectId ========>" , this.checkProjectId);
		if(this.checkProjectId == "null"){
			if(this.checkDeveloperId != "null"){
				console.log("************this.checkProjectId == null && this.checkDeveloperId != null ******");
				this.filterByDeveloperId(this.checkDeveloperId);
			}
			else if(this.checkProjectId == "null" && this.checkDeveloperId == "null"){
				console.log("do it later");
				this.getProject();
			}
		}else{
			if(this.checkDeveloperId != "null" && this.checkProjectId != "null"){
				this.filterByProjectIdAndDevelopmentId();
			}
			else{
				this.getEmptyNewTracks();
				_.forEach(this.tracks , (track , index1)=>{
					console.log("track ====>" , track , index1);
					_.forEach(track.tasks , (task, index2)=>{
						//console.log("task ====>" , task);
						if(task.projectId._id ==  projectId){
							console.log(" mactched");
							//console.log("index of that task =======>" , index2);
							3					//	console.log("particular track.task =======>" , track.tasks[index2] , "of index =====> " , index2);
							this.newTracks[index1].tasks.push(track.tasks[index2]);
						}
					})
				})
				console.log("***********************************************");
				console.log("This.newTracj ====>" , this.newTracks);
				localStorage.setItem("trackChangeProjectWise" , JSON.stringify(true));
				this.trackChangeProjectWise = true;
				localStorage.setItem("trackChangeDeveloperWise" , JSON.stringify(false));
				this.trackChangeDeveloperWise = false;
			}
		}
	}
	filterByDeveloperId(developerId){
		console.log("developer ID ========>" , developerId);
		this.checkDeveloperId = developerId;
		if(this.checkDeveloperId == "null"){
			if(this.checkProjectId != "null"){
				this.filterByProjectId(this.checkProjectId);
			}
			else if(this.checkDeveloperId == "null" && this.checkProjectId == "null"){
				console.log("will do it l ater");
				this.getProject();
			}
		}
		else{
			if(this.checkProjectId != "null" && this.checkDeveloperId != "null"){
				this.filterByProjectIdAndDevelopmentId();
			}
			else{
				this.getEmptyNewTracks();
				_.forEach(this.tracks , (track ,index1)=>{
					console.log("tracks of developer =========>" , track , index1);
					_.forEach( track.tasks , (task , index2)=>{
						// console.log("task ====>" , task.assignTo._id , index2 );
						if(task.assignTo && task.assignTo._id == developerId){
							console.log("mathched");
							this.newTracks[index1].tasks.push(track.tasks[index2]);
						}

					})
				})
				console.log("********************************************");
				console.log("devevloper new tracks ===========>" , this.newTracks);
				localStorage.setItem("trackChangeDeveloperWise" , JSON.stringify(true));
				this.trackChangeDeveloperWise = true;
				localStorage.setItem("trackChangeProjectWise" , JSON.stringify(false));
				this.trackChangeProjectWise = false;
			}
		}
	}
	filterByProjectIdAndDevelopmentId(){
		console.log("hey you are on right track");
		this.getEmptyNewTracks();
		_.forEach(this.tracks , (track , index1)=>{
			console.log("filterByProjectIdAndDevelopmentId ===> track ===>" , track , index1);
			_.forEach(track.tasks , (task , index2)=>{
				console.log("task ===>" , task , index2);
				if(task.assignTo && task.assignTo._id == this.checkDeveloperId &&  task.projectId._id == this.checkProjectId){
					console.log("matched");
					this.newTracks[index1].tasks.push(track.tasks[index2]);
				}
			})
		})
	}

}
