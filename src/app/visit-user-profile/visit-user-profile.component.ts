import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import * as _ from 'lodash';
import {config} from '../config';
declare var $ : any;


@Component({
	selector: 'app-visit-user-profile',
	templateUrl: './visit-user-profile.component.html',
	styleUrls: ['./visit-user-profile.component.css']
})
export class VisitUserProfileComponent implements OnInit {
	developers;
	developer;
	userId;

	user;
	path = config.baseMediaUrl;
	


	constructor(private route: ActivatedRoute,
		private router: Router, public _projectService: ProjectService, public _alertService: AlertService, private _loginService: LoginService) { 
	}

	ngOnInit() {
		this.route.params.subscribe(param=>{
			this.userId = param.id;
			this.getDeveloperById(this.userId);
		});
		
	}
	getDeveloperById(id){
		console.log("id=>>>",id);
		this._loginService.getUserById(id).subscribe((res:any)=>{
			this.developer = res;
			console.log("all users =============>",res);
		},(err:any)=>{
			console.log("eroooooor=========>",err);
		})
	}
}

// this Component is created for guest-user who can visit all team members profile....


