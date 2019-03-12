import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';

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
  		console.log("applicationsss==>",this.leaveApp);
  	},err=>{
  		console.log(err);
  	})
  }

}
