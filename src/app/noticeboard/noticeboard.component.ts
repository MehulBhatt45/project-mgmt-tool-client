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
  allNotice:any;
  singlenotice:any;
  noticeImg:any;
  newNotice;
  editNoticeForm;
  swal:any;
  expireon;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  files: any;
  url = [];
  commentUrl = [];
  path = config.baseMediaUrl;
  noticeid;


  ngOnInit() {
    this.getAllNotice();
    // this.getDetails(this.noticeid);
    this.createEditNoticeForm();
    $(document).ready(function(){
      setTimeout(function () {
        $('.grid').masonry({
          itemSelector: '.grid-item'
        });
      }, 2000);
    });
  }

  getAllNotice(){

    this._projectservice.getNotice().subscribe((res:any)=>{
      console.log("response====>>>",res);
      this.allNotice=res;
      console.log("all notice===>>>",this.allNotice);
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
  
  createEditNoticeForm(){
    this.editNoticeForm = new FormGroup({
      title : new FormControl(''),
      desc : new FormControl(''),
      published : new FormControl(''),
      expireon :new FormControl(''),
      image : new FormControl(''),
    })
  }

  updateNotice(editNoticeForm, noticeId){
    console.log("noticeId", noticeId);
    console.log("update Notice =====>",editNoticeForm);
    console.log("fdf============",this.files);
    let data = new FormData();
    data.append('title', editNoticeForm.title?editNoticeForm.title:"");
    data.append('desc', editNoticeForm.desc?editNoticeForm.desc:"");
    data.append('expireon', editNoticeForm.expireon?editNoticeForm.expireon:"");
    data.append('published', editNoticeForm.published?editNoticeForm.published:"");
    if(this.files && this.files.length>0){
      for(var i=0;i<this.files.length;i++){
        data.append('image', this.files[i]);
      }
    }
    this._projectservice.updateNoticeWithFile(data, noticeId).subscribe((res:any)=>{
      $('#editmodel').modal('hide');
      this.getAllNotice();
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

  noticeById(noticeid){

    this._projectservice.getNoticeById(noticeid).subscribe((res:any)=>{
      console.log("response====>>>",res);
      this.singlenotice=res;
      console.log("all notice===>>>", this.singlenotice);
      console.log("all notice===>>>", this.singlenotice.images);
      this.noticeImg = this.singlenotice.images
      this.path = config.baseMediaUrl;
      console.log("base",this.path); 
    },err=>{
      console.log(err);    
    })
  }

  changeFile(event, option){
    _.forEach(event.target.files, (file:any)=>{
      console.log(event.target.files);
      this.files = event.target.files;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e:any) => {
        if(option == 'item')
          this.url.push(e.target.result);
        if(option == 'image')
          this.url.push(e.target.result);
      }
    })  
  }
  removeAvatar(file, index){
    console.log(file, index);
    this.url.splice(index, 1);
    if(this.files && this.files.length)
      this.url.splice(index,1);
    console.log(this.files);

  }

  deleteNoticeImage(file, index){
    console.log(index);
    this.noticeImg.splice(_.findIndex(this.noticeImg, index), 1);
    if(this.files && this.files.length)
      this.noticeImg.splice(_.findIndex(this.noticeImg, index), 1);
    // this._projectservice.updateNotice(this.noticeImg).subscribe((res:any)=>{
      //   console.log(res);
      //   this.getAllNotice();
      // })
    }
  }

