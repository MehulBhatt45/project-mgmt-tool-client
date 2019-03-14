import { Component, OnInit, HostListener } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
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
import { PushNotificationOptions, PushNotificationService } from 'ngx-push-notifications';



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
	newTask = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low',  dueDate: "" };
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
	pro;

	projectTeam;
	Teams;
	// files:FileList;

	files:Array<File> = [];

	
	constructor(private _pushNotificationService: PushNotificationService,public _projectService: ProjectService, private route: ActivatedRoute,
		public _alertService: AlertService, public searchTextFilter: SearchTaskPipe,
		public _commentService: CommentService) {
		$('.datepicker').pickadate();
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getEmptyTracks();
			this.getProject(this.projectId);
		});
		this.createEditTaskForm();

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
			estimatedTime: new FormControl('',[Validators.required]),
			status : new FormControl({value: '', disabled: true}, Validators.required)
		})
	}

	ngOnInit() {
		$('.datepicker').pickadate();
		$('#estimatedTime').pickatime({});
		this.getAllDevelopers();
		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		});
		// var refresh;
		// alert('Button clicked. Disabling...');
		$('#save_changes').on('click', function(){
			$('#save_changes').attr("disabled", true);
			$('#refresh_icon').css('display','block');

		});
		this._pushNotificationService.requestPermission();
		this.myFunction();


		
	}

	myFunction() {
		const title = 'Hello';
		const options = new PushNotificationOptions();
		options.body = 'New Task Asssign to You';

		this._pushNotificationService.create(title, options).subscribe((notif) => {
			if (notif.event.type === 'show') {
				console.log('onshow');
				setTimeout(() => {
					notif.notification.close();
				}, 25000);
			}
			if (notif.event.type === 'click') {
				console.log('click');
				notif.notification.close();
			}
			if (notif.event.type === 'close') {
				console.log('close');
			}
		},
		(err) => {
			console.log(err);
		});
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
		// this.loader = true;
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				this.pro = res;
				console.log("project detail===>>>>",this.pro);
				this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
					//this.projectTeam = res.team;

					res.Teams.push(this.pro.pmanagerId); 
					console.log("response of team============>"  ,res.Teams);
					this.projectTeam = res.Teams;
					this.projectTeam.sort(function(a, b){
						var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
						if (nameA < nameB) //sort string ascending
							return -1 
						if (nameA > nameB)
							return 1
						return 0 //default return value (no sorting)
						this.projectTeam.push
						console.log("response of team============>"  ,this.projectTeam);
					})

				},(err:any)=>{
					console.log("err of project============>"  ,err);
				});
			},(err:any)=>{
				console.log("err of project============>"  ,err);
			});

			this._projectService.getTaskById(id).subscribe((res:any)=>{
				console.log("all response ======>" , res);
				this.getEmptyTracks();
				this.project = res;
				this.project.sort(custom_sort);
				this.project.reverse();
				console.log("PROJECT=================>", this.project);
				_.forEach(this.project , (task)=>{
					_.forEach(this.tracks , (track)=>{
						if(this.currentUser.userRole!='projectManager' && this.currentUser.userRole!='admin'){
							if(task.status == track.id && task.assignTo && task.assignTo._id == this.currentUser._id){
								track.tasks.push(task);
								console.log("tracks==-=-=-=-",track);
							}
						}else{
							if(task.status == track.id){
								track.tasks.push(task);
							}
						}
					});
				});
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
	get trackIds(): string[] {
		return this.tracks.map(track => track.id);
	}

	onTalkDrop(event: CdkDragDrop<any>) {
		console.log(event.container.id, event.container.data[_.findIndex(event.container.data, { 'status': event.previousContainer.id })]);
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex);
			this.updateStatus(event.container.id, event.container.data[_.findIndex(event.container.data, { 'status': event.previousContainer.id })]);
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
			});
		}else{
			data.status = newStatus;
			console.log("UniqueId", data.uniqueId);
			this._projectService.updateStatus(data).subscribe((res:any)=>{
				console.log(res);
				this.getProject(res.projectId);
			},(err:any)=>{

				console.log(err);
			});

		}
	}
	sortTasksByCreatedAt(type){
		console.log("Sorting tasks by = ",type)

		_.forEach(this.tracks,function(track){
			console.log("Sorting track =()()() ",track.title);
			track.tasks.sort(custom_sort);
			if(type == 'desc'){
				track.tasks.reverse();
			}
			console.log("sorted output =><>?????)_)_)_ ",track.tasks);
		});

		function custom_sort(a, b) {
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}
		console.log("sorting======>",custom_sort);
	}
	sortTasksByPriority(type){

		console.log("hdgfhd=>>>>..");
		_.forEach(this.tracks,function(track){
			console.log("Sorting track = ",track.title);
			track.tasks.sort(custom_sort1);
			if(type == 'desc'){
				track.tasks.reverse();
			}
			console.log("sorted output = ",track.tasks);
		});

		function custom_sort1(a, b) {
			return a.priority - b.priority;
		}
		console.log("nthi avtu=======>",custom_sort1);
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
		});

	}

	getEmptyTask(){
		return { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low', dueDate: "" };
	}

	addItem(option){
		this.newTask = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low', dueDate: "" };
		this.modalTitle = 'Add '+option;
		$('.datepicker').pickadate();
		$('#estimatedTime').pickatime({});
		$('#exampleModalPreviewLabel').modal('show');
	}


	saveTheData(task){
		// this.loader = true;
		task['projectId']= this.projectId;
		task.priority = Number(task.priority); 
		task['type']= _.includes(this.modalTitle, 'Task')?'TASK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
		task.startDate = $("#startDate").val();
		console.log(task.dueDate);
		console.log(task.title);
		task.dueDate = moment().add({days:task.dueDate,months:0}).format('YYYY-MM-DD HH-MM-SS'); 
		task['createdBy'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log(task);
		let data = new FormData();
		_.forOwn(task, function(value, key) {
			if(key!="estimatedTime")
				data.append(key, value)
			else
				data.append(key, $('#estimatedTime').val())
		});
		if(this.files.length>0){
			for(var i=0;i<this.files.length;i++){
				data.append('fileUpload', this.files[i]);	
			}
		}
			// subUrl = _.includes(task.uniqueId, 'TSK')?"task/add-task/":'' || _.includes(task.uniqueId, 'BUG')?"bug/add-bug/":'' || _.includes(task.uniqueId, 'ISSUE')?"issue/add-issue/":'';
			// console.log(subUrl);
			this._projectService.addTask(data).subscribe((res:any)=>{
				console.log("response task***++",res);
				this.getProject(res.projectId);
				$('#exampleModalPreviewLabel').css({'visibility': 'hidden'});
				$('#save_changes').attr("disabled", false);
				$('#refresh_icon').css('display','none');
				this.newTask = this.getEmptyTask();
				this.loader = false;
			},err=>{
				$('#alert').css('display','block');
				console.log("error========>",err);
			});
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
		// this.comment = data.replace(/<\/?[^>]+(>|$)/g, "");
		this.comment = data;
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
		this._commentService.addComment(data).subscribe((res:any)=>{
			console.log(res);
			this.comment = "";
			this.model.editorData = 'Enter comments here';
			this.files = [];
			this.getAllCommentOfTask(res.taskId);
		},err=>{
			console.error(err);
		});
	}
	
	onKey(searchText){
		console.log(this.project);
		var dataToBeFiltered = [this.project];
		var task = this.searchTextFilter.transform(dataToBeFiltered, searchText);
		console.log("In Component",task);
		this.getEmptyTracks();
		_.forEach(task, (content)=>{
			_.forEach(this.tracks, (track)=>{
				if(this.currentUser.userRole!='projectManager' && this.currentUser.userRole!='admin'){
					if(content.status == track.id && content.assignTo && content.assignTo._id == this.currentUser._id){
						// if(content.status == track.id){
							track.tasks.push(content);
						}

					}
					else{
						if(content.status == track.id){
							track.tasks.push(content);
						}
					}
				});
		});
	}

	getAllProjects(){
		this._projectService.getProjects().subscribe(res=>{
			this.projects = res;
		},err=>{
			this._alertService.error(err);
			console.log(err);
		});
	}

	getAllCommentOfTask(taskId){
		this._commentService.getAllComments(taskId).subscribe(res=>{
			this.comments = res;
		}, err=>{
			console.error(err);
		});
	}


	onSelectFile(event){
		this.files = event.target.files;
	}
	deleteTask(taskId){
		console.log(taskId);
		this._projectService.deleteTaskById(this.task).subscribe((res:any)=>{
			console.log("Delete Task======>" , res);
			this.task = res;
		},(err:any)=>{
			console.log("error in delete Task=====>" , err);
		});
	}
}
