import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

	projects;
	projectId;
	updateForm:FormGroup;
	availData;
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
	}

	view_Project(){

		this.router.navigate(['./view-project']);

	}

	getProjectById(id){
		this._projectService.getProjectById(id).subscribe(res=>{
			this.availData = res;
			console.log(this.availData);
		},err=>{
			console.log(err);
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
