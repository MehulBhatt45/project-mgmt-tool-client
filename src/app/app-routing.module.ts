import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { ViewProjectComponent } from './view-project/view-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { MainTableViewComponent } from './main-table-view/main-table-view.component';
import { IssueComponent } from "./issue/issue.component";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LogsComponent } from './logs/logs.component';
import { FileListComponent } from './file-list/file-list.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import {AddNoticeComponent} from './add-notice/add-notice.component';
import {NoticeboardComponent} from './noticeboard/noticeboard.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

const routes: Routes = [
// {
	// 	path:'',
	// 	redirectTo:'login',
	// 	pathMatch:'full'
	// },
	{
		path:'login',
		component:LoginComponent
	},
	{
		path:'register',
		component:RegisterComponent
	},
	{
		path:'reset-password',
		component:ResetPasswordComponent
	},
	{
		path:'userprofile',
		component:UserprofileComponent
	},

	{
		path:"",
		component:HomeComponent,
		canActivate: [AuthGuard],
		children:[
		{
			path:'',
			pathMatch:"full",
			redirectTo:'view-projects'
		},
		{
			path:'noticeboard',
			component:NoticeboardComponent
		},
		{
			path:'add-notice',
			component:AddNoticeComponent
		},
		{
			path:'view-projects',
			component:ViewProjectComponent
		},
		{
			path:'create-project',
			component:CreateProjectComponent
		},
		{
			path:'edit-project/:id',
			component:EditProjectComponent
		},
		{
			path:'add-team',
			component:AddTeamComponent
		},

		{
			path:'all-item-list',
			component:MainTableViewComponent
		},
		{
			path:'issue',
			component:IssueComponent
		},
		{
			path:'project-details/:id',
			component:ProjectDetailComponent
		},
		{
			path:'project/files-list/:id',
			component:FileListComponent
		},
		{
			path:'logs',
			pathMatch: "full",
			component: LogsComponent	
		},
		{
			path:"logs/:projectId",
			pathMatch: "full",
			component: LogsComponent
		},
		{
			path:"logs/:projectId/:memberId",
			pathMatch: "full",
			component: LogsComponent
		}]
	}];

	@NgModule({
		imports: [RouterModule.forRoot(routes, { useHash : true })],
		exports: [RouterModule]
	})
	export class AppRoutingModule { }
