import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $ : any;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'project-manager';
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	constructor(public router : Router){

	}

	ngOnInit() {
		if(!this.currentUser){
			this.router.navigate(['/login'])
		}
		$("#dropdown").click(function(e){
  e.stopPropagation();
});

	}
}
