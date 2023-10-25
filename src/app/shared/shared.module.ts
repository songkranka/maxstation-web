import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgSelectModule } from "@ng-select/ng-select";
import { RouterModule } from '@angular/router';
import { SharedService } from "./shared.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoadingComponent,
  ],
  imports: [CommonModule, MatTooltipModule, NgSelectModule,RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoadingComponent,
    MatTooltipModule,
  ],
  providers: [
    SharedService
  ]
})
export class SharedModule {}
