import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';

@Component({
	selector: 'app-add-employee',
	templateUrl: './add-employee.component.html',
	styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
	addEmployeeForm: FormGroup;
	constructor( private formBuilder: FormBuilder) {
		this.addEmployeeForm = this.formBuilder.group({
			fname:new FormControl( '', [Validators.required]),
			lname:new FormControl( '', [Validators.required]),
			password:new FormControl('',[Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			date:new FormControl('',[Validators.required]),
			userrole:new FormControl('',[Validators.required]),
			experience:new FormControl('',[Validators.required]),
			profilePhoto:new FormControl('',[Validators.required]),
			CV:new FormControl('',[Validators.required])
		}); 
	}

		ngOnInit() {

			// $(document).ready(function() {
			// 	$('.mdb-select').materialSelect();
			// });
		 }
		 addEmployee(addEmployeeForm){
		 	console.log("btn tapped");
		 }

	}
