import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {ProjectService} from '../services/project.service';
import { LoginService } from '../services/login.service';
declare var $ : any;
import Swal from 'sweetalert2';


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
	developerId;
	loader: boolean = false;
	constructor(private _loginService: LoginService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public _projectService: ProjectService) { 
		this.editEmployeeForm = this.formBuilder.group({
			name:new FormControl(''),
			email: new FormControl(''),
			phone:new FormControl(''),
			userRole:new FormControl({value: ''}),
			experience:new FormControl(''),
			cv:new FormControl('')
		}); 
	}


	ngOnInit() {
		this.route.params.subscribe(param=>{
			this.developerId = param.id;
			this.getDetails(this.developerId);
			

		})
		// this.getDetails();
	}
	addFile(event){
		this.files = event.target.files;
	}

	updateProfile(editEmployeeForm){
		console.log(this.files);
		console.log("btn tapped");
		this.editEmployeeForm['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("form value=====>>>",editEmployeeForm);
		let data = new FormData();
		data.append('name', editEmployeeForm.name?editEmployeeForm.name:"");
		data.append('email', editEmployeeForm.email?editEmployeeForm.email:"");
		data.append('phone', editEmployeeForm.phone?editEmployeeForm.phone:"");
		data.append('experience', editEmployeeForm.experience?editEmployeeForm.experience:"");
		if(this.files && this.files.length)
			data.append('cv', this.files[0]);

		this._loginService.editUserProfileWithFile(data).subscribe((res:any)=>{
			console.log("res",res);
			  Swal.fire({type: 'success',title: 'Profile Updated Successfully',showConfirmButton:false,timer: 2000})
		},err=>{
			console.log("error",err); 
			  Swal.fire('Oops...', 'Something went wrong!', 'error')   
		})

	}
	getDetails(id){
		this.loader = true;
		// var id =  JSON.parse(localStorage.getItem('currentUser'))._id;
		console.log("user Di ======++>" , id);
		this._loginService.getUserById(id).subscribe((res:any)=>{
			console.log(res);
			this.userDetails = res;
			this.loader = false;
			console.log("this user dateailsls ==>" , this.userDetails);
		},(err:any)=>{
			console.log(err);
			this.loader = false;
		})
	}


}
