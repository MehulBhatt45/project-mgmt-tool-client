import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

import {ProjectService} from '../services/project.service';



declare var $ : any;



@Component({
	selector: 'app-leave',
	templateUrl: './leave.component.html',
	styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
	addForm:FormGroup; 


	constructor(public router:Router, public _projectservice:ProjectService) {
		this.addForm = new FormGroup({
			email: new FormControl ('',Validators.required),
			name: new FormControl ('',Validators.required),
			leaveDuration : new FormControl ('',Validators.required),
			typeOfLeave : new FormControl ('',Validators.required),
			reasonForLeave : new FormControl ('', Validators.required),
		})
	}

	ngOnInit() {
		$('.datepicker')
	}
	addLeave(form){
		console.log(this.addForm.value);
		this._projectservice.addLeave(this.addForm.value).subscribe((res:any)=>{
			console.log("ressssssssssssss",res);
		},err=>{
			console.log(err);
		})
	}
}
