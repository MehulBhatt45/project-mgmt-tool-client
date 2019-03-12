import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';



declare var $ : any;


@Component({
	selector: 'app-leave',
	templateUrl: './leave.component.html',
	styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
	addForm:FormGroup; 


	constructor() {
		this.addForm = new FormGroup({
			email: new FormControl ('',Validators.required),
			name: new FormControl ('',Validators.required),
			leaveDuration : new FormControl ('',Validators.required),
			typeOfLeave : new FormControl ('',Validators.required),
		})
	}

	ngOnInit() {
		$('.datepicker')
	}
	addLeave(form){
		console.log(this.addForm.value);
	}
}
