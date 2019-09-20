import {Component, OnInit} from '@angular/core';
import {PersonModel} from '../../models/personModel';
import {SettlingModel} from '../../models/settlingModel';
import {ResultsModel} from '../../models/resultsModel';
import {GraphqlService} from '../../services/graphql.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {HistoryItemModel} from '../../models/historyItemModel';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {map} from 'rxjs/operators';

@Component({
    selector: 'summary',
    templateUrl: 'summary.page.html',
    styleUrls: ['summary.page.scss'],
    providers: [GraphqlService]
})
export class SummaryPage implements OnInit{

    constructor(
        private router: Router,
        private graphqlService: GraphqlService,
        private activatedRoute: ActivatedRoute
    ) {}

    name: string;
    numberOfPeople: string;
    peopleArray: Array<PersonModel> = [];
    generateNickInput = false;
    settlingModelArray: Array<SettlingModel> = [];
    borrowersArray: Array<ResultsModel> = [];
    private historyElement = new HistoryItemModel();

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(map(() => window.history.state))
            .subscribe( results => {
                if (results.data) {
                    this.historyElement.id = results.data;
                    this.graphqlService.getHistoryItem(results.data)
                        .subscribe(result => {
                            this.name = result.data.historyItem.name;
                            this.numberOfPeople = result.data.historyItem.nickNames.length;
                            this.generateInputs();
                            this.peopleArray.forEach( (person, index) => {
                                person.nick = result.data.historyItem.nickNames[index];
                            });
                            result.data.historyItem.payments.forEach( (payment, index) => {
                               this.addSettlingModel();
                               this.settlingModelArray[index].whoPayed = payment.whoPayed;
                               this.settlingModelArray[index].forWhom = payment.forWhom;
                               this.settlingModelArray[index].howMany = payment.howMany;
                            });
                        });
                }
            });
    }

    generateInputs() {
        this.settlingModelArray.length = 0;
        const amount = parseInt(this.numberOfPeople, 10);
        this.peopleArray = Array.apply(null, Array(amount)).map(item => new PersonModel());
        this.generateNickInput = true;
    }

    addSettlingModel() {
        this.settlingModelArray.push(new SettlingModel());
    }

    goToSummary() {

        this.calculateValues();

        this.saveToDB();

        const navigationExtras: NavigationExtras = {
            state: {
                data: this.borrowersArray
            }
        };

        this.router.navigateByUrl('/settlement', navigationExtras);
    }

    calculateValues() {
        this.settlingModelArray.forEach(
            settlingModel => {
                settlingModel.forWhom.forEach(
                    person => {
                        let borrower = this.borrowersArray.find( (resultModel) => {
                            return resultModel.whoBorrowed === person && resultModel.fromWhomBorrowed === settlingModel.whoPayed;
                        });

                        if (borrower) {
                            borrower.howMany += settlingModel.howMany / settlingModel.forWhom.length;
                        } else {
                            borrower = new ResultsModel();
                            borrower.whoBorrowed = person;
                            borrower.fromWhomBorrowed = settlingModel.whoPayed;
                            borrower.howMany = settlingModel.howMany / settlingModel.forWhom.length;
                            this.borrowersArray.push(borrower);
                        }
                    }
                );
            }
        );

        const helperBorrowerArray = JSON.parse(JSON.stringify(this.borrowersArray));

        helperBorrowerArray.forEach(
            borrower => {
                const person = this.borrowersArray.find( (resultModel) => {
                    return borrower.whoBorrowed === resultModel.fromWhomBorrowed && borrower.fromWhomBorrowed === resultModel.whoBorrowed;
                });
                if (person) {
                    borrower.howMany = (borrower.howMany - person.howMany) / 2;
                }
            }
        );

        this.borrowersArray = helperBorrowerArray;
    }

    saveToDB() {
        this.historyElement.name = this.name;
        this.historyElement.nickNames =
            this.peopleArray.map(
                person => person.nick
            );
        this.historyElement.payments =
            this.settlingModelArray.map( payment => {
                return {
                    whoPayed: payment.whoPayed,
                    forWhom: payment.forWhom,
                    howMany: parseFloat(String(payment.howMany))
                };
            });
        this.historyElement.summary =
            this.borrowersArray.map( payment => {
                return {
                    whoPays: payment.whoBorrowed,
                    whomPays: payment.fromWhomBorrowed,
                    howMany: payment.howMany
                };
            });

        this.graphqlService.insertHistoryItem(this.historyElement)
            .subscribe(({ data }) => {
                console.log('got data', data);
            }, (error) => {
                console.log('there was an error sending the query', error);
            });
    }

}
