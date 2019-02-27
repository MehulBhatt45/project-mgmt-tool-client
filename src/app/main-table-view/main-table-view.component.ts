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
	tracks = [
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
	modalTitle;
	task;
	projects;
	projectId;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	editTaskForm;
	developers;
	constructor(public _projectService: ProjectService, private route: ActivatedRoute, public _alertService: AlertService) { 
		this.getProject();
		this.createEditTaskForm();
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
			console.log(this.developers);
		},err=>{
			this._alertService.error(err);
		})
	}

	getProject(){
		this._projectService.getProjects().subscribe((res:any)=>{
			console.log(res);
			this.projects = res;
			_.forEach(this.projects, (project)=>{
				console.log(project);
				_.forEach([...project.taskId, ...project.IssueId, ...project.BugId], (content)=>{
					_.forEach(this.tracks, (track)=>{
						if(content.status == track.id){
							track.tasks.push(content);
						}
					})
				})
			})
			console.log(this.tracks);
		},err=>{
			console.log(err);
		})
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
			console.log("Wait for some time");
		}else{
			data.status = newStatus;
			this._projectService.updateStatus(data).subscribe(res=>{
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
		this._projectService.updateData(task).subscribe((res:any)=>{
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
		this.task = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' };
		this.modalTitle = 'Add '+option;
		$('.datepicker').pickadate();
		$('#editModel').modal('show');
	}

	saveTheData(task){
		task['projectId']= this.projectId; 
		task['uniqueId']= _.includes(this.modalTitle, 'Task')?'TASK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
		task.startDate = $("#startDate").val();
		task.dueDate = $("#dueDate").val();
		console.log(task);
		this._projectService.addData(task).subscribe((res:any)=>{
			$('#editModel').modal('hide');
			this.getProject();
		},err=>{
			console.log(err);
		})
	}
}
