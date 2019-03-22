import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { config } from '../config';
declare var $ : any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css']
})
export class NoticeboardComponent implements OnInit {

  constructor(public router:Router, public _projectservice:ProjectService) { }
  notice;
  newNotice;
  path:any;
  editNoticeForm;
  swal:any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  ngOnInit() {
  	this.getAllNotice();
    this.createEditNoticeForm();
  }

  getAllNotice(){

    this._projectservice.getNotice().subscribe((res:any)=>{
      console.log(res);
      this.notice=res;
      this.path = config.baseMediaUrl;
      console.log("base",this.path); 
    },err=>{
      console.log(err);    
    })
  }

  deleteNotice(id){
    console.log("deleted id",id);
    this._projectservice.deleteNotice(id).subscribe((res:any)=>{
      Swal.fire({type: 'success',title: 'Notice Deleted Successfully',showConfirmButton:false,timer: 2000})
      this.getAllNotice();
    },err=>{
      console.log(err);
       Swal.fire('Oops...', 'Something went wrong!', 'error')
    })
  }

  createEditNoticeForm(){
    this.editNoticeForm = new FormGroup({
      title : new FormControl('', Validators.required),
      desc : new FormControl('', Validators.required),
      published : new FormControl('',Validators.required),
      expireon :new FormControl('',Validators.required),
    })
  }

  updateNotice(notice){
    console.log("update Notice =====>",notice);
    this._projectservice.updateNotice(notice).subscribe((res:any)=>{
      $('#exampleModalPreview').modal('hide');
      Swal.fire({type: 'success',title: 'Notice Updated Successfully',showConfirmButton:false,timer: 2000})
    },err=>{
      console.log(err);
      Swal.fire('Oops...', 'Something went wrong!', 'error')
    })
  }
}
