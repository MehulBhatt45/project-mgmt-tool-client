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
  logs;
  attedenceByDateError;
  errMessage;
  items;
  currentDate;
  attendenceByDate = [];
  select;
  constructor(public router:Router, public _leaveService:LeaveService,
    public _alertService: AlertService,private route: ActivatedRoute) {
    this.route.queryParams
    .subscribe(params=>{
      this.items = params;
      this.dateSelected(this.items.date);
      this.currentDate = this.items.date;
      this.currentDate = moment(this.currentDate).format("DD-MM-YYYY");
      console.log("this is current date",this.currentDate);
      localStorage.setItem("attedenceByDateError",JSON.stringify(false));
    })
  }

  ngOnInit() {
    $('.datepicker').pickadate({ 
      onSet: function(context) {
        console.log('Just set stuff:', context)
        localFunction(context);
      }

    })

    var localFunction = (date)=>{
      this.dateSelected(date);
    }
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

  checkOut(){
    this._leaveService.checkOut(this.currentEmployeeId).subscribe((res:any)=>{
      localStorage.setItem("checkOut",JSON.stringify(false));
      this.checkInStatus = false;
    },(err:any)=>{
      console.log("err of chechout------------->",err);
    })
  }
  dateSelected(event){
    var date = moment(event.select).format('YYYY-MM-DD');
    console.log("event  of date ===>" , date);   
    
    this._leaveService.empAttendence(date).subscribe((res:any)=>{
     console.log("res ==>" , res);
     if(res == null){
       console.log("either Holiday or No attendence");
     }
     else{
      this.logs = res.in_out;
      _.map(this.logs, function(log){
        if(log.checkOut!=null){
          var diff = Number(new Date(log.checkOut)) - Number(new Date(log.checkIn));
          var hours = Math.floor(diff / 1000 / 60 / 60);
          var min = Math.floor((diff/1000/60)%60);
          var sec = (Math.floor((diff/1000) % 60)>9)?Math.floor((diff/1000) % 60):'0'+Math.floor((diff/1000) % 60);
          log['diff'] = hours + ':' + min + ':' + sec;
         
        }
      })

        this.attendenceByDate.push(res);
      console.log("response",this.logs);
      localStorage.setItem("attendenceByDateError",JSON.stringify(false));
      this.attedenceByDateError = false;
     }
    },err=>{
      localStorage.setItem("attedenceByDateError",JSON.stringify(true));
      this.attedenceByDateError = true;
      this.errMessage = "Either Absent Or Holiday"
      console.log("error",err);
    })
  }


}
