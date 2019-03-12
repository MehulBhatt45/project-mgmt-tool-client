import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
	selector: 'app-all-developer',
	templateUrl: './all-developer.component.html',
	styleUrls: ['./all-developer.component.css']
})
export class AllDeveloperComponent implements OnInit {
	developers;
	userId;
	constructor(private route: ActivatedRoute,
		private router: Router, public _projectService: ProjectService, public _alertService: AlertService, private _loginService: LoginService) { }

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

}
