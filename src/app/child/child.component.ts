import { Component, OnInit, Output, Input, EventEmitter, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { config } from '../config';

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
  @Output() trackDrop : EventEmitter<any> = new EventEmitter();
  @Output() talkDrop : EventEmitter<any> = new EventEmitter();
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  taskId;
  path = config.baseMediaUrl;
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

  openModel(task){
    console.log(task);
    this.task.emit(task);
  }

  get trackIds(): string[] {
    return this.tracks.map(track => track.id);
  }

  onTrackDrop(event){
    // console.log("kai chale che", event, this.taskId);
    this.trackDrop.emit(event);
  }
  onTalkDrop(event){
    // console.log("kai chale che", event, this.taskId);
    this.talkDrop.emit(event);
  }

  ondrag(task){
    console.log(task);
  }
  
}
