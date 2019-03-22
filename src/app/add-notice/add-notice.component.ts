import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
declare var $:any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-add-notice',
	templateUrl: './add-notice.component.html',
	styleUrls: ['./add-notice.component.css']
})
export class AddNoticeComponent implements OnInit {
	files:FileList;
	addForm:FormGroup;
	swal:any;

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
		console.log(addForm);
		var data = new FormData();
		_.forOwn(addForm, function(value, key) {
			data.append(key, value)
		});
		console.log(addForm, this.files);
		if(this.files && this.files.length>0){
			for(var i=0;i<this.files.length;i++){
				data.append('uploadfile', this.files[i]);
			}
		}
		data.append('createdby', JSON.parse(localStorage.getItem('currentUser'))._id);
		this._projectservice.addNotice(data).subscribe((res:any)=>{
			Swal.fire({type: 'success',title: 'Notice Added Successfully',showConfirmButton:false,timer: 2000})
			this.router.navigate(['./noticeboard']);
			console.log(res);
		},err=>{
			console.log(err);   
			Swal.fire('Oops...', 'Something went wrong!', 'error')
		}) 
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


