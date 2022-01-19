import { Options } from '../interfaces/interfaces';

class Presenter {
    
  model;
  view;
  $textInputsContainer: JQuery<HTMLElement>;
  $toggleInputsContainer: JQuery<HTMLElement>;
  $minInputContainer: JQuery<HTMLElement>;
  $minButton: JQuery<HTMLElement>;
  $minInput: JQuery<HTMLElement>;
  $maxInputContainer: JQuery<HTMLElement>;
  $maxButton: JQuery<HTMLElement>;
  $maxInput: JQuery<HTMLElement>;
  $fromInputContainer: JQuery<HTMLElement>;
  $fromButton: JQuery<HTMLElement>;
  $fromInput: JQuery<HTMLElement>;
  $toInputContainer: JQuery<HTMLElement>;
  $toButton: JQuery<HTMLElement>;
  $toInput: JQuery<HTMLElement>;
  $stepInputContainer: JQuery<HTMLElement>;
  $stepButton: JQuery<HTMLElement>;
  $stepInput: JQuery<HTMLElement>;
  $intervalToggleContainer: JQuery<HTMLElement>; 
  $toggleText: JQuery<HTMLElement>;
  $customIntervalToggle: JQuery<HTMLElement>; 
  $intervalToggle: JQuery<HTMLElement>;
  $tooltipsToggleContainer: JQuery<HTMLElement>;
  $tooltipsToggle: JQuery<HTMLElement>;
  $rangeBetweenToggleContainer: JQuery<HTMLElement>;
  $rangeBetweenToggle: JQuery<HTMLElement>;
  $scaleToggleContainer: JQuery<HTMLElement>;
  $scaleToogle: JQuery<HTMLElement>;
  $verticalToggleContainer: JQuery<HTMLElement>;
  $verticalToggle: JQuery<HTMLElement>;

  constructor(model: any, view: any) {
    this.model = model;
    this.view = view;

    this.$textInputsContainer = $('<div/>').addClass('js-slider__text-inputs-container').appendTo(this.view.$panelContainer);
    this.$toggleInputsContainer = $('<div/>').addClass('js-slider__toggle-inputs-container').appendTo(this.view.$panelContainer);

    this.$minInputContainer = $('<div/>').addClass('js-slider__min-input-container').appendTo(this.$textInputsContainer);
    this.$minButton = $('<button/>').html('MIN').addClass('js-slider__min-button').appendTo(this.$minInputContainer);
    this.$minInput = $('<input/>').addClass('js-slider__min-input').attr('type', 'number').appendTo(this.$minInputContainer);

    this.$maxInputContainer = $('<div/>').addClass('js-slider__max-input-container').appendTo(this.$textInputsContainer);
    this.$maxButton = $('<button/>').html('MAX').addClass('js-slider__max-button').appendTo(this.$maxInputContainer);
    this.$maxInput = $('<input/>').addClass('js-slider__max-input').attr('type', 'number').appendTo(this.$maxInputContainer);

    this.$fromInputContainer = $('<div/>').addClass('js-slider__from-input-container').appendTo(this.$textInputsContainer);
    this.$fromButton = $('<button/>').html('FROM').addClass('js-slider__from-button').appendTo(this.$fromInputContainer);
    this.$fromInput = $('<input/>').addClass('js-slider__from-input').attr('type', 'number').appendTo(this.$fromInputContainer);

    this.$toInputContainer = $('<div/>').addClass('js-slider__to-input-container').appendTo(this.$textInputsContainer);
    this.$toButton = $('<button/>').html('TO').addClass('js-slider__to-button').appendTo(this.$toInputContainer);
    this.$toInput = $('<input/>').addClass('js-slider__to-input').attr('type', 'number').appendTo(this.$toInputContainer);

    this.$stepInputContainer = $('<div/>').addClass('js-slider__step-input-container').appendTo(this.$textInputsContainer);
    this.$stepButton = $('<button/>').html('STEP').addClass('js-slider__step-button').appendTo(this.$stepInputContainer);
    this.$stepInput = $('<input/>').addClass('js-slider__step-input').attr('type', 'number').appendTo(this.$stepInputContainer);

    this.$intervalToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    this.$intervalToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$intervalToggleContainer);
    this.$customIntervalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$intervalToggleContainer);
    this.$toggleText = $('<span/>').html('INTERVAL').addClass('js-slider__toggle-text').appendTo(this.$intervalToggleContainer);

    this.$tooltipsToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    this.$tooltipsToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$tooltipsToggleContainer);
    this.$customIntervalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$tooltipsToggleContainer);
    this.$toggleText = $('<span/>').html('TOOLTIPS').addClass('js-slider__toggle-text').appendTo(this.$tooltipsToggleContainer);

    this.$rangeBetweenToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    this.$rangeBetweenToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$rangeBetweenToggleContainer);
    this.$customIntervalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$rangeBetweenToggleContainer);
    this.$toggleText = $('<span/>').html('RANGE').addClass('js-slider__toggle-text').appendTo(this.$rangeBetweenToggleContainer);

    this.$scaleToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    this.$scaleToogle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$scaleToggleContainer);
    this.$customIntervalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$scaleToggleContainer);
    this.$toggleText = $('<span/>').html('SCALE').addClass('js-slider__toggle-text').appendTo(this.$scaleToggleContainer);

    this.$verticalToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    this.$verticalToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$verticalToggleContainer);
    this.$customIntervalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$verticalToggleContainer);
    this.$toggleText = $('<span/>').html('VERTICAL').addClass('js-slider__toggle-text').appendTo(this.$verticalToggleContainer);
    
    this.init();
    this.model.observer.addObserver(this.updateView);
    this.model.observer.addObserver(this.initPanel); 

    this.view.$panelContainer.on('pointerdown', (event: PointerEvent) => event.stopPropagation());
    this.$minInput.on('change', this.setMin);
    this.$maxInput.on('change', this.setMax);
    this.$fromInput.on('change', this.setFrom);
    this.$toInput.on('change', this.setTo);
    this.$stepInput.on('change', this.setStep);
    this.$intervalToggle.on('click', this.toggleInterval);
    this.$verticalToggle.on('click', this.toggleVertical);
    this.$tooltipsToggle.on('click', this.toggleTooltip);
    this.$rangeBetweenToggle.on('click', this.toggleRangeBetween);
    this.$scaleToogle.on('click', this.toggleScale);

    this.view.$firstButton.on('pointerdown', (event: PointerEvent) => {
      const shiftAxis1 = this.model.calculateShiftAxis1(event);
      
      const moveFirstButton = (event: PointerEvent) => {
        this.model.calculateFirstButtonPositionWhileMoving(event, shiftAxis1);
      };

      document.addEventListener('pointermove', moveFirstButton);
      document.addEventListener('pointerup', () => document.removeEventListener('pointermove', moveFirstButton));
    });

    this.view.$secondButton.on('pointerdown', (event: PointerEvent) => {
      const shiftAxis2 = this.model.calculateShiftAxis2(event);
      
      const moveSecondButton = (event: PointerEvent) => {
        this.model.calculateSecondButtonPositionWhileMoving(event, shiftAxis2);
      };

      document.addEventListener('pointermove', moveSecondButton);
      document.addEventListener('pointerup', () => document.removeEventListener('pointermove', moveSecondButton));
    });

    this.view.$firstButton.on('focusin', (event: JQuery.FocusEvent) => {   
      const moveFirstButtonAfterKeydown = (event: JQuery.KeyDownEvent) => {
        this.model.calculateFirstButtonPositionAfterKeydown(event);
      }

      $(event.currentTarget).on('keydown', moveFirstButtonAfterKeydown);
      $(event.currentTarget).on('focusout', () => $(event.currentTarget).off('keydown', moveFirstButtonAfterKeydown));
    });

    this.view.$secondButton.on('focusin', (event: JQuery.FocusEvent) => {   
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
    
    this.view.$scaleContainer.on('pointerdown', (event: PointerEvent) => {
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
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, options.lengthParameter));
  }

  private initPanel = (): void => {
    if (!this.model.isPanel) return;
    
    this.$minInput.val(`${this.model.minValue}`).attr('step', `${this.model.isStepSet ? '' : (0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.$maxInput.val(`${this.model.maxValue}`).attr('step', `${this.model.isStepSet ? '' : (0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.$toInput.val(`${this.model.to}`).attr('step', `${this.model.isStepSet ? this.model.step : (0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.$fromInput.val(`${this.model.from}`).attr('step', `${this.model.isStepSet ? this.model.step : (0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.$stepInput.val(`${this.model.step}`).attr('step', `${(0.1).toFixed(this.model.numberOfCharactersAfterDot)}`);
    this.$intervalToggle.prop('checked', this.model.isInterval ? true : false);
    this.$verticalToggle.prop('checked', this.model.isVertical ? true : false);
    this.$tooltipsToggle.prop('checked', this.model.isTooltip ? true : false);
    this.$rangeBetweenToggle.prop('checked', this.model.isRangeBetween ? true : false);
    this.$scaleToogle.prop('checked', this.model.isScale ? true : false);

    this.setPanelPosition();
  }

  private setPanelPosition = (): void => {
    if (this.model.isVertical) {
      this.view.$panelContainer.css({'left': parseFloat(this.view.$maxValue.css('width')) + this.model.buttonLength + parseFloat(this.view.$slider.css('width')), 'transform': 'translateX(0)', 'top': 0, 'width': '150px'});
    }
    else {
      this.view.$panelContainer.css({'top': parseFloat($('.js-slider__scale-element').css('height')) + this.model.buttonLength + parseFloat(this.view.$slider.css('height')), 'left': '50%','transform': 'translateX(-50%)', 'width': '650px'});
    }
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
    this.setPanelPosition();
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
    this.setPanelPosition();
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
    this.setPanelPosition();
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
    this.setPanelPosition();
    this.model.setConfigToLocalStorage();
  }

  private toggleVertical = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isVertical = true;

      this.model.positionParameter = this.model.isVertical ? 'top' : 'left';
      this.model.lengthParameter = this.model.isVertical ? 'height' : 'width';
      this.model.scalePositionParameter = this.model.isVertical ? 'right' : 'top';
    }
    else {
      this.model.isVertical = false;

      this.model.positionParameter = this.model.isVertical ? 'top' : 'left';
      this.model.lengthParameter = this.model.isVertical ? 'height' : 'width';
      this.model.scalePositionParameter = this.model.isVertical ? 'right' : 'top';
    }
    
    this.init();
  }
}

export { Presenter };