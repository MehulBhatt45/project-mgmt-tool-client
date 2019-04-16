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
	date: any;
	loader: boolean = false;
	constructor(private _loginService: LoginService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public _projectService: ProjectService) { 
		this.editEmployeeForm = this.formBuilder.group({
			name:new FormControl(''),
			email: new FormControl(''),
			phone:new FormControl(''),
			userRole:new FormControl({value: ''}),
			experience:new FormControl(''),
			joiningDate:new FormControl(''),
			cv:new FormControl('')
		}); 
	}


	ngOnInit() {
		this.route.params.subscribe(param=>{
			this.developerId = param.id;
			// console.log("id-=",this.developerId);
			this.getDetails(this.developerId);
			

		})
		// this.getDetails();
	}
	addFile(event){
		this.files = event.target.files;
	}

	updateProfile(editEmployeeForm){
		if(this.currentUser.userRole == "admin"){

			console.log(this.files);
			console.log("btn tapped");
			// this.editEmployeeForm['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
			this.editEmployeeForm['userId'] = this.userDetails._id;
			console.log("form value=====>>>",editEmployeeForm);
			let data = new FormData();
			data.append('name', editEmployeeForm.name?editEmployeeForm.name:"");
			data.append('email', editEmployeeForm.email?editEmployeeForm.email:"");
			data.append('phone', editEmployeeForm.phone?editEmployeeForm.phone:"");
			data.append('experience', editEmployeeForm.experience?editEmployeeForm.experience:"");
			data.append('joiningDate',editEmployeeForm.joiningDate?editEmployeeForm.joiningDate:"");
			data.append('userRole',editEmployeeForm.userRole);
			if(this.files && this.files.length)
				data.append('cv', this.files[0]);

			this._loginService.editUserProfileWithFile(data,this.developerId).subscribe((res:any)=>{
				console.log("res",res);
				Swal.fire({type: 'success',title: 'Profile Updated Successfully',showConfirmButton:false,timer: 2000})
			},err=>{
				console.log("error",err); 
				Swal.fire('Oops...', 'Something went wrong!', 'error')   
			})
		}
		else if(this.currentUser.userRole == "developer" || this.currentUser.userRole=='Developer'){
			// alert("Developer");
			// this.files = this.userDetails.CV;
			console.log(this.files);
			console.log("btn tapped");
			// this.editEmployeeForm['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
			this.editEmployeeForm['userId'] = this.userDetails._id;
			console.log("form value=====>>>",editEmployeeForm);
			let data = new FormData();
			data.append('name', editEmployeeForm.name?editEmployeeForm.name:"");
			data.append('email', editEmployeeForm.email?editEmployeeForm.email:"");
			data.append('phone', editEmployeeForm.phone?editEmployeeForm.phone:"");
			data.append('experience', editEmployeeForm.experience?editEmployeeForm.experience:"");
			// data.append('joiningDate',editEmployeeForm.joiningDate?editEmployeeForm.joiningDate:"");
			// data.append('userRole',editEmployeeForm.userRole);
			if(this.files && this.files.length)
				data.append('cv', this.files[0]);
			// if(this.files == null && this.files.length){
			// 	this.files[0] = this.userDetails.CV;
			// 	data.append('cv', this.files[0]);
			// }
			// else{
			// 	data.append('cv', this.files[0]);
			// }

			this._loginService.editUserProfileWithFile(data,this.developerId).subscribe((res:any)=>{
				console.log("res",res);
				Swal.fire({type: 'success',title: 'Profile Updated Successfully',showConfirmButton:false,timer: 2000})
			},err=>{
				console.log("error",err); 
				Swal.fire('Oops...', 'Something went wrong!', 'error')   
			})
		}

	}
	getDetails(id){
		this.loader = true;
		// var id =  JSON.parse(localStorage.getItem('currentUser'))._id;
		var id = this.developerId;
		this._loginService.getUserById(id).subscribe((res:any)=>{
			console.log("user Di ======++>" , id);
			this.userDetails = res;
			// var dat = this.userDetails.joiningDate.split("T");
			// this.date = dat[0];
			// console.log("res-=",this.date);
			// console.log("res-=-=",dat);
			this.loader = false;
			console.log("this user dateailsls ==>" , this.userDetails);
			// console.log("res-=-=",this.userDetails.userRole);
			if(this.currentUser.userRole=='projectManager'){
				this.editEmployeeForm.controls['name'].disable();
				this.editEmployeeForm.controls['email'].disable();
				this.editEmployeeForm.controls['phone'].disable();
				this.editEmployeeForm.controls['experience'].disable();
				this.editEmployeeForm.controls['cv'].disable();
			}
			else if(this.currentUser.userRole=='developer' || this.currentUser.userRole=='Developer'){
				this.editEmployeeForm.controls['userRole'].disable();
				this.editEmployeeForm.controls['joiningDate'].disable();
			}
			// else{
				// 	this.editEmployeeForm.controls['userRole'].disable();
				// 	this.editEmployeeForm.controls['joiningDate'].disable();
				// }
			},(err:any)=>{
				console.log(err);
				this.loader = false;
			})
	}


}
