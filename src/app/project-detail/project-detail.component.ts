import { Component, OnInit, HostListener } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {SearchTaskPipe} from '../search-task.pipe';
declare var $ : any;
import * as _ from 'lodash';



@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
	tracks:any;
	modalTitle;
	public model = {
		editorData: 'Enter comments here'
	};
	task;
	project;
	comment;
	projectId;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	editTaskForm;
	developers;
	loader : boolean = false;
	currentDate = new Date();
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	constructor(public _projectService: ProjectService, private route: ActivatedRoute,
		public _alertService: AlertService, public searchTextFilter: SearchTaskPipe) {
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getEmptyTracks();
			this.getProject(this.projectId);
		});
		this.createEditTaskForm();

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
			status : new FormControl({value: '', disabled: true}, Validators.required)
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
			console.log("Developers",this.developers);
		},err=>{
			console.log("Couldn't get all developers ",err);
			this._alertService.error(err);
		})
	}

	getProject(id){
		this.loader = true;
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				console.log("projects ==>" ,res);
				this.getEmptyTracks()
				this.project = res;
				console.log("project ====>",this.project);
				_.forEach([...this.project.taskId, ...this.project.IssueId, ...this.project.BugId], (content)=>{
					_.forEach(this.tracks, (track)=>{
						if(content.status == track.id){
							track.tasks.push(content);
						}
					})
				})
				// _.forEach(this.tracks,function(track){
					// 	var tasks = _.orderBy(
					// 		track.tasks, ['createdAt'],['asc'])  
					// 	{propertyName:"age", order:"asc"});
					// 	console.log("desending======>", tasks);
					// this.tracks[0].tasks.reverse();
					// this.tracks[1].tasks.reverse();

					// })
					// console.log("desarr====>",this.tasks);
					// this.descendingITB();
					// this.ascendingITB();


					this.loader = false;
				},err=>{
					console.log(err);
					this.loader = false;
				})
		},1000);
	}
	/*getProject(id){
		this._projectService.getProjectByIdAndUserId(id).subscribe((res:any)=>{
			console.log("res of project ===>" , res)
		})
	}*/
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
			subUrl = _.includes(data.uniqueId, 'TSK')?"task/complete/":'' || _.includes(data.uniqueId, 'BUG')?"bug/complete/":'' || _.includes(data.uniqueId, 'ISSUE')?"issue/complete/":'';
			console.log(subUrl);
			data.status = newStatus;
			this._projectService.completeItem(data, subUrl).subscribe((res:any)=>{
				console.log(res);
				// this.getProject(res.projectId);
			},err=>{
				console.log(err);
			})
		}else{
			data.status = newStatus;
			console.log("UniqueId", data.uniqueId);
			var subUrl; 
			subUrl = _.includes(data.uniqueId, 'TSK')?"task/update-status/":'' || _.includes(data.uniqueId, 'BUG')?"bug/update-status/":'' || _.includes(data.uniqueId, 'ISSUE')?"issue/update-status/":'';
			console.log(subUrl);
			this._projectService.updateStatus(data, subUrl).subscribe((res:any)=>{
				console.log(res);
				// this.getProject(res.projectId);
			},err=>{
				console.log(err);
			})
		}
	}
	sortTasksByCreatedAt(type){
		console.log("Sorting tasks by = ",type)
		
		// Loop through all 4 tracks
		_.forEach(this.tracks,function(track){
			console.log("Sorting track = ",track.title);
			// var task = _.orderBy(track.tasks, ['createdAt'],[type]);
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
			// if(){
				// 	a.priority = "high";
				// 	b.priority = "low";
				// 	return a;
				// }
				return a.priority - b.priority;
				// var x = a[this.priority]; var y = b[this.priority];
				// return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				// return new data.tracks.tasks[a.priority]- new data.tracks.tasks[b.priority];
			}
			// function getPriority(){

				// }
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

			// getColorCodeOfPriority(priority) {
			// 	for (var i = 0; i < this.allPriorityList.length; i++) {
			// 		if (this.allPriorityList[i].value == priority) {
			// 			return this.allPriorityList[i].colorCode;
			// 		}
			// 	}

			// }

			openModel(task){

				console.log(task);
				this.task = task;
				$('#fullHeightModalRight').modal('show');
			}

			updateTask(task){
				if(!task.assingTo)
					task['assignTo'] = this.editTaskForm.value.assignTo;
				console.log(task);
				var subUrl; 
				subUrl = _.includes(task.uniqueId, 'TSK')?"task/update/":'' || _.includes(task.uniqueId, 'BUG')?"bug/update/":'' || _.includes(task.uniqueId, 'ISSUE')?"issue/update/":'';
				console.log("updatedtask===========>",subUrl);
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
				$('#input_starttime').pickatime({});
				$('#editModel').modal('show');
			}

			addItem(option){
				this.loader=true;
				setTimeout(()=>{
					this.task = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' };
					this.modalTitle = 'Add '+option;
					$('.datepicker').pickadate();
					$('#input_starttime').pickatime({});
					$('#editModel').modal('show');
					this.loader=false;
				},1000);
			}

			saveTheData(task){
				task['projectId']= this.projectId; 
				task['uniqueId']= _.includes(this.modalTitle, 'Task')?'TSK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
				task.startDate = $("#startDate").val();
				task.dueDate = $("#dueDate").val();
				console.log(task);
				var subUrl = _.includes(task.uniqueId, 'TSK')?"task/add-task/":'' || _.includes(task.uniqueId, 'BUG')?"bug/add-bug/":'' || _.includes(task.uniqueId, 'ISSUE')?"issue/add-issue/":'';
				console.log(subUrl);
				this._projectService.addData(task, subUrl).subscribe((res:any)=>{
					$('#editModel').modal('hide');
					this.getProject(this.projectId);
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

			sendComment(){
				console.log(this.comment);
			}


			creationDateComparator(a,b) {
				return parseInt(a.price, 10) - parseInt(b.price, 10);
			}	

			searchTask(){
				console.log("btn tapped");
			}
			onKey(event: any){
				console.log(event);
				var dataToBeFiltered = [...this.project.taskId, ...this.project.BugId, ...this.project.IssueId];
				var task = this.searchTextFilter.transform(dataToBeFiltered, event);
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
		}
