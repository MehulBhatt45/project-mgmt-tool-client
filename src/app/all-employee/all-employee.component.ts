import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { config } from '../config';
declare var $ : any;
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import {SearchTaskPipe} from '../search-task.pipe';
import * as _ from 'lodash';

@Component({
	selector: 'app-all-employee',
	templateUrl: './all-employee.component.html',
	styleUrls: ['./all-employee.component.css']
})
export class AllEmployeeComponent implements OnInit {
	tracks:any;
	Teams;
	developers;
	developer;
	userId;
	projectId;
	teamArray = [];
	loader:boolean=false;
	path = config.baseMediaUrl;
	addEmployeeForm;
	files: Array<File> = [];
	selectedProjectId: 'all';
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	
	constructor(private formBuilder: FormBuilder, private _loginService: LoginService,private route: ActivatedRoute,public _alertService: AlertService,
		private router: Router, public _projectService: ProjectService,  public searchTextFilter: SearchTaskPipe) { }

	ngOnInit() {
		this.getAllDevelopers();
		this.getAllProjects();
		// this.getDeveloper(projectId);
		this.loader=true;
		$('.datepicker').pickadate();
		// this.getAllUser();
	}
	addFile(event){
		this.files.push(event.target.files[0]);
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
	
	getAllDevelopers(){
		this._projectService.getAllDevelopers().subscribe(res=>{
			this.developers = res;
			console.log("dev()()",this.developers);
			// this.addEmployeeForm = res;
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
		setTimeout(()=>{
			console.log("rotate js--------------------")
			$('a.rotate-btn').click(function () {
				$(this).parents(".card-rotating").toggleClass('flipped');
			});
		},2000);
	}

	deleteEmployee(developerid){
		console.log("msgggg--=--",developerid);

		this._projectService.deleteEmployeeById(developerid).subscribe(res=>{
			Swal.fire({type: 'success',title: 'Employee Deleted Successfully',showConfirmButton:false,timer: 2000})
			console.log("delete{}{}{}{}",res);
			this.getAllDevelopers();
		},err=>{
			console.log("errr=-=-=-= ",err);
			Swal.fire('Oops...', 'Something went wrong!', 'error')
		})
	}
	projects;
	getAllProjects(){
		this._projectService.getProjects().subscribe(res=>{
			this.projects = res;
		},err=>{
			this._alertService.error(err);
			console.log(err);
		})
	}
	onKey(searchText){
		console.log("searchText",searchText);
		var dataToBeFiltered = [this.developers];
		var name = this.searchTextFilter.transform(dataToBeFiltered, searchText);
		console.log("In Component",name);
		_.forEach(name, (content)=>{
			_.forEach(this.developers, (developer)=>{
				if(this.currentUser.userRole!='projectManager' && this.currentUser.userRole!='admin'){
					if(content.status == name ){
						developer.name.push(content);
					}
				}
				else{
					if(content.status == developer.id){
						developer.name.push(content);
					}
				}
			});
		});
	}

	getDeveloper(projectId){
		this.selectedProjectId = projectId;
		console.log(" project id is===========>",projectId);

		this._projectService.getTeamByProjectId(projectId).subscribe((res:any)=>{
			console.log("response of team============>"  ,res.Teams);
			console.log("filter====>");
			this.Teams = res.Teams;
			console.log("response of team============>"  ,this.Teams);
			this.developers.push(this.Teams);
			console.log(this.developers);
			// this.Teams = res.Teams;
			// this.Teams.sort(function(a, b){
				// 	var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
				// 	if (nameA < nameB) //sort string ascending
				// 		return -1 
				// 	if (nameA > nameB)
				// 		return 1
				// 	return 0 //default return value (no sorting)
				// 	this.Teams.push
				// 	console.log("response of team============>"  ,this.Teams);
				// })


				// if( projectId!='all'){
					// 	this.teamArray = [];
					// 	_.forEach(this.Teams , (team)=>{
						// 		if(projectId == projectId.team ){
							// 			this.teamArray.push(team);
							// 		}
							// 	});

							// }
							// (err:any)=>{
								// 	console.log("err of project============>"  ,err);
								// }
							}
							)};
	}



