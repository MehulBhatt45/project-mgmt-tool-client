import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { config } from '../config';
@Injectable({
	providedIn: 'root'
})
export class LoginService {

	private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    login(userCredentials) {
        console.log("heyy");
        return this.http.post<any>(config.baseApiUrl+"user/login", userCredentials)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.data && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user.data));
                    localStorage.setItem('token', JSON.stringify(user.token));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    register(user) {
        return this.http.post(config.baseApiUrl+"user/signup", user);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    getUserById(id){
         return this.http.get(config.baseApiUrl+"user/get-single-user/"+id);   
    }
}
