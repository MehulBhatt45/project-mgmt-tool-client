import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

import { Router, ActivatedRoute } from '@angular/router';
import {ProjectService} from '../services/project.service';
import {LoginService} from '../services/login.service';
declare var $ : any;

@Component({
	selector: 'app-add-employee',
	templateUrl: './add-employee.component.html',
	styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
	addEmployeeForm: FormGroup;
	
	files: Array<File> = [];
	materialSelect;
	constructor( public router:Router, public route: ActivatedRoute,private formBuilder: FormBuilder, public _projectservice:ProjectService,public _loginservice:LoginService) {
		this.addEmployeeForm = this.formBuilder.group({
			name:new FormControl( '', [Validators.required]),
			// lname:new FormControl( '', [Validators.required]),
			password:new FormControl('',[Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			date:new FormControl('',[Validators.required]),
			mobile:new FormControl('',[Validators.required]),
			userRole:new FormControl('',[Validators.required]),
			experience:new FormControl('',[Validators.required]),
			profile:new FormControl(''),
			cv:new FormControl('')
		}); 
	}

	ngOnInit() {
		$('.datepicker').pickadate();
		
	}

	addEmployee(addEmployeeForm){
		console.log("btn tapped");

		this.addEmployeeForm.value['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		this.addEmployeeForm.value.date = $('.datepicker').val();
		console.log("form value=====>>>",addEmployeeForm.value);
		this._loginservice.addUser_with_file(addEmployeeForm.value,this.files).subscribe((res:any)=>{
			this.router.navigate(['./all-employee']);
			console.log("res=-=-=()()",res);
		},err=>{
			console.log("error",err);    
		})
	}
	// else{
		// 	this.addEmployeeForm.value['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		// 	this._projectservice.addProject_Without_file(addEmployeeForm.value).subscribe((res:any)=>{
			// 		console.log(res);
			// 		// console.log("addproject2 is called");
			// 	},err=>{
				// 		console.log(err);    
				// 	}) 
				// } 	

				addFile(event){
					this.files.push(event.target.files[0]);
				}


			}
