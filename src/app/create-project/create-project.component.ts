import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { config } from '../config';
declare var $:any;
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  files:FileList;
  addForm:FormGroup;
  url = '';
  developers: any;
  config = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description
    search: true
  };
  baseUrl = config.baseMediaUrl;
  objectsArray: any = [];
  setDate:any;
  constructor(public router:Router, public _projectservice:ProjectService,public _projectService: ProjectService,
    public _alertService: AlertService,) { 

    this.addForm = new FormGroup({
      title: new FormControl('',Validators.required),
      avatar:new FormControl('',Validators.required),
      desc: new FormControl(''),
      deadline: new FormControl(''),
      uniqueId: new FormControl('',Validators.required),
      clientEmail: new FormControl('',Validators.required),
      clientFullName: new FormControl('',Validators.required),
      clientContactNo: new FormControl('',Validators.required),
      clientDesignation: new FormControl(''),

      // avatar:new FormControl(''),
      allDeveloper:new FormControl(''),
      // Teams: new FormControl([])

      //avatar:new FormControl(''),
      //allDeveloper:new FormControl(''),
      // Teams: new FormControl([])


    });

  }

  ngOnInit() {
    this.getAllDevelopers();
    $('.datepicker').pickadate({
      onSet: function(context) {
        console.log('Just set stuff:', context);
        setDate(context);
      }
    });
    var setDate = (context)=>{
      this.timePicked();
    }
  }

  addProject(addForm){
    console.log(addForm, this.files);
    var data = new FormData();
    _.forOwn(addForm, function(value, key) {
      data.append(key, value)
    });
    if(this.files && this.files.length>0){
      for(var i=0;i<this.files.length;i++){
        data.append('uploadfile', this.files[i]);
      }
    }
    data.append('pmanagerId', JSON.parse(localStorage.getItem('currentUser'))._id);
    this._projectService.addProject(data).subscribe((res:any)=>{
      console.log(res);
      Swal.fire({type: 'success',title: 'Project Created Successfully',showConfirmButton:false,timer: 2000})
      this.addForm.reset();
      this.url = '';
      this.router.navigate(['/view-projects']);
    },err=>{
      console.log(err); 
       Swal.fire('Oops...', 'Something went wrong!', 'error')   
    }) 
  }

  timePicked(){
    this.addForm.controls.deadline.setValue($('.datepicker').val())
  }

  addIcon(value){
    this.addForm.value['avatar'] = value;
    console.log(this.addForm.value['avatar']);
    this.url = this.baseUrl+this.addForm.value['avatar'];
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

  getAllDevelopers(){
    this._projectService.getAllDevelopers().subscribe(res=>{
      this.developers = res;
      this.developers.sort(function(a, b){
        var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1 
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      })
      console.log("Developers",this.developers);
    },err=>{
      console.log("Couldn't get all developers ",err);
      this._alertService.error(err);
    })
  }

  removeAvatar(){
    this.url = "";
    if(this.files && this.files.length)
      this.files = null;
  }
}