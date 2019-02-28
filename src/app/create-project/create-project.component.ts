import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
   addForm:FormGroup; 
  constructor(public router:Router, public _projectservice:ProjectService) { 

    this.addForm = new FormGroup({
      projecttitle: new FormControl(''),
      projecttalias: new FormControl(''),
      description: new FormControl(''),
    });


  }

  ngOnInit() {
  }
  view_Project(addForm){
console.log(addForm);
  	// this.router.navigate(['/view-project'])

  }
}
