import { Component, OnInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import * as _ from 'lodash';
declare var $ : any;
import { config } from '../config';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-userprofile',
	templateUrl: './userprofile.component.html',
	styleUrls: ['./userprofile.component.css']
})

export class UserprofileComponent implements OnInit {
	projects;
	developers;
	path = config.baseMediaUrl;
	userId;
	url = '';
	user;
	files;
	projectId;
	projectArr = [];
	finalArr = [];
	editTEmail;
	projectTeam;
	Teams;
	teams;
	all;
	item;
	total:any =[]; 
	task;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	baseMediaUrl = config.baseMediaUrl;
	
	constructor(private route: ActivatedRoute,public _alertService: AlertService,
		private router: Router, public _projectservice: ProjectService, public _loginService: LoginService) { 
	}

	createEditEmail(){
		this.editTEmail = new FormGroup({
			subject : new FormControl('', Validators.required),
			content : new FormControl('', Validators.required),
			sendTo : new FormControl(['']),
			projectId : new FormControl(['']),
		})
	}

	ngOnInit() {
		// this.getAllProjects();
		this.route.params.subscribe(param=>{
			this.userId = param.id;
			this.projectId = param.id;
			// this.getDeveloperById(this.userId);
			// this.getAllProjects(this.projectId);
		});
		this.createEditEmail();
		// this.projectSelected(this.item);
		// this.getAllDevelopers();
		this.getAllProjects();
		
	}
	getAllProjects(){
		this._projectservice.getProjects().subscribe(res=>{
			console.log("all projects =====>" , res);
			var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
			console.log("current user ====>" , userId);
			this.projects = res;
			console.log(this.projects);
			console.log(this.projects[0].pmanagerId._id);
			_.forEach(this.projects , (task)=>{
				_.forEach(task.Teams , (project)=>{
					if(project._id == userId){

						this.projectArr.push(task);
					}
				})
			})
			for(var i=0;i<this.projectArr.length;i++){
				this.finalArr.push(this.projectArr[i]);
				console.log("response======>",this.finalArr);
			}	
		},err=>{
			this._alertService.error(err);
			console.log(err);
		})
	}
	// getDeveloperById(id){
		// 	this._loginService.getUserById(id).subscribe((res:any)=>{
			// 		this.currentUser = res;
			// 		console.log("current user =============>",res);
			// 		var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
			// 		console.log(" currentUser  ====>" , userId);
			// 	},(err:any)=>{
				// 	})
				// }

				getAllDevelopers(){
					this._projectservice.getAllDevelopers().subscribe(res=>{
						this.developers = res;
						console.log("Developers",this.developers);
					},err=>{
						console.log("Couldn't get all developers ",err);
						this._alertService.error(err);
					})
				}
				openModel(task){
					$('#editEmailModel').modal('show');
				}
				
				projectSelected(item){
					if(item && item._id){
						_.forEach(item.Teams,(all)=>{
							console.log("all",all._id);
							this.total.push(all._id);
						})
						this.teams =item.Teams;
						console.log(this.teams);
						
						$(".progress").addClass("abc");
						setTimeout(()=>{
							// this.loader = false;
							$(".progress").removeClass("abc");
							this.task.projectId = item._id;	
							this.developers = this.projects[_.findIndex(this.projects, {_id: item._id})].Teams;
							// console.log(this.developers);
						},3000);
					}else{
						this.editTEmail.reset();
					}
				}
				getProjectByPmanagerId(){
						this._projectservice.getProjectByPmanagerId(this.currentUser._id).subscribe((res:any)=>{
								this.currentUser = res;
								console.log("current====>",this.currentUser);
							})
						}

						addNotification(editTEmail){
							this._projectservice.addNotification(editTEmail.value).subscribe((res:any)=>{
								console.log(res);
							})
						}
						uploadFile(e){
							console.log("file============>",e.target.files);
							var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
							console.log("userId===============>",userId);
							this.files = e.target.files;
							console.log("files===============>",this.files);
							this._loginService.changeProfilePicture(this.files, userId).subscribe((res:any)=>{
								console.log("resss=======>",res);
								Swal.fire({type: 'success',title: 'profile Picture Updated Successfully',showConfirmButton:false,timer: 2000})

								setTimeout(()=>{
									this.currentUser = res;
									localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
								},1000);
							},error=>{
								console.log("errrorrrrrr====>",error);
								Swal.fire('Oops...', 'Something went wrong!', 'error')
							});  
						}

					}







