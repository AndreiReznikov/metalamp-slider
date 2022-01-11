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
  $intervalToggle: JQuery<HTMLElement>;
  $tooltipsToggle: JQuery<HTMLElement>;
  $rangeBetweenToggle: JQuery<HTMLElement>;
  $scaleToogle: JQuery<HTMLElement>;
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

    this.$intervalToggle = $('<input/>').addClass('js-slider__interval-input').attr('type', 'checkbox').appendTo(this.$toggleInputsContainer);
    this.$tooltipsToggle = $('<input/>').addClass('js-slider__tooltip-input').attr('type', 'checkbox').appendTo(this.$toggleInputsContainer);
    this.$rangeBetweenToggle = $('<input/>').addClass('js-slider__range-between-input').attr('type', 'checkbox').appendTo(this.$toggleInputsContainer);
    this.$scaleToogle = $('<input/>').addClass('js-slider__scale-input').attr('type', 'checkbox').appendTo(this.$toggleInputsContainer);
    this.$verticalToggle = $('<input/>').addClass('js-slider__vertical-input').attr('type', 'checkbox').appendTo(this.$toggleInputsContainer);
    
    this.init();
    this.model.observer.addObserver(this.updateView); 

    this.view.$panelContainer.on('mousedown', this.toggleOnDown);
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

    this.view.$firstButton.on('mousedown', this.model.calculateFirstButtonPosition);
    this.view.$secondButton.on('mousedown', this.model.calculateSecondButtonPosition);
    this.view.$firstButton.on('focusin', this.model.calculateFirstButtonPositionAfterFocusing);
    this.view.$secondButton.on('focusin', this.model.calculateSecondButtonPositionAfterFocusing);
    this.view.$slider.on('mousedown', this.model.calculateFirstButtonPositionAfterSliderOnDown);
    this.view.$slider.on('mousedown', this.model.calculateSecondButtonPositionAfterSliderOnDown);
    this.view.$minValue.on('mousedown', this.model.calculateFirstButtonPositionAfterMinValueOnDown);
    this.view.$maxValue.on('mousedown', this.model.calculateFirstButtonPositionAfterMaxValueOnDown);
    this.view.$maxValue.on('mousedown', this.model.calculateSecondButtonPositionAfterMaxValueOnDown);
    this.view.$scaleContainer.on('mousedown', this.model.calculateButtonPositionAfterScaleOnDown);
  }

  private init = () => {
    this.view.initView(this.model.getSliderState());
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions().lengthParameter));
    this.model.calculateInitialSecondButtonPosition();
    this.model.calculateInitialFirstButtonPosition();
    this.model.calculateInitialValues();
    this.updateView(this.model.getOptions());
    this.initPanel();
  }

  private updateView = (options: Options) => {
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
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions().lengthParameter));
  }

  private initPanel = () => {
    if (!this.model.isPanel) return;

    this.$minInput.val(`${this.model.minValue}`);
    this.$maxInput.val(`${this.model.maxValue}`);
    this.$toInput.val(`${this.model.to}`);
    this.$fromInput.val(`${this.model.from}`);
    this.$stepInput.val(`${this.model.step}`);
    this.$intervalToggle.prop('checked', this.model.isInterval ? true : false);
    this.$verticalToggle.prop('checked', this.model.isVertical ? true : false);
    this.$tooltipsToggle.prop('checked', this.model.isTooltip ? true : false);
    this.$rangeBetweenToggle.prop('checked', this.model.isRangeBetween ? true : false);
    this.$scaleToogle.prop('checked', this.model.isScale ? true : false);
  }

  private toggleOnDown = (event: JQuery.MouseDownEvent) => {
    event.stopPropagation();
  }

  private setMin = (event: JQuery.ChangeEvent) => {
    const minValue = $(event.target).val();
    
    this.model.minValue = parseFloat(`${minValue}`);

    this.model.calculateInitialFirstButtonPosition();
    this.model.calculateInitialSecondButtonPosition();
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private setMax = (event: JQuery.ChangeEvent) => {
    const maxValue = $(event.target).val();
    
    this.model.maxValue = parseFloat(`${maxValue}`);

    this.model.calculateInitialFirstButtonPosition();
    this.model.calculateInitialSecondButtonPosition();
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private setFrom = (event: JQuery.ChangeEvent) => {
    const from = $(event.target).val();
    
    this.model.from = parseFloat(`${from}`);

    this.model.calculateInitialFirstButtonPosition();
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private setTo = (event: JQuery.ChangeEvent) => {
    const to = $(event.target).val();
    
    this.model.to = parseFloat(`${to}`);

    this.model.calculateInitialSecondButtonPosition();
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private setStep = (event: JQuery.ChangeEvent) => {
    const step = $(event.target).val();
    
    this.model.step = parseFloat(`${step}`);

    this.model.validateInitialValues();
    this.model.calculateStepLength();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private toggleInterval = (event: JQuery.ClickEvent) => {
    if ($(event.target).is(':checked')) {
      this.model.isInterval = true;
    }
    else {
      this.model.isInterval = false;
    }

    this.view.initView(this.model.getSliderState());
    this.model.calculateInitialSecondButtonPosition();
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private toggleTooltip = (event: JQuery.ClickEvent) => {
    if ($(event.target).is(':checked')) {
      this.model.isTooltip = true;
    }
    else {
      this.model.isTooltip = false;
    }

    this.view.initView(this.model.getSliderState());
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private toggleRangeBetween = (event: JQuery.ClickEvent) => {
    if ($(event.target).is(':checked')) {
      this.model.isRangeBetween = true;
    }
    else {
      this.model.isRangeBetween  = false;
    }

    this.view.initView(this.model.getSliderState());
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private toggleScale = (event: JQuery.ClickEvent) => {
    if ($(event.target).is(':checked')) {
      this.model.isScale = true;
    }
    else {
      this.model.isScale  = false;
    }

    this.view.initView(this.model.getSliderState());
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }

  private toggleVertical = (event: JQuery.ClickEvent) => {
    if ($(event.target).is(':checked')) {
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
    
    this.view.initView(this.model.getSliderState());
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions().lengthParameter));
    this.model.calculateInitialValues();

    this.model.observer.notifyObservers(this.model.getOptions());
  }
}

export { Presenter };