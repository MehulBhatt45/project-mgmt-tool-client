import { Component, OnInit, Output, Input, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { CommentService } from '../services/comment.service';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import {SearchTaskPipe} from '../search-task.pipe';
import { config } from '../config';
import * as moment from 'moment';
import * as _ from 'lodash';
import Swal from 'sweetalert2';


declare var $ : any;

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['../project-detail/project-detail.component.css'],
  // host: {'window:beforeunload':'doSomething'}
})
export class ChildComponent  implements OnInit{

  name;  
  @Input() projectId;
  @Input() developers;
  @Input() tracks;
  @Output() task : EventEmitter<any> = new EventEmitter();
  @Output() trackDrop : EventEmitter<any> = new EventEmitter();
  @Output() talkDrop : EventEmitter<any> = new EventEmitter();
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  
  public model = {
    editorData: ''  
  };
  taskId;
  url = [];
  commentUrl = [];
  newTask = { title:'', desc:'', assignTo: '', sprint:'', status: 'to do', priority: 'low', dueDate:'', estimatedTime:'', images: [] };
  modalTitle;3
  project;
  tasks;
  comments;
  comment;
  // projectId;
  developerId;
  allStatusList = this._projectService.getAllStatus();
  allPriorityList = this._projectService.getAllProtity();
  editTaskForm: FormGroup;
  loader : boolean = false;
  currentDate = new Date();
  pro;
  id;
  files:Array<File> = [];
  path = config.baseMediaUrl;
  searchText;
  projectTeam;
  Teams;
  selectedProjectId = "all";
  selectedDeveloperId = "all";
  sprints;
  timeLog;
  logs;
  diff;
  counter: number;
  taskdata;
  startText = 'Start';
  time:any;
  assignTo;
  taskArr= [];
  running: boolean = false;
  timerRef;
  initialTime = 0;  
  trackss:any;
  currentsprintId;
  newSprint = [];

  temp;
  difference;
  

  

  constructor( private route: ActivatedRoute,public _projectService: ProjectService,
    public _commentService: CommentService, public _change: ChangeDetectorRef, public searchTextFilter: SearchTaskPipe, private router: Router) { 

    this.route.params.subscribe(param=>{
      this.projectId = param.id;
    });

    this.getProject(this.projectId);
    this.createEditTaskForm();  
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) { 
        this.func('reload');
      }
    });    
  }
  ngOnInit(){
    // this.getProject(this.projectId);
    console.log(this.tracks, this.developers);
    this.getSprint(this.projectId);
    this.getSprintWithoutComplete(this.projectId);
    
    window.addEventListener('beforeunload', function (e) {
      // Cancel the event
      if(localStorage.getItem('isTimerRunning')!="null"){
        console.log("EVENT",e);
        console.log("EVENT",localStorage.getItem('isTimerRunning'));
        console.log("EVENT",localStorage.getItem('runningStatus'));
        fromReload('reload');

        e.stopPropagation();
        // Chrome requires returnValue to be set
        e.returnValue = false;

      }
    });
    var fromReload = (option) =>{
      this.func(option);
    }
  }

  func = async (option)=>{
    // debugger;
    console.log("in func",option);
    console.log("EVENT",localStorage.getItem('isTimerRunning'));
    var taskId = localStorage.getItem('isTimerRunning');
    console.log('taskId===========>',taskId);
    await _.forEach(this.tracks,async (track)=>{
      console.log('track =================>',track);
      await _.forEach(track.tasks,(task)=>{
        if(task._id == taskId){
          console.log('taskkkkkkkkkkkkkkkk=================>',task);
          if(option=='reload')
            this.timerUpdate(task);
          else if(option=='load')
            this.startTimer(task);
        }

      })
    })
  }

  ngOnChanges() {
    this._change.detectChanges();
    console.log("ngOnChanges()  ===============================",this.tracks);
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
    console.log("this tracks in child component =====>" , this.tracks);
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
      sprint :new FormControl('',Validators.required),
      priority : new FormControl('', Validators.required),
      startDate : new FormControl('', Validators.required),
      dueDate : new FormControl('', Validators.required),
      status : new FormControl({value: '', disabled: true}, Validators.required),
      files : new FormControl(),
      estimatedTime : new FormControl()
    })
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
    }else{
      return '';
    }
  }

  get trackIds(): string[] {
    return this.tracks.map(track => track.id);
  }

  onTrackDrop(event){
    this.trackDrop.emit(event);
  }
  onTalkDrop(event){
    this.talkDrop.emit(event);
  }
  ondrag(task){
    console.log(task);
  }

  public Editor = DecoupledEditor;
  public configuration = { placeholder: 'Enter Comment Text...'};

  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
      );
  }
  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
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
      // data.append("Images",this.images);
      for(var i = 0; i < this.files.length; i++)
        data.append('fileUpload',this.files[i]);
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
  openModel(task){
    console.log(task);
    this.task = task;
    console.log(task.status);
    this.getAllCommentOfTask(task._id);
    $('#fullHeightModalRight').modal('show');
  }


  editTask(task){
    this.newTask = task;
    console.log("newTask",this.newTask);
    console.log("title===>",this.newTask.title);
    console.log("title2===>",this.newTask.assignTo);
    console.log("title3===>",this.newTask.sprint);

    this.modalTitle = 'Edit Item';
    $('#itemManipulationModel1').modal('show');
    this.getProject(task.projectId._id);
  }



  updateTask(task){
    task.assignTo = this.editTaskForm.value.assignTo;
    task.sprint = this.editTaskForm.value.sprint;
    console.log("assignTo",task.assignTo);
    let data = new FormData();
    data.append('projectId', task.projectId);
    data.append('title', task.title);
    data.append('desc', task.desc);
    data.append('assignTo', task.assignTo);
    data.append('sprint' , task.sprint);
    data.append('priority', task.priority);
    data.append('dueDate', task.dueDate);
    data.append('estimatedTime', task.estimatedTime);
    data.append('images', task.images);
    if(this.files.length>0){
      for(var i=0;i<this.files.length;i++){
        data.append('fileUpload', this.files[i]);  
      }
    }
    console.log("update =====>",task);
    this._projectService.updateTask(task._id, data).subscribe((res:any)=>{
      Swal.fire({type: 'success',title: 'Task Updated Successfully',showConfirmButton:false,timer: 2000})
      $('#save_changes').attr("disabled", false);
      $('#refresh_icon').css('display','none');
      $('#itemManipulationModel1').modal('hide');
      $('#fullHeightModalRight').modal('hide');
      this.getProject(this.projectId);
      this.newTask = this.getEmptyTask();
      this.files = this.url = [];
      this.editTaskForm.reset();
      this.loader = false;

    },err=>{
      Swal.fire('Oops...', 'Something went wrong!', 'error')
      console.log(err);
      this.loader = false;

    })
  }
  getEmptyTask(){
    return { title:'', desc:'', assignTo: '', sprint:'', status: 'to do', priority: 'low' , dueDate:'', estimatedTime:'', images: [] };
  }
  updateStatus(newStatus, data){
    $('#fullHeightModalRight').modal('hide');
    if(newStatus == 'complete'){
      data.status = newStatus;
      this._projectService.completeItem(data).subscribe((res:any)=>{
        console.log(res);
        this.getProject(res.projectId);
        var n = res.timelog.length
        Swal.fire({
          type: 'info',
          title: "Task is shifted to complete from testing" ,
          showConfirmButton:false,timer: 2000})
      },err=>{
        console.log(err);
        Swal.fire('Oops...', 'Something went wrong!', 'error')
      });
    }else{
      data.status = newStatus;
      console.log("UniqueId", data.uniqueId);
      this._projectService.updateStatus(data).subscribe((res:any)=>{
        console.log(res);
        this.getProject(res.projectId);
        var n = res.timelog.length
        Swal.fire({
          type: 'info',
          title: "Task is"  + " " +res.timelog[n -1].operation ,
          showConfirmButton:false,timer: 2000})
      },(err:any)=>{
        console.log(err);
        Swal.fire('Oops...', 'Something went wrong!', 'error')
      })
    }
  }


  getHHMMTime(difference){
      if(difference != '00:00:00'){
        difference = difference.split("T");  
        difference = difference[1];
        difference = difference.split(".");
        // console.log('difference',difference[0]);
        return difference[0];
      }
      return '00:00:00';
    }
  getTime(counter){
    var milliseconds = ((counter % 1000) / 100),
    seconds = Math.floor((counter / 1000) % 60),
    minutes = Math.floor((counter / (1000 * 60)) % 60),
    hours = Math.floor((counter / (1000 * 60 * 60)) % 24);
    return hours + ":" + minutes + ":" + seconds ;
  }

  deleteTask(taskId){
    console.log(taskId);
    this._projectService.deleteTaskById(this.task).subscribe((res:any)=>{
      $('#exampleModalPreview').modal('hide');
      $('#itemManipulationModel1').modal('hide');
      $('#fullHeightModalRight').modal('hide');
      this.getProject(this.projectId);
      Swal.fire({type: 'success',title: 'Task Deleted Successfully',showConfirmButton:false,timer: 2000})
      console.log("Delete Task======>" , res);
      this.task = res;


    },(err:any)=>{
      Swal.fire('Oops...', 'Something went wrong!', 'error')
      console.log("error in delete Task=====>" , err);
    });
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
          this.projectTeam = res.team;

          res.Teams.push(this.pro.pmanagerId); 
          console.log("response of team============>"  ,res.Teams);
          this.projectTeam = res.Teams;
          // this.projectTeam.sort(function(a, b){
            //   var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
            //   if (nameA < nameB) //sort string ascending
            //     return -1 
            //   if (nameA > nameB)
            //     return 1
            //   return 0 //default return value (no sorting)
            //   this.projectTeam.push
            //   console.log("sorting============>"  ,this.projectTeam);
            // })


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
          //console.log("task ======>" , task);
          _.forEach(this.tracks , (track)=>{
            //console.log("tracks==-=-=-=-",this.tracks);
            if(this.currentUser.userRole!='projectManager' && this.currentUser.userRole!='admin'){
              if(task.status == track.id && task.assignTo && task.assignTo._id == this.currentUser._id){
                track.tasks.push(task);
              }
            }else{
              if(task.status == track.id && task.sprint.status == 'Active'){
                track.tasks.push(task);
              }
            }
          })
        })

        this.loader = false;
        this.func('load');
      },err=>{
        console.log(err);
        this.loader = false;
      })
    },1000);

  }

  saveTheData(task){
    this.loader = true;
    console.log("projectId=========>",this.pro._id);
    console.log(task);
    task['projectId']= this.pro._id;
    task.priority = Number(task.priority); 
    task['type']= _.includes(this.modalTitle, 'Task')?'TASK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
    task.startDate = $("#startDate").val();
    task.estimatedTime = $("#estimatedTime").val();
    console.log("estimated time=====>",task.estimatedTime);
    task.images = $("#images").val();
    console.log("images====>",task.images);
    console.log(task.dueDate);
    task.dueDate = moment().add(task.dueDate,'days').toString();
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

  getSprint(projectId){
    this._projectService.getSprint(projectId).subscribe((res:any)=>{
      console.log("sprints in project detail=====>>>>",res);
      this.sprints = res;
    },(err:any)=>{
      console.log(err);
    });

  }

  startTimer(data) {
       console.log('task data================>',data);
    this.running = !this.running;
    data['running'] = data.running?!data.running:true;
    console.log(data.running);
    if (data.running) {
      // console.log('data.running in if==================>',this.running)
      data['startText'] = 'Stop';
      var startTime = Date.now() - (data.timelog1?data.timelog1.count:this.initialTime);
      // console.log("startTime=======>",startTime);
      data['timerRef'] = setInterval(() => {
        data.timelog1['count'] = Date.now() - startTime;
        var milliseconds = (( data.timelog1.count % 1000) / 100),
        seconds = Math.floor(( data.timelog1.count / 1000) % 60),
        minutes = Math.floor(( data.timelog1.count / (1000 * 60)) % 60),
        hours = Math.floor(( data.timelog1.count / (1000 * 60 * 60)) % 24);
        // console.log('hours + ":" + minutes + ":" + seconds',hours + ":" + minutes + ":" + seconds);
        this.time = hours + ":" + minutes + ":" + seconds;
        data['time'] = this.time;

      });
      window.localStorage.setItem("isTimerRunning",data._id);
      window.localStorage.setItem("runningStatus",data.running);
    } else {
      data.startText = 'Resume';

      window.localStorage.setItem("isTimerRunning","null");
      console.log(data.timelog1.count);
      clearInterval(data.timerRef);
    }
    this.timerUpdate(data);
  }

  timerUpdate(data){
    this.taskdata = data;
    console.log('data===========>',this.taskdata);
    this._projectService.addTimeLog(this.taskdata).subscribe((res:any)=>{
      console.log('res=============>',res);        
      this.timeLog = res;
      console.log('this.timeLog',this.timeLog.difference);
      this.logs = res.log;

    },(err:any)=>{
      console.log(err);
    });

  }

  getSprintWithoutComplete(projectId){
    this._projectService.getSprint(projectId).subscribe((res:any)=>{
      this.sprints = res;
      _.forEach(this.sprints, (sprint)=>{
        if(sprint.status !== 'Complete'){
          console.log("sprint in if",sprint);
          this.newSprint.push(sprint);
        }
      })
    },(err:any)=>{
      console.log(err);
    });
  }  

}