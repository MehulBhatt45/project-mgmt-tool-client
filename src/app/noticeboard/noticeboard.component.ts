import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { config } from '../config';
declare var $ : any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import * as moment from 'moment';



@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css']
})
export class NoticeboardComponent implements OnInit {

  constructor(public router:Router, public _projectservice:ProjectService) { }
  allNotice;
  newNotice;
  path:any;
  editNoticeForm;
  swal:any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  files;

  ngOnInit() {
  	this.getAllNotice();
    this.createEditNoticeForm();
  }

  getAllNotice(){

    this._projectservice.getNotice().subscribe((res:any)=>{
      console.log(res);
      this.allNotice=res;
      this.path = config.baseMediaUrl;
      console.log("base",this.path); 
    },err=>{
      console.log(err);    
    })
  }

  deleteNotice(id){
    console.log("deleted id",id);

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {

      if (result.value) {

        this._projectservice.deleteNotice(id).subscribe((res:any)=>{
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
            )
          this.getAllNotice();
        },err=>{
          console.log(err);
          Swal.fire('Oops...', 'Something went wrong!', 'error')
        })

      }
    })
  }



  // this._projectservice.deleteNotice(id).subscribe((res:any)=>{
    //   Swal.fire({type: 'success',title: 'Notice Deleted Successfully',showConfirmButton:false,timer: 2000})


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


    uploadFile(e,noticeid){
      console.log("file============>",e.target.files);
      console.log("noticeid",noticeid);
      this.files = e.target.files;
      console.log("files===============>",this.files);
      this._projectservice.changeNoticePicture(this.files,noticeid).subscribe((res:any)=>{
        console.log("resss=======>",res);
        Swal.fire({type: 'success',title: 'Notice Updated Successfully',showConfirmButton:false,timer: 2000})
        this.getAllNotice();
      },error=>{
        console.log("errrorrrrrr====>",error);
        Swal.fire('Oops...', 'Something went wrong!', 'error')
      });  
    }

  }
