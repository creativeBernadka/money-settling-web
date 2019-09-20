import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HistoryItemPage } from './history-item.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        HistoryItemPage
    ],
    declarations: [HistoryItemPage]
})
export class HistoryItemModule {}
