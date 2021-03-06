import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {ResultsModel} from '../../models/resultsModel';

@Component({
    selector: 'settlement',
    templateUrl: 'summary.page.html',
    styleUrls: ['summary.page.scss']
})
export class SummaryPage implements OnInit {

    settlementArray: Array<ResultsModel> = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.activatedRoute.paramMap
            .pipe(map(() => window.history.state))
            .subscribe( results => {
                console.log(results.data);
                this.settlementArray = results.data;
            });
    }

    goToHistory() {
        this.router.navigateByUrl('/home');
    }

}
