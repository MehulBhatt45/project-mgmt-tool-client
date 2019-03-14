import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {ProjectService} from '../services/project.service';
declare var $ : any;

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {
	editEmployeeForm: FormGroup;
	files;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public _projectService: ProjectService) { 
this.editEmployeeForm = this.formBuilder.group({
			fname:new FormControl( '', [Validators.required]),
			lname:new FormControl( '', [Validators.required]),
			password:new FormControl('',[Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			date:new FormControl('',[Validators.required]),
			mobile:new FormControl('',[Validators.required]),
			userRole:new FormControl('',[Validators.required]),
			experience:new FormControl('',[Validators.required]),
			profile:new FormControl(''),
			cv:new FormControl('')
		}); 
	}
  

  ngOnInit() {
  	$('.datepicker').pickadate();
  }
  addFile(event){
			this.files.push(event.target.files[0]);
		}
}
