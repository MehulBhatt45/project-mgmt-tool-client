import { Component, OnInit, Output, Input, EventEmitter, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { CommentService } from '../services/comment.service';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import { config } from '../config';
import * as moment from 'moment';
import * as _ from 'lodash';
import Swal from 'sweetalert2';


declare var $ : any;
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['../project-detail/project-detail.component.css']
})
export class ChildComponent  implements OnInit{
  name;  
  @Input()developers;
  @Input() tracks;
  // @Output()modalTitle;
  // @Input()getProject;
  @Output() task : EventEmitter<any> = new EventEmitter();
  @Output() trackDrop : EventEmitter<any> = new EventEmitter();
  @Output() talkDrop : EventEmitter<any> = new EventEmitter();
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  // modalTitle;
  public model = {
    editorData: ''
  };
  taskId;
  url = [];
  commentUrl = [];
  newTask = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low', dueDate:'', estimatedTime:'', images: [] };
  modalTitle;3
  project;
  tasks;
  comments;
  comment;
  projectId;
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
  

  constructor( private route: ActivatedRoute,public _projectService: ProjectService,public _commentService: CommentService) { 
    this.route.params.subscribe(param=>{
      this.projectId = param.id;
    });
    this.createEditTaskForm();      
    this.getProject(this.projectId);

  }

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
  createEditTaskForm(){
    this.editTaskForm = new FormGroup({
      title : new FormControl('', Validators.required),
      desc : new FormControl('', Validators.required),
      assignTo : new FormControl('', Validators.required),
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
    searchTask(){
      console.log("btn tapped");
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
      this.getAllCommentOfTask(task._id);
      $('#fullHeightModalRight').modal('show');
    }
   
    
    editTask(task){
      this.newTask = task;
      console.log("newTask",this.newTask);
      console.log("title===>",this.newTask.title);
      console.log("title2===>",this.newTask.assignTo);
      this.modalTitle = 'Edit Item';
      $('#itemManipulationModel1').modal('show');
      this.getProject(task.projectId._id);
    }

    
    updateTask(task){
      task.assignTo = this.editTaskForm.value.assignTo;
      console.log("assignTo",task.assignTo);
      let data = new FormData();
      data.append('projectId', task.projectId);
      data.append('title', task.title);
      data.append('desc', task.desc);
      data.append('assignTo', task.assignTo);
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
        this.newTask = this.getEmptyTask();
        this.files = this.url = [];
        this.editTaskForm.reset();
        this.loader = false;
      },err=>{
        Swal.fire('Oops...', 'Something went wrong!', 'error')
        console.log(err);
        this.loader = false;
        //$('#alert').css('display','block');
      })

    }
    getEmptyTask(){
      return { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' , dueDate:'', estimatedTime:'', images: [] };
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
        })

      }
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
          this.projectTeam.sort(function(a, b){
            var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
            if (nameA < nameB) //sort string ascending
              return -1 
            if (nameA > nameB)
              return 1
            return 0 //default return value (no sorting)
            this.projectTeam.push
            console.log("sorting============>"  ,this.projectTeam);
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
        this.project.sort(custom_sort);
        this.project.reverse();
        console.log("PROJECT=================>", this.project);
        _.forEach(this.project , (task)=>{
          console.log("task ======>" , task);
          _.forEach(this.tracks , (track)=>{
            console.log("tracks==-=-=-=-",this.tracks);
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
    function custom_sort(a, b) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
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


  }
