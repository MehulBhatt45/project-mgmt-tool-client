import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() {
  }

  view_Project(){

  	this.router.navigate(['./view-project']);

  }

}
