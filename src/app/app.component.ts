import { Component, OnInit } from '@angular/core';
declare var $ : any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project-manager';

  constructor(){}

  ngOnInit() {
		// var dropdown = document.getElementsByClassName("dropdown-btn");
		// var i;

		// for (i = 0; i < dropdown.length; i++) {
		// 	dropdown[i].addEventListener("click", function() {
		// 		this.classList.toggle("active");
		// 		var dropdownContent = this.nextElementSibling;
		// 		if (dropdownContent.style.display === "block") {
		// 			dropdownContent.style.display = "none";
		// 		} else {
		// 			dropdownContent.style.display = "block";
		// 		}
		// 	});
		// }
	}

	// openNav() {
	// 	document.getElementById("mySidenav").style.width = "250px";
	// 	document.getElementById("main").style.marginLeft = "0px";

	// }
	// closeNav() {
	// 	document.getElementById("mySidenav").style.width = "0";
	// 	document.getElementById("main").style.marginLeft= "0";
	// }
}
