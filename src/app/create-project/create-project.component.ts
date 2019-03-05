import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  files:FileList;
  addForm:FormGroup;
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
      this._projectservice.addProject(addForm.value, this.files).subscribe((res:any)=>{
        console.log(res);
        },err=>{
          console.log(err);    
        }) 
    }
    else{
      this.addForm.value['pmanagerId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
      this._projectservice.addProject2(addForm.value).subscribe((res:any)=>{
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
  }

  changeFile(e){
    console.log("response from changefile",e.target.files);
    this.files = e.target.files;
  }

}

