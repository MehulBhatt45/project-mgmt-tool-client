import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

declare var $ : any;
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['../project-detail/project-detail.component.css']
})
export class ChildComponent  {
  name;  
  @Input()developers;
  @Input() tracks;
  @Output() task : EventEmitter<any> = new EventEmitter();
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  // trackChangeProjectWise;
  // trackChangeDeveloperWise;
  // projects;
  // projectId;
  // developerId;
  // checkProjectId = "null";
  // checkDeveloperId = "null";

  constructor() { }

  ngOnInit(){
    console.log(this.tracks, this.developers);
  }
  // getEmptyTracks(){
  //   this.tracks = [
  //   {
  //     "title": "Todo",
  //     "id": "to do",
  //     "class":"primary",
  //     "tasks": [

  //     ]
  //   },
  //   {
  //     "title": "In Progress",
  //     "id": "in progress",
  //     "class":"info",
  //     "tasks": [

  //     ]
  //   },
  //   {
  //     "title": "Testing",
  //     "id": "testing",
  //     "class":"warning",
  //     "tasks": [

  //     ]
  //   },
  //   {
  //     "title": "Done",
  //     "id": "complete",
  //     "class":"success",
  //     "tasks": [

  //     ]
  //   }
  //   ];
  // }

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

  openModel(task){
    console.log(task);
    this.task.emit(task);
  }
  
}
