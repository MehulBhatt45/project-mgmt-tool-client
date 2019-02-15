import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';


@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  project;
  constructor(public router:Router, public _projectservice:ProjectService) { }

  ngOnInit() {

    this._projectservice.getProject().subscribe(res=>{
      console.log(res);
      this.project = res;
    },err=>{
      console.log(err);
    })



  }
  createProject(){
  	this.router.navigate(['/create-project']);
  }

   editProject(){
  	this.router.navigate(['/edit-project']);
  }

  addTeam(){
    this.router.navigate(['/add-team']);
  }
}


