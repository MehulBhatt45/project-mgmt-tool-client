import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
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
  loader = false;
  show: boolean;
  pwd: boolean;

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
      this.show = false;
      this.pwd = false;
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.formBuilder.group({
      email: ['']
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    $(".toggle-password").click(function() {
      $(this).toggleClass("fa-eye fa-eye-slash");
    });
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
  showPassword(){
    // var pass = document.getElementById("FORMPASSWORD").setAttribute("type" , "text");
     var pass = document.getElementById("FORMPASSWORD").getAttribute("type");
     if(pass == "password"){
        document.getElementById("FORMPASSWORD").setAttribute("type" , "text");
    }
    else{
       document.getElementById("FORMPASSWORD").setAttribute("type" , "password");
    }
    // console.log("pass ==>" , pass);
    
    
  }
  updatePassword(){
    // console.log(this.forgotPasswordForm.value);
    this.loader = true;
    this._loginService.resetPwd(this.forgotPasswordForm.value).subscribe(res=>{
      console.log("res-=-=",res);
      this.loader = false;
      // alert("Reset password link sent on your email");
      Swal.fire("","Reset password link sent on your email","success");
      $('#modalForgotPasswordForm').modal('hide');
    },err=>{
      console.log("res-=-=",err);
      this.loader = false;
      // alert("email not found");
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Email not found!',
        footer: ''
      })
    })    
  }
  
  password() {
    this.show = !this.show;
    this.pwd = !this.pwd;
  }
}