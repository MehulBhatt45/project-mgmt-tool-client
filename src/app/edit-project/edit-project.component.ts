import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as _ from "lodash";
declare var $ : any;
@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
	availableDevelopers = [];
	projectTeam;
	projects;
	editAvail;
	projectId;
	updateForm:FormGroup;
	availData;
	developerShow = false;
	allDevelopers;
	availDevelopers;
	teamShow:boolean = false;
	showDeveloper:boolean = false;
	constructor(public router:Router, public _projectService: ProjectService, public route: ActivatedRoute) {
		this.updateForm = new FormGroup({
			title: new FormControl('', Validators.required),
			desc: new FormControl(''),
			uniqueId: new FormControl('' ),
			deadline: new FormControl('' ),
			clientEmail: new FormControl('' ),
			clientFullName: new FormControl(''),
			clientContactNo: new FormControl(''),
			clientDesignation: new FormControl(''),
			avatar:new FormControl(''),
			date: new FormControl('')
		});
		this.route.params.subscribe(params=>{
			this.getProjectById(params.id);
		})
	}

	ngOnInit() {
		$('.datepicker').pickadate();
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
	view_Project(){

		this.router.navigate(['./view-project']);

	}
	
	getProjectById(id){
		this._projectService.getProjectById(id).subscribe(res=>{
			this.availData = res;
			console.log("this . avail data ==========>" ,this.availData);
			this.projectTeam = this.availData.Teams;
			this._projectService.getAllDevelopers().subscribe((res:any)=>{
			var flag = 0;
			console.log("All developers ========>" , res);
			console.log("this . project teams ========>" , this.projectTeam);
			_.forEach(res , (allDeveloper)=>{
				console.log("All developers ================================>" , allDeveloper);
				_.forEach(this.projectTeam , (projectTeam)=>{
					console.log("project team ========>" , projectTeam);
					if(allDeveloper._id == projectTeam._id){
						flag = 1;
					}
				})
					if(flag == 0){
						this.availableDevelopers.push(allDeveloper);			
					}
					flag = 0;
			})
			console.log("this . avail developer =======>" , this.availableDevelopers);
		})
		},err=>{
			console.log(err);
		})

	}
	updateProject(updateForm){
		console.log("avail data in update form ====>" , this.availData);
		this._projectService.updateProject(this.availData).subscribe((res:any)=>{
			console.log("response of update form  ====>" , res);
		},(err:any)=>{
			console.log("error of update form  ====>" , err);
		})
	}
	deleteProject(projectId){
		console.log(projectId);
		if(projectId.BugId.length>0 || projectId.IssueId.length>0 || projectId.taskId.length>0 || projectId.Teams.length>0){
			console.log("You can't delete this");
		}else{
			this._projectService.deleteProjectById(this.availData).subscribe((res:any)=>{
				console.log("Delete project======>" , res);
				this.projects = res;
			},(err:any)=>{
				console.log("error in delete project =====>" , err);
			});
		}
	}
	showTeams(){
		if(this.teamShow == false){
			localStorage.setItem("teamShow" , JSON.stringify(true));
			this.teamShow = true;
		}
		else{
			localStorage.setItem("teamShow" , JSON.stringify(false));
			this.teamShow = false;	
		}
			localStorage.setItem("showDeveloper" , JSON.stringify(false));
	}
	getDevelopers(){
		console.log("show developer" , this.showDeveloper);
		if(this.showDeveloper == false){
			localStorage.setItem("showDeveloper" , JSON.stringify(true));
			this.showDeveloper = true;
		}
		else{
			localStorage.setItem("showDeveloper" , JSON.stringify(false));
			this.showDeveloper = false;	
		}
		

	}
	addRemoveDeveloper(developerId){
		var arr = [];
		var arVariable;
		console.log("heyyyyyyyy");
		console.log("all developers ====>" , this.availableDevelopers);
		console.log("all project team ====>" , this.projectTeam);

		console.log("developer Show ===>" , this.developerShow);
		if(this.showDeveloper == true){
			console.log("this . teams in addRemoveDeveloper if ======>" , this.availData);
			_.forEach(this.availableDevelopers , (developer, index)=>{
				if(developer._id == developerId){
					console.log("found developer ====>" , developer , index);
					arr.push(index);
					//this.projectTeam.push(developer);
					this.availData.Teams.push(developer);
					// console.log("In if",this.availData);
					// this.availDevelopers.splice(index,1); 

				}
			})
			arVariable = arr[0];
			console.log("arr ====>" , arVariable);
			this.availableDevelopers.splice(arVariable,1);
			console.log("arr ===>" , this.availableDevelopers);
		}
		else{
			console.log("this . temas in addRemoveDeveloper else ======>" , this.availData);
			_.forEach(this.availData.Teams , (developer , index)=>{
				console.log("developerss ===>" , developer._id , index);	
				if(developer._id == developerId){
					this.availableDevelopers.push(developer);
					console.log("found User" , developer , index);
					arr.push(index);
				//	this.availData.Teams.splice(index,1);
					//console.log("In else",this.availData) 
				}
			})
			console.log("arr ====>" , arr);
			var p = arr[0];
			this.availData.Teams.splice(p , 1);
			localStorage.setItem('teams' , JSON.stringify(this.availData));
			console.log("after Splice else ====>" , this.availData.Teams);
			//this.editProject();
		}
	}
}
