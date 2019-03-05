import { Component, OnInit } from '@angular/core';
import {Router , ActivatedRoute , Params} from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as _ from "lodash";
@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
	teams;
		
	updateForm:FormGroup;
	developerShow = false;
	projectId;
	allDevelopers;
	userId = null;
	projects;
	editAvail;
	teamShow = false;
	loader:boolean=false;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	availData;
	availDevelopers;
	ngOnInitData;
	constructor(private router: Router, public _activatedRoute:ActivatedRoute , public _projectService: ProjectService){
		this._activatedRoute.params.subscribe(params =>{
			this.projectId = params['pid'];
			this.userId = params['did'];
			console.log("this . project id in edit projcts ====>" , this.projectId);
			console.log("this . developer id in edit projcts ====>" , this.userId);
			this.ngOnInitData = this.availData;
		})
		this.updateForm = new FormGroup({
			title: new FormControl('', Validators.required),
			desc: new FormControl(''),
			clientEmail: new FormControl('' , Validators.required),
			clientFullName: new FormControl('', Validators.required),
			clientContactNo: new FormControl('',Validators.required),
			clientDesignation: new FormControl('')
		});
	}

	ngOnInit() {
		if(this.projectId){
			this.editProject(this.projectId);		
		}
		this.getProjects();
	}
	getProjects(){
			localStorage.setItem('teamShow' , JSON.stringify(false));
			this.teamShow = false;
			localStorage.setItem('developerShow' , JSON.stringify(false));
			this.developerShow = false;
			localStorage.setItem('editAvail' , JSON.stringify(false));
			this.editAvail = false;	
		this._projectService.getProjects().subscribe((res:any)=>{
			console.log("res of all projects in edit project component ====>" , res);
			this.projects = res;
		},(err:any)=>{
			console.log("err in all projects in edit project component ====>" , err);
		})
	}
	editProject(projectId){
		
		console.log(projectId);
		console.log("heyy");
		console.log("on right path");
		localStorage.setItem('teamShow' , JSON.stringify(false));
			this.teamShow = false;
			localStorage.setItem('developerShow' , JSON.stringify(false));
			this.developerShow = false;
			
		this._projectService.getProjectById(projectId).subscribe((res:any)=>{
			console.log("res of requested project in edit project component ====>" , res);
			this.availData = res;
			// localStorage.setItem("teams" , JSON.stringify(this.availData));
			// this.teams = true;
			console.log("this . avail Data in edit projects ======>" , this.availData);
			localStorage.setItem('editAvail' , JSON.stringify(true));
			this.editAvail = true;
		},(err:any)=>{
			console.log("err in requested project in edit project component ====>" , err);
		})
	}
	showTeams(){
		if(this.teamShow == false){
			localStorage.setItem('teamShow' , JSON.stringify(true));
			this.teamShow = true;
		}
		else if(this.teamShow == true){
			localStorage.setItem('teamShow' , JSON.stringify(false));
			this.teamShow = false;	
		}
		localStorage.setItem('developerShow' , JSON.stringify(false));
	}
	getDevelopers(){
		if(this.developerShow == false){
			localStorage.setItem('developerShow' , JSON.stringify(true));
			this.developerShow = true;
		}
		else if(this.developerShow == true){
			localStorage.setItem('developerShow' , JSON.stringify(false));
			this.developerShow = false;	
		}		
		this._projectService.getAllDevelopers().subscribe((res:any)=>{
			console.log("All Developers ====>" , res);
			this.allDevelopers = res;
			for(var i = 0; i< this.availData.Teams.length ; i++){
				for(var j = 0; j< this.allDevelopers.length; j++){
					if(this.availData.Teams[i]._id == this.allDevelopers[j]._id ){
						console.log("found USers =====>" , this.allDevelopers._id , j)
						this.allDevelopers.splice(j,1);
					}
				}
			}
			console.log("after Slice response ====>" , res);
			this.availDevelopers = this.allDevelopers; 
		})
	}
	addRemoveDeveloper(developerId){
		var arr = [];
		console.log("heyyyyyyyy");
		console.log("all developers ====>" , this.availDevelopers);
		console.log("developer Show ===>" , this.developerShow);
		if(this.developerShow == true){
			console.log("this . teams in addRemoveDeveloper if ======>" , this.availData);
			_.forEach(this.allDevelopers , (developer, index)=>{
				if(developer._id == developerId){
					console.log("found developer ====>" , developer , index);
					this.availData.Teams.push(developer);
					console.log("In if",this.availData);
					this.availDevelopers.splice(index,1); 

				}
			})
		}
		else{
			console.log("this . temas in addRemoveDeveloper else ======>" , this.availData);
			_.forEach(this.availData.Teams , (developer , index)=>{
				console.log("developerss ===>" , developer._id , index);	
				if(developer._id == developerId){
					console.log("found User" , developer , index);
					arr.push(index);
					this.availData.Teams.splice(index,1);
					console.log("In else",this.availData) 
				}
			})
			console.log("arr ====>" , arr);
			for(var i = 0; i<arr.length ; i++){
				var p = arr[i];
				this.availData.Teams.splice(p , 1);
			}
			localStorage.setItem('teams' , JSON.stringify(this.availData));
			console.log("after Splice else ====>" , this.availData.Teams);
			/*this.editProject();*/
			
		}
	}
	updateProject(updateForm){
		console.log("avail data in update form ====>" , this.availData);
		this._projectService.updateProject(this.availData).subscribe((res:any)=>{
			console.log("response of update form  ====>" , res);
		},(err:any)=>{
			console.log("error of update form  ====>" , err);
		})
	}

}
