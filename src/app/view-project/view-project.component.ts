import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';
import {AlertService} from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import{LeaveService} from '../services/leave.service';
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
  currentEmployeeId = JSON.parse(localStorage.getItem("currentUser"))._id;
  currentUserName = JSON.parse(localStorage.getItem("currentUser")).name;
  checkInStatus = JSON.parse(localStorage.getItem('checkIn'));
  projects;
  projectTeam;
  addForm:FormGroup; 
  files:Array<File>;
  url = '';
  pro;
  idet = [];
  pmt:any;
  developers: any;
  path = config.baseMediaUrl;
  loader:boolean=false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  message;
  tracks;
  projectId;
  project;
  demoprojects = [];
  timediff:any;
  attendence:any;
  idpmt:any;
  objectsArray:any;
  hoveredProject: any;
  teamproject:any;
  ary:any;
  optionsSelect: Array<any>;
  pmanagerId = JSON.parse(localStorage.getItem('currentUser'));
  flag:boolean = false;
  constructor( public _leaveService:LeaveService,private messagingService: MessagingService,private route: ActivatedRoute, public _projectService:ProjectService, public _alertService: AlertService) {

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

   if(this.checkInStatus == false){

   $('#myModal').modal('show');
   
   }else{

      $('#myModal').modal('hide');

   }

    this.getProjects();

    this.getAllDevelopers();
    // this.getProject();
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
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage
  }

  timePicked(){
    this.addForm.controls.deadline.setValue($('.datepicker').val())
  }

  checkIn(){

    

    this._leaveService.checkIn(this.currentEmployeeId).subscribe((res:any)=>{
      console.log("respopnse of checkin=======<",res);

      res.difference = res.difference.split("T");
      res.difference = res.difference[1];
      res.difference = res.difference.split("Z");
      res.difference = res.difference[0];
      console.log("diffrence====-=-=-=-=-=-=-",res.difference);
      this.timediff = res.difference;
      console.log("timediff--=-=-=-=",this.timediff);


      this.attendence = res.in_out;
      console.log("attendence=-=-=-=-=-=-=+++++++++++===",this.attendence);


      _.forEach(this.attendence , (attendence)=>{
        console.log("attendence.checkOut =========+++>" ,attendence.checkOut);
        if(attendence.checkOut != null){
          attendence.checkOut = attendence.checkOut.split("T");
          attendence.checkOut = attendence.checkOut[1];
          attendence.checkOut = attendence.checkOut.split("Z");
          attendence.checkOut = attendence.checkOut[0];
        }
      })

      _.forEach(this.attendence , (attendence)=>{
        console.log("attendence.checkIn =========+++>" ,attendence.checkIn);
        if(attendence.checkIn != null){
          attendence.checkIn = attendence.checkIn.split("T");
          attendence.checkIn = attendence.checkIn[1];
          attendence.checkIn = attendence.checkIn.split("Z");
          attendence.checkIn = attendence.checkIn[0];
        }
      })

      // this.date = this.attendence.checkIn;
      // console.log("date][][][][][][][][",time);

      localStorage.setItem("checkIn",JSON.stringify(true));
      this.checkInStatus = true;
      Swal.fire({
        title: 'Hey! '+this.currentUserName,
        text:'Check In Successfully',
        // html:'<strong>Hey</strong> '+this.currentUserName,
        // type: 'success',
        // // text: 'hey '+this.currentUserName,
        // title: 'Check In Successfully',
        // showConfirmButton:false,
        timer: 2000
      })
    },(err:any)=>{
      console.log("err of checkin=>",err);
    })

  }


  getProjects(){
    this.loader=true;
    this._projectService.getProjects().subscribe((res:any)=>{
      if(this.currentUser.userRole == 'projectManager' || this.currentUser.userRole == 'admin'){
        this.projects = _.filter(res, (p)=>{ return p.pmanagerId._id == this.currentUser._id });
        console.log("IN If=========================================",this.projects);
        this.projects = res;
        
        console.log("this.demoprojects========------=-=-=-=",this.projects);

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
        $("a.view_more_detail").on("click", function(){
          $(this).parents(".card.testimonial-card").toggleClass("open");
          // $(this).parent(".project_header").next(".project_detail").toggleClass("open");
        });
      }, 100);
    },err=>{
      Swal.fire('Oops...', 'Something went wrong!', 'error')  
      this.loader=false;
    });
  }
  
  getDate(date){
    date = date.split("T");
    return date[0];
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
manageroject(addForm){
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
      if (name){
        var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1 
        if (nameA > nameB)
          return 1
        return 0 
      }
    })
    console.log("Developers",this.developers);
  },err=>{
    console.log("Couldn't get all developers ",err);
    Swal.fire('Oops...', 'Something went wrong!', 'error')
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



getTaskCount(status){

  return _.filter(this.hoveredProject.tasks,function(o) { if (o.status == status) return o }).length;
}

mouseOver(project){
  this.hoveredProject = project;
}



}


