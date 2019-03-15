import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {ProjectService} from '../services/project.service';
import { LoginService } from '../services/login.service';
declare var $ : any;

@Component({
	selector: 'app-editprofile',
	templateUrl: './editprofile.component.html',
	styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {
	editEmployeeForm: FormGroup;
	userId;
	files: Array<File> = [];
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	userDetails;
	constructor(private _loginService: LoginService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public _projectService: ProjectService) { 
		this.editEmployeeForm = this.formBuilder.group({
			fname:new FormControl( ''),
			lname:new FormControl( ''),
			email: new FormControl(''),
			mobile:new FormControl(''),
			name:new FormControl(''),
			userRole:new FormControl(''),
			experience:new FormControl(''),
			cv:new FormControl('')
		}); 
	}


	ngOnInit() {
		this.getDetails();
	}
	addFile(event){
		this.files.push(event.target.files[0]);
	}

	updateProfile(editEmployeeForm){
		console.log("btn tapped");

		this.editEmployeeForm.value['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("form value=====>>>",editEmployeeForm.value);
		this._loginService.editUserProfileWithFile(editEmployeeForm.value,this.files).subscribe((res:any)=>{
			console.log("res",res);
		},err=>{
			console.log("error",err);    
		})

	}
	getDetails(){
		var id =  JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("user Di ======++>" , id);
		this._loginService.getUserById(id).subscribe((res:any)=>{
			console.log(res);
			this.userDetails = res;
			console.log("this user dateailsls ==>" , this.userDetails);
		},(err:any)=>{
			console.log(err);
		})
	}


}
