import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

	constructor(public _messagingservice:MessagingService,public route:ActivatedRoute,public router:Router) {

	}

	ngOnInit() {
		this.get();
	}
	get(){
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		console.log("res-=-=",currentUser);
	}
}
