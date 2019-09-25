import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SettlementPage } from './settlement.page';
import {EnterValueModule} from '../enter-value/enter-value.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EnterValueModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: SettlementPage
            }
        ])
    ],
    declarations: [SettlementPage]
})
export class SettlementModule {}
