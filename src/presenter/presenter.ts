interface Options {
  positionParameter: string;
  lengthParameter: string;
  sliderPosition: number;
  sliderLength: number;
  buttonLength: number;
  stepLength: number;
  minValuePosition: number;
  maxValuePosition: number;
  minValue: number;
  maxValue: number;
  showMinValue: boolean;
  showMaxValue: boolean;
  minValueLength: number;
  maxValueLength: number;
  firstButtonPosition: number;
  secondButtonPosition: number;
  firstButtonGlobalPositon: number;
  secondButtonGlobalPositon: number;
  firstTooltipPosition: number;
  secondTooltipPosition: number;
  firstTooltipValue: number | string;
  secondTooltipValue: number | string;
  rangeBetweenPosition: number;
  rangeBetweenLength: number;
  scaleNumbers: number;
  scaleElements: number[];
  lengthBetweenScaleElements: number;
}

class Presenter {
    
  model;
  view;

  constructor(model: any, view: any) {
    this.model = model;
    this.view = view;
    
    this.init();
    this.model.observer.addObserver(this.updateView);  

    // this.view.$panelContainer.on('mousedown', this.view.panel.toggleOnDown);
    // this.view.panel.$minInput.on('change', this.view.panel.setMin);
    // this.view.panel.$maxInput.on('change', this.view.panel.setMax);
    // this.view.panel.$fromInput.on('change', this.view.panel.setFrom);
    // this.view.panel.$toInput.on('change', this.view.panel.setTo);
    // this.view.panel.$stepInput.on('change', this.view.panel.setStep);
    // this.view.panel.$intervalToggle.on('click', this.view.panel.toggleInterval);
    // this.view.panel.$verticalToggle.on('click', this.view.panel.toggleVertical);
    // this.view.panel.$tooltipsToggle.on('click', this.view.panel.toggleTooltip);
    // this.view.panel.$rangeBetweenToggle.on('click', this.view.panel.toggleRangeBetween);
    // this.view.panel.$scaleToogle.on('click', this.view.panel.toggleScale);

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
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions()));
    this.model.calculateInitialSecondButtonPosition();
    this.model.calculateInitialFirstButtonPosition();
    this.model.calculateInitialValues();
    this.updateView(this.model.getOptions());
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
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions()));
  }
}

export { Presenter };