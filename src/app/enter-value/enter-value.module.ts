import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { EnterValuePage } from './enter-value.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [
        EnterValuePage
    ],
    declarations: [EnterValuePage]
})
export class EnterValueModule {}
