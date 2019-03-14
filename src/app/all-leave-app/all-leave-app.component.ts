import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-all-leave-app',
  templateUrl: './all-leave-app.component.html',
  styleUrls: ['./all-leave-app.component.css']
})
export class AllLeaveAppComponent implements OnInit {


	leaveApp;
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
  

}
