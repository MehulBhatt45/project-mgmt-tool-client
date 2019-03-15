import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

import {ProjectService} from '../services/project.service';



declare var $ : any;




@Component({
	selector: 'app-leave',
	templateUrl: './leave.component.html',
	styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
	addForm:FormGroup;
	// stratDate;
	// endDate; 
	// durationDays;
	showOneDays;
	showMoreDayss;
	leaveDuration;

	constructor(public router:Router, public _projectservice:ProjectService) {
		this.addForm = new FormGroup({
			email: new FormControl ('',Validators.required),
			name: new FormControl ('',Validators.required),
			leaveDuration : new FormControl (''),
			typeOfLeave : new FormControl (''),
			reasonForLeave : new FormControl ('', Validators.required),
			startingDate: new FormControl (''),
			noOfDays: new FormControl(''),
			endingDate: new FormControl (''),
			singleDate: new FormControl('')
		})
	}

	ngOnInit() {
		$('.datepicker').pickadate();

		this.showMoreDayss = false;
		localStorage.setItem("showMoreDayss" , JSON.stringify(false));

		this.showOneDays = false;
		localStorage.setItem("showOneDays" , JSON.stringify(false));

		/*$('#oneDay').on('click', function(){
			if($('#moreDays').hasClass("hide")){
				$('#moreDays').removeClass("hide");
				$('.forOneDay').css('display', 'none');
			}
			else{
				$('#moreDays').addClass("hide");
				$('.forOneDay').css('display', 'block');
			}
		});
		$('#moreDays').on('click', function(){
			if($('#oneDay').hasClass("hide")){
				$('#oneDay').removeClass("hide");
				$('.forMoreDays').css('display', 'none');
			}
			else{
				$('#oneDay').addClass("hide");
				$('.forMoreDays').css('display', 'block');
			}
		})*/
	}
	addLeave(form){
		form.startingDate = $('#startDate').val();
		form.singleDate = $('#startDateFor1').val();
		form.endingDate = $('#endDate').val();
		if(form.singleDate){
			form.noOfDays = "1-day";
			console.log("single date======>",form.singleDate);
		}
		console.log("form data========>",form);
		if(form.noOfDays == "1-day"){
			form['endingDate'] = form['singleDate'];
			form['startingDate'] = form['singleDate'];
			console.log("datesssssssssssss",form);
		}else{
			form.noOfDays == "more-day"
			var date2 = new Date(form.startingDate);
			var date1 = new Date(form.endingDate);
			console.log("staring date ===" , date2);
			console.log("ending date ===" , date1);
			form['endingDate'] = date1;
			form['startingDate'] = date2;
			console.log("staring date ...... ===" , date2);
			console.log("ending date .........===" , date1);
			var timeDuration = Math.abs(date1.getTime()-date2.getTime());
			var daysDuration = Math.ceil(timeDuration/(1000 * 3600 * 24));
			console.log("daysDuration =======+>" , daysDuration);
			form['leaveDuration'] = daysDuration;
		console.log("form data======>",form);
		}
		this._projectservice.addLeave(this.addForm.value).subscribe((res:any)=>{

			console.log("ressssssssssssss",res);
		},err=>{
			console.log(err);
		})
	}
	showOneDay(){
		console.log("show one day ==>" , this.showOneDays);
		this.showMoreDayss = false;
		localStorage.setItem("showMoreDayss" , JSON.stringify(false));
		if(this.showOneDays == false){
			this.showOneDays = true;
			localStorage.setItem("showOneDays" , JSON.stringify(true));
			console.log("show one day ==>" , this.showOneDays);
		}
		else{
			this.showOneDays = false;
			localStorage.setItem("showOneDays" , JSON.stringify(false));
		}
	}
	showMoreDays(){
		$('.datepicker').pickadate();
		localStorage.setItem("showOneDays" , JSON.stringify(false));
		this.showOneDays = false;
		if(this.showMoreDayss == false){
			this.showMoreDayss = true;
			localStorage.setItem("showMoreDayss" , JSON.stringify(true));
		}
		else{
			this.showMoreDayss = false;
			localStorage.setItem("showMoreDayss" , JSON.stringify(false));
		}
	}
}
