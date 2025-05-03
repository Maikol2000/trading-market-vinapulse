import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { IdIndicator } from '@app/shared/models';
import { ModalService } from '@app/shared/services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartGantt } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { IndicatorsModalComponent } from '../indicators-modal/indicators-modal.component';

@Component({
  selector: 'app-indicators-selector',
  imports: [FontAwesomeModule, TranslateModule, CommonModule],
  templateUrl: './indicators-selector.component.html',
  styleUrl: './indicators-selector.component.scss',
})
export class IndicatorsSelectorComponent {
  selectIndicator = output<IdIndicator>();
  indicatorIcon = faChartGantt;

  constructor(private modalService: ModalService) {}

  openFormModal(): void {
    const modalRef = this.modalService.open(IndicatorsModalComponent);

    const instance = modalRef.instance;

    instance.select.subscribe((value) => {
      this.selectIndicator.emit(value);
    });

    instance.close.subscribe(() => {
      this.modalService.close(modalRef);
    });
  }
}
