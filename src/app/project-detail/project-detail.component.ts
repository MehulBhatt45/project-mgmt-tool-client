import { Component, OnInit, HostListener } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
declare var $ : any;
import * as _ from 'lodash';
export interface Track {
	title: string;
	id: string;
	tasks: Task[];
}

export interface Task {
	description: string;
	projectName: string;
	label:string;
	p_alias:string;

	id: string;
}
@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
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
	task;
	project;
	projectId;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	constructor(public _projectService: ProjectService, private route: ActivatedRoute) { 
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getProject(this.projectId);
		});
	}

	ngOnInit() {
	}

	getProject(id){
		this._projectService.getProjectById(id).subscribe((res:any)=>{
			console.log(res);
			this.project = res;
			_.forEach([...this.project.taskId, ...this.project.IssueId, ...this.project.BugId], (content)=>{
				_.forEach(this.tracks, (track)=>{
					if(content.status == track.id){
						track.tasks.push(content);
					}
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

	onTalkDrop(event: CdkDragDrop<Task[]>) {
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

	onTrackDrop(event: CdkDragDrop<Track[]>) {
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
}
