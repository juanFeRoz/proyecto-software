import { Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent} from './home/home.component'
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChatComponent } from './chat/chat.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';

export const routes: Routes = [
  {path: 'about-us', component: AboutUsComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'to-do-list', component: ToDoListComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];
