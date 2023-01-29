import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserManagementComponent],
  imports: [CommonModule, CoreRoutingModule, FormsModule],
})
export class CoreModule {}
