import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $ : any;
@Component({
  selector: 'app-all-leave-app',
  templateUrl: './all-leave-app.component.html',
  styleUrls: ['./all-leave-app.component.css']
})
export class AllLeaveAppComponent implements OnInit {
  tracks:any;
  leaves;
  leaveApp;
  acceptedLeave;
  rejectedLeave;
  id;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // apps;

  constructor(public router:Router, public _projectservice:ProjectService) { }

  ngOnInit() {
  	this.getLeaves();
    this.leavesByUserId();

    // this.$filter('orderBy')(this.leaveApp,'startingDate');
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

  statusOfLeave(){
    this._projectservice.pendingLeaves().subscribe(res=>{
      console.log("data is ============>",res);
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
  statusOfLeaveForAdmin(leave){
    var obj ={ email : JSON.parse(localStorage.getItem('currentUser')).email};
    console.log("email of login user",obj);
    console.log("current User is");
    this._projectservice.getAllLeaves().subscribe(res=>{
      console.log("all data==========>",res);
      this.leaveApp = res;
      _.forEach(this.leaveApp , (leave)=>{
        leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
        // let _sortedDates = leave.startingDate.sort(function(a, b){
        //   return moment(b).format('YYYY-MM-DD')- moment(a).format('YYYY-MM-DD')
        // });
        // leave.startingDate.sort(function(a, b) {
        //     a = new leave.startingDate(a.dateModified).format('YYYY-MM-DD');
        //     b = new leave.startingDate(b.dateModified).format('YYYY-MM-DD');
        //     return a>b ? -1 : a<b ? 1 : 0;
        //   });
          // console.log("change date=============>",leave.startingDate);
          leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
        })
      console.log("statussssssss",this.leaves);
      console.log("applicationsss==>",this.leaveApp);
    },err=>{
      console.log(err);
    })


  }

}


