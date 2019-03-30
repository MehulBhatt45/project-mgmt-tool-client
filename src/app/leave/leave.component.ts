import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { NgModule } from '@angular/core';
import{LeaveService} from '../services/leave.service';
import Swal from 'sweetalert2';
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
	files: Array<File> = [];
	showOneDays;
	showMoreDayss;
	leaveDuration;
	startDate;
	currentUser = JSON.parse(localStorage.getItem('currentUser'));


	constructor(public router:Router, public _leaveService:LeaveService) {
		this.addForm = new FormGroup({
			email: new FormControl (''),
			name: new FormControl (''),
			leaveDuration : new FormControl (''),
			typeOfLeave : new FormControl (''),
			reasonForLeave : new FormControl ('', Validators.required),
			startingDate: new FormControl (''),
			noOfDays: new FormControl(''),
			endingDate: new FormControl (''),
			singleDate: new FormControl(''),
			attechment: new FormControl('')
		})
	}

	ngOnInit() {

		// Date Picker Valadation Start Here

		$('.datepicker').pickadate({ 
			min: new Date(),
		})
		var from_input = $('#startDate').pickadate(),
		from_picker = from_input.pickadate('picker')
		var to_input = $('#endDate').pickadate(),
		to_picker = to_input.pickadate('picker')
		if ( from_picker.get('value') ) {
			to_picker.set('min', from_picker.get('select'))
		}
		if ( to_picker.get('value') ) {
			from_picker.set('max', to_picker.get('select'))
		}
		from_picker.on('set', function(event) {
			if ( event.select ) {
				to_picker.set('min', from_picker.get('select'))
			}
			else if ( 'clear' in event ) {
				to_picker.set('min', false)
			}
		})
		to_picker.on('set', function(event) {
			if ( event.select ) {
				from_picker.set('max', to_picker.get('select'))
			}
			else if ( 'clear' in event ) {
				from_picker.set('max', false)
			}
		})

		// Date Picker Valadation End Here

		this.showMoreDayss = false;
		localStorage.setItem("showMoreDayss" , JSON.stringify(false));

		this.showOneDays = false;
		localStorage.setItem("showOneDays" , JSON.stringify(false));
	}

	addFile(event){
		this.files = event.target.files;
	}
	addLeave(form){
		form.startingDate = $('#startDate').val();
		form.singleDate = $('#startDateFor1').val();
		form.endingDate = $('#endDate').val();
		var name = JSON.parse(localStorage.getItem('currentUser')).name;
		var email = JSON.parse(localStorage.getItem('currentUser')).email;
		form['name'] = name;
		form['email'] = email;
		console.log("valueeeeeeeeeeee",form);
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
		this._leaveService.addLeave(this.addForm.value, this.files).subscribe((res:any)=>{
			Swal.fire({type: 'success',title: 'Leave Apply Successfully',showConfirmButton:false,timer: 2000})
			this.router.navigate(['./view-projects']);
			console.log("ressssssssssssss",res);


		},err=>{
			console.log(err);
			Swal.fire('Oops...', 'Something went wrong!', 'error')
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
