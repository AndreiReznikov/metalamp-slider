import { Options } from '../interfaces/interfaces';
import { Model } from '../model/model';
import { View } from '../view/view';

class Presenter {
    
  model: Model;
  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    
    this.init();
    this.model.observer.addObserver(this.updateView);
    this.model.observer.addObserver(this.initPanel);

    this.eventManager();
    this.panelEventManager();
  }

  private init = (): void => {
    this.view.initView(this.model.getState());
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions().lengthParameter));
    this.model.validateInitialValues();
    this.model.calculateInitialHandlesPosition();
    this.model.calculateInitialValues();
    this.updateView(this.model.getOptions());
    this.model.calculatePanelPosition();
    this.view.panel.setPanelPosition(this.model.getOptions());
    this.initPanel();
    this.model.setConfigToLocalStorage();
  }

  private updateView = (options: Options): void => {
    this.view.handleFrom.setHandleFromPosition(options);
    this.view.handleTo.setHandleToPosition(options);
    this.view.tooltips.setTooltipFromValue(options);
    this.view.tooltips.setTooltipToValue(options);
    this.view.tooltips.setTooltipFromPosition(options);
    this.view.tooltips.setTooltipToPosition(options);
    this.view.range.setRangePosition(options);
    this.view.range.setRangeLength(options);
    this.view.minAndMaxValues.setMinAndMaxValues(options);
    this.view.minAndMaxValues.setMinAndMaxPosition(options);
    this.view.minAndMaxValues.showMinAndMax(options);
    this.view.scale.setScaleElementsValues(options);
    this.view.scale.setScaleLength(options);
    this.view.scale.setScaleElementsPositions(options);
    this.view.scale.setScalePosition(options);
    this.view.panel.setPanelPosition(options);
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, options.lengthParameter));
  }

  private initPanel = (): void => {
    if (!this.model.isPanel) return;
    
    this.view.panel.$minInput.val(`${this.model.minValue}`).attr('step', `${this.model.isStepSet ? '' : (0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.view.panel.$maxInput.val(`${this.model.maxValue}`).attr('step', `${this.model.isStepSet ? '' : (0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.view.panel.$toInput.val(`${this.model.to}`).attr('step', `${this.model.isStepSet ? this.model.step : (0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.view.panel.$fromInput.val(`${this.model.from}`).attr('step', `${this.model.isStepSet ? this.model.step : (0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.view.panel.$stepInput.val(`${this.model.step}`).attr('step', `${(0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.view.panel.$intervalToggle.prop('checked', this.model.isInterval ? true : false);
    this.view.panel.$verticalToggle.prop('checked', this.model.isVertical ? true : false);
    this.view.panel.$tooltipsToggle.prop('checked', this.model.isTooltip ? true : false);
    this.view.panel.$rangeToggle.prop('checked', this.model.isRange ? true : false);
    this.view.panel.$scaleToogle.prop('checked', this.model.isScale ? true : false);
  }

  private eventManager = (): void => {
    this.view.$handleFrom.on('pointerdown', (event: JQuery.TriggeredEvent) => {
      const shiftAxis1 = this.model.calculateShiftAxis1(event);
      
      const moveHandleFrom = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis1 === undefined) return;

        this.model.calculateHandleFromPositionWhileMoving(event, shiftAxis1);
      };

      $(document).on('pointermove', moveHandleFrom);
      $(document).on('pointerup', () => $(document).off('pointermove', moveHandleFrom));
    });

    this.view.$handleTo.on('pointerdown', (event: JQuery.TriggeredEvent) => {
      const shiftAxis2 = this.model.calculateShiftAxis2(event);
      
      const moveHandleTo = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis2 === undefined) return;

        this.model.calculateHandleToPositionWhileMoving(event, shiftAxis2);
      };

      $(document).on('pointermove', moveHandleTo);
      $(document).on('pointerup', () => $(document).off('pointermove', moveHandleTo));
    });

    this.view.$handleFrom.on('focusin', (event: JQuery.FocusInEvent) => {   
      const moveHandleFromAfterKeydown = (event: JQuery.KeyDownEvent): void => {
        this.model.calculateHandleFromPositionAfterKeydown(event);
      }

      $(event.currentTarget).on('keydown', moveHandleFromAfterKeydown);
      $(event.currentTarget).on('focusout', () => $(event.currentTarget).off('keydown', moveHandleFromAfterKeydown));
    });

    this.view.$handleTo.on('focusin', (event: JQuery.FocusInEvent) => {   
      const moveHandleToAfterKeydown = (event: JQuery.KeyDownEvent) => {
        this.model.calculateHandleToPositionAfterKeydown(event);
      }

      $(event.currentTarget).on('keydown', moveHandleToAfterKeydown);
      $(event.currentTarget).on('focusout', () => $(event.currentTarget).off('keydown', moveHandleToAfterKeydown));
    });

    this.view.$slider.on('pointerdown', this.model.calculateHandleFromPositionAfterSliderOnDown);
    this.view.$slider.on('pointerdown', this.model.calculateHandleToPositionAfterSliderOnDown);
    this.view.$minValue.on('pointerdown', this.model.calculateHandleFromPositionAfterMinValueOnDown);
    this.view.$maxValue.on('pointerdown', this.model.calculateHandleFromPositionAfterMaxValueOnDown);
    this.view.$maxValue.on('pointerdown', this.model.calculateHandleToPositionAfterMaxValueOnDown);
    
    this.view.$scaleContainer.on('pointerdown', (event: JQuery.TriggeredEvent) => {
      if (!event.target) return;

      const $target: JQuery<EventTarget> = $(event.target);
      const isScaleElementOnDown: boolean = $target.hasClass('js-slider__scale-element');
      const scaleElementPosition: number = parseInt(`${$target.css(this.model.positionParameter)}`);
      const scaleElementLength: number = parseInt(`${$target.css(this.model.lengthParameter)}`);
      const scaleElementValue: string = $target.html();
      
      const scaleElementOptions = {
        isScaleElementOnDown: isScaleElementOnDown,
        scaleElementPosition: scaleElementPosition,
        scaleElementLength: scaleElementLength,
        scaleElementValue: scaleElementValue
      }

      this.model.calculateHandlePositionAfterScaleOnDown(event, scaleElementOptions);
    });
  }

  private panelEventManager = (): void => {
    this.view.panel.$panelContainer.on('pointerdown', (event: JQuery.TriggeredEvent) => event.stopPropagation());
    this.view.panel.$minInput.on('change', this.setMin);
    this.view.panel.$maxInput.on('change', this.setMax);
    this.view.panel.$fromInput.on('change', this.setFrom);
    this.view.panel.$toInput.on('change', this.setTo);
    this.view.panel.$stepInput.on('change', this.setStep);
    this.view.panel.$intervalToggle.on('click', this.toggleInterval);
    this.view.panel.$verticalToggle.on('click', this.toggleVertical);
    this.view.panel.$tooltipsToggle.on('click', this.toggleTooltip);
    this.view.panel.$rangeToggle.on('click', this.toggleRange);
    this.view.panel.$scaleToogle.on('click', this.toggleScale);
  }

  private setMin = (event: JQuery.ChangeEvent): void => {
    const minValue = $(event.currentTarget).val();

    //вынести в переменную
    if (typeof parseFloat(`${minValue}`) !== 'number' || minValue == '') {
      this.initPanel();
      return;
    };
    
    this.model.minValue = parseFloat(`${minValue}`);

    this.init();
  }

  private setMax = (event: JQuery.ChangeEvent): void => {
    const maxValue = $(event.currentTarget).val();
    
    if (typeof parseFloat(`${maxValue}`) !== 'number'  || maxValue == '') {
      this.initPanel();
      return;
    };

    this.model.maxValue = parseFloat(`${maxValue}`);

    this.init();
  }

  private setFrom = (event: JQuery.ChangeEvent): void => {
    const from = $(event.currentTarget).val();

    if (typeof parseFloat(`${from}`) !== 'number'  || from == '') {
      this.initPanel();
      return;
    };

    this.model.from = parseFloat(`${from}`);   
  
    this.model.validateInitialValues();
    this.model.calculateInitialHandleFromPosition();
    this.model.calculateInitialValues();
    this.initPanel();

    this.updateView(this.model.getOptions());
    this.model.setConfigToLocalStorage();
  }

  private setTo = (event: JQuery.ChangeEvent): void => {
    const to = $(event.currentTarget).val();

    if (typeof parseFloat(`${to}`) !== 'number' || to == '') {
      this.initPanel();
      return;
    };

    this.model.to = parseFloat(`${to}`);
    
    this.model.validateInitialValues();
    this.model.calculateInitialHandleToPosition();
    this.model.calculateInitialValues();
    this.initPanel();

    this.updateView(this.model.getOptions());
    this.model.setConfigToLocalStorage();
  }

  private setStep = (event: JQuery.ChangeEvent): void => {
    const step = $(event.currentTarget).val();

    if (typeof parseFloat(`${step}`) !== 'number' || step == '') {
      this.initPanel();
      return;
    };

    this.model.step = parseFloat(`${step}`);

    this.view.initView(this.model.getState());
    this.model.validateInitialValues();
    this.model.calculateStepLength();
    this.initPanel();

    this.updateView(this.model.getOptions());
    this.model.setConfigToLocalStorage();
  }

  private toggleInterval = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isInterval = true;
    }
    else {
      this.model.isInterval = false;
    }

    this.view.initView(this.model.getState());
    this.model.validateInitialValues();
    this.model.calculateInitialHandleToPosition();
    this.model.calculateInitialValues();


    this.updateView(this.model.getOptions());
    this.model.setConfigToLocalStorage();
  }

  private toggleTooltip = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isTooltip = true;
    }
    else {
      this.model.isTooltip = false;
    }

    this.view.initView(this.model.getState());
    this.updateView(this.model.getOptions());
    this.model.setConfigToLocalStorage();
  }

  private toggleRange = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isRange = true;
    }
    else {
      this.model.isRange  = false;
    }

    this.view.initView(this.model.getState());
    this.updateView(this.model.getOptions());
    this.model.setConfigToLocalStorage();
  }

  private toggleScale = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isScale = true;
    }
    else {
      this.model.isScale  = false;
    }

    this.view.initView(this.model.getState());
    this.updateView(this.model.getOptions());
    this.view.panel.setPanelPosition(this.model.getOptions());
    this.model.setConfigToLocalStorage();
  }

  private toggleVertical = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isVertical = true;
    }
    else {
      this.model.isVertical = false;
    }

    this.model.positionParameter = this.model.isVertical ? 'top' : 'left';
    this.model.lengthParameter = this.model.isVertical ? 'height' : 'width';
    this.model.scalePositionParameter = this.model.isVertical ? 'right' : 'top';
    this.model.panelPositionParameter = this.model.isVertical ? 'left' : 'top';
    
    this.init();
  }
}

export { Presenter };