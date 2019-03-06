import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.css']
})
export class NoticeboardComponent implements OnInit {

  constructor(public router:Router, public _projectservice:ProjectService) { }
  notice:any;

  ngOnInit() {
  	this.getAllNotice();
  }

  getAllNotice(){

		this._projectservice.getNotice().subscribe((res:any)=>{
			console.log(res);
			this.notice = res;
		},err=>{
			console.log(err);    
		})
	}

}
