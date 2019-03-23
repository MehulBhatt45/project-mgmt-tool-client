import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {ProjectService} from '../services/project.service';
import { AlertService } from '../services/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $ : any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-leave-app',
  templateUrl: './all-leave-app.component.html',
  styleUrls: ['./all-leave-app.component.css']
})
export class AllLeaveAppComponent implements OnInit {

  leaves;
  leaveApp;
  acceptedLeave;
  rejectedLeave;
  developers;
  developerId;
  // projectTeam;
  // Teams;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  selectedDeveloperId = "all";
  // apps;

  constructor(public router:Router, public _projectservice:ProjectService,public _projectService: ProjectService,
    public _alertService: AlertService,private route: ActivatedRoute) { 

  }

  ngOnInit() {
    this.getLeaves();
    // this.leavesByUserId();
    this.getAllDevelopers();
    // this.route.params.subscribe(param=>{
      //   this.developerId = param.id;
      //   this.leavesByUserId(this.developerId);
      // })
      // this.filterTracks(developerId);
    }
    getLeaves(){
      this._projectservice.pendingLeaves().subscribe(res=>{
        console.log("data avo joye==========>",res);
        this.leaveApp = res;
        _.forEach(this.leaveApp , (leave)=>{
          leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
          leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
        })
        //this.dueDate = moment().add({days:task.dueDate,months:0}).format('YYYY-MM-DD HH-MM-SS'); 
        console.log("applicationsss==>",this.leaveApp);
      },err=>{
        console.log(err);
      })
    }


    getAllDevelopers(){
      this._projectService.getAllDevelopers().subscribe(res=>{
        console.log("function calling===>")
        this.developers = res;
        this.developers.sort(function(a, b){
          var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1 
          if (nameA > nameB)
            return 1
          return 0 
        })
        console.log("Developers",this.developers);
      },err=>{
        console.log("Couldn't get all developers ",err);
        this._alertService.error(err);
      })
    }

    leaveAccepted(req){
      var body;
      console.log("dsfdsbgfdf",this.leaveApp);
      console.log("reeeeeeee",req);
      _.forEach(this.leaveApp, (apply)=>{
        if(apply._id == req){
          body = apply;
        }
      })
      body.status = "approved";
      console.log("bodyyyyyyyyyyyyyyy",body);
      this._projectservice.leaveApproval(req, body).subscribe((res:any)=>{

        console.log("respondsssssss",res);
        this.acceptedLeave = res;
        console.log("acceptedd===========>",this.acceptedLeave);
      },(err:any)=>{
        console.log(err);
      })
    }


    leaveRejected(req){
      var body;
      console.log("rejected",this.leaveApp);
      console.log("gtgt",req);
      _.forEach(this.leaveApp, (apply)=>{
        if(apply._id == req){
          body = apply;
        }
      })
      body.status = "rejected";
      console.log("body",body);
      this._projectservice.leaveApproval(req, body).subscribe((res:any)=>{

        console.log("response",res);
        this.rejectedLeave = res;
        console.log("rejected===========>",this.rejectedLeave);
      },(err:any)=>{
        console.log(err);
      })
    }


    leavesByUserId(){
      var obj ={ email : JSON.parse(localStorage.getItem('currentUser')).email};
      console.log("email of login user",obj);
      this._projectservice.leavesById(obj).subscribe((res:any)=>{
        console.log("resppppppondssss",res);
        this.leaves = res;
        _.forEach(this.leaves , (leave)=>{
          leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
          leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
        })
        console.log("statussssssss",this.leaves);
      },err=>{
        console.log(err);
      })
    }

            filterTracks(developerId){
              console.log("this . leave app =======>" , this.leaveApp);

              console.log("this . leaves =======>" , this.leaves);
              console.log("filter====>");
              this.selectedDeveloperId = developerId;
              console.log(developerId);
              if( developerId!='all'){
                this.leaveApp = [];
                $('.unselected').css('display','block');
                $('.selected').css('display','none');
                console.log("sucess");
                _.forEach(this.leaves,(leave)=>{
                  console.log("hello");
                  if(developerId == leave.email ){
                    console.log(leave);
                    $('.unselected').css('display','none');
                    $('.selected').css('display','block');
                    this.leaveApp.push(leave);
                  }
                });
              }else{
                console.log("not found");
              }

            }


            
          }


