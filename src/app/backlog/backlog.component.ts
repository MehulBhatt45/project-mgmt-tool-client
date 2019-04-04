import { Component, OnInit, HostListener,EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {SearchTaskPipe} from '../search-task.pipe';
import { ChildComponent } from '../child/child.component';
import { config } from '../config'
declare var $ : any;
import * as _ from 'lodash';
import { Chart } from 'chart.js';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-backlog',
	templateUrl: './backlog.component.html',
	styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {
	project:any;
	sprints:any;
	projectId;
	addForm:FormGroup;
	editSprintForm:FormGroup;
	singlesprint:any;
	newsprint;
	newNotice;
	notice;
	// newsprint;

	constructor(public _projectService: ProjectService, private route: ActivatedRoute) { 
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			this.getProject(this.projectId);			
		});
		this.addForm = new FormGroup({
			title: new FormControl('', Validators.required),
			goal: new FormControl('',Validators.required),
			startDate: new FormControl('',Validators.required),
			endDate:new FormControl('',Validators.required)
		});
	}

	ngOnInit() {
		this.getSprint(this.projectId);
		this.createEditSprintForm();
		$('.datepicker').pickadate({
			min: new Date(),
		})
	}

	getProject(id){
		this._projectService.getProjectById(id).subscribe((res:any)=>{
			console.log(res);
			this.project = res;
		},(err:any)=>{
			console.log("err of team============>"  ,err);
		});
	}

	addSprint(addForm){
		addForm.startDate = $('#startDate').val();
		addForm.endDate = $('#endDate').val();
		addForm.projectId = this.projectId;
		console.log("form value==>>",addForm);

		this._projectService.addSprint(addForm).subscribe((res:any)=>{
			console.log(res);
			$('#addsprint').modal('hide');
			Swal.fire({type: 'success',title: 'Sprint Created Successfully',showConfirmButton:false,timer: 2000})
			this.getSprint(this.projectId);
		},(err:any)=>{
			console.log(err);
			Swal.fire('Oops...','Something went wrong!', 'error')
		});
	}

	getSprint(projectId){

		this._projectService.getSprint(projectId).subscribe((res:any)=>{
			console.log(res);
			this.sprints = res;
		},(err:any)=>{
			console.log(err);
		});

	}

	createEditSprintForm(){
		this.editSprintForm = new FormGroup({
			title: new FormControl('', Validators.required),
			goal: new FormControl('',Validators.required),
			startDate: new FormControl('',Validators.required),
			endDate:new FormControl('',Validators.required)
		})
	}

	updateSprint(sprint){
		console.log("update Notice =====>",sprint);
		this._projectService.updateSprint(sprint).subscribe((res:any)=>{
			$('#editmodel').modal('hide');
			Swal.fire({type: 'success',title: 'Sprint Updated Successfully',showConfirmButton:false,timer: 2000})
		},err=>{
			console.log(err);
			Swal.fire('Oops...', 'Something went wrong!', 'error')
		})
	}


	deleteSprint(sprintid){
		console.log("deleted id",sprintid);

		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {

			if (result.value) {

				this._projectService.deleteSprint(sprintid).subscribe((res:any)=>{
					Swal.fire(
						'Deleted!',
						'Your Sprint has been deleted.',
						'success'
						)
					this.getSprint(this.projectId);
				},err=>{
					console.log(err);
					Swal.fire('Oops...', 'Something went wrong!', 'error')
				})

			}
		})
	}

	sprintById(sprintid){

		this._projectService.sprintById(sprintid).subscribe((res:any)=>{
			console.log("response====>>>",res);
			this.singlesprint=res;
			console.log("all sprint===>>>", this.singlesprint);
		},err=>{
			console.log(err);    
		})

	}

}



