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
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	baseMediaUrl = config.baseMediaUrl;
	
	constructor(private route: ActivatedRoute,public _alertService: AlertService,
		private router: Router, public _projectservice: ProjectService, public _loginService: LoginService) { 
	}

	createEditEmail(){
		this.editTEmail = new FormGroup({
			subject : new FormControl('', Validators.required),
			content : new FormControl('', Validators.required),
			sendTo : new FormControl('', Validators.required),
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
		// this.getAllDevelopers();
		this.getAllProjects();
		
	}
	getAllProjects(){
		this._projectservice.getProjects().subscribe(res=>{
			console.log("all projects =====>" , res);
			var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
			console.log("current user ====>" , userId);
			// this.pro = res.userId;
			// console.log("project detail===>>>>",this.pro);
			this.projects = res;
			console.log(this.projects);
			_.forEach(this.projects , (task)=>{
				_.forEach(task.Teams , (project)=>{
					if(project._id == userId){
						this.projectArr.push(task);
					}
				})
			})
			for(var i=0;i<this.projects.length;i++){
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
						// this.developers.sort(function(a, b){
							// 	var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
							// 	if (nameA < nameB) //sort string ascending
							// 		return -1 
							// 	if (nameA > nameB)
							// 		return 1
							// 	return 0 //default return value (no sorting)
							// })
						},err=>{
							console.log("Couldn't get all developers ",err);
							this._alertService.error(err);
						})
				}

				openModel(task){
					$('#editEmailModel').modal('show');
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







