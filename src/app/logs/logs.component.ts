import { Component, OnInit , HostListener} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ProjectService } from '../services/project.service';
@Component({
	selector: 'app-logs',
	templateUrl: './logs.component.html',
	styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
	logFinalStep;
	project;
	projectName;
	projectId;
	memberId;
	logFunctionSwap;
	loader:boolean = false;
	teams = [];
	finalArray = [
	{
		"type": "bug",
		"timeLog": [
		]
	},
	{
		"type": "issue",
		"timeLog": [
		]
	},
	{
		"type": "task",
		"timeLog": [
		]
	}
	];
	
	constructor(public _route: ActivatedRoute , public _projectService: ProjectService) {
		this._route.params.subscribe(params => {
			this.projectId = params['projectId'];
			this.memberId = params['memberId'];
			console.log("ProjectId  ======>" , this.projectId);
			console.log("MemberId  ======>" , this.memberId);
		});
	}

	ngOnInit() {
		this.getAllProjects();
	}
	getAllProjects(){
		this.loader = true;
		setTimeout(()=>{
		if(this.projectId && !this.memberId){
			this._projectService.getProjectById(this.projectId).subscribe((res:any)=>{
				console.log("this.logFunctionSwap == true CORRECT============>" , res);
				for(var i = 0; i < res.Teams.length; i++){
					this.teams.push(res.Teams[i]);
				}
				console.log("teams ========>" , this.teams);
				localStorage.setItem("logFunctionSwap" , JSON.stringify(true));
				this.logFunctionSwap = true;
				
				localStorage.setItem("logFinalStep" , JSON.stringify(false));
				this.logFinalStep = false;	
				
				this.loader = false;
				// this.projectId = null;
			},err=>{
				console.log("this.logFunctionSwap == true ERROR============>" , err);
				this.loader= false;
			})

		}
		else if(this.memberId){
			this._projectService.getlogs(this.memberId).subscribe((res:any)=>{
				console.log("logs of member ======>" , res);
				console.log("res.data.bug.timelog.length ====>" , res.data.bug[0].timelog.length);
				for(var i = 0; i < res.data.bug[0].timelog.length ; i++){
					if(res.data.bug[0].timelog[i].operatedBy == this.memberId){
						console.log("matched");
						if(res.data.bug[0].timelog[i] == null){
							var index = 0;
							this.finalArray.splice(index , 1);	
						}
						else{
							this.finalArray[0].timeLog.push(res.data.bug[0].timelog[i]);  
						}
						
					}
				}
				for(var i = 0; i < res.data.issue[0].timelog.length ; i++){
					if(res.data.issue[0].timelog[i].operatedBy == this.memberId){
						console.log("matched");
						console.log(res.data.issue[0].timelog[i]);
						if(res.data.issue[0].timelog[i] == null){
							var index = 1;
							this.finalArray.splice(index , 1);	
						}
						else{
							this.finalArray[1].timeLog.push(res.data.issue[0].timelog[i]);  
						}
					}
				}
				for(var i = 0; i < res.data.task[0].timelog.length ; i++){
					if(res.data.task[0].timelog[i].operatedBy == this.memberId){
						console.log("matched");
						this.finalArray[2].timeLog.push(res.data.task[0].timelog[i]);
					}
				}
				console.log("this is final array ======>" , this.finalArray);
				localStorage.setItem("logFinalStep" , JSON.stringify(true));
				this.logFinalStep = true;
				localStorage.setItem("logFunctionSwap" , JSON.stringify(false));
				this.logFunctionSwap = false;
			},(err:any)=>{
				console.log("error in logs of member ======>" , err);
				
			})
		}
		else{

			this._projectService.getProjects().subscribe(res=>{
				console.log("res in logs ==========>" , res);
				this.projectName = res;
				console.log("this project Name =============>" , this.projectName);
				localStorage.setItem("logFunctionSwap" , JSON.stringify(false));
				this.logFunctionSwap = false;
				localStorage.setItem("logFinalStep" , JSON.stringify(false));
				this.logFinalStep = false;
				this.loader = false;
				
			},err=>{
				console.log("error ========>" , err);
				this.loader = false;
				
			})
		}
		},1000);
	}

}
