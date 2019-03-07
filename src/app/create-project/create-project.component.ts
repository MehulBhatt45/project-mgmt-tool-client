import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { config } from '../config';
declare var $:any;

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  files:FileList;
  addForm:FormGroup;
  url = '';
  constructor(public router:Router, public _projectservice:ProjectService) { 

    this.addForm = new FormGroup({
      title: new FormControl('', Validators.required),
      desc: new FormControl(''),
      clientEmail: new FormControl('' , Validators.required),
      clientFullName: new FormControl('', Validators.required),
      clientContactNo: new FormControl('',Validators.required),
      clientDesignation: new FormControl(''),
      avatar:new FormControl('')
    });

  }

  ngOnInit() {
  }
  
  addProject(addForm){
    if(this.files && this.files.length){
      this.addForm.value['pmanagerId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
      console.log("form value=====>>>",addForm.value);
      this._projectservice.addProject_With_image(addForm.value,this.files).subscribe((res:any)=>{
        console.log(res);
      },err=>{
        console.log(err);    
      }) 
    }
    else{
      this.addForm.value['pmanagerId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
      this._projectservice.addProject_Without_image(addForm.value).subscribe((res:any)=>{
        console.log(res);
        console.log("addproject2 is called");
      },err=>{
        console.log(err);    
      }) 
    }
  }

  addIcon(value){
    this.addForm.value['avatar'] = value;
    console.log(this.addForm.value['avatar']);
     this.url = 'http://localhost/project_mgmt_tool/server'+this.addForm.value['avatar'];
    $('#basicExampleModal').modal('hide');
  }
  
  onSelectFile(event) {
    console.log("response from changefile",event.target.files);
    this.files = event.target.files;
    $('#basicExampleModal').modal('hide');
    if (event.target.files && event.target.files[0]) {

      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;

      }
    }
  }

}

