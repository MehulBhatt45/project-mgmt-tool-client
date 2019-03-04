import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';
import {AlertService} from '../services/alert.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
declare var $ : any;
@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  projects;
  addForm:FormGroup; 
  files:FileList;
  loader:boolean=false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  constructor(public router:Router, public _projectservice:ProjectService, public _alertService: AlertService) {
    this.addForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      avatar:new FormControl('')
    });
  }

  ngOnInit() {
    this.loader=true;
    setTimeout(()=>{
      this._projectservice.getProjects().subscribe(res=>{
        console.log(res);
        this.projects = res;
        this.loader=false;
      },err=>{
        this._alertService.error(err);
        this.loader=false;
      })
    },3000);
  }

  getTitle(name){
    var str = name.split(' ');
    return str[0].charAt(0).toUpperCase() + str[0].slice(1) + ' ' + str[1].charAt(0).toUpperCase() + str[1].slice(1);
  }

  getInitialsOfName(name){
    var str = name.split(' ')[0][0]+name.split(' ')[1][0];
    return str.toUpperCase();
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

  openDropdown(){
    if (this.currentUser.userRole=='projectManager') {
      $('.dropdown-toggle').dropdown();
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


