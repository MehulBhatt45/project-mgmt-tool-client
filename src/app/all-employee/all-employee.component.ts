import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AlertService } from '../services/alert.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { config } from '../config';
declare var $ : any;
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-all-employee',
	templateUrl: './all-employee.component.html',
	styleUrls: ['./all-employee.component.css']
})
export class AllEmployeeComponent implements OnInit {
	developers;
	developer;
	userId;
	loader:boolean=false;
	path = config.baseMediaUrl;
	addEmployeeForm;
	files: Array<File> = [];
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
	
	constructor(private formBuilder: FormBuilder, private _loginService: LoginService,private route: ActivatedRoute,public _alertService: AlertService,
		private router: Router, public _projectService: ProjectService) { }

	ngOnInit() {
		this.getAllDevelopers();
		this.loader=true;
		$('.datepicker').pickadate();
		// this.getAllUser();
	}
	addFile(event){
		this.files.push(event.target.files[0]);
	}
	getInitialsOfName(name){
		if(name != 'admin'){
			var str = name.split(' ')[0][0]+name.split(' ')[1][0];
			return str.toUpperCase();
		}else if(name == 'admin'){
			return "A";
		}else{
			return "";
		}
	}
	
	getAllDevelopers(){
		this._projectService.getAllDevelopers().subscribe(res=>{
			this.developers = res;
			console.log("dev()()",this.developers);
			// this.addEmployeeForm = res;
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
		setTimeout(()=>{
			console.log("rotate js--------------------")
			$('a.rotate-btn').click(function () {
				$(this).parents(".card-rotating").toggleClass('flipped');
			});
		},2000);
	}

	deleteEmployee(developerid){
		console.log("msgggg--=--",developerid);

		this._projectService.deleteEmployeeById(developerid).subscribe(res=>{
			Swal.fire({type: 'success',title: 'Employee Deleted Successfully',showConfirmButton:false,timer: 2000})
			console.log("delete{}{}{}{}",res);
			this.getAllDevelopers();
		},err=>{
			console.log("errr=-=-=-= ",err);
			Swal.fire('Oops...', 'Something went wrong!', 'error')
		})
	}

}
