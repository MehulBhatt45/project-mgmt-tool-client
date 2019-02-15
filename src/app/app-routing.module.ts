import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component'
import {ViewProjectComponent} from './view-project/view-project.component';
import {CreateProjectComponent} from './create-project/create-project.component';
import {EditProjectComponent} from './edit-project/edit-project.component';
import {AddTeamComponent} from './add-team/add-team.component';
import{MainTableViewComponent} from './main-table-view/main-table-view.component';
import {IssueComponent} from "./issue/issue.component";
import {ProjectDetailComponent} from "./project-detail/project-detail.component";
const routes: Routes = [
	{
		path:'login',
		component:LoginComponent
	},
	{
		path:'view-project',
		component:ViewProjectComponent
	},
	{
		path:'create-project',
		component:CreateProjectComponent
	},
	{
		path:'edit-project',
		component:EditProjectComponent
	},
	{
		path:'add-team',
		component:AddTeamComponent
	},

	{
		path:'main-table-view',
		component:MainTableViewComponent
	},
	{
		path:'issue',
		component:IssueComponent
	},
	{
		path:'project-detail',
		component:ProjectDetailComponent
	}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
