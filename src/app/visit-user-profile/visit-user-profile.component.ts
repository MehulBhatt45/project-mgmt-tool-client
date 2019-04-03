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
import { Chart } from 'chart.js';



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
	leaves:any;
	leavescount:any;
	approvedLeaves:any = [];

	constructor(private route: ActivatedRoute,public _alertService: AlertService,
		private router: Router, public _projectService: ProjectService,
		public _loginService: LoginService, public _leaveService:LeaveService) { 
	}

	getEmptytracks(){

		this.leavescount = [
		{
			"typeOfLeave" : "sickleave",
			"leavesTaken" : Number()
		},
		{
			"typeOfLeave" : "personalleave",
			"leavesTaken" : Number()
		},
		{
			"typeOfLeave" : "leavewithoutpay",
			"leavesTaken" : Number()
		},
		{
			"typeOfLeave" : "emergencyleave",
			"leavesTaken" : Number()
		},
		{
			"leavesPerYear" : 18,
			"leavesLeft" : 18 
		}  
		]
		console.log("leaves+++++++++++++++=",this.leavescount);
	}


	ngOnInit() {
		
		this.route.params.subscribe(param=>{
			this.developerId = param.id;
			this.getDeveloperById(this.developerId);
		});
		// this.leaveByUserId(this.currentUser.email);
		this.leaveByUserId(this.developerId);
		this.getLeave(this.developerId);
		


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
				this.leaves = this.leaveApp;
			},err=>{
				console.log("errrrrrrrrrrrrr",err);
			})

		})
	}
	getLeave(id){
		this._loginService.getUserById(id).subscribe((res:any)=>{
			this.currentUser = res;
			console.log("current developer=============>",this.currentUser);

			console.log("leave id=======>>",this.currentUser.email);
			this._leaveService.leaveByUserId(this.currentUser.email).subscribe((res:any)=>{
				console.log("======>>>",res);
				this.leaveApp = res;
				console.log("single leave",this.leaveApp);
				// var approvedLeaves:any = [];
				_.forEach(this.leaveApp,(leave)=>{
					// console.log('leaves==========>',leave);
					if(leave.status == "approved"){
						// console.log('leavessssssssssss==========>',leave);
						this.approvedLeaves.push(leave)
					}
				});
					console.log('approvedLeaves',this.approvedLeaves);
				this.getEmptytracks();
				var ctxP = document.getElementById("pieChart");
				var myPieChart = new Chart(ctxP, {
					type: 'pie',
					data: {
						labels: [ "Personal Leave","Sick leave(Illness or Injury)","Emergency leave","Leave without pay"],
						datasets: [{
							data: this.getLeaveCount(this.approvedLeaves),
							backgroundColor: ["#008000", "#ff8100", "#ff0000", "#3385ff"],
							hoverBackgroundColor: ["lightgray", "lightgray", "gray", "gray"]
						}]
					},
					options: {
						responsive: true,
						legend:{
							position:"right",
							labels:{
								boxWidth:12
							}
						}
					}
				});

				var ctxP = document.getElementById("pieChart1");
				var myPieChart = new Chart(ctxP, {
					type: 'pie',
					data: {
						labels: ["Half Day", "Full Day", "More Day"],
						datasets: [{
							data:this.getLeaveDuration(this.approvedLeaves),
							backgroundColor: ["#ff0000", "#ff8100", "#005ce6"],
							hoverBackgroundColor: ["lightgray", "lightgray", "gray"]
						}]
					},

					options: {
						responsive: true,
						legend:{
							position:"right",
							labels:{
								boxWidth:12,
								// usePointStyle:true,
							}
						}
					}
				})
				
				_.forEach(this.leaveApp , (leave)=>{
					_.forEach(this.leavescount , (count)=>{
						if(count.typeOfLeave == leave.typeOfLeave){
							count.leavesTaken = count.leavesTaken + 1;
						}
					});
				});
				console.log( this.leavescount[4].leavesLeft = this.leavescount[4].leavesLeft-(this.leavescount[3].leavesTaken+this.leavescount[2].leavesTaken+this.leavescount[1].leavesTaken+this.leavescount[0].leavesTaken));
				console.log("leaves count ====>" , this.leavescount);

			},err=>{
				console.log("errrrrrrrrrrrrr",err);
			})

		})
	}


	getLeaveCount(leaves){
		console.log("all p_leave=====",leaves);
		// console.log("attt====>",leaves[0].attechment);
		var Personal_Leave :any= [];
		var Sick_Leave :any= [];
		var Emergency_Leave :any= [];
		var Leave_WithoutPay :any= [];
		console.log('this.leaveApp',this.leaveApp);
		_.forEach(leaves,(leave)=>{
			switch (leave.typeOfLeave) {
				case "personalleave":
				Personal_Leave.push(leave);
				break;
				case "sickleave":
				Sick_Leave.push(leave);
				break;
				case "emergencyleave":
				Emergency_Leave.push(leave);
				break;
				case "leavewithoutpay":
				Leave_WithoutPay.push(leave);
				break;
			}
		});
		console.log(Personal_Leave.length, Sick_Leave.length, Emergency_Leave.length, Leave_WithoutPay.length);
		return [ Personal_Leave.length, Sick_Leave.length, Emergency_Leave.length, Leave_WithoutPay.length ];  }


		getLeaveDuration(leaves){
			console.log(leaves);
			var Half_Day = [];
			var Full_Day = [];
			var More_Day = [];
			_.forEach(leaves,(leave)=>{
				switch (leave.leaveDuration) {
					case "second half-day":
					Half_Day.push(leave);
					break;
					case "1":
					Full_Day.push(leave);
					break;
					default :
					More_Day.push(leave);
					break; 
				}
			})
			console.log(Half_Day.length,Full_Day.length,More_Day.length);
			return [Half_Day.length,Full_Day.length,More_Day.length];
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


