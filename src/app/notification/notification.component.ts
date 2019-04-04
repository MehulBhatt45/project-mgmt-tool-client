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

	selectedStatus:any;
	selectedProjectId = "all";

	constructor(public router:Router, public _leaveService:LeaveService,
		private route: ActivatedRoute,public _projectservice: ProjectService,public _loginService: LoginService,  public _alertService: AlertService) { 

	}
	ngOnInit() {
		this.getAllTeams();
		this.getLeaves();
	}

	getAllTeams(){
		var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("current user Id ====>" , userId);
		this._projectservice.getAllTeamOfManagerId(userId).subscribe(res=>{
			console.log("function ===>")
			this.developers = res;
			console.log("teams array=========>",this.developers);

		},err=>{
			console.log("Couldn't get all My team ",err);
			this._alertService.error(err);
		})
	}

	getLeaves(){

		this._leaveService.pendingLeaves().subscribe(res=>{
			this.leaveApp = res;
			console.log("data ==========>",this.leaveApp);
			$('#statusAction').show();
			_.map(this.leaveApp, leave=>{
				_.forEach(this.developers, dev=>{
					if(leave.email == dev.email){
						leave['dev']= dev;
					}
				})
			})
			_.forEach(this.leaveApp , (leave)=>{
				leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
				leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
			});

			this.allLeaves = this.leaveApp; 
			console.log("applicationsss==>",this.leaveApp);
		},err=>{
			console.log(err);
		});
	}

}
