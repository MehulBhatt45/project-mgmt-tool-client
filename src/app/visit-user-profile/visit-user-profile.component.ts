import { Component, OnInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import * as _ from 'lodash';
declare var $ : any;
import { config } from '../config';
import{LeaveService} from '../services/leave.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';


@Component({
	selector: 'app-visit-user-profile',
	templateUrl: './visit-user-profile.component.html',
	styleUrls: ['./visit-user-profile.component.css']
})
export class VisitUserProfileComponent implements OnInit {
	projects;
	developers;
	path = config.baseMediaUrl;
	userId;
	url = '';
	user;
	files;
	developerId;
	projectArr = [];
	finalArr = [];
	editTEmail;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	baseMediaUrl = config.baseMediaUrl;
	singleleave:any;
	leaveApp:any;
	curruntDeveloper;

	constructor(private route: ActivatedRoute,public _alertService: AlertService,
		private router: Router, public _projectService: ProjectService,
		public _loginService: LoginService, public _leaveService:LeaveService) { 
	}


	ngOnInit() {
		
		this.route.params.subscribe(param=>{
			this.developerId = param.id;
			this.getDeveloperById(this.developerId);
		});
		// this.leaveByUserId(this.currentUser.email);
		this.leaveByUserId(this.developerId);


	}
	
	getDeveloperById(id){
		console.log("id=>>>",id);
		this._loginService.getUserById(id).subscribe((res:any)=>{
			this.currentUser = res;
			console.log("current developer=============>",this.currentUser);
			this._projectService.getProjects().subscribe(res=>{
				console.log("total number of projects =====>" , res);
				this.projects = res;
				_.forEach(this.projects , (task)=>{
					_.forEach(task.Teams , (project)=>{
						if(project._id == this.developerId){
							this.projectArr.push(task);
						}
					})
				})
				for(var i=0;i<this.projects.length;i++){
					this.finalArr.push(this.projectArr[i]);
					console.log("response======>",this.finalArr);
				}	
			}
			)},(err:any)=>{
				console.log("eroooooor=========>",err);
			})

	}

	leaveByUserId(id){
		this._loginService.getUserById(id).subscribe((res:any)=>{
			this.currentUser = res;
			console.log("current developer=============>",this.currentUser);

			console.log("leave id=======>>",this.currentUser.email);
			this._leaveService.leaveByUserId(this.currentUser.email).subscribe((res:any)=>{
				console.log("======>>>",res);
				this.leaveApp = res;
				console.log("single leave",this.leaveApp);
			},err=>{
				console.log("errrrrrrrrrrrrr",err);
			})

		})
	}
	leaveById(leaveid){
		console.log("leave id=======>>",leaveid);
		this._leaveService.getbyId(leaveid).subscribe((res:any)=>{
			this.singleleave = res[0];
			console.log("single leave",this.singleleave);
		},err=>{
			console.log("errrrrrrrrrrrrr",err);
		})

	}
}
// this Component is created for guest-user who can visit all team members profile....


