import { Component, OnInit, ViewChild,
  TemplateRef, } from '@angular/core';
  import {Router,ActivatedRoute} from '@angular/router';
  import{AttendenceService} from '../services/attendence.service';
  import { AlertService } from '../services/alert.service';
  import{LeaveService} from '../services/leave.service';
  import { startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours
  } from 'date-fns';
  import { Subject } from 'rxjs';
  import { ProjectService } from '../services/project.service';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView
  } from 'angular-calendar';

  import * as moment from 'moment';
  import * as _ from 'lodash';
  declare var $ : any;
  import Swal from 'sweetalert2';
  import { config } from '../config';

  const colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };



  @Component({
    selector: 'app-attendence',
    templateUrl: './attendence.component.html',
    styleUrls: ['./attendence.component.css']
  })
  export class AttendenceComponent implements OnInit {
    // currentEmployeeId = JSON.parse(localStorage.getItem("currentUser"))._id;
    // currentUserName = JSON.parse(localStorage.getItem("currentUser")).name;
    // checkInStatus = JSON.parse(localStorage.getItem('checkIn'));
    logs;
    diff:any;
    maindiff=[];
    check:any;
    diffff:any;
    timediff:any;
    gate = [];
    workdifference=[];
    worktime:any;
    attedenceByDateError;
    errMessage;
    loader : boolean = false;
    userid = [];
    presentid = [];
    usercheck:any;
    presentuser:any;
    absentuser:any;
    attendence:any;
    items;
    date = [];
    checkin = [];
    checkout = [];
    att=[];
    missing:any;
    totaldifff:any;
    currentDate;
    developers:any;
    filteredDevelopers;
    attendenceByDate = [];
    select;
    alldiff=[];
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    maxtime:any;

    view: string = 'month';

    viewDate: Date = new Date();

    events: CalendarEvent[] = [];

    // clickedDate: Date;

    clickedColumn: number;

    constructor(public router:Router, public _leaveService:LeaveService,
      public _alertService: AlertService,private route: ActivatedRoute,private modal: NgbModal,public _projectService: ProjectService) {
      this.route.queryParams
      .subscribe(params=>{
        this.items = params;
        this.dateSelected(this.items.date);
        this.currentDate = this.items.date;
        this.currentDate = moment(this.currentDate).format("DD-MM-YYYY");
        console.log("this is current date",this.currentDate);
        localStorage.setItem("attedenceByDateError",JSON.stringify(false));

      })
    }

    ngOnInit() {


      // localStorage.setItem("checkIn",JSON.stringify(false));
      this.getAllDevelopers();

      // $('.datepicker').pickadate({ 
        //   onSet: function(context) {
          //     console.log('Just set stuff:', context)
          //     localFunction(context);
          //   }

          // })


          var localFunction = (date)=>{
            this.dateSelected(date);
          }


        }


        getAllDevelopers(){
          this._projectService.getAllDevelopers().subscribe(res=>{
            console.log("msg-------",res);
            // this.developers = res;
            this.developers = res;
            this.userid = [];
            _ .forEach(this.developers,(developer)=>{
              // console.log("userid=======",developer._id);


              this.userid.push(developer.name);



            })
            console.log("userid============",this.userid);
            // this.filteredDevelopers = res;
            // console.log("dev()()==-=-=-=-",this.userid);

            // this.addEmployeeForm = res;
            this.developers.sort(function(a, b){
              if (a.name && b.name) {
                var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
                if (nameA < nameB) //sort string ascending
                  return -1 
                if (nameA > nameB)
                  return 1
                return 0 //default return value (no sorting)
              }
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

        

        dateSelected(event){
          var date = moment(event).format('YYYY-MM-DD');
          console.log("event  of date ===>" , date);   

          this._leaveService.empAttendence(date).subscribe((res:any)=>{
            console.log("res ==>" , res);
            

            if(res == null){
              console.log("either Holiday or No attendence");
              Swal.fire('Developer Is Absent........')
            }



            else{

              this.worktime = res;

              this.gate = [];

              this.gate.push(this.worktime);


              this.workdifference = [];

              _ .forEach(this.gate,(gate)=>{

                if(gate.difference != null){

                  gate.difference = gate.difference.split("T");
                  gate.difference = gate.difference[1];
                  gate.difference = gate.difference.split("Z");
                  gate.difference = gate.difference[0];


                }

                this.workdifference.push(gate.difference);


              })
              console.log("workdifference===============",this.workdifference);

              var obj = {

                'difference':this.workdifference[0]


              }

              console.log("obj===========",obj.difference);

              this.diffff = obj.difference;
              console.log("difffffffffff==============",this.diffff);

              console.log("either==============-",this.worktime);

              this.logs = this.worktime.in_out;

              _.map(this.logs, function(log){
                if(log.checkOut!=null){
                  var diff = Number(new Date(log.checkOut)) - Number(new Date(log.checkIn));
                  var hours = Math.floor(diff / 1000 / 60 / 60);
                  var min = Math.floor((diff/1000/60)%60);
                  var sec = (Math.floor((diff/1000) % 60)>9)?Math.floor((diff/1000) % 60):'0'+Math.floor((diff/1000) % 60);
                  log['diff'] = hours + ':' + min + ':' + sec;

                }
              })

              this.attendenceByDate.push(res);
              console.log("response()()()()()",this.logs);

              localStorage.setItem("attendenceByDateError",JSON.stringify(false));
              this.attedenceByDateError = false;
            }
          },err=>{
            localStorage.setItem("attedenceByDateError",JSON.stringify(true));
            this.attedenceByDateError = true;
            this.errMessage = "Either Absent Or Holiday"
            console.log("error",err);
          })

          this._leaveService.getUserById(date).subscribe((res:any)=>{

            console.log("response--------------===========-=",res);
            this.presentuser = res;

            this.alldiff = [];

            _ .forEach(this.presentuser,(pre)=>{

              if(pre.difference!= null){
                pre.difference = pre.difference.split("T");
                pre.difference = pre.difference[1];
                pre.difference = pre.difference.split("Z");
                pre.difference = pre.difference[0];
              }


              this.alldiff.push(pre.difference);


            })

            console.log("alldiff=============",this.alldiff);

            this.presentid = [];
            _ .forEach(this.presentuser,(present)=>{

              this.presentid.push(present.UserName);



            })
            console.log("present userid============",this.presentid);

            this.missing = this.userid.filter(item => this.presentid.indexOf(item) < 0);
            console.log("absent student========>>>>",this.missing);


          })


        }
      }




