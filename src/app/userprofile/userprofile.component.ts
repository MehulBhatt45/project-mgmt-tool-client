import { Component, OnInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';



@Component({
	selector: 'app-userprofile',
	templateUrl: './userprofile.component.html',
	styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	projects;

	constructor(private route: ActivatedRoute,
		private router: Router, public _projectService: ProjectService,) { }

	ngOnInit() {
		// this.getAllProjects()
	}

	
	// getAllProjects(){
	// 	this._projectService.getProjects().subscribe(res=>{
	// 		console.log("jay che ke nai=====>");
	// 		this.projects = res;
	// 		console.log("mde che ke nai============>",res);
	// 	},err=>{
	// 		this._alertService.error(err);
	// 		console.log(err);
	// 	})
	// }

	// getInitialsOfName(name){
		// 		var str = name.split(' ')[0][0]+name.split(' ')[1][0];
		// 		return str.toUpperCase();
		// 		// return name.split(' ')[0][0]+name.split(' ')[1][0];
		// 	}
	}
