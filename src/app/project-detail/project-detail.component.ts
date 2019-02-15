import { Component, OnInit, HostListener } from '@angular/core';
//import { DndDropEvent, DropEffect } from "ngx-drag-drop";
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
@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
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
	constructor() { 
		//this.setHorizontalLayout( this.horizontalLayoutActive );
	}

	ngOnInit() {
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

// 	draggableListLeft = [
// 	{
	// 		content: "Left",
	// 		effectAllowed: "move",
	// 		disable: false,
	// 		handle: false,
	// 	},
	// 	{
		// 		content: "Lefter",
		// 		effectAllowed: "move",
		// 		disable: false,
		// 		handle: false,
		// 	},
		// 	{
			// 		content: "Leftest",
			// 		effectAllowed: "copyMove",
			// 		disable: false,
			// 		handle: false
			// 	},
			// 	{
				// 		content: "Lefty",
				// 		effectAllowed: "move",
				// 		disable: false,
				// 		handle: true,
				// 	}
				// 	];

				// 	draggableListRight = [
				// 	{
					// 		content: "I was originally right",
					// 		effectAllowed: "move",
					// 		disable: false,
					// 		handle: false,
					// 	}
					// 	];
					// 	layout:any;
					// 	horizontalLayoutActive:boolean = false;
					// 	private currentDraggableEvent:DragEvent;
					// 	private currentDragEffectMsg:string;
					// 	private readonly verticalLayout = {
						// 		container: "row",
						// 		list: "column",
						// 		dndHorizontal: false
						// 	};
						// 	private readonly horizontalLayout = {
							// 		container: "row",
							// 		list: "row",
							// 		dndHorizontal: true
							// 	};


							// 	setHorizontalLayout( horizontalLayoutActive:boolean ) {

								// 		this.layout = (horizontalLayoutActive) ? this.horizontalLayout : this.verticalLayout;
								// 	}

								// 	onDragStart( event:DragEvent ) {

									// 		this.currentDragEffectMsg = "";
									// 		this.currentDraggableEvent = event;


									// 	}

									// 	onDragged( item:any, list:any[], effect:DropEffect ) {

										// 		this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;

										// 		if( effect === "move" ) {

											// 			const index = list.indexOf( item );
											// 			list.splice( index, 1 );
											// 		}
											// 	}

											// 	onDragEnd( event:DragEvent ) {

												// 		this.currentDraggableEvent = event;

												// 	}

												// 	onDrop( event:DndDropEvent, list?:any[] ) {

													// 		if( list
													// 			&& (event.dropEffect === "copy"
													// 				|| event.dropEffect === "move") ) {

														// 			let index = event.index;

														// 		if( typeof index === "undefined" ) {

															// 			index = list.length;
															// 		}

															// 		list.splice( index, 0, event.data );
															// 	}
															// }

// }