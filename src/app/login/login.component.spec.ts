import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule , DebugElement } from '@angular/core';
import { AbstractControl , FormGroup , FormsModule , FormBuilder  , ReactiveFormsModule} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By , BrowserModule }  from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LoginComponent } from './login.component';
import { Developers } from '../services/models/developers.model';
import { ViewProjectComponent } from '../view-project/view-project.component';
fdescribe('LoginComponent Integration testing', () => {
    let router;
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let userEmail: any;
    let userPassword: any;
    let loginButton: DebugElement;
    let loginForm: FormGroup;
    let emailFormControl: AbstractControl;
    let passwordFormControl: AbstractControl;  
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            imports: [ HttpClientModule ,
            FormsModule  ,
            BrowserModule ,
            ReactiveFormsModule,
            RouterTestingModule.withRoutes(
                [{path: 'view-projects' , component: ViewProjectComponent}]
                )
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = fixture.debugElement.injector.get(Router);
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
    it(`form should navigate to "view-project" on succesful login ` , () => {
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
        spyOn(router , 'navigate');

        fixture.whenStable().then(() => {
            //act
            userEmail.value = developers.email;
            userEmail.dispatchEvent(new Event("input"));

            userPassword.value = developers.password;
            userPassword.dispatchEvent(new Event("input"));

            loginButton.triggerEventHandler('click' , null);
            fixture.detectChanges();

            expect(router.navigate).toHaveBeenCalledWith(['./view-projects']);                    
        });
    });
});
