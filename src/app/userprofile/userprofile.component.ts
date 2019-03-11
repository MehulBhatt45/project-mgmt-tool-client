import { Component, OnInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import * as _ from 'lodash';
declare var $ : any;



@Component({
	selector: 'app-userprofile',
	templateUrl: './userprofile.component.html',
	styleUrls: ['./userprofile.component.css']
})

export class UserprofileComponent implements OnInit {
	projects;
	developers;
	userId;
	projectArr = [];
	finalarr = [];
	editTEmail;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));

	constructor(private route: ActivatedRoute,
		private router: Router, public _projectService: ProjectService, public _alertService: AlertService, private _loginService: LoginService) { 
	}



	createEditEmail(){
		this.editTEmail = new FormGroup({
			subject : new FormControl('', Validators.required),
			content : new FormControl('', Validators.required),
			sendTo : new FormControl('', Validators.required),
		})
	}
	
	ngOnInit() {
		this.getAllProjects();
		this.route.params.subscribe(param=>{
			this.userId = param.id;
			this.getUserById(this.userId);
		})
		// this.sendMail();
		this.createEditEmail();

	}
	getAllProjects(){
		this._projectService.getProjects().subscribe(res=>{
			console.log("all projects =====>" , res);
			var userId = JSON.parse(localStorage.getItem('currentUser'))._id;
			console.log("current user ====>" , userId);
			this.projects = res;
			_.forEach(this.projects , (task)=>{
				_.forEach(task.Teams , (singleTask)=>{
					if(singleTask._id == userId){
						this.projectArr.push(task);
					}
				})
			})			
			this.finalarr.push(this.projectArr[0]);
			console.log("response======>",this.finalarr);
		},err=>{
			this._alertService.error(err);
			console.log(err);
		})
	}

	
	getUserById(id){
		this._projectService.getAllDevelopers().subscribe(res=>{
			this.developers = res;
			this.developers.sort(function(a, b){
				var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
				if (nameA < nameB) //sort string ascending
					return -1 
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			})
			console.log("Developers",this.developers);
		},err=>{
			console.log("Couldn't get all developers ",err);
			this._alertService.error(err);
		})
	}
	// sendMail(){
		// 	$('#editEmailModel').modal('show');
		// }
		openModel(task){
			$('#editEmailModel').modal('show');
		}

	}




