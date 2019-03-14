import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import {ProjectService} from '../services/project.service';
import * as moment from 'moment';
import { config } from '../config';
declare var $ : any;
import * as _ from 'lodash';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	tracks:any;
	task;
	userId
	project;
	baseMediaUrl;
	projectId;
	modalTitle;
	projects;
	addUserProfile;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	developers;
	editTaskForm;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	files : FileList;
	constructor(private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute,
		private _loginService: LoginService,  public _projectService: ProjectService, public _alertService: AlertService) {
		this.addUserProfile = this.formBuilder.group({
			name:new FormControl( '', [Validators.required]),
			password:new FormControl('',[Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			userrole:new FormControl('',[Validators.required]),
			fileName:new FormControl('',[Validators.required]),
		}); 
		this.createEditTaskForm();
	}

	getEmptyTracks(){
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
	}

	createEditTaskForm(){
		this.editTaskForm = new FormGroup({
			title : new FormControl('', Validators.required),
			desc : new FormControl('', Validators.required),
			assignTo : new FormControl('', Validators.required),
			priority : new FormControl('', Validators.required),
			startDate : new FormControl('', Validators.required),
			dueDate : new FormControl('', Validators.required),
			status : new FormControl({value: '', disabled: true}, Validators.required)
		})
	}


	ngOnInit() {
		$('.button-collapse').sideNav({
			edge: 'left',
			closeOnClick: true
		});
		this._projectService.getProjects().subscribe(res=>{
			console.log(res);
			this.projects = res;
			// console.log(this.projects.pmanagerId);
		},err=>{
			console.log(err);
		});
		// $('#login_details').click(function (){
		// 	$(this).children('.dropdown-content').toggleClass('open');
		// });
		
		this.getAllDevelopers();
		this.getEmptyTracks();

		this.route.params.subscribe(param=>{
			this.userId = param.id;
			this.getDeveloperById(this.userId);
		});

	}	

	logout() {
		this._loginService.logout();
		this.router.navigate(['/login']);
	}
	getTitle(name){
		var str = name.split(' ');
		return str[0].charAt(0).toUpperCase() + str[0].slice(1) + ' ' + str[1].charAt(0).toUpperCase() + str[1].slice(1);
	}

	// getInitialsOfName(name){

	// 	// console.log(name);

	// 	if(name != 'admin'){
	// 		var str = name.split(' ')[0][0]+name.split(' ')[1][0];
	// 		return str.toUpperCase();
	// 	}else if(name == 'admin'){
	// 		return "A";
	// 	}else{
	// 		return "";
	// 	}
	// 	// return name.split(' ')[0][0]+name.split(' ')[1][0];
	// }
	getDeveloperById(id){
		console.log("id=>>>",id);
		this._loginService.getUserById(id).subscribe((res:any)=>{
			this.currentUser = res;
			console.log("all users =============>",res);
			var userId = JSON.parse(localStorage.getItem('user'))._id;
			console.log(" currentUser profile ====>" , userId);
		},(err:any)=>{
			console.log("eroooooor=========>",err);
		})
	}

	editTask(task){
		this.task = task;
		this.modalTitle = 'Edit Item'
		$('.datepicker').pickadate();
		$('#editModel').modal('show');
	}

	updateTask(task){
		console.log(task);
		var subUrl; 
		subUrl = _.includes(task.uniqueId, 'TSK')?"task/update/":'' || _.includes(task.uniqueId, 'BUG')?"bug/update/":'' || _.includes(task.uniqueId, 'ISSUE')?"issue/update/":'';
		console.log(subUrl);
		this._projectService.updateData(task, subUrl).subscribe((res:any)=>{
			$('#editModel').modal('hide');
		},err=>{
			console.log(err);
			
		})
		
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
			this._alertService.error(err);
		})
	}

	addItem(option){
		// this.loader=true;
		setTimeout(()=>{
			this.task = { title:'', desc:'', assignTo: '', status: 'to do', priority: 'low' };
			this.modalTitle = 'Add '+option;
			$('.datepicker').pickadate();
			$('#editModel').modal('show');
			// this.loader=false;
		},1000);
	}
	getProject(id){
		// this.loader = true;
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				console.log(res);
				this.getEmptyTracks()
				this.project = res;
				_.forEach([...this.project.taskId, ...this.project.IssueId, ...this.project.BugId], (content)=>{
					_.forEach(this.tracks, (track)=>{
						if(content.status == track.id){
							track.tasks.push(content);
						}
					})
				})
				console.log(this.tracks);
				// this.loader = false;
			},err=>{
				console.log(err);
				// this.loader = false;
			})
		},1000);
	}
	saveTheData(task){

		task['projectId']= this.projectId; 
		console.log("ave che ke nai===>",this.projectId);
		task['uniqueId']= _.includes(this.modalTitle, 'Task')?'TSK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
		task.startDate = $("#startDate").val();
		task.dueDate = moment().add({days:task.dueDate,months:0}).format('YYYY-MM-DD HH-MM-SS'); 
		console.log("task here==>>>",task);
		var subUrl; 
		subUrl = _.includes(task.uniqueId, 'TSK')?"task/add-task/":'' || _.includes(task.uniqueId, 'BUG')?"bug/add-bug/":'' || _.includes(task.uniqueId, 'ISSUE')?"issue/add-issue/":'';
		console.log("ama pn jovanu che ho ========>",subUrl);
		this._projectService.addData(task, subUrl).subscribe((res:any)=>{
			$('#editModel').modal('hide');
			this.getProject(this.projectId);
			console.log("kai vandho pde che===>",this.projectId);
		},err=>{
			console.log(err);
		})
	}

	reloadProjects(){
		this._projectService.getProjects().subscribe(res=>{
			console.log(res);
			this.projects = res;
		},err=>{
			console.log(err);
		});
	}

	changeFile(e){
		console.log(e.target.files);
		var userId = JSON.parse(localStorage.getItem('login'))._id;
		console.log("userId===>",this.addUserProfile['userId']);
		this.files = e.target.files;
		this._projectService.uploadFilesToFolder(this.files, userId).subscribe((res:any)=>{
			console.log("resss=======>",res);
			this.addUserProfile = res;
		},error=>{
			console.log("errrorrrrrr====>",error);
		});  
	}
}
