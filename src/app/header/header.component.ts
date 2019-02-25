import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import {ProjectService} from '../services/project.service';
declare var $: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	projects
	constructor(private router: Router,
		private _loginService: LoginService,  public _projectservice:ProjectService) {
	}

	ngOnInit() {
		$('.button-collapse').sideNav({
			edge: 'left',
			closeOnClick: true
		});
		this._projectservice.getProjects().subscribe(res=>{
			console.log(res);
			this.projects = res;
		},err=>{
			console.log(err);
		})
	}

	logout() {
		this._loginService.logout();
		this.router.navigate(['/login']);
	}
}
