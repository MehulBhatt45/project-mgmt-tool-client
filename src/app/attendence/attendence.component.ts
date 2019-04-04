import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import{AttendenceService} from '../services/attendence.service';
import { AlertService } from '../services/alert.service';
import{LeaveService} from '../services/leave.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $ : any;
import Swal from 'sweetalert2';
import { config } from '../config';

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendenceComponent implements OnInit {
	currentEmployeeId = JSON.parse(localStorage.getItem("currentUser"))._id;
	checkInStatus = JSON.parse(localStorage.getItem('checkIn'));

  constructor(public router:Router, public _leaveService:LeaveService,
    public _alertService: AlertService,private route: ActivatedRoute) { }

  ngOnInit() {
  }

  checkIn(){
  	this._leaveService.checkIn(this.currentEmployeeId).subscribe((res:any)=>{
  		console.log("respopnse of checkin=======<",res);
  		localStorage.setItem("checkIn",JSON.stringify(true));
  		this.checkInStatus = true;
  	},(err:any)=>{
  		console.log("err of checkin=>",err);
  	})
  }

}
