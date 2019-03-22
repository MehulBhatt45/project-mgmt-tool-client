import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormControl, FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as _ from "lodash";
declare var $ : any;
import { config } from '../config';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
	availableDevelopers = [];
	projectTeam:any = [];
	projects;
	editAvail;
	projectId;
	updateForm:FormGroup;
	availData;
	developerShow = false;
	allDevelopers;
	availDevelopers;
	loader:boolean = false;
	showDeveloper:boolean = false;
	basMediaUrl = config.baseMediaUrl;
	developers;
	constructor(public router:Router, public _projectService: ProjectService, public route: ActivatedRoute, public _change: ChangeDetectorRef) {
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
			Teams: new FormControl([])
		});
		this.route.params.subscribe(params=>{
			this.getProjectById(params.id);
			this.getAllDevelopersNotInProject(params.id);
		})
	}

	ngViewAfterChecked(){
		this._change.detectChanges();
	}
	ngOnDestroy(){
		this._change.detach();
	}

	ngOnInit() {
		$('.datepicker').pickadate({
			onSet: function(context) {
				console.log('Just set stuff:', context);
				setDate(context);
			}
		});
		var setDate = (context)=>{
			this.timePicked();
		}
		if(this.projectId){
			this.editProject(this.projectId);		
		}
		this.getProjects();
		this.getAllDevelopers();		
	}
	timePicked(){
		this.updateForm.controls.deadline.setValue($('.datepicker').val())
	}

	getAllDevelopers(){
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
			// this._alertService.error(err);
		})
	}

	getAllDevelopersNotInProject(id){
		this._projectService.getUsersNotInProject(id).subscribe((res:any)=>{
			this.availableDevelopers = res;
		},err=>{
			console.log(err);
		})
	}

	getProjects(){
		this._projectService.getProjects().subscribe((res:any)=>{
			console.log("res of all projects in edit project component ====>" , res);
			this.projects = res;
		},(err:any)=>{
			console.log("err in all projects in edit project component ====>" , err);
		})
	}
	editProject(projectId){
		this._projectService.getProjectById(projectId).subscribe((res:any)=>{
			console.log("res of requested project in edit project component ====>" , res);
			this.loader = false;
			Swal.fire({type: 'success',title: 'Project Updated Successfully',showConfirmButton:false,timer: 2000})
			this.availData = res;
			// localStorage.setItem("teams" , JSON.stringify(this.availData));
			// this.teams = true;
			console.log("this . avail Data in edit projects ======>" , this.availData);
			localStorage.setItem('editAvail' , JSON.stringify(true));
			this.editAvail = true;
		},(err:any)=>{
			Swal.fire('Oops...', 'Something went wrong!', 'error')
			console.log("err in requested project in edit project component ====>" , err);
		})
	}

	getProjectById(id){
		this.loader = true;
		console.log("id--=-=-=-{}{}{}",id);
		this._projectService.getProjectById(id).subscribe(res=>{
			this.availData = res;
			this.loader = false;
			console.log("this . avail data ==========>" ,this.availData);
			this.projectTeam = this.availData.Teams;
			localStorage.setItem('teams', JSON.stringify(this.projectTeam)); 
		},err=>{
			console.log(err);
			this.loader = false;
		})

	}
	updateProject(updateForm){
		updateForm.Teams = [];
		_.forEach(this.availData.Teams, t => { updateForm.Teams.push(t._id) });
		updateForm.uniqueId = this.availData.uniqueId;
		updateForm.avatar = this.availData.avatar;
		updateForm._id = this.availData._id;
		console.log("updateForm={}{}{}{}{}",updateForm);
		console.log("avail data in update form ====>" , this.availData);
		this._projectService.updateProject(updateForm).subscribe((res:any)=>{
			this.loader = false;
			console.log("response of update form  ====>" , res);
			Swal.fire({type: 'success',title: 'Project Updated Successfully',showConfirmButton:false,timer: 2000})
			this.router.navigate(['./view-projects']);
		},(err:any)=>{
			console.log("error of update form  ====>" , err);
			Swal.fire('Oops...', 'Something went wrong!', 'error')
		})
	}
	deleteProject(projectId){
		console.log(projectId);
		if(projectId.BugId.length>0 || projectId.IssueId.length>0 || projectId.taskId.length>0 || projectId.Teams.length>0){
			console.log("You can't delete this");
			Swal.fire('Oops...', 'You Can not Delete This!', 'error')

		}else{
			this._projectService.deleteProjectById(this.availData).subscribe((res:any)=>{
				console.log("Delete project======>" , res);
				this.projects = res;
				Swal.fire({type: 'success',title: 'Project deleted Successfully',showConfirmButton:false,timer: 2000})
				this.router.navigate(['./view-projects']);
			},(err:any)=>{
				console.log("error in delete project =====>" , err);
				Swal.fire('Oops...', 'Something went wrong!', 'error')
			});
		}
	}

	addDeveloper(event){
		console.log(event);
		this.projectTeam.push(event);
	}

	removeDeveloper(event){
		console.log(event);
		this.projectTeam.splice(_.findIndex(this.projectTeam, event), 1);
		if(_.findIndex(this.availableDevelopers, function(o) { return o._id == event._id; }) == -1 ){
			console.log("in fi");
			this.availableDevelopers.push(event);
		}
	}

	clearSelection(event){
		console.log(this.availData);
		this.projectTeam = JSON.parse(localStorage.getItem('teams'));
	}
}
