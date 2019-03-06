import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-add-notice',
	templateUrl: './add-notice.component.html',
	styleUrls: ['./add-notice.component.css']
})
export class AddNoticeComponent implements OnInit {
	files:FileList;
	addForm:FormGroup;

	constructor(public router:Router, public _projectservice:ProjectService) { 

		this.addForm = new FormGroup({
			title: new FormControl('', Validators.required),
			desc: new FormControl('',Validators.required),
			images: new FormControl('' , Validators.required),
			published:new FormControl('',Validators.required),
			expireon:new FormControl('',Validators.required)

		});

	}

	ngOnInit() {
		this.getAllNotice();
	}

	addNotice(addForm){
		console.log("add form calling",addForm.value);
		if(this.files && this.files.length){
			this.addForm.value['createdby'] = JSON.parse(localStorage.getItem('currentUser'))._id;
			console.log("form value=====>>>",addForm.value);
			this._projectservice.addNotice_with_image(addForm.value, this.files).subscribe((res:any)=>{
				console.log(res);
			},err=>{
				console.log(err);    
			}) 
		}
		else{
			this.addForm.value['createdby'] = JSON.parse(localStorage.getItem('currentUser'))._id;
			this._projectservice.addNotice_without_image(addForm.value).subscribe((res:any)=>{
				console.log(res);
			},err=>{
				console.log(err);    
			}) 
		}
	}

	getAllNotice(){

		this._projectservice.getNotice().subscribe((res:any)=>{
			console.log(res);
		},err=>{
			console.log(err);    
		})
	}

	changeFile(e){
		console.log("response from changefile",e.target.files);
		this.files = e.target.files;
	}
}


