import { Component, OnInit, HostListener } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {SearchTaskPipe} from '../search-task.pipe';
import { ChildComponent } from '../child/child.component';

declare var $ : any;
import * as _ from 'lodash';
import { CommentService } from '../services/comment.service';


@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
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
	developers: any
	loader : boolean = false;
	currentDate = new Date();
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	files:Array<File> = [];
	
	constructor(public _projectService: ProjectService, private route: ActivatedRoute,
		public _alertService: AlertService, public searchTextFilter: SearchTaskPipe,
		public _commentService: CommentService) {

		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getEmptyTracks();
			this.getEmptyComments();
			this.getProject(this.projectId);
		});
		this.createEditTaskForm();

	}

	getEmptyComments(){
		this.comments = [{
			"profilePhoto": "../assets/3.png",
			"developerName": "Komal Sakhiya",
			"comment": "this is my first comment in this task.........."
		},
		{
			"profilePhoto": "../assets/5.jpg",
			"developerName": "Mehul Bhatt",
			"comment": "this is my second comment in this task.........."
		},
		{
			"profilePhoto": "../assets/6.jpg",
			"developerName": "Foram Trada",
			"comment": "this is my third comment in this task.........."
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
	getPriorityClass(priority){
		switch (priority) {
			case "low":
			return "primary"
			break;

			case "medium":
			return "warning"
			break;

			case "high":
			return "danger"
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
			startDate : new FormControl('', Validators.required),
			dueDate : new FormControl('', Validators.required),

			status : new FormControl({value: '', disabled: true}, Validators.required),
			files: new FormControl(),

		})
	}

	ngOnInit() {
		this.getAllDevelopers();
		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		})
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
			console.log("Developers",this.developers);
		},err=>{
			console.log("Couldn't get all developers ",err);
			this._alertService.error(err);
		})

	}

	getProject(id){
		this.loader = true;
		setTimeout(()=>{
			this._projectService.getTaskById(id).subscribe((res:any)=>{
				console.log("all response ======>" , res);
				this.getEmptyTracks();
				this.project = res;
				console.log("PROJECT=================>", this.project);
				_.forEach(this.project , (task)=>{
					// console.log("task ======>" , task);
					_.forEach(this.tracks , (track)=>{
						if(this.currentUser.userRole!='projectManager'){
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
			data.status = newStatus;
			this._projectService.completeItem(data).subscribe((res:any)=>{
				console.log(res);

			},err=>{
				console.log(err);
			})
		}else{
			data.status = newStatus;
			console.log("UniqueId", data.uniqueId);
			this._projectService.updateStatus(data).subscribe((res:any)=>{
				console.log(res);
				 this.getProject(res.projectId);
			},(err:any)=>{

				console.log(err);
			})
		}
	}
	sortTasksByCreatedAt(type){
		console.log("Sorting tasks by = ",type)
		
		_.forEach(this.tracks,function(track){
			console.log("Sorting track = ",track.title);
			track.tasks.sort(custom_sort);
			if(type == 'desc'){
				track.tasks.reverse();
			}
			console.log("sorted output = ",track.tasks);
		});

		function custom_sort(a, b) {
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}
	}
	sortTasksByPriority(data){
		console.log("hdgfhd=>>>>..");
		_.forEach(this.tracks,function(track){
			console.log("Sorting track = ",track.title);
			track.tasks.sort(custom_sort1);
			console.log("sorted output = ",track.tasks);
		});

		function custom_sort1(a, b) {
			return a.priority - b.priority;
		}
	}
	getTitle(name){
		if(name){
			var str = name.split(' ');
			return str[0].charAt(0).toUpperCase() + str[0].slice(1) + ' ' + str[1].charAt(0).toUpperCase() + str[1].slice(1);
		}else{
			return '';
		}
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
		this.getAllCommentOfTask(task._id);
		$('#fullHeightModalRight').modal('show');
	}

	editTask(task){
		this.newTask = task;
		this.modalTitle = 'Edit Item';
		$('.datepicker').pickadate();
		$('#input_starttime').pickatime({});
		$('#exampleModalPreviewLabel').modal('show');
	}

	updateTask(task){
		task.assignTo = this.editTaskForm.value.assignTo;
		console.log("update =====>",task);
		this._projectService.updateTask(task).subscribe((res:any)=>{
			$('#exampleModalPreviewLabel').modal('hide');
		},err=>{
			console.log(err);
			
		})
		
	}

	getEmptyTask(){
		return { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' };
	}

	addItem(option){
		this.newTask = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' };
		this.modalTitle = 'Add '+option;
		$('.datepicker').pickadate();
		$('#input_starttime').pickatime({});
		$('#exampleModalPreviewLabel').modal('show');
	}


	saveTheData(task){
		task['projectId']= this.projectId; 
		task['type']= _.includes(this.modalTitle, 'Task')?'TASK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
		task.startDate = $("#startDate").val();
		task.dueDate = $("#dueDate").val();
		task['createdBy'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log(task);

		// subUrl = _.includes(task.uniqueId, 'TSK')?"task/add-task/":'' || _.includes(task.uniqueId, 'BUG')?"bug/add-bug/":'' || _.includes(task.uniqueId, 'ISSUE')?"issue/add-issue/":'';
		// console.log(subUrl);
		this._projectService.addTask(task).subscribe((res:any)=>{
			$('#exampleModalPreviewLabel').modal('hide');
			// this.getProject(this.projectId);
		},err=>{
			console.log(err);
		})
	}
	public Editor = DecoupledEditor;


	public onReady( editor ) {
		editor.ui.getEditableElement().parentElement.insertBefore(
			editor.ui.view.toolbar.element,
			editor.ui.getEditableElement()
			);
	}

	public onChange( { editor }: ChangeEvent ) {
		const data = editor.getData();
		this.comment = data.replace(/<\/?[^>]+(>|$)/g, "")
	}





	sendComment(taskId){
		console.log(this.comment);
		var data : any;
		if(this.files.length>0){
			data = new FormData();
			data.append("content",this.comment?this.comment:"");
			data.append("userId",this.currentUser._id);
			data.append("projectId",this.projectId);
			data.append("taskId",taskId);
			for(var i = 0; i < this.files.length; i++)
				data.append("fileUpload",this.files[i]);
		}else{
			data = {content:this.comment, userId: this.currentUser._id, taskId: taskId};
		}
		console.log(data);
		this._commentService.addComment(data).subscribe(res=>{
			console.log(res);
			this.comment = "";
			this.model.editorData = 'Enter comments here';
		},err=>{
			console.error(err);
		})
	}
	searchTask(){
		console.log("btn tapped");
	}
	// onKey(event: any){
	// 	console.log(event);
	// 	var dataToBeFiltered = [...this.project.taskId, ...this.project.BugId, ...this.project.IssueId];
	// 	var task = this.searchTextFilter.transform(dataToBeFiltered, event);
	// 	console.log("In Component",task);
	// 	this.getEmptyTracks();
	// 	_.forEach(task, (content)=>{
	// 		_.forEach(this.tracks, (track)=>{
	// 			if(content.status == track.id){
	// 				track.tasks.push(content);
	// 			}
	// 		})
	// 	})
	// }
	onKey(searchText,$event){
		console.log(event, this.project);
		var dataToBeFiltered = [this.project];
		var task = this.searchTextFilter.transform(dataToBeFiltered, searchText);
		console.log("In Component",task);
		this.getEmptyTracks();
		_.forEach(task, (content)=>{
			_.forEach(this.tracks, (track)=>{
				if(content.status == track.id){
					track.tasks.push(content);
				}
			})
		})
	}

	getAllProjects(){
		this._projectService.getProjects().subscribe(res=>{
			this.projects = res;
		},err=>{
			this._alertService.error(err);
			console.log(err);
		})
	}

	getAllCommentOfTask(taskId){
		this._commentService.getAllComments(taskId).subscribe(res=>{
			this.comments = res;
		}, err=>{
			console.error(err);
		})
	}

	onSelectFile(event){
			this.files = event.target.files;
	}
}