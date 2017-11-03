import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent {
    public users: User[];
    public selectedUser: User | undefined;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.refreshData();
    }

    async refreshData() {
        this.http.get(this.baseUrl + 'api/users').subscribe(result => {
            let userList = [];

            for (let u of result.json() as User[]) {

                let user = new User();
                user.id = u.id;
                user.name = u.name;
                user.surname = u.surname;
                user.age = u.age;
                user.password = u.password;
                user.hasChanges = false;
                userList.push(user);
            }

            console.log("ok");

            this.users = userList;

            this.selectUser();
        }, error => console.error(error));
    }


    selectUser(): void {

        this.selectedUser = undefined;

        for (let u of this.users) {
            if (u.deleted == false) {
                this.selectedUser = u;
                break;
            }

        }
    }


    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let user of this.users) {
            if (user.hasChanges == true || user.deleted) {

                let json = JSON.stringify(user.toJSON());

                if (!user.id) { //create
                    if (!user.deleted) {
                        let call = this.http.put(this.baseUrl + 'api/users', json, { headers: headers });
                        serverCalls.push(call);
                    }
                }
                else {
                    if (user.deleted) {
                        let url = this.baseUrl + 'api/students?id=' + user.id;
                        let call = this.http.delete(url, { headers: headers });
                        serverCalls.push(call);
                    }
                    else {
                        let call = this.http.post(this.baseUrl + 'api/users', json, { headers: headers });
                        serverCalls.push(call);
                    }

                }
            }
        }
        Observable.forkJoin(serverCalls)
            .subscribe(data => {
                this.refreshData();
            }, error => console.error(error));


    }

    onSelect(user: User): void {

        if (user.deleted == false) {
            this.selectedUser = user;
        }
    }

    addNewUser(): void {
        this.selectedUser = new User();
        this.selectedUser.hasChanges = true;
        this.users.push(this.selectedUser);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
    }

    delete(user: User): void {
        user.deleted = true;
        this.selectUser();
    }
}

class User {
    id: number;

    private _name: string = "";
    private _surname: string = "";
    private _age: number = 0;
    private _password: string = "";
    public hasChanges: boolean;
    public deleted: boolean = false;

    get name(): string {
        return this._name;
    }
    set name(n: string) {
        this._name = n;
        this.hasChanges = true;
        console.log("set name");
    }

    get surname(): string {
        return this._surname;
    }
    set surname(s: string) {
        this._surname = s;
        this.hasChanges = true;
        console.log("set surname");
    }

    get age(): number {
        return this._age;
    }
    set age(a: number) {
        this._age = a;
        this.hasChanges = true;
        console.log("set age");
    }

    get password(): string {
        return this._password;
    }
    set password(p: string) {
        this._password = p;
        this.hasChanges = true;
        console.log("set password");
    }

    public toJSON() {
        return {
            id: this.id,
            name: this._name,
            surname: this._surname,
            age: this._age,
            password: this._password,
        };
    };
}
