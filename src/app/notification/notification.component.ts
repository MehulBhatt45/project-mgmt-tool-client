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

import { MessagingService } from '../services/messaging.service';



@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
 
 //  @Input() notification = {
	// 	subject: '',
	// 	content:'',
	// 	sendTo:''
	// };;

  // @Output() add : EventEmitter<any> = new EventEmitter();


	path = config.baseMediaUrl;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	allLeaves;
	allAproveLeaves;
	leaves;
	projectId;
	leavescount:any;
	leaveApp;
	acceptedLeave;
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
	currentUserId;


	constructor(public _messagingservice:MessagingService,public route:ActivatedRoute,public router:Router,
		            public _projectservice: ProjectService) {

	}

	ngOnInit() {
		this.get();
		this.getNotificationByUserId(this.currentUserId);
	}
	get(){
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		console.log("res-=-=",currentUser);

	}
	getNotificationByUserId(currentUserId){
		this._projectservice.getNotificationByUserId(this.currentUser._id).subscribe((res:any)=>{
			this.currentUser = res;
	        console.log("current====>",this.currentUser);
		})
	}
	
}
	
