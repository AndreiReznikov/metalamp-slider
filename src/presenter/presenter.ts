import { Options } from '../interfaces/interfaces';
import { Model } from '../model/model';
import { View } from '../view/view';

class Presenter {
    
  model;
  view;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    
    this.init();
    this.model.observer.addObserver(this.updateView);
    this.model.observer.addObserver(this.initPanel);

    this.view.panel.$panelContainer.on('pointerdown', (event: JQuery.TriggeredEvent) => event.stopPropagation());
    this.view.panel.$minInput.on('change', this.setMin);
    this.view.panel.$maxInput.on('change', this.setMax);
    this.view.panel.$fromInput.on('change', this.setFrom);
    this.view.panel.$toInput.on('change', this.setTo);
    this.view.panel.$stepInput.on('change', this.setStep);
    this.view.panel.$intervalToggle.on('click', this.toggleInterval);
    this.view.panel.$verticalToggle.on('click', this.toggleVertical);
    this.view.panel.$tooltipsToggle.on('click', this.toggleTooltip);
    this.view.panel.$rangeBetweenToggle.on('click', this.toggleRangeBetween);
    this.view.panel.$scaleToogle.on('click', this.toggleScale);

    this.view.$firstButton.on('pointerdown', (event: JQuery.TriggeredEvent) => {
      const shiftAxis1 = this.model.calculateShiftAxis1(event);
      
      const moveFirstButton = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis1 === undefined) return;

        this.model.calculateFirstButtonPositionWhileMoving(event, shiftAxis1);
      };

      $(document).on('pointermove', moveFirstButton);
      $(document).on('pointerup', () => $(document).off('pointermove', moveFirstButton));
    });

    this.view.$secondButton.on('pointerdown', (event: JQuery.TriggeredEvent) => {
      const shiftAxis2 = this.model.calculateShiftAxis2(event);
      
      const moveSecondButton = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis2 === undefined) return;

        this.model.calculateSecondButtonPositionWhileMoving(event, shiftAxis2);
      };

      $(document).on('pointermove', moveSecondButton);
      $(document).on('pointerup', () => $(document).off('pointermove', moveSecondButton));
    });

    this.view.$firstButton.on('focusin', (event: JQuery.FocusInEvent) => {   
      const moveFirstButtonAfterKeydown = (event: JQuery.KeyDownEvent): void => {
        this.model.calculateFirstButtonPositionAfterKeydown(event);
      }

      $(event.currentTarget).on('keydown', moveFirstButtonAfterKeydown);
      $(event.currentTarget).on('focusout', () => $(event.currentTarget).off('keydown', moveFirstButtonAfterKeydown));
    });

    this.view.$secondButton.on('focusin', (event: JQuery.FocusInEvent) => {   
      const moveSecondButtonAfterKeydown = (event: JQuery.KeyDownEvent) => {
        this.model.calculateSecondButtonPositionAfterKeydown(event);
      }

      $(event.currentTarget).on('keydown', moveSecondButtonAfterKeydown);
      $(event.currentTarget).on('focusout', () => $(event.currentTarget).off('keydown', moveSecondButtonAfterKeydown));
    });

    this.view.$slider.on('pointerdown', this.model.calculateFirstButtonPositionAfterSliderOnDown);
    this.view.$slider.on('pointerdown', this.model.calculateSecondButtonPositionAfterSliderOnDown);
    this.view.$minValue.on('pointerdown', this.model.calculateFirstButtonPositionAfterMinValueOnDown);
    this.view.$maxValue.on('pointerdown', this.model.calculateFirstButtonPositionAfterMaxValueOnDown);
    this.view.$maxValue.on('pointerdown', this.model.calculateSecondButtonPositionAfterMaxValueOnDown);
    
    this.view.$scaleContainer.on('pointerdown', (event: JQuery.TriggeredEvent) => {
      if (!('target' in event)) return;
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

      this.model.calculateButtonPositionAfterScaleOnDown(event, scaleElementOptions);
    });
  }

  private init = (): void => {
    this.view.initView(this.model.getState());
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions().lengthParameter));
    this.model.validateInitialValues();
    this.model.calculateInitialButtonsPosition();
    this.model.calculateInitialValues();
    this.updateView(this.model.getOptions());
    this.model.calculatePanelPosition();
    this.view.panel.setPanelPosition(this.model.getOptions());
    this.initPanel();
    this.model.setConfigToLocalStorage();
  }

  private updateView = (options: Options): void => {
    this.view.firstButton.setFirstButtonPosition(options);
    this.view.secondButton.setSecondButtonPosition(options);
    this.view.tooltips.setFirstTooltipValue(options);
    this.view.tooltips.setSecondTooltipValue(options);
    this.view.tooltips.setFirstTooltipPosition(options);
    this.view.tooltips.setSecondTooltipPosition(options);
    this.view.rangeBetween.setRangeBetweenPosition(options);
    this.view.rangeBetween.setRangeBetweenLength(options);
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
    this.view.panel.$rangeBetweenToggle.prop('checked', this.model.isRangeBetween ? true : false);
    this.view.panel.$scaleToogle.prop('checked', this.model.isScale ? true : false);
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
    this.model.calculateInitialFirstButtonPosition();
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
    this.model.calculateInitialSecondButtonPosition();
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
    this.model.calculateInitialSecondButtonPosition();
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

  private toggleRangeBetween = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isRangeBetween = true;
    }
    else {
      this.model.isRangeBetween  = false;
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