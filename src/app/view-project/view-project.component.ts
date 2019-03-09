import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';
import {AlertService} from '../services/alert.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
declare var $ : any;
import * as _ from 'lodash';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  projects;
  addForm:FormGroup; 
  files:FileList;
  url = '';
  loader:boolean=false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  constructor(public router:Router, public _projectservice:ProjectService, public _alertService: AlertService) {
    this.addForm = new FormGroup({
      title: new FormControl('', Validators.required),
      desc: new FormControl(''),
      uniqueId: new FormControl('' , Validators.required),
      clientEmail: new FormControl('' , Validators.required),
      clientFullName: new FormControl('', Validators.required),
      clientContactNo: new FormControl('',Validators.required),
      clientDesignation: new FormControl(''),
      avatar: new FormControl('')
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
    // return name.split(' ')[0][0]+name.split(' ')[1][0];
  }

  addProject(addForm){
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
    data.append('pmanagerId', JSON.parse(localStorage.getItem('currentUser'))._id);
    this._projectservice.addProject(data).subscribe((res:any)=>{
      console.log(res);
      console.log("addproject2 is called");
    },err=>{
      console.log(err);    
    }) 
  }

  openDropdown(){
    if (this.currentUser.userRole=='projectManager') {
      $('.dropdown-toggle').dropdown();
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
      reader.onload = (event:any) => { // called once readAsDataURL is completed
        this.url = event.target.result;

      }
    }
  }

}


