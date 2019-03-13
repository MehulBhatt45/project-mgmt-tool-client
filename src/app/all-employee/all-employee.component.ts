import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { config } from '../config';
@Component({
	selector: 'app-all-employee',
	templateUrl: './all-employee.component.html',
	styleUrls: ['./all-employee.component.css']
})
export class AllEmployeeComponent implements OnInit {
	developers;
	developer;
	userId;
	path = config.baseMediaUrl;
	constructor(private route: ActivatedRoute,public _alertService: AlertService,
		private router: Router, public _projectService: ProjectService) { }

	ngOnInit() {
		this.route.params.subscribe(param=>{
			this.userId = param.id;
			this.getUserById(this.userId);
		})
	}
	getUserById(id){
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
	// update employee profile
	updateEmployee(id){
		console.log("update",id);
		this._projectService.updateUserById(this.developer).subscribe((res:any)=>{
			console.log("update Employee Profile",res);
			this.developer = res;
		},(err:any)=>{
			console.log("update Employee====>", err);
		})
	}
}
