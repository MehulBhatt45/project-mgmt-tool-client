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


	leaveApp;
  acceptedLeave;
  rejectedLeave;
	// apps;

  constructor(public router:Router, public _projectservice:ProjectService) { }

  ngOnInit() {
  	this.getLeaves();
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

}
