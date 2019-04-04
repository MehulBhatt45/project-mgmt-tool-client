import { Component, OnInit } from '@angular/core';

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


	constructor(public _messagingservice:MessagingService,public route:ActivatedRoute,public router:Router) {

	}

	ngOnInit() {
		this.get();
	}
	get(){
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		console.log("res-=-=",currentUser);
	}
}
