import {Component, Input} from '@angular/core';
import {PersonModel} from '../../models/personModel';
import {SettlingModel} from '../../models/settlingModel';

@Component({
    selector: 'enter-value',
    templateUrl: 'enter-value.page.html',
    styleUrls: ['enter-value.page.scss'],
})
export class EnterValuePage {

    constructor() {
    }

    @Input() selectOptions: Array<PersonModel>;
    @Input() settlingModel: SettlingModel;

}
