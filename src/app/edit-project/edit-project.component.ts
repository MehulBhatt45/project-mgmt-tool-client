import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ProjectService } from '../services/project.service';
@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
	availData;
	projects;
	projectId;
	constructor(public router:Router, public _projectService: ProjectService) { }

	ngOnInit() {
	}

	view_Project(){

		this.router.navigate(['./view-project']);

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
