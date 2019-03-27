import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
// import {ProjectService} from '../services/project.service';
import{LeaveService} from '../services/leave.service';
import { AlertService } from '../services/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $ : any;
import Swal from 'sweetalert2';
import {config} from '../config'
@Component({
  selector: 'app-all-leave-app',
  templateUrl: './all-leave-app.component.html',
  styleUrls: ['./all-leave-app.component.css']
})
export class AllLeaveAppComponent implements OnInit {
  allLeaves;
  leaves;
  leaveApp;
  acceptedLeave;
  rejectedLeave;
  developers;
  developer;
  developerId;
  leavescount:any;
  leavesToDisplay: boolean = true;
  approvedLeaves;
  rejectedLeaves;
  appLeaves;
  rejeLeaves;
  // projectTeam;
  // Teams;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  selectedDeveloperId = "all";

  path = config.baseMediaUrl;
  // apps;

  constructor(public router:Router, public _leaveService:LeaveService,
    public _alertService: AlertService,private route: ActivatedRoute) { 

  }
  getEmptytracks(){

    this.leavescount = [
    {
      "typeOfLeave" : "sickleave",
      "leavesTaken" : Number()
    },
    {
      "typeOfLeave" : "personalleave",
      "leavesTaken" : Number()
    },
    {
      "typeOfLeave" : "leavewithoutpay",
      "leavesTaken" : Number()
    },
    {
      "typeOfLeave" : "emergencyleave",
      "leavesTaken" : Number()
    },
    {
      "leavesPerYear" : 18,
      "leavesLeft" : 18 
    }  
    ]
  }
  ngOnInit() {
    this.getLeaves();
    this.leavesByUserId();
    this.getAllDevelopers();
    // this.route.params.subscribe(param=>{
      //   this.developerId = param.id;
      //   this.leavesByUserId(this.developerId);
      // })
      // this.filterTracks(developerId);
    }


    getApprovedLeaves(){
      this._leaveService.approvedLeaves().subscribe(res=>{
        console.log("approved leaves",res);
        this.approvedLeaves = res;
        _.forEach(this.approvedLeaves, (approved)=>{
          approved.startingDate = moment(approved.startingDate).format('YYYY-MM-DD');
          approved.endingDate = moment(approved.endingDate).format('YYYY-MM-DD');
        })
        this.appLeaves = this.approvedLeaves;
        console.log("approved leaves",this.approvedLeaves);
      },err=>{
        console.log(err);
      })
    }

    getRejectedLeaves(){
      this._leaveService.rejectedLeaves().subscribe(res=>{
        console.log("rejected leaves",res);
        this.rejectedLeaves = res;
        _.forEach(this.rejectedLeaves, (rejected)=>{
          rejected.startingDate = moment(rejected.startingDate).format('YYYY-MM-DD');
          rejected.endingDate = moment(rejected.endingDate).format('YYYY-MM-DD');
        })
        this.rejeLeaves = this.rejectedLeaves;
        console.log("rejected leaves",this.rejectedLeaves);
      },err=>{
        console.log(err);
      })
    }


    getLeaves(){
      this._leaveService.pendingLeaves().subscribe(res=>{
        console.log("data avo joye==========>",res);
        this.leaveApp = res;
        _.forEach(this.leaveApp , (leave)=>{
          leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
          leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
        })

        //this.dueDate = moment().add({days:task.dueDate,months:0}).format('YYYY-MM-DD HH-MM-SS');
        this.allLeaves = this.leaveApp; 
        console.log("applicationsss==>",this.leaveApp);
      },err=>{
        console.log(err);
      })
    }


    getAllDevelopers(){
      this._leaveService.getAllDevelopers().subscribe(res=>{
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
        _.map(this.leaveApp, leave=>{
          _.forEach(this.developers, dev=>{
            if(leave.email == dev.email){
              leave['dev']= dev;
            }
          })
        })
        console.log("Developers",this.developers);
      },err=>{
        console.log("Couldn't get all developers ",err);
        this._alertService.error(err);
      })
    }

    leaveAccepted(req){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Approve it!'
      }).then((result) => {
        if (result.value) {
          var body;
          console.log("dsfdsbgfdf",this.leaveApp);
          console.log("reeeeeeee",req);
          _.forEach(this.leaveApp, (apply)=>{
            if(apply._id == req){
              body = apply;
              body.status = "approved";
            }
          })
          console.log("req ========>" , req);
          console.log("bodyy ========>" , body);
          this._leaveService.leaveApproval(req, body).subscribe((res:any)=>{
            Swal.fire(
              'Approve!',
              'Your Leave has been Approve.',
              'success'
              )
            body.status = "approved";
            console.log("bodyyyyyyyyyyyyyyy",body);
            console.log("respondsssssss",res);
            this.acceptedLeave = res;
            console.log("acceptedd===========>",this.acceptedLeave);
            this.getLeaves();
          },(err:any)=>{
            console.log(err);
            Swal.fire('Oops...', 'Something went wrong!', 'error')
          })
        }
      })
    }

    leaveRejected(req){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Reject it!'
      }).then((result) => {
        if (result.value) {
          var body;
          console.log("rejected",this.leaveApp);
          console.log("reeeeeeee",req);
          _.forEach(this.leaveApp, (apply)=>{
            if(apply._id == req){
              body = apply;
              body.status = "rejected";
            }
          })
          console.log("req ========>" , req);
          console.log("bodyy ========>" , body);
          this._leaveService.leaveApproval(req, body).subscribe((res:any)=>{
            Swal.fire(
              'Rejected!',
              'Your Leave has been Rejected.',
              'success'
              )
            body.status = "rejected";
            console.log("bodyyyyyyyyyyyyyyy",body);
            console.log("respondsssssss",res);
            this.rejectedLeave = res;
            console.log("rejected===========>",this.rejectedLeave);
            this.getLeaves();
          },(err:any)=>{
            console.log(err);
            Swal.fire('Oops...', 'Something went wrong!', 'error')
          })
        }
      })
    }

  leavesByUserId(){
    var obj ={ email : JSON.parse(localStorage.getItem('currentUser')).email};
    console.log("email of login user",obj);
    this._leaveService.leavesById(obj).subscribe((res:any)=>{
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
    this.getEmptytracks();
    var obj ={ email : developerId};
    console.log("email of login user",obj);
    this._leaveService.leavesById(obj).subscribe((res:any)=>{
      console.log("resppppppondssss",res);
      this.leaves = res;
      _.forEach(this.leaves , (leave)=>{
        leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
        leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
      })
      console.log("statussssssss",this.leaves);
      if( developerId!='all'){
        this.leaveApp = [];
        $('.unselected').css('display','block');
        $('.selected').css('display','none');
        console.log("sucess");
        _.forEach(this.leaves , (leave)=>{
          console.log("dsfbbdsf",leave);
          if(developerId == leave.email ){
            console.log(leave);
            $('.unselected').css('display','none');
            $('.selected').css('display','block');
            this.leaveApp.push(leave);
          }
        });
        _.forEach(this.leaves , (leave)=>{
          _.forEach(this.leavescount , (count)=>{
            if(count.typeOfLeave == leave.typeOfLeave){
              count.leavesTaken = count.leavesTaken + 1;
            }
          });
        });
        console.log( this.leavescount[4].leavesLeft = this.leavescount[4].leavesLeft-(this.leavescount[3].leavesTaken+this.leavescount[2].leavesTaken+this.leavescount[1].leavesTaken+this.leavescount[0].leavesTaken));
        console.log("leaves count ====>" , this.leavescount);
      }else{
        console.log("not found");
      }
    },err=>{
      console.log(err);
    })
  }

}

