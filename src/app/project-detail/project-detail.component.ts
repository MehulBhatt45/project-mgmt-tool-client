import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
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
import * as _ from 'lodash';
import { CommentService } from '../services/comment.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
declare var $ : any;


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
		editorData: ''
	};
	url = [];
	commentUrl = [];
	searchText;
	newTask = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low', dueDate:'', estimatedTime:'', images: [] };
	task;
	tasks;
	taskId;
	projects: any;
	project;
	comment;
	projectId;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	editTaskForm;
	assignTo;
	developers: any
	loader : boolean = false;
	currentDate = new Date();
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	pro;
	asc;
	desc;
	id;
	projectTeam;
	Teams;
	files:Array<File> = [];
	path = config.baseMediaUrl;
	priority: boolean = false;
	// sorting: any;
	sorting = [];

	
	constructor(public _projectService: ProjectService, private route: ActivatedRoute,
		public _alertService: AlertService, public searchTextFilter: SearchTaskPipe,
		public _commentService: CommentService, public _change: ChangeDetectorRef) {
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
		if(this.currentUser.userRole == "projectManager" || this.currentUser.userRole == "admin"){

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
			console.log("tracks====-=-_+_++",this.tracks);
			
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
			status : new FormControl({value: 'to do', disabled: true}, Validators.required),
			files : new FormControl()
		})
	}

	ngOnInit() {
		this.getProject(this.id);
		$('.datepicker').pickadate();
		// $('#estimatedTime').pickatime({});
		this.getAllDevelopers();
		$(function () {
			$('[data-toggle="tooltip"]').tooltip()
		});
		$('#save_changes').on('click', function(){
			$('#save_changes').attr("disabled", true);
			$('#refresh_icon').css('display','block');
		});
	}
	getAllDevelopers(){
		this._projectService.getAllDevelopers().subscribe(res=>{
			this.developers = res;
			this.developers.sort(function(a, b){
				if (name) {
					
				var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
				if (nameA < nameB) //sort string ascending
					return -1 
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			}
			})
			console.log("Developers",this.developers);
		},err=>{
			console.log("Couldn't get all developers ",err);
			this._alertService.error(err);
		})

	}

	getProject(id){
		console.log("projectId=====>",this.projectId);
		this.loader = true;
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				console.log("title=={}{}{}{}{}",res);
				this.pro = res;
				console.log("project detail===>>>>",this.pro);
				this.projectId=this.pro._id;
				console.log("iddddd====>",this.projectId);
				this._projectService.getTeamByProjectId(id).subscribe((res:any)=>{
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
						console.log("sort============>"  ,this.projectTeam);
					})


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
		// function custom_sort(a, b) {
		// 	return new Date(new Date(a.createdAt)).getTime() - new Date(new Date(b.createdAt)).getTime();
		// }
		

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
				// this.getProject(res.projectId);
			},(err:any)=>{

				console.log(err);
			})

		}
	}

	sortTasksByDueDate(type){
		if(this.priority == true){
			console.log("sorting Array=============>",this.sorting);
			console.log("Sorting tasks by dueDate = ",type)
			_.forEach(this.sorting,function(track){
				console.log("Sorting track = ",track.title);
				track.tasks.sort(custom_sort);
				// track.tasks.sort(custom_sort1);
				if(type == 'desc'){
					track.tasks.reverse();
				}
				console.log("sorted output======== =====> ",track.tasks);
			});
		}else{
			console.log("Sorting tasks byDueDate = ",type)

			_.forEach(this.tracks,function(track){
				console.log("Sorting track =()()() ",track.title);
				track.tasks.sort(custom_sort);
				if(type == 'desc'){
					track.tasks.reverse();
				}
				console.log("sorted output =><>?????)_)_)_ ",track.tasks);
			});
			// }
		}

		function custom_sort(a, b) {
			// var   Aarr = a.dueDate.split(" ");
			// a.dueDate = Aarr[0];
			// var   Barr = b.dueDate.split(" ");
			// b.dueDate = Barr[0];
			return new Date(new Date(a.dueDate)).getTime() - new Date(new Date(b.dueDate)).getTime();
		}
		function custom_sort1(a, b) {
			return a.priority - b.priority;
		}

		console.log("sorting======>",custom_sort);
		$(".due_date_sorting_btn i.fas").toggleClass("hide");
	}

	sortTasksByPriority(type){
		this.priority = true;
		console.log("sorting task by priority=>>>>..",type);
		_.map(this.tracks,function(track){
			console.log("Sorting track = ",track.title);
			track.tasks = track.tasks.sort(custom_sort1);
			if(type == 'desc'){
				track.tasks = track.tasks.reverse();
			}
		var sort = track.tasks;
		console.log('sorting===========>',sort);
		});
		this.sorting = this.tracks;
		console.log('jkfdhdfjkghd============================>',this.sorting);

		function custom_sort1(a, b) {
			return a.priority - b.priority;
		}
		this._change.detectChanges();
		console.log("sorted output =====> ",this.tracks);
		// console.log("nthi avtu=======>",custom_sort1);
		$(".priority_sorting_btn i.fas").toggleClass("hide");
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
		if(name){
			var str = name.split(' ')[0][0]+name.split(' ')[1][0];
			return str.toUpperCase();
			// return name.split(' ')[0][0]+name.split(' ')[1][0];
		}else{
			return '';
		}
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
		$('#estimatedTime').pickatime({});
		$('#itemManipulationModel').modal('show');
	}



	// updateTask(task){
	// 	task.assignTo = this.editTaskForm.value.assignTo;
	// 	let data = new FormData();

	// 	data.append('projectId', task.projectId);
	// 	data.append('title', task.title);
	// 	data.append('desc', task.desc);
	// 	data.append('assignTo', task.assignTo);
	// 	data.append('priority', task.priority);
	// 	data.append('dueDate', task.dueDate);
	// 	data.append('estimatedTime', task.estimatedTime);
	// 	data.append('images', task.images);
	// 	if(this.files.length>0){
	// 		for(var i=0;i<this.files.length;i++){
	// 			data.append('fileUpload', this.files[i]);	
	// 		}
	// 	}
	// 	console.log("update =====>",task);
	// 	this._projectService.updateTask(task._id, data).subscribe((res:any)=>{
	// 		Swal.fire({type: 'success',title: 'Task Updated Successfully',showConfirmButton:false,timer: 2000})
	// 		$('#save_changes').attr("disabled", false);
	// 		$('#refresh_icon').css('display','none');
	// 		$('#itemManipulationModel').modal('hide');
	// 		this.newTask = this.getEmptyTask();
	// 		this.files = this.url = [];
	// 		this.editTaskForm.reset();
	// 		this.loader = false;
	// 	},err=>{
	// 		Swal.fire('Oops...', 'Something went wrong!', 'error')
	// 		console.log(err);
	// 		this.loader = false;
	// 		//$('#alert').css('display','block');
	// 	})

	// }

	getEmptyTask(){
		return { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' , dueDate:'', estimatedTime:'', images: [] };
	}

	addItem(option){
		this.newTask = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' , dueDate:'', estimatedTime:'', images: [] };
		this.modalTitle = 'Add '+option;
		$('#itemManipulationModel').modal('show');
	}


	saveTheData(task){

		this.loader = true;

		task['projectId']= this.projectId;
		console.log("projectId=========>",this.projectId);
		task.priority = Number(task.priority); 
		task['type']= _.includes(this.modalTitle, 'Task')?'TASK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
		// task.startDate = $("#startDate").val();
		// task.estimatedTime = $("#estimatedTime").val();
		console.log("estimated time=====>",task.estimatedTime);
		task.images = $("#images").val();
		console.log("images====>",task.images);
		console.log(task.dueDate);
		task.dueDate = moment().add(task.dueDate, 'days').toString();
		task['createdBy'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log(task);
		let data = new FormData();
		_.forOwn(task, function(value, key) {
			data.append(key, value)
		});
		if(this.files.length>0){
			for(var i=0;i<this.files.length;i++){
				data.append('fileUpload', this.files[i]);	
			}
		}
		this._projectService.addTask(data).subscribe((res:any)=>{
			console.log("response task***++",res);
			Swal.fire({type: 'success',title: 'Task Added Successfully',showConfirmButton:false,timer: 2000})
			this.getProject(res.projectId);
			$('#save_changes').attr("disabled", false);
			$('#refresh_icon').css('display','none');
			$('#itemManipulationModel').modal('hide');
			this.newTask = this.getEmptyTask();
			this.editTaskForm.reset();
			this.files = this.url = [];
			// this.assignTo.reset();
			this.loader = false;
		},err=>{
			Swal.fire('Oops...', 'Something went wrong!', 'error')
			//$('#alert').css('display','block');
			console.log("error========>",err);
		});
	}


	searchTask(){
		console.log("btn tapped");
	}

	onKey(searchText){
		console.log("searchText",searchText);
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
		})
	}
	getAllCommentOfTask(taskId){
		this._commentService.getAllComments(taskId).subscribe(res=>{
			this.comments = res;
		}, err=>{
			console.error(err);
		})
	}

	onSelectFile(event, option){
		_.forEach(event.target.files, (file:any)=>{
			this.files.push(file);
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e:any) => {
				if(option == 'item')
					this.url.push(e.target.result);
				if(option == 'comment')
					this.commentUrl.push(e.target.result);
			}
		})
	}
	deleteTask(taskId){
		console.log(taskId);
		this._projectService.deleteTaskById(this.task).subscribe((res:any)=>{
			$('#exampleModalPreview').modal('hide');
			Swal.fire({type: 'success',title: 'Task Deleted Successfully',showConfirmButton:false,timer: 2000})
			console.log("Delete Task======>" , res);
			this.task = res;
		},(err:any)=>{
			Swal.fire('Oops...', 'Something went wrong!', 'error')
			console.log("error in delete Task=====>" , err);
		});
	}

	removeAvatar(file, index){
		console.log(file, index);
		this.url.splice(index, 1);
		if(this.files && this.files.length)
			this.files.splice(index,1);
		console.log(this.files);
	}
	removeCommentImage(file, index){
		console.log(file, index);
		this.commentUrl.splice(index, 1);
		if(this.files && this.files.length)
			this.files.splice(index,1);
		console.log(this.files);	
	}

	removeAlreadyUplodedFile(option){
		this.newTask.images.splice(option,1);
	}
}