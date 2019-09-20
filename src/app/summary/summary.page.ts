import {Component} from '@angular/core';
import {PersonModel} from '../../models/personModel';
import {SettlingModel} from '../../models/settlingModel';
import {ResultsModel} from '../../models/resultsModel';
import {GraphqlService} from '../../services/graphql.service';
import {NavigationExtras, Router} from '@angular/router';
import {graphql} from 'graphql';
import {HistoryItemModel} from '../../models/historyItemModel';
import {element} from 'protractor';

@Component({
    selector: 'summary',
    templateUrl: 'summary.page.html',
    styleUrls: ['summary.page.scss'],
    providers: [GraphqlService]
})
export class SummaryPage {

    constructor(
        private router: Router,
        private graphqlService: GraphqlService
    ) {}

    name: string;
    numberOfPeople: string;
    peopleArray: Array<PersonModel> = [];
    generateNickInput = false;
    settlingModelArray: Array<SettlingModel> = [];
    borrowersArray: Array<ResultsModel> = [];

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
        const historyElement = new HistoryItemModel();
        historyElement.name = this.name;
        historyElement.nickNames =
            this.peopleArray.map(
                person => person.nick
            );
        historyElement.payments =
            this.settlingModelArray.map( payment => {
                return {
                    whoPayed: payment.whoPayed,
                    forWhom: payment.forWhom,
                    howMany: parseFloat(String(payment.howMany))
                };
            });
        historyElement.summary =
            this.borrowersArray.map( payment => {
                return {
                    whoPays: payment.whoBorrowed,
                    whomPays: payment.fromWhomBorrowed,
                    howMany: payment.howMany
                };
            });

        this.graphqlService.insertHistoryItem(historyElement)
            .subscribe(({ data }) => {
                console.log('got data', data);
            }, (error) => {
                console.log('there was an error sending the query', error);
            });
    }

}
