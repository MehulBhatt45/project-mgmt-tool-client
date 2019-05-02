import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectService} from '../services/project.service';
import {LoginService} from '../services/login.service';
declare var $ : any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';

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
			password:new FormControl('',[Validators.required]),
			isDelete: new FormControl('false',[Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			date:new FormControl('',[Validators.required]),
			phone:new FormControl(''),
			userRole:new FormControl('',[Validators.required]),
			experience:new FormControl(''),	
			// profile:new FormControl(''),
			cv:new FormControl('')
		}); 
	}

	ngOnInit() {
		$('.datepicker').pickadate({
			min: new Date(),
			onSet: function(context) {
				change();
			}
		});
		var change:any = ()=>{
			this.addEmployeeForm.controls.date.setValue($('.datepicker').val());
		}
		// $('#date-picker-example').pickadate({ 
		// 	min: new Date()
		// })
	}

	addEmployee(addEmployeeForm){
		console.log("btn tapped");

		this.addEmployeeForm.value['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		this.addEmployeeForm.value.date = $('.datepicker').val();
		// this.addEmployeeForm.value.date = $('#date-picker-example').val();
		console.log("form value=====>>>",addEmployeeForm.value);
		this._loginservice.addUser_with_file(addEmployeeForm.value,this.files).subscribe((res:any)=>{
			Swal.fire({type: 'success',title: 'Employee Added Successfully',showConfirmButton:false,timer: 2000})
			this.router.navigate(['./all-employee']);
			console.log("res=-=-=()()",res);
		},err=>{
			Swal.fire('Oops...', 'Something went wrong!', 'error')
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
					// this.files.push(event.target.files[0]);
					_.forEach(event.target.files, (file:any)=>{
						// console.log(file.type);
						if(file.type == "application/pdf"){
							this.files.push(file);
							// var reader = new FileReader();
							// reader.readAsDataURL(file);
							// reader.onload = (e:any) => {
							// 	if(option == 'item')
							// 		this.url.push(e.target.result);
							// 	if(option == 'comment')
							// 		this.commentUrl.push(e.target.result);
							// }
						}else {
							Swal.fire({
								title: 'Error',
								text: "You can upload pdf file only",
								type: 'warning',
							})
						}
					})
				}


			}
