// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Output, Input, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';

import {Router,ActivatedRoute} from '@angular/router';
import {ProjectService} from '../services/project.service';
import{LeaveService} from '../services/leave.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $ : any;
import { config } from '../config';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { AlertService } from '../services/alert.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { AllLeaveAppComponent } from '../all-leave-app/all-leave-app.component';
import { MessagingService } from '../services/messaging.service';



@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
	@Input() acceptedLeave;

		path = config.baseMediaUrl;
		currentUser = JSON.parse(localStorage.getItem('currentUser'));
		allLeaves;
		allAproveLeaves;
		leaves;
		projectId;
		leavescount:any;
		leaveApp;
		rejectedLeave;
		developers;
		rejeLeaves;
		developer;
		projects;
		developerId;
		id;
		projectArr =[];
		finalArr = [];
		project;
		start;
		currentUserId;


		constructor(public _messagingservice:MessagingService,public route:ActivatedRoute,public router:Router,
			public _projectservice: ProjectService,public _leaveService:LeaveService) {

		}

		ngOnInit() {
			console.log("appected leave " , this.acceptedLeave);
			this.get();
			this.getNotificationByUserId(this.currentUserId);
			
		}
		get(){
			var currentUser = JSON.parse(localStorage.getItem('currentUser'));
			console.log("res-=-=",currentUser);

		}
		getNotificationByUserId(currentUserId){
			this._projectservice.getNotificationByUserId(this.currentUser._id).subscribe((res:any)=>{
				var loginUser = JSON.parse(localStorage.getItem('currentUser'));
				// console.log("loginUser==========>",loginUser);
				this.currentUser = res;
				this.currentUser.sort(custom_sort);
				this.currentUser.reverse();
				 var start = new Date();
				
				 start.setTime(1532403882588);
				
				console.log(this.currentUser[0].subject);
				console.log("title=========>",this.currentUser[0].title);
				console.log("current====>",this.currentUser);
				console.log("projectId==========>",this.currentUser[0].projectId._id);
				console.log("type======================>",this.currentUser[0].type);
				
			})
			 function custom_sort(a, b) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
		}
		getHHMMTime(data){
			data = data.split('T');
			// data = data[1];
			// data =data.split('Z')
			return data[0];
		}

		displayLeaveEmit(leave){
			console.log("leave ==>",leave);	
		}

	}
	
	