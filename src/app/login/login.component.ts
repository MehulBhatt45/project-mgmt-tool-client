import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  passCtrl = new FormControl('', [Validators.required]);
  loginForm = new FormGroup({});
  constructor(public router:Router, public _loginService: LoginService) {
    this.loginForm.addControl("email", this.emailCtrl);
    this.loginForm.addControl("password", this.passCtrl);
  }

  ngOnInit() {
  }

  login(loginForm){
  	console.log("btn tapped", this.loginForm.value);
    this._loginService.login(loginForm).subscribe((res:any)=>{
      
    },err=>{
      
    })
  }

}
