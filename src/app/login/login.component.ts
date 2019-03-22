import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { LoginService } from '../services/login.service';
declare var $:any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  forgotPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _loginService: LoginService,
    private _alertService: AlertService
    ) {
    // redirect to home if already logged in
    if (this._loginService.currentUserValue) { 
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.formBuilder.group({
      email: [''],
      password: [''],
      confirmpassword: ['']
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this._loginService.login(this.loginForm.value)
    .pipe(first())
    .subscribe(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this._alertService.error(error);
        this.loading = false;
      });
  }

  updatePassword(){
    // console.log(this.forgotPasswordForm.value);
    if(this.forgotPasswordForm.value.password == this.forgotPasswordForm.value.confirmpassword){
      delete this.forgotPasswordForm.value["confirmpassword"];
      // console.log(this.forgotPasswordForm.value);
      this._loginService.resetPwd(this.forgotPasswordForm.value).subscribe(res=>{
        console.log("res-=-=",res);
        $('#modalForgotPasswordForm').modal('hide');
      },err=>{
        console.log("res-=-=",err);
        alert("email not found");
      })
    }
    else{
      alert("Please enter same password");
    }    
  }  


}
