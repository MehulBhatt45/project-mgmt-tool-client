import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as _ from "lodash";
@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

	projects;
	editAvail;
	projectId;
	updateForm:FormGroup;
	availData;
	developerShow = false;
	allDevelopers;
	availDevelopers;
	teamShow:boolean = false;

	constructor(public router:Router, public _projectService: ProjectService, public route: ActivatedRoute) {
		this.updateForm = new FormGroup({
			title: new FormControl('', Validators.required),
			desc: new FormControl(''),
			uniqueId: new FormControl('' , Validators.required),
			clientEmail: new FormControl('' , Validators.required),
			clientFullName: new FormControl('', Validators.required),
			clientContactNo: new FormControl('',Validators.required),
			clientDesignation: new FormControl(''),
			avatar:new FormControl('')
		});
		this.route.params.subscribe(params=>{
			this.getProjectById(params.id);
		})
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
	view_Project(){

		this.router.navigate(['./view-project']);

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
	getProjectById(id){
		this._projectService.getProjectById(id).subscribe(res=>{
			this.availData = res;
			console.log(this.availData);
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
}
