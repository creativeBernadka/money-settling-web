import {Component, Input} from '@angular/core';
import {HistoryItemModel} from '../../models/historyItemModel';

@Component({
    selector: 'history-item',
    templateUrl: 'history-item.page.html',
    styleUrls: ['history-item.page.scss'],
})
export class HistoryItemPage {

    constructor() {
    }

    @Input() historyElement: HistoryItemModel;

}
