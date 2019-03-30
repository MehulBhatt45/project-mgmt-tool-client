import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
// import {ProjectService} from '../services/project.service';
import{LeaveService} from '../services/leave.service';
import { AlertService } from '../services/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $ : any;
import Swal from 'sweetalert2';
import { config } from '../config';
import { Chart } from 'chart.js';
import {SearchTaskPipe} from '../search-task.pipe';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-all-leave-app',
  templateUrl: './all-leave-app.component.html',
  styleUrls: ['./all-leave-app.component.css']
})
export class AllLeaveAppComponent implements OnInit {
  allLeaves;
  leaves;
  leaveApp;
  acceptedLeave;
  rejectedLeave;
  developers;
  developer;
  developerId;
  leavescount:any;
  leavesToDisplay: boolean = true;
  approvedLeaves;
  rejectedLeaves;
  appLeaves;
  rejeLeaves;
  comments;
  singleleave:any;
  flag;
  fileUrl;
  filteredLeaves = [];
  // projectTeam;
  // Teams;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  selectedDeveloperId = "all";
  selectedStatus:any;
  comment;
  leaveid;

  path = config.baseMediaUrl;
  // apps;
  constructor(public router:Router, public _leaveService:LeaveService,
    public _alertService: AlertService,private route: ActivatedRoute,public searchTextFilter:SearchTaskPipe) { 

  }
  getEmptytracks(){

    this.leavescount = [
    {
      "typeOfLeave" : "sickleave",
      "leavesTaken" : Number()
    },
    {
      "typeOfLeave" : "personalleave",
      "leavesTaken" : Number()
    },
    {
      "typeOfLeave" : "leavewithoutpay",
      "leavesTaken" : Number()
    },
    {
      "typeOfLeave" : "emergencyleave",
      "leavesTaken" : Number()
    },
    {
      "leavesPerYear" : 18,
      "leavesLeft" : 18 
    }  
    ]
    console.log("leaves+++++++++++++++=",this.leavescount);
  }
  ngOnInit() {
    this.getLeaves();
    this.leavesByUserId();
    this.getAllDevelopers();
    // this.route.params.subscribe(param=>{
      //   this.developerId = param.id;
      //   this.leavesByUserId(this.developerId);
      // })
    // this.filterTracks(developerId);

  // }

  // getApprovedLeaves(){
  //   this._leaveService.approvedLeaves().subscribe(res=>{
  //     console.log("approved leaves",res);
  //     this.leaveApp = res;
  //     $('#statusAction').hide();
  //     _.map(this.leaveApp, leave=>{
  //       _.forEach(this.developers, dev=>{
  //         if(leave.email == dev.email){
  //           leave['dev']= dev;
  //         }

      // this.filterTracks(developerId);
    }
    getApprovedLeaves(){
      this._leaveService.approvedLeaves().subscribe(res=>{
        console.log("approved leaves",res);
        this.leaveApp = res;
        $('#statusAction').hide();
        _.map(this.leaveApp, leave=>{
          _.forEach(this.developers, dev=>{
            if(leave.email == dev.email){
              leave['dev']= dev;
            }
          })
        })
        _.forEach(this.leaveApp, (approved)=>{
          approved.startingDate = moment(approved.startingDate).format('YYYY-MM-DD');
          approved.endingDate = moment(approved.endingDate).format('YYYY-MM-DD');
        })
      })

    }
    getRejectedLeaves(){
      this._leaveService.rejectedLeaves().subscribe(res=>{
        console.log("rejected leaves",res);
        this.leaveApp = res;
        $('#statusAction').hide();
        _.map(this.leaveApp, leave=>{
          _.forEach(this.developers, dev=>{
            if(leave.email == dev.email){
              leave['dev']= dev;
            }
          })
        })
      _.forEach(this.leaveApp, (rejected)=>{
        rejected.startingDate = moment(rejected.startingDate).format('YYYY-MM-DD');
        rejected.endingDate = moment(rejected.endingDate).format('YYYY-MM-DD');
      })
      this.rejeLeaves = this.leaveApp;
      console.log("rejected leaves",this.leaveApp);
    },err=>{
      console.log(err);
    })
  }




  getLeaves(){
    this._leaveService.pendingLeaves().subscribe(res=>{
      this.leaveApp = res;
      console.log("data avo joye==========>",this.leaveApp);
      $('#statusAction').show();
      _.map(this.leaveApp, leave=>{
        _.forEach(this.developers, dev=>{
          if(leave.email == dev.email){
            leave['dev']= dev;
          }
        })
      })
      _.forEach(this.leaveApp , (leave)=>{
        leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
        leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
      });

      this.allLeaves = this.leaveApp; 
      console.log("applicationsss==>",this.leaveApp);

      this.getEmptytracks();
      var ctxP = document.getElementById("pieChart");
      var myPieChart = new Chart(ctxP, {
        type: 'pie',
        data: {
          labels: [ "Personal Leave","Sick leave(Illness or Injury)","Emergency leave","Leave without pay"],
          datasets: [{
            data: this.getLeaveCount(this.leaveApp),
            backgroundColor: ["#008000", "#ff8100", "#ff0000", "#3385ff"],
            hoverBackgroundColor: ["lightgray", "lightgray", "gray", "gray"]
          }]
        },
        options: {
          responsive: true,
          legend:{
            position:"right",
            labels:{
              boxWidth:12
            }
          }
        }
      });

      var ctxP = document.getElementById("pieChart1");
      var myPieChart = new Chart(ctxP, {
        type: 'pie',
        data: {
          labels: ["Half Day", "Full Day", "More Day"],
          datasets: [{
            data:this.getLeaveDuration(this.leaveApp),
            backgroundColor: ["#ff0000", "#ff8100", "#005ce6"],
            hoverBackgroundColor: ["lightgray", "lightgray", "gray"]
          }]
        },

        options: {
          responsive: true,
          legend:{
            position:"right",
            labels:{
              boxWidth:12,
              // usePointStyle:true,
            }
          }
        }
      });
    },err=>{
      console.log(err);
    });

    
  }

  getLeaveCount(leaves){
    console.log(leaves);
    var Personal_Leave :any= [];
    var Sick_Leave :any= [];
    var Emergency_Leave :any= [];
    var Leave_WithoutPay :any= [];
    _.forEach(leaves,(leave)=>{
      switch (leave.typeOfLeave) {
        case "Personal_Leave":
        Personal_Leave.push(leave);
        break;
        case "Sick_Leave":
        Sick_Leave.push(leave);
        break;
        case "Emergency_Leave":
        Emergency_Leave.push(leave);
        break;
        case "Leave_WithoutPay":
        Leave_WithoutPay.push(leave);
        break;
      }
    });
    console.log(Personal_Leave.length, Sick_Leave.length, Emergency_Leave.length, Leave_WithoutPay.length);
    return [ Personal_Leave.length, Sick_Leave.length, Emergency_Leave.length, Leave_WithoutPay.length ];
  }


  getLeaveDuration(leaves){
    console.log(leaves);
    var Half_Day = [];
    var Full_Day = [];
    var More_Day = [];
    _.forEach(leaves,(leave)=>{
      switch (leave.leaveDuration) {
        case "0.5":
        Half_Day.push(leave);
        break;
        case "1":
        Full_Day.push(leave);
        break;
        default :
        More_Day.push(leave);
        break; 
      }
    })
    return [Half_Day.length,Full_Day.length,More_Day.length];
  }



  getFilteredLeaves(){
    switch (this.selectedStatus) {
      case "pending":
      this.getLeaves();
      break;
      case "approved":
      this.getApprovedLeaves();
      break;
      case "rejected":
      this.getRejectedLeaves();
      break;        
      default:
      console.log("DEFAULT CASE");
      break;
    }
  }



    getAllDevelopers(){
      this._leaveService.getAllDevelopers().subscribe(res=>{
        console.log("function calling===>")
        this.developers = res;
        // this.developers.sort(function(a, b){
          //   var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
          //   if (nameA < nameB) //sort string ascending
          //     return -1 
          //   if (nameA > nameB)
          //     return 1
          //   return 0 
          // })

        _.map(this.leaveApp, leave=>{
          _.forEach(this.developers, dev=>{
            if(leave.email == dev.email){
              leave['dev']= dev;
            }
          })
        })
        console.log("Developers",this.leaveApp);
      },err=>{
        console.log("Couldn't get all developers ",err);
        this._alertService.error(err);
      })
    }

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
      this._leaveService.leaveApproval(req, body).subscribe((res:any)=>{

        console.log("respondsssssss",res);
        this.acceptedLeave = res;
        console.log("acceptedd===========>",this.acceptedLeave);
      },(err:any)=>{
        console.log(err);
      })
      Swal.fire({
        title: 'Are you sure?',
        text: "Leaves Left: "+this.leavescount[4].leavesLeft,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Approve it!'
      }).then((result) => {
        if (result.value) {
          var body;
          console.log("dsfdsbgfdf",this.leaveApp);
          console.log("reeeeeeee",req);
          _.forEach(this.leaveApp, (apply)=>{
            if(apply._id == req){
              body = apply;
              body.status = "approved";
            }
          })
          console.log("req ========>" , req);
          console.log("bodyy ========>" , body);
          this._leaveService.leaveApproval(req, body).subscribe((res:any)=>{
            Swal.fire(
              'Approve!',
              'Your Leave has been Approve.',
              'success'
              )
            body.status = "approved";
            console.log("bodyyyyyyyyyyyyyyy",body);
            console.log("respondsssssss",res);
            this.acceptedLeave = res;
            console.log("acceptedd===========>",this.acceptedLeave);
            this.getLeaves();
          },(err:any)=>{
            console.log(err);
            Swal.fire('Oops...', 'Something went wrong!', 'error')
          })
        }
      })
  }



    leaveRejected(req){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Reject it!'
      }).then((result) => {
        if (result.value) {
          var body;
          console.log("rejected",this.leaveApp);
          console.log("reeeeeeee",req);
          _.forEach(this.leaveApp, (apply)=>{
            if(apply._id == req){
              body = apply;
              body.status = "rejected";
            }
          })
          console.log("req ========>" , req);
          console.log("bodyy ========>" , body);
          this._leaveService.leaveApproval(req, body).subscribe((res:any)=>{
            Swal.fire(
              'Rejected!',
              'Your Leave has been Rejected.',
              'success'
              )
            body.status = "rejected";
            console.log("bodyyyyyyyyyyyyyyy",body);
            console.log("respondsssssss",res);
            this.rejectedLeave = res;
            console.log("rejected===========>",this.rejectedLeave);
            this.getLeaves();
          },(err:any)=>{
            console.log(err);
            Swal.fire('Oops...', 'Something went wrong!', 'error')
          })
        }
      })
    }

  filterTracks(developerId){
    this.getEmptytracks();
    var obj ={ email : developerId};
    console.log("email of login user",obj);
    this._leaveService.leavesById(obj).subscribe((res:any)=>{
      console.log("resppppppondssss",res);
      this.leaves = res;
      _.forEach(this.leaves , (leave)=>{
        leave.startingDate = moment(leave.startingDate).format('YYYY-MM-DD');
        leave.endingDate = moment(leave.endingDate).format('YYYY-MM-DD');
      })
      console.log("statussssssss",this.leaves);
      if( developerId!='all'){
        this.leaveApp = [];
        $('.unselected').css('display','block');
        $('.selected').css('display','none');
        console.log("sucess");
        _.forEach(this.leaves , (leave)=>{
          console.log("dsfbbdsf",leave);
          if(developerId == leave.email ){
            console.log(leave);
            $('.unselected').css('display','none');
            $('.selected').css('display','block');
            this.leaveApp.push(leave);
          }
        });

          _.forEach(this.leaves , (leave)=>{
            _.forEach(this.leavescount , (count)=>{
              if(count.typeOfLeave == leave.typeOfLeave){
                count.leavesTaken = count.leavesTaken + 1;
              }

            });
          });
          console.log( this.leavescount[4].leavesLeft = this.leavescount[4].leavesLeft-(this.leavescount[3].leavesTaken+this.leavescount[2].leavesTaken+this.leavescount[1].leavesTaken+this.leavescount[0].leavesTaken));
          console.log("leaves count ====>" , this.leavescount);
        }else{
          console.log("not found");
        }
      },err=>{
        console.log(err);
      })
      
    }

    addComment(comment){
      console.log("data=====>>",comment);
    }

  //   leaveById(leaveid){
  //     console.log("leave id=======>>",leaveid);
  //     this._leaveService.getbyId(leaveid).subscribe((res:any)=>{
  //       this.singleleave = res[0];
  //       console.log("single leave",this.singleleave);
  //     },err=>{
  //       console.log("errrrrrrrrrrrrr",err);
  //     })
  //   }
  //       console.log( this.leavescount[4].leavesLeft = this.leavescount[4].leavesLeft-(this.leavescount[3].leavesTaken+this.leavescount[2].leavesTaken+this.leavescount[1].leavesTaken+this.leavescount[0].leavesTaken));
  //       console.log("leaves count ====>" , this.leavescount);
  //     }else{
  //       console.log("not found");
  //     }
  //   },err=>{
  //     console.log(err);
  //   })
  // }
  sortLeavesByFromDate(type){

    console.log("Sorting tasks by = ",type)
    // console.log(this.pendingLeaves);
    // console.log('leave===============================>',this.pendingLeaves);
    this.leaveApp.sort(custom_sort);
    if(type == 'desc'){
      this.leaveApp.reverse();
    }
    console.log("sorted output =><>?????)_)_)_ ",this.leaveApp);
function custom_sort(a, b) {

  return new Date(new Date(a.startingDate)).getTime() - new Date(new Date(b.startingDate)).getTime();
}
console.log("nthi avtu=======>",custom_sort);
}
onKey(searchText){
  console.log("searchText",searchText);
  console.log(this.allLeaves);
  var dataToBeFiltered = [this.allLeaves];
  console.log('dataToBeFiltered===================>',dataToBeFiltered);
  var leave = this.searchTextFilter.transform2(dataToBeFiltered, searchText);
  console.log("In Component",leave);
  this.leaveApp = [];
  _.forEach(leave, (content)=>{
    this.leaveApp.push(content);
  });
}



leavesByUserId(){
  var obj ={ email : JSON.parse(localStorage.getItem('currentUser')).email};
  console.log("email of login user",obj);
  this._leaveService.leavesById(obj).subscribe((res:any)=>{
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

// addComment(comment){
//   console.log("data=====>>",comment);
// }

leaveById(leaveid){
  console.log("leave id=======>>",leaveid);
  this._leaveService.getbyId(leaveid).subscribe((res:any)=>{
    this.singleleave = res[0];
    console.log("single leave",this.singleleave);
  },err=>{
    console.log("errrrrrrrrrrrrr",err);
  })

}

submitComment(leaveid,comment){
  console.log("leave id==>>>>>",leaveid);
  console.log("====>",comment);
  var data={
    leaveId:leaveid,
    comment:comment

  }
  console.log("data==========>>",data);
  this._leaveService.addComments(data).subscribe((res:any)=>{
    res['comment'] = true; 
    console.log("response",res);
    Swal.fire({type: 'success',title: 'Comment Added Successfully',showConfirmButton:false,timer: 2000})
    $('#centralModalInfo').modal('hide');
  },err=>{
    console.log("errrrrrrrrrrrrr",err);
    Swal.fire('Oops...', 'Something went wrong!', 'error')
  })
}

}


