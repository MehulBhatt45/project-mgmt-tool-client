import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {ProjectService} from '../services/project.service';
import { AlertService } from '../services/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $ : any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-leave-app',
  templateUrl: './all-leave-app.component.html',
  styleUrls: ['./all-leave-app.component.css']
})
export class AllLeaveAppComponent implements OnInit {
  tracks:any;
  leaves;
  leaveApp;
  acceptedLeave;
  rejectedLeave;

  developers;
  developerId;
  // projectTeam;
  // Teams;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  selectedDeveloperId = "all";
  // apps;

  constructor(public router:Router, public _projectservice:ProjectService,public _projectService: ProjectService,
    public _alertService: AlertService,private route: ActivatedRoute) { 

  }

  ngOnInit() {
    this.getLeaves();
    this.leavesByUserId();
    this.getAllDevelopers();

    
  }

  getLeaves(){
  	this._projectservice.pendingLeaves().subscribe(res=>{
  		console.log("data avo joye==========>",res);
  		this.leaveApp = res;
      _.forEach(this.leaveApp , (leave)=>{
        leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
        leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
      })
      //this.dueDate = moment().add({days:task.dueDate,months:0}).format('YYYY-MM-DD HH-MM-SS'); 
      console.log("applicationsss==>",this.leaveApp);
    },err=>{
      console.log(err);
    })

  }
  // getLeaves(){
    //   this._projectservice.pendingLeaves().subscribe(res=>{
      //     console.log("data avo joye==========>",res);
      //     this.leaveApp = res;
      //     _.forEach(this.leaveApp , (leave)=>{
        //       this.leaves.startingDate.sort(custom_sort);
        //       this.leaves.startingDate.reverse();
        //       leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
        //       leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
        //     })
        //     //this.dueDate = moment().add({days:task.dueDate,months:0}).format('YYYY-MM-DD HH-MM-SS'); 
        //     console.log("applicationsss==>",this.leaveApp);
        //   },err=>{
          //     console.log(err);
          //   })
          //   function custom_sort(a, b) {
            //     return new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime();
            //   }
            // }
            leaveAccepted(req){
              var body;
              console.log("dsfdsbgfdf",this.leaveApp);
              console.log("reeeeeeee",req);
              _.forEach(this.leaveApp, (apply)=>{
                if(apply._id == req){
                  body = apply;
                }
              })
              body.status = "approved";
              console.log("bodyyyyyyyyyyyyyyy",body);
              this._projectservice.leaveApproval(req, body).subscribe((res:any)=>{

                console.log("respondsssssss",res);
                this.acceptedLeave = res;
                console.log("acceptedd===========>",this.acceptedLeave);
              },(err:any)=>{
                console.log(err);
              })
            }
            

            leaveRejected(req){
              var body;
              console.log("rejected",this.leaveApp);
              console.log("gtgt",req);
              _.forEach(this.leaveApp, (apply)=>{
                if(apply._id == req){
                  body = apply;
                }
              })
              body.status = "rejected";
              console.log("body",body);
              this._projectservice.leaveApproval(req, body).subscribe((res:any)=>{

                console.log("response",res);
                this.rejectedLeave = res;
                console.log("rejected===========>",this.rejectedLeave);
              },(err:any)=>{
                console.log(err);
              })
            }


            leavesByUserId(){
              var obj ={ email : JSON.parse(localStorage.getItem('currentUser')).email};
              console.log("email of login user",obj);
              this._projectservice.leavesById(obj).subscribe((res:any)=>{
                console.log("resppppppondssss",res);
                this.leaves = res;
                _.forEach(this.leaves , (leave)=>{
                  leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
                  leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
                })
                console.log("statussssssss",this.leaves);
              },err=>{
                console.log(err);
              })
            }

            statusOfLeave(){
              this._projectservice.pendingLeaves().subscribe(res=>{
                console.log("data is ============>",res);
                this.leaveApp = res;
                _.forEach(this.leaveApp , (leave)=>{
                  leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
                  leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
                })
                //this.dueDate = moment().add({days:task.dueDate,months:0}).format('YYYY-MM-DD HH-MM-SS'); 
                console.log("applicationsss==>",this.leaveApp);
              },err=>{
                console.log(err);
              })

            }
            statusOfLeaveForAdmin(leave){
              var obj ={ email : JSON.parse(localStorage.getItem('currentUser')).email};
              console.log("email of login user",obj);
              console.log("current User is");
              this._projectservice.getAllLeaves().subscribe(res=>{
                console.log("all data==========>",res);
                this.leaveApp = res;
                _.forEach(this.leaveApp , (leave)=>{
                  leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
                  // let _sortedDates = leave.startingDate.sort(function(a, b){
                    //   return moment(b).format('YYYY-MM-DD')- moment(a).format('YYYY-MM-DD')
                    // });
                    // leave.startingDate.sort(function(a, b) {
                      //     a = new leave.startingDate(a.dateModified).format('YYYY-MM-DD');
                      //     b = new leave.startingDate(b.dateModified).format('YYYY-MM-DD');
                      //     return a>b ? -1 : a<b ? 1 : 0;
                      //   });
                      // console.log("change date=============>",leave.startingDate);
                      leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
                    })
                console.log("statussssssss",this.leaves);
                console.log("applicationsss==>",this.leaveApp);
              },err=>{
                console.log(err);
              })


            }

          





          getAllDevelopers(){
            this._projectService.getAllDevelopers().subscribe(res=>{
              console.log("function calling===>")
              this.developers = res;
              this.developers.sort(function(a, b){
                var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
                if (nameA < nameB) //sort string ascending
                  return -1 
                if (nameA > nameB)
                  return 1
                return 0 
              })
              console.log("Developers",this.developers);
            },err=>{
              console.log("Couldn't get all developers ",err);
              this._alertService.error(err);
            });
          }





          filterTracks(developerId){
            console.log("this . leave app =======>" , this.leaveApp);

            console.log("this . leaves =======>" , this.leaves);
            console.log("filter====>");
            this.selectedDeveloperId = developerId;
            console.log(developerId);
            if( developerId!='all'){
              this.leaveApp = [];
              $('.unselected').css('display','block');
              $('.selected').css('display','none');
              console.log("sucess");
              _.forEach(this.leaves , (leave)=>{
                if(developerId == leave.email ){
                  console.log(leave);
                  $('.unselected').css('display','none');
                  $('.selected').css('display','block');
                  this.leaveApp.push(leave);
                }
              });
            }else{
              console.log("not found");
            }

          }



        }



