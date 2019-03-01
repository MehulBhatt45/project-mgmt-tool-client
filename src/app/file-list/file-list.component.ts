import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-file-list',
	templateUrl: './file-list.component.html',
	styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
	projectId;
	files;
	constructor(public _projectService: ProjectService, public route: ActivatedRoute) {
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
		})
	}

	ngOnInit() {
		this._projectService.getAllFilesInfolder(this.projectId).subscribe(res=>{
			console.log(res);
			this.files = res;
		},err=>{
			console.log(err);
		})
	}

	onfileChange(files : FileList){
		console.log(files);
		let formData = new FormData();
		formData.append("projectId", this.projectId);
		formData.append("userName", JSON.parse(localStorage.getItem('currentUser')).name);
		for(var i = 0; i<files.length; i++){
			formData.append("fileUpload", files[i]);
		}
		this._projectService.uploadFiles(formData).subscribe(res=>{
			console.log(res);
		},err=>{
			console.log(err);
		})
	}

}
