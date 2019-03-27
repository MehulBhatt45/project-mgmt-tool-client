import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-forgotpwd',
	templateUrl: './forgotpwd.component.html',
	styleUrls: ['./forgotpwd.component.css']
})
export class ForgotpwdComponent implements OnInit {
	resetPasswordForm:FormGroup;
	token;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private _loginService: LoginService
		) {
		this.token = this.route.snapshot.params.token; 
	}

	ngOnInit() {
		this.resetPasswordForm = this.formBuilder.group({
			password: [''],
			confirmPassword: ['']
		});
	}

	resetPassword(){
		if(this.resetPasswordForm.value.password == this.resetPasswordForm.value.confirmPassword){
			// console.log(this.token);
			delete this.resetPasswordForm.value["confirmPassword"];
			// console.log(this.resetPasswordForm.value);
			var obj = {};
			obj = {
				"password": this.resetPasswordForm.value.password,
				"token": this.token
			};
			// console.log(obj);
			this._loginService.updatepwd(obj).subscribe(res=>{
				console.log("res-=-=",res);
				// alert("Password reset successfully");
				Swal.fire("","Password reset successfully","success");
				this.router.navigate(["/login"]);
			},err=>{
				console.log("res-=-=",err);
				Swal.fire({
					type: 'error',
					title: 'Oops...',
					text: 'Link Expired!',
					footer: ''
				})
			})
		}
		else if(this.resetPasswordForm.value.password != this.resetPasswordForm.value.confirmPassword){
			// alert("Please enter same password");
			Swal.fire({
				type: 'error',
				title: 'Oops...',
				text: 'Please enter matching password!',
				footer: ''
			})
		}
	}

}
