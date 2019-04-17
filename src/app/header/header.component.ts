import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import {ProjectService} from '../services/project.service';
import * as moment from 'moment';
import{LeaveService} from '../services/leave.service';
import { config } from '../config';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
declare var $ : any;



@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	currentEmployeeId = JSON.parse(localStorage.getItem("currentUser"))._id;
	currentUserName = JSON.parse(localStorage.getItem("currentUser")).name;
	checkInStatus = JSON.parse(localStorage.getItem('checkIn'));
	tracks:any;
	task = this.getEmptyTask();
	userId
	project;
	url = [];
	commentUrl = [];
	newTask = { title:'', desc:'', assignTo: '',sprint:'', status: 'to do', priority: 'low', dueDate:'', estimatedTime:'', images: [] };
	path = config.baseMediaUrl;
	projectId;
	modalTitle;
	projects;
	timediff:any;
	attendence:any;
	demoprojects;
	userNotification;
	addUserProfile:FormGroup;
	allStatusList = this._projectService.getAllStatus();
	allPriorityList = this._projectService.getAllProtity();
	developers;
	editTaskForm:FormGroup;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	files: Array<File> = [];
	loader: boolean = false;
	sprints;
	constructor(public _leaveService:LeaveService,private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute,

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

	createEditTaskForm(){
		this.editTaskForm = new FormGroup({
			title : new FormControl('', Validators.required),
			desc : new FormControl('',),
			assignTo : new FormControl('',),
			sprint :new FormControl('',),
			priority : new FormControl('',),
			projectId : new FormControl('', Validators.required),
			dueDate : new FormControl(''),
			estimatedTime: new FormControl(),
			status : new FormControl({value: ''},)
		})
	}


	ngOnInit() {
		// localStorage.setItem("checkIn",JSON.stringify(false));
		this.editTaskForm.reset()
		this.task = this.getEmptyTask();
		$('#editModel').on('hidden.bs.modal', function (e) {
			reset();
		})
		var reset = ()=>{
			this.editTaskForm.reset()
			this.task = this.getEmptyTask();
		}
		$('#estimatedTime').pickatime({
			afterDone: function(context) {
				console.log('Just set stuff:', context);
				setDate(context);
			}
		});
		var setDate = (context)=>{
			this.timePicked();
		}
		$('.button-collapse').sideNav({
			edge: 'left',
			closeOnClick: true
		});
		this.route.params.subscribe(param=>{
			this.projectId = param.id;
			console.log("res-==",this.projectId);
		});
		this.getProjects();
		// this.getAllDevelopers();
		this.getNotificationByUserId();
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

	timePicked(){
		this.editTaskForm.controls.estimatedTime.setValue($('#estimatedTime').val())
	}
	projectSelected(item){
		if(item && item._id){
			console.log(item);
			this.getSprint(item._id);
			this.projectId = item._id;
			this.loader = true;
			$(".progress").addClass("abc");
			// $(".progress .progress-bar").css({"width": '100%'});
			setTimeout(()=>{
				this.loader = false;
				$(".progress").removeClass("abc");
				this.task.projectId = item._id;	
				this.developers = this.projects[_.findIndex(this.projects, {_id: item._id})].Teams;
				console.log(this.developers);
			},3000);
		}else{
			this.editTaskForm.reset();
			this.task = this.getEmptyTask();
		}
	}

	clearSelection(event){
		console.log(event);
	}

	checkIn(){



		this._leaveService.checkIn(this.currentEmployeeId).subscribe((res:any)=>{
			console.log("respopnse of checkin=======<",res);

			// res.difference = res.difference.split("T");
			// res.difference = res.difference[1];
			// res.difference = res.difference.split("Z");
			// res.difference = res.difference[0];
			console.log("diffrence====-=-=-=-=-=-=-",res.difference);
			this.timediff = res.difference;
			console.log("timediff--=-=-=-=",this.timediff);


			this.attendence = res.in_out;
			console.log("attendence=-=-=-=-=-=-=+++++++++++===",this.attendence);


			_.forEach(this.attendence , (attendence)=>{
				console.log("attendence.checkOut =========+++>" ,attendence.checkOut);
				if(attendence.checkOut != null){
					attendence.checkOut = attendence.checkOut.split("T");
					attendence.checkOut = attendence.checkOut[1];
					attendence.checkOut = attendence.checkOut.split("Z");
					attendence.checkOut = attendence.checkOut[0];
				}
			})

			_.forEach(this.attendence , (attendence)=>{
				console.log("attendence.checkIn =========+++>" ,attendence.checkIn);
				if(attendence.checkIn != null){
					attendence.checkIn = attendence.checkIn.split("T");
					attendence.checkIn = attendence.checkIn[1];
					attendence.checkIn = attendence.checkIn.split("Z");
					attendence.checkIn = attendence.checkIn[0];
				}
			})

			// this.date = this.attendence.checkIn;
			// console.log("date][][][][][][][][",time);

			localStorage.setItem("checkIn",JSON.stringify(true));
			this.checkInStatus = true;
			Swal.fire({
				title: 'Hey! '+this.currentUserName,
				text:'Check In Successfully',
				// html:'<strong>Hey</strong> '+this.currentUserName,
				// type: 'success',
				// // text: 'hey '+this.currentUserName,
				// title: 'Check In Successfully',
				// showConfirmButton:false,
				timer: 2000
			})

			


		},(err:any)=>{
			console.log("err of checkin=>",err);
		})

	}



	checkOut(){

		this._leaveService.checkOut(this.currentEmployeeId).subscribe((res:any)=>{
			console.log("respopnse of checkout=======<",res);
			localStorage.setItem("checkOut",JSON.stringify(true));
			localStorage.setItem("checkIn",JSON.stringify(false));
			// this.checkInStatus = false;
			Swal.fire({
				title: 'Hey! '+this.currentUserName,
				text:'Check Out Successfully',
				// html:'<strong>Hey</strong> '+this.currentUserName,
				// type: 'success',
				// // text: 'hey '+this.currentUserName,
				// title: 'Check In Successfully',
				// showConfirmButton:false,
				timer: 2000
			})

			window.location.reload();

			// this.router.navigate["/view-projects"];
		},(err:any)=>{
			console.log("err of chechout------------->",err);
		})

	}

	getProjects(){
		this._projectService.getProjects().subscribe((res:any)=>{
			console.log("current user id",this.currentUser._id);
			if(this.currentUser.userRole == 'projectManager'){
				this.demoprojects = [];
				this.projects = res;
				console.log("this.projects",this.projects);
				_.forEach(this.projects,(project)=>{
					// console.log("project",project);
					_.forEach(project.pmanagerId,(pid)=>{
						// console.log("pid",pid);
						if(pid._id == this.currentUser._id){
							this.demoprojects.push(project);
						}
					})
				})
				console.log("IN If=========================================",this.demoprojects);
			}
			else{
				this.projects = [];
				_.forEach(res, (p)=>{
					_.forEach(p.Teams, (user)=>{
						if(user._id == this.currentUser._id)
							this.projects.push(p);
					})
				});
				console.log("IN Else=========================================",this.projects);
			}
		},err=>{
			console.log(err);
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

	getInitialsOfName(name){
		if(name != 'admin'){
			var str = name.split(' ')[0][0]+name.split(' ')[1][0];
			return str.toUpperCase();
		}else if(name == 'admin'){
			return "A";
		}else{
			return "";
		}
	}
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

	
	getAllDevelopers(){
		this._projectService.getAllDevelopers().subscribe(res=>{
			this.developers = res;
			console.log("Developers",this.developers);
			this.developers.sort(function(a, b){
				var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
				if (nameA < nameB) //sort string ascending
					return -1 
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			})
		},err=>{
			console.log("Couldn't get all developers ",err);
			this._alertService.error(err);
		})
	}

	addItem(option){
		this.task = this.getEmptyTask();
		this.modalTitle = 'Add '+option;
		$('.datepicker').pickadate();
		$('#editModel').modal('show');
		
	}
	getProject(id){
		setTimeout(()=>{
			this._projectService.getProjectById(id).subscribe((res:any)=>{
				console.log(res);
				this.project = res;
				_.forEach([...this.project.taskId, ...this.project.IssueId, ...this.project.BugId], (content)=>{
					_.forEach(this.tracks, (track)=>{
						if(content.status == track.id){
							track.tasks.push(content);
						}
					})
				})
				console.log(this.tracks);
			},err=>{
				console.log(err);
			})
		},1000);
	}
	saveTheData(task){
		this.loader = true;
		task.priority = Number(task.priority); 
		task.status = "to do"
		task['type']= _.includes(this.modalTitle, 'Task')?'TASK':_.includes(this.modalTitle, 'Bug')?'BUG':_.includes(this.modalTitle, 'Issue')?'ISSUE':''; 
		task.estimatedTime = $("#estTime").val();
		task.dueDate = moment().add({days:task.dueDate,months:0}).format('YYYY-MM-DD HH-MM-SS'); 
		task['createdBy'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log(task);
		let data = new FormData();
		_.forOwn(task, function(value, key) {
			// if(key!="estimatedTime")
			// 	data.append(key, value)
			// else
			data.append(key, value)
		});
		if(this.files.length>0){
			for(var i=0;i<this.files.length;i++){
				data.append('fileUpload', this.files[i]);	
			}
		}
		this._projectService.addTask(data).subscribe((res:any)=>{
			console.log("response task***++",res);
			Swal.fire({type: 'success',title: 'Task Added Successfully',showConfirmButton:false,timer: 2000})
			this.loader = false;
			$('#editModel').modal('hide');
			this.task = this.getEmptyTask();
			this.editTaskForm.reset();
			this.files = this.url = [];
			console.log("res-=-=",this.projectId);
			this.router.navigate(["/project-details/"+this.projectId]);
		},err=>{
			Swal.fire('Oops...', 'Something went wrong!', 'error')
			//$('#alert').css('display','block');
			this.loader = false;
			console.log("error========>",err);
		});
	}
	getEmptyTask(){
		return { title:'', desc:'', assignTo: '',sprint:'', status: 'to do', priority: '3' , dueDate:'', estimatedTime:'', projectId:'' };
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

	onSelectFile(event,option){
		// this.files = event.target.files;
		_.forEach(event.target.files, (file:any)=>{
			this.files.push(file);
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e:any) => {
				if(option == 'item')
					this.url.push(e.target.result);
				if(option == 'comment')
					this.commentUrl.push(e.target.result);
			}
		})
	}
	getSprint(projectId){
		this._projectService.getSprint(projectId).subscribe((res:any)=>{
			console.log("sprints in project detail=====>>>>",res);
			this.sprints = res;
		},(err:any)=>{
			console.log(err);
		});
	}

	getNotificationByUserId(){
		this._projectService.getNotificationByUserId(this.currentUser._id).subscribe((res:any)=>{
			var loginUser = JSON.parse(localStorage.getItem('currentUser'));
			// console.log("loginUser==========>",loginUser);
			this.userNotification = res;
			this.userNotification.sort(custom_sort);
			this.userNotification.reverse();
			var start = new Date();

			start.setTime(1532403882588);
			console.log("response ==========++>" , res);
			this.userNotification = res.length;
			console.log("count of notification",this.userNotification);
			// // console.log(this.currentUser[0].subject);
			// console.log("title=========>",this.currentUser[0].title);
			// console.log("current====>",this.currentUser);
			// console.log("projectId==========>",this.currentUser[0].projectId._id);
			// console.log("type======================>",this.currentUser[0].type);

		})
		function custom_sort(a, b) {
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}
	}
	removeAvatar(file, index){
		console.log(file, index);
		this.url.splice(index, 1);
		if(this.files && this.files.length)
			this.files.splice(index,1);
		console.log(this.files);
	}
	removeCommentImage(file, index){
		console.log(file, index);
		this.commentUrl.splice(index, 1);
		if(this.files && this.files.length)
			this.files.splice(index,1);
		console.log(this.files);	
	}

	removeAlreadyUplodedFile(option){
		this.newTask.images.splice(option,1);
	}
	close(){
		this.editTaskForm.reset();
		this.url = this.files = [];
		// this.task.estimatedTime = " ";
		// this.editTaskForm.estimatedTime = "";
		$("#estTime").val(null);
		$("#priority").val(null);
		// this.task.priority = null;
		// this.newTask.priority = null;
	}
}
