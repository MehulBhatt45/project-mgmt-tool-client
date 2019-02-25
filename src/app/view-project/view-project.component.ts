import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjectService} from '../services/project.service';


@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  projects;
  
  constructor(public router:Router, public _projectservice:ProjectService) { }

  ngOnInit() {
    this._projectservice.getProjects().subscribe(res=>{
      console.log(res);
      this.projects = res;
    },err=>{
      console.log(err);
    })
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

  
}


