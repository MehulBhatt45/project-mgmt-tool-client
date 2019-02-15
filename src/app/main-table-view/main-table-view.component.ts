import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
export interface Track {
  title: string;
  id: string;
  tasks: Task[];
}

export interface Task {
  //title: string;
  description: string;
  projectName: string;
  label:string;
  p_alias:string;

  id: string;
}
declare var $:any;
@Component({
  selector: 'app-main-table-view',
  templateUrl: './main-table-view.component.html',
  styleUrls: ['./main-table-view.component.css']
})
export class MainTableViewComponent implements OnInit {
	tracks: Track[] = [
	{
		"title": "Todo",
		"id": "todo",
		"tasks": [
		{
			"id": "first-task",
			//"title": "First Task",
			"description": "Lorem Ipsum is simply dummy text of the printing and",
			"projectName": "plan sprints",
			"label":"5",
			"p_alias":"TIS-25"
		}
		]
	},
	{
		"title": "In Progress",
		"id": "inprogress",
		"tasks": [
		{
			"id": "seconf-task",
			//"title": "Second Task",
			"description": "Lorem Ipsum is simply dummy text of the printing and",
            "projectName": "plan sprints",
            "label":"5",
            "p_alias":"TIS-25"
		},
		{
			"id": "seconf-task",
			//"title": "Second Task",
			"description": "Lorem Ipsum is simply dummy text of the printing and",
            "projectName": "plan sprints",
            "label":"5",
            "p_alias":"TIS-25"
		}
		]
	},
	{
		"title": "Testing",
		"id": "testing",
		"tasks": [
		{
			"id": "third-task",
			//"title": "Third Task",
			"description": "Lorem Ipsum is simply dummy text of the printing and",
			"projectName": "plan sprints",
			"label":"5",
			"p_alias":"TIS-25"

		}
		]
	},
	{
		"title": "Done",
		"id": "done",
		"tasks": [
		{
			"id": "fourth-task",
			//"title": "Fourth Task",
			"description": "Lorem Ipsum is simply dummy text of the printing and",
			"projectName": "plan sprints",
			"label":"5",
			"p_alias":"TIS-25"

		}
		]
	}
	];

  constructor(public router:Router) { }

  ngOnInit() {
  	$(function () {
    $('#datepicker').datepicker({ 
    	minDate: 0 ,
    	changeYear: true,
        changeMonth: true,
         dateFormat: "yy-m-dd",
      yearRange: "-100:+20",
    });
});

  }

	get trackIds(): string[] {
		return this.tracks.map(track => track.id);
	}

	onTalkDrop(event: CdkDragDrop<Task[]>) {
		// In case the destination container is different from the previous container, we
		// need to transfer the given task to the target data array. This happens if
		// a task has been dropped on a different track.
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex);
		}
	}

	onTrackDrop(event: CdkDragDrop<Track[]>) {
		moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
	}

 
}
