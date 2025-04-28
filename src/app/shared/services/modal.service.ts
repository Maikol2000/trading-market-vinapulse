import {
  Injectable,
  ComponentRef,
  Type,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: ComponentRef<any>[] = [];
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  /**
   * Opens a component as a modal
   * @param component The component to render as a modal
   * @param props Properties to pass to the component
   * @returns A reference to the created component
   */
  open<T extends object>(
    component: Type<T>,
    props?: Partial<T>
  ): ComponentRef<T> {
    // Create the component
    const componentRef = createComponent(component, {
      environmentInjector: this.injector,
    });

    // Set input properties
    if (props) {
      Object.assign(componentRef.instance, props);
    }

    // Add to the DOM
    document.body.appendChild(componentRef.location.nativeElement);

    // Track the modal
    this.modals.push(componentRef);

    // Attach to the application
    this.appRef.attachView(componentRef.hostView);

    return componentRef;
  }

  /**
   * Closes a specific modal
   * @param componentRef Reference to the modal component to close
   */
  close<T>(componentRef: ComponentRef<T>): void {
    const index = this.modals.indexOf(componentRef);

    if (index > -1) {
      // Remove from tracking array
      this.modals.splice(index, 1);

      // Clean up the component
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }
  }

  /**
   * Closes all open modals
   */
  closeAll(): void {
    this.modals.forEach((modal) => {
      this.appRef.detachView(modal.hostView);
      modal.destroy();
    });

    this.modals = [];
  }
}
