import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

@Component({
    selector: 'concerts',
    templateUrl: './concerts.component.html',
    styleUrls: ['./concerts.component.css']
})
export class ConcertsComponent {
    public concerts: Concert[];
    public selectedConcert: Concert | undefined;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.refreshData();
    }

    async refreshData() {
        this.http.get(this.baseUrl + 'api/concerts').subscribe(result => {
            let concertList = [];

            for (let c of result.json() as Concert[]) {

                let concert = new Concert();
                concert.id = c.id;
                concert.name = c.name;
                concert.where = c.where;
                concert.when = c.when;
                concert.hasChanges = false;
                concertList.push(concert);
            }

            console.log("ok");

            this.concerts = concertList;

            this.selectConcert();
        }, error => console.error(error));
    }


    selectConcert(): void {

        this.selectedConcert = undefined;

        for (let c of this.concerts) {
            if (c.deleted == false) {
                this.selectedConcert = c;
                break;
            }

        }
    }


    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let concert of this.concerts) {
            if (concert.hasChanges == true || concert.deleted) {

                let json = JSON.stringify(concert.toJSON());

                if (!concert.id) {
                    if (!concert.deleted) {
                        let call = this.http.put(this.baseUrl + 'api/concerts', json, { headers: headers });
                        serverCalls.push(call);
                    }
                }
                else {
                    if (concert.deleted) {
                        let url = this.baseUrl + 'api/concerts?id=' + concert.id;
                        let call = this.http.delete(url, { headers: headers });
                        serverCalls.push(call);
                    }
                    else {
                        let call = this.http.post(this.baseUrl + 'api/concerts', json, { headers: headers });
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

    onSelect(concert: Concert): void {

        if (concert.deleted == false) {
            this.selectedConcert = concert;
        }
    }

    addNewConcert(): void {
        this.selectedConcert = new Concert();
        this.selectedConcert.hasChanges = true;
        this.concerts.push(this.selectedConcert);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
    }

    delete(concert: Concert): void {
        concert.deleted = true;
        this.selectConcert();
    }
}

class Concert {
    id: number;

    private _name: string = "";
    private _where: string = "";
    private _when: string = "";
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

    get where(): string {
        return this._where;
    }
    set where(w: string) {
        this._where = w;
        this.hasChanges = true;
        console.log("set where");
    }

    get when(): string {
        return this._when;
    }
    set when(w: string) {
        this._when = w;
        this.hasChanges = true;
        console.log("set when");
    }

    public toJSON() {
        return {
            id: this.id,
            name: this._name,
            where: this._where,
            when: this._when,
        };
    };
}