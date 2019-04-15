import { Location } from '@angular/common';
import {tick , fakeAsync , async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule , DebugElement } from '@angular/core';
import { AbstractControl , FormGroup , FormsModule , FormBuilder  , ReactiveFormsModule} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By , BrowserModule }  from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'jquery';
declare var $ : any;
 
import { LoginComponent } from './login.component';
import { Developers } from '../services/models/developers.model';
import { ViewProjectComponent } from '../view-project/view-project.component';
import { LoginService } from '../services/login.service';
fdescribe('LoginComponent Integration testing', () => {
    let loginService: LoginService;
    let location: Location;
    let router: Router;
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let userEmailErrorEl: any;
    let userPasswordErrorEl: any;    
    let userEmail: any;
    let userPassword: any;
    let loginButton: DebugElement;
    let loginForm: FormGroup;
    let emailFormControl: AbstractControl;
    let passwordFormControl: AbstractControl;  
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LoginComponent , ViewProjectComponent ],
            imports: [ HttpClientModule ,
            FormsModule  ,
            BrowserModule ,
            ReactiveFormsModule,
            RouterTestingModule.withRoutes(
                [{path: 'view-projects' , component: ViewProjectComponent}]
                )
            ],
            providers: [ LoginService ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loginService = TestBed.get(LoginService);
        router = TestBed.get(Router);
        location = TestBed.get(Location);
        router.initialNavigation();
        //get the html elements
        userEmail = fixture.debugElement.query(By.css('#loginEmail')).nativeElement ;
        userPassword = fixture.debugElement.query(By.css('#loginPassword')).nativeElement ;
        loginButton = fixture.debugElement.query(By.css('#loginClick')) ;

        //get the form and form controls
        loginForm = component.loginForm;
        emailFormControl = loginForm.controls['email'];
        passwordFormControl = loginForm.controls['password'];


    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ******** INTEGRATED TESTING ******************

    it(`must test the proper validation of the email field and password field` , async() => {
        const developers = 
        { 
            "_id" : "5c6c0aa9d96ad972c2e5438e", 
            "userRole" : "user", 
            "name" : "mehul bhatt", 
            "email" : "mehul@gmail.com", 
            "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
            "createdAt" : "2019-02-19T13:54:49.334+0000", 
            "updatedAt" : "2019-02-19T13:54:49.334+0000", 
        };
        fixture.whenStable().then(() => {
            //act
            userEmail.value = developers.email;
            userEmail.dispatchEvent(new Event("input"));

            userPassword.value = developers.password;
            userPassword.dispatchEvent(new Event("input"));
            
            fixture.detectChanges();

            //assert

            console.log("integrated =========>" , component.loginForm.value);
            expect(emailFormControl.hasError('required')).toBe(false);
            expect(emailFormControl.valid).toBe(true);
            
            expect(passwordFormControl.hasError('required')).toBe(false);
            expect(passwordFormControl.valid).toBe(true);    
        });
    });
    it(`form should navigate to "view-project" on succesful login ` , async() => {
        const developers = { 
            "_id" : "5c6c0aa9d96ad972c2e5438e", 
            "userRole" : "user", 
            "name" : "mehul bhatt", 
            "email" : "mehul@gmail.com", 
            "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
            "createdAt" : "2019-02-19T13:54:49.334+0000", 
            "updatedAt" : "2019-02-19T13:54:49.334+0000", 
        };
        spyOn(router , 'navigate');

        fixture.whenStable().then(() => {
            //act
            router.navigate(['view-projects']);
            userEmail.value = developers.email;
            userEmail.dispatchEvent(new Event("input"));

            userPassword.value = developers.password;
            userPassword.dispatchEvent(new Event("input"));

            loginButton.triggerEventHandler('click' , null);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(router.navigate).toHaveBeenCalledWith(['view-projects']);                    
            });
        });
    });

    it(`form should be invalid when nothing is set ` , async() => {
        //arrange
        //act
        fixture.whenStable().then(() =>{
            expect(emailFormControl.hasError('required')).toBe(true);
            expect(emailFormControl.valid).toBe(false);

            expect(passwordFormControl.hasError('required')).toBe(true);
            expect(passwordFormControl.valid).toBe(false);            
        });
    });

    // *************** UNIT TESTING ********************
    it(` it should check that the UPDATE function is working proper  ` , () => {
       
       const developers: Developers[] = 
        [{ 
            "_id" : "5c6c0aa9d96ad972c2e5438e", 
            "userRole" : "user", 
            "name" : "mehul bhatt", 
            "email" : "mehul@gmail.com", 
            "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
            "createdAt" : "2019-02-19T13:54:49.334+0000", 
            "updatedAt" : "2019-02-19T13:54:49.334+0000", 
        }];
        component.forgotPasswordForm.value.email = "vivekkbahrda@gmail.com";
        
        spyOn(loginService , 'resetPwd').and.callFake(() => {
            return Observable.from([developers]);
        });

        component.updatePassword();
        expect(component.loader).toBe(false);
    });
    it(`should set the error property if server returns the error in reset passwrod function` , () => {
        const error = new Error("Server Error");

        spyOn(loginService , 'resetPwd').and.returnValue(Observable.throw(error));

        expect(component.error).not.toBeDefined();

        component.updatePassword();

        expect(component.error).toBeDefined();
    });

   
    it(`should check the function ONSUBMIT throws error` , () => {
        const error = new Error("Server Error");
        const developers =  { 
            "_id" : "5c6c0aa9d96ad972c2e5438e", 
            "userRole" : "user", 
            "name" : "mehul bhatt", 
            "email" : "mehul@gmail.com", 
            "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
            "createdAt" : "2019-02-19T13:54:49.334+0000", 
            "updatedAt" : "2019-02-19T13:54:49.334+0000", 
        };
        spyOn(loginService , 'login').and.returnValue(Observable.throw(error));
        expect(component.flag).toBe(false);
        fixture.whenStable().then(() => {
            //act
            userEmail.value = developers.email;
            userEmail.dispatchEvent(new Event("input"));

            userPassword.value = developers.password;
            userPassword.dispatchEvent(new Event("input"));
            component.onSubmit();
            expect(component.loader).toBe(false);
        });
    });
    it(`should check the function ONSUBMIT is working proper  and check the if condition "this.loginForm.invalid"` , () => {
        const error = new Error("Server Error");
        const developers =  { 
            "_id" : "5c6c0aa9d96ad972c2e5438e", 
            "userRole" : "user", 
            "name" : "mehul bhatt", 
            "email" : "", 
            "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
            "createdAt" : "2019-02-19T13:54:49.334+0000", 
            "updatedAt" : "2019-02-19T13:54:49.334+0000", 
        };
        spyOn(loginService , 'login').and.returnValue(Observable.throw(error));
        expect(component.flag).toBe(false);
        fixture.whenStable().then(() => {
            //act
            userEmail.value = developers.email;
            userEmail.dispatchEvent(new Event("input"));
            
            userPassword.value = developers.password;
            userPassword.dispatchEvent(new Event("input"));
            component.onSubmit();
            expect(component.flag1).toBe(true);
        });
    });
    it(`should check the function ONSUBMIT works properly` , () => {
        const error = new Error("Server Error");
        const developers =  { 
            "_id" : "5c6c0aa9d96ad972c2e5438e", 
            "userRole" : "user", 
            "name" : "mehul bhatt", 
            "email" : "mehul@gmail.com", 
            "password" : "$2a$10$S8Z0Csddog0JOKsbLoqsmeuxR8kWlK3VKdNkxLcfHzjFwsMo/tjhy", 
            "createdAt" : "2019-02-19T13:54:49.334+0000", 
            "updatedAt" : "2019-02-19T13:54:49.334+0000", 
        };
        spyOn(loginService , 'login').and.callFake(() => {
            return Observable.from([developers]);
        });
        expect(component.flag).toBe(false);
        fixture.whenStable().then(() => {
            //act
            userEmail.value = developers.email;
            userEmail.dispatchEvent(new Event("input"));

            userPassword.value = developers.password;
            userPassword.dispatchEvent(new Event("input"));
            component.onSubmit();
            expect(component.flag).toBe(true);
        });
    });
});
