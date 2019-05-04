import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { first } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	ngOnInit() {

		console.log("Component Re-Initialized.");

	}


	resetPasswordForm: FormGroup;
	submitted = false;
	returnUrl: string;
	loader: boolean = false;
	match: boolean = false;
	isDisable:boolean = false;


	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private _loginService: LoginService,
		private _alertService: AlertService) { 
		if (this._loginService.currentUserValue) { 
			console.log("REDIRECTION UNCONTROLLED")
		}
		this.resetPasswordForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			currentPassword: new FormControl('', [Validators.required]),
			newPassword: new FormControl('',[Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]),
			confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')])
		});
	}
	
	get f() { return this.resetPasswordForm.controls; }

	resetPassword() {
		console.log("user is=========>");
		this.submitted = true;
		if (this.resetPasswordForm.invalid) {
			return;
		}
		this.isDisable = true;
		delete this.resetPasswordForm.value['confirmPassword']
		console.log(this.resetPasswordForm.value);
		this._loginService.resetPassword(this.resetPasswordForm.value)
		.pipe(first())
		.subscribe(data => {
			Swal.fire({type: 'success',title: 'Password Change Successfully',showConfirmButton:false,timer: 2000})
			this.isDisable = false;
			this.router.navigate(['/login']);
		},
		error => {
			Swal.fire('Oops...', 'Something went wrong!', 'error')
			this.isDisable = false;
		});
	}

	comparePassword(form){
		console.log(form.value.newPassword == form.value.confirmPassword, this.match);
		if(form.value.newPassword === form.value.confirmPassword){
			console.log("In true condition");
			this.match = true;
		}else{
			this.match = false;
		} 

	}
}
