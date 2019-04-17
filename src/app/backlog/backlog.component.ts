import { Component, OnInit, HostListener,EventEmitter} from '@angular/core';
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
import * as moment from 'moment';

@Component({
	selector: 'app-backlog',
	templateUrl: './backlog.component.html',
	styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {
	projectOne;
	sprintTrack;
	project;
	sprints:any;
	projectId;
	addForm:FormGroup;
	editSprintForm:FormGroup;
	singlesprint:any;
	startsprintId;
	sprintData = {
		startDate : "",
		endDate: ""
	}
	Active;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	tracks;
	allSprints = [];
	totalSDuration:number = 0;
	pdealine;
	prdead;
	pstart;
	pduration:number = 0;
	remainingLimit:number = 0;
	pDuration;

	constructor(public _projectService: ProjectService, private route: ActivatedRoute) { 
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
		});
		this.addForm = new FormGroup({
			title: new FormControl('', Validators.required),
			goal: new FormControl('',Validators.required),
			startDate: new FormControl('',Validators.required),
			endDate:new FormControl('',Validators.required)
		});
	}

	ngOnInit() {
		this.getProject(this.projectId);			
		this.createEditSprintForm();
		this.getTaskbyProject(this.projectId);
		this.getSprint(this.projectId);
		$('#startDate').pickadate({ 
			min: new Date(),
		})	
		$('#endDate').pickadate({ 
			min: new Date(),
		})	

		// Date Picker Valadation Start Here

		//console.log("this . prdead" , this.prdead);
		
		var from_input = $('#startDate').pickadate(),
		from_picker = from_input.pickadate('picker')

		var to_input = $('#endDate').pickadate(),
		to_picker = to_input.pickadate('picker')


		if ( from_picker.get('value') ) {
			console.log(from_picker.get('select'));
			to_picker.set('min', from_picker.get('select'))

		}
		if ( to_picker.get('value') ) {
			from_picker.set('max', to_picker.get('select'))
		}
		from_picker.on('set', function(event) {
			if ( event.select ) {
				console.log(from_picker.get('select'));
				to_picker.set('min', from_picker.get('select'))
			}
			else if ( 'clear' in event ) {
				to_picker.set('min', false)
			}
		})
		to_picker.on('set', function(event) {
			if ( event.select ) {
				from_picker.set('max', to_picker.get('select'))+1
			}
			else if ( 'clear' in event ) {
				from_picker.set('max', false)
			}
		})

		// Date Picker Valadation End Here
	}

	getEmptyTracks(){
		console.log("user=====================>",this.currentUser.userRole);
		if(this.currentUser.userRole == "projectManager" || this.currentUser.userRole == "admin"){

			this.tracks = [
			{
				"title": "Todo",
				"id": "to do",
				"class":"primary",
				"tasks": [

				]
			},
			{
				"title": "In Progress",
				"id": "in progress",
				"class":"info",
				"tasks": [

				]
			},
			{
				"title": "Testing",
				"id": "testing",
				"class":"warning",
				"tasks": [

				]
			},
			{
				"title": "Done",
				"id": "complete",
				"class":"success",
				"tasks": [

				]
			}
			];
			console.log("tracks====-=-_+_++",this.tracks);
		}
		else{
			this.tracks = [
			{
				"title": "Todo",
				"id": "to do",
				"class":"primary",
				"tasks": [

				]
			},
			{
				"title": "In Progress",
				"id": "in progress",
				"class":"info",
				"tasks": [

				]
			},
			{
				"title": "Testing",
				"id": "testing",
				"class":"warning",
				"tasks": [

				]
			}
			];
			console.log("tracks====-=-_+_++",this.tracks);
			
		}
	}
	getProject(id){
		this._projectService.getProjectById(id).subscribe((res:any)=>{
			console.log(res);
			this.projectOne = res;
			var pdealine = moment(this.projectOne.deadline);
			var pstart = moment(this.projectOne.createdAt);
			var prdead = moment(this.projectOne.deadline).format("YYYY,M,DD");
			console.log("prdead ===+++>" , prdead);
			this.pduration = pdealine.diff(pstart,'days');
			console.log("Project Duration=====>>>",this.pduration);
			localStorage.setItem('projectduration' , JSON.stringify(this.pduration));

			
		},(err:any)=>{
			console.log("err of team============>"  ,err);
		});
	}

	addSprint(addForm){
		addForm.startDate = $('#startDate').val();
		addForm.endDate = $('#endDate').val();
		addForm.duration = this.durationOfDate(addForm.startDate,addForm.endDate);
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
			console.log("All sprint response--------->>>>>>>",res);
			this.sprints = res;
			_.forEach(this.sprints , (sprint)=>{
				console.log("single sptint",typeof sprint.duration);

				this.totalSDuration = this.totalSDuration + sprint.duration; 
				if(sprint.status == 'Active'){
					this.Active = true;
				}
			})
			this.pDuration = JSON.parse(localStorage.getItem('projectduration'));
			console.log("is Active available sprint",this.Active);
			console.log("total sprint Duration",this.totalSDuration);
			console.log("total project Duration",this.pDuration);
			
			this.remainingLimit = this.pDuration - this.totalSDuration;
			console.log("this.remainingLimit",this.remainingLimit);
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
			$('#editmodel').modal('hide');
			this.getSprint(this.projectId);
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
			this.singlesprint=res[0];
			console.log("all sprint===>>>", this.singlesprint);
		},err=>{
			console.log(err);    
		})
	}

	startSprint(sprint){
		console.log("start sprint =====>",sprint);
		sprint.duration = this.durationOfDate(sprint.startDate,sprint.endDate);
		console.log("sprint ID=========>>>>",sprint);
		if(sprint.duration > this.remainingLimit){
			Swal.fire('Oops...', 'sprint Duration over projectdue!', 'error')
		}
		else{
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes,Start it!'
			}).then((result) => {
				if (result.value) {

					this._projectService.startSprint(sprint).subscribe((res:any)=>{
						Swal.fire(
							'Started!',
							'Your Sprint has been Started.',
							'success'
							)
						$('#startmodel').modal('hide');
						this.getSprint(this.projectId);
					},err=>{
						console.log(err);
						Swal.fire('Oops...', 'Something went wrong!', 'error')
					})

				}
			})
		}

	}

	getTaskbyProject(projectId){
		this._projectService.getTaskById(projectId).subscribe((res:any)=>{
			console.log("all response ======>" , res);
			this.getEmptyTracks();
			this.project = res;
			console.log("PROJECT=================>", this.project);
		},err=>{
			console.log(err);
		})	

	}

	getTaskCount(sprintId, status){
		return _.filter(this.project, function(o) {  
			if(o.sprint._id == sprintId && o.status == status){
				return o;
			}
		}).length;
	}

	durationOfDate(startDate,endDate){
		var startLimit = moment(startDate); 
		var endLimit = moment(endDate); 
		var duration;
		return duration = endLimit.diff(startLimit,'days')
	}

	completeSprint(sprintId){
		console.log("Sprint ID=====>>>",sprintId);
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes,complete it!'
		}).then((result) => {
			if (result.value) {

				this._projectService.completeSprint(sprintId).subscribe((res:any)=>{
					Swal.fire(
						'Complete!',
						'Your Sprint has been Completed.',
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
}