import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';
import {AlertService} from '../services/alert.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
declare var $ : any;
import * as _ from 'lodash';
import { config } from '../config';
import { MessagingService } from "../services/messaging.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  projects;
  addForm:FormGroup; 
  files:Array<File>;
  url = '';
  developers: any;
  path = config.baseMediaUrl;
  loader:boolean=false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  message;
  objectsArray:any;
  optionsSelect: Array<any>;
  constructor(private messagingService: MessagingService,public router:Router, public _projectService:ProjectService, public _alertService: AlertService) {
    this.addForm = new FormGroup({
      title: new FormControl('', Validators.required),
      desc: new FormControl(''),
      deadline: new FormControl(''),
      uniqueId: new FormControl('' , Validators.required),
      clientEmail: new FormControl('' , Validators.required),
      clientFullName: new FormControl('', Validators.required),
      clientContactNo: new FormControl('',Validators.required),
      clientDesignation: new FormControl(''),
      avatar: new FormControl(''),
      allDeveloper:new FormControl(''),
      // Teams: new FormControl([])
      // Teams: new FormControl([])

    });
  }

  ngOnInit() {
    
    
    setTimeout(()=>{
      
    $('[data-toggle="popover-hover"]').popover({
      html: true,
      trigger: 'hover',
      placement: 'bottom',
      content: function () { console.log("EVENT TIGGERED"); return '<img src="' + $(this).data('img') + '" />'; }
    });
    },2000);

    this.getProjects();
    this.getAllDevelopers();
    $('.datepicker').pickadate({
      onSet: function(context) {
        console.log('Just set stuff:', context);
        setDate(context);
      }
    });
    var setDate = (context)=>{
      this.timePicked();
    }

    const currentUserId = JSON.parse(localStorage.getItem('currentUser'))._id;
    console.log("currentUser",currentUserId);
    this.messagingService.requestPermission(currentUserId)
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage
  }

  timePicked(){
    this.addForm.controls.deadline.setValue($('.datepicker').val())
  }

  getProjects(){
    this.loader=true;
    this._projectService.getProjects().subscribe((res:any)=>{
      if(this.currentUser.userRole == 'projectManager'){
        this.projects = _.filter(res, (p)=>{ return p.pmanagerId._id == this.currentUser._id });
        console.log("IN If=========================================",this.projects);
      }
      else{
        this.projects = [];
        _.forEach(res, (p)=>{
          _.forEach(p.Teams, (user)=>{
            if(user._id == this.currentUser._id)
              this.projects.push(p);
          })
        });
        console.log("IN Else=========================================",this.projects);
      }
      this.loader=false;
      setTimeout(()=>{
        console.log('view project -------------------------------------');
        $("a.view_more_detail").on("click", function(){
          $(this).parents(".card.testimonial-card").toggleClass("open");
          // $(this).parent(".project_header").next(".project_detail").toggleClass("open");
        });
      }, 100);
    },err=>{
      this._alertService.error(err);
      this.loader=false;
    })
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

getTechName(tech){
  if(tech == "fa-react") return "React JS"
}
  addProject(addForm){
    var data = new FormData();
    _.forOwn(addForm, function(value, key) {
      data.append(key, value)
      console.log("data====()()",data);
    });
    console.log("my file()()){}",addForm, this.files);
    if(this.files && this.files.length>0){
      for(var i=0;i<this.files.length;i++){
        data.append('uploadfile', this.files[i]);
      }
    }
    data.append('pmanagerId', JSON.parse(localStorage.getItem('currentUser'))._id);
    console.log("data__+__+{}{}{}{}{}{}",data);
    this._projectService.addProject(data).subscribe((res:any)=>{
      Swal.fire({type: 'success',title: 'Project Created Successfully',showConfirmButton:false,timer: 2000})
      console.log("addproject2 is called");

    },err=>{
      console.log(err);  
      Swal.fire('Oops...', 'Something went wrong!', 'error')  
    }) 
  }

  openDropdown(){
    if (this.currentUser.userRole=='projectManager') {
      $('.dropdown-toggle').dropdown();
      $('.btn_popover_menu').click(function(){
        // setTimeout(()=>{
          $('[data-toggle="popover-hover"]').popover({
            html: true,
            trigger: 'hover',
            placement: 'bottom',
            content: function () { return '<img src="' + $(this).data('img') + '" />'; }
          });
        // },1000);
      });
    }
  }

  addIcon(value){
    this.addForm.value['avatar'] = value;
    console.log(this.addForm.value['avatar']);
    this.url = 'http://localhost/project-mgmt-tool/server'+this.addForm.value['avatar'];
    $('#basicExampleModal').modal('hide');
  }
  
  onSelectFile(event) {
    console.log("response from changefile",event.target.files);
    this.files = event.target.files;
    $('#basicExampleModal').modal('hide');
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event:any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }
  getAllDevelopers(){
    this._projectService.getAllDevelopers().subscribe(res=>{
      this.developers = res;
      this.developers.sort(function(a, b){
        var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1 
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      })
      console.log("Developers",this.developers);
    },err=>{
      console.log("Couldn't get all developers ",err);
      this._alertService.error(err);
    })
  }

  getLength(project, opt){
    // console.log(project, opt);
    if(project.tasks && project.tasks.length)
      return _.filter(project.tasks,{ 'type': opt }).length;
    else
      return 0;
  }

  removeAvatar(){
    this.url = '';
    this.addForm.value['avatar'] = '';
    this.files = [];
  }

  // getTaskCount(status){

  //  return _.filter(function(o) { if (o.status == status) return o }).length;


  // }
}


