import { Options, Config, SliderState, ElementsParameters } from '../interfaces/interfaces';

class Observer {
  observers: Function[] = [];

  addObserver = (observer: Function) => {
    this.observers.push(observer);
  }

  notifyObservers = (options: Options) => {
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i](options);
    }
  }
}

export class Model {
  observer: Observer;
  options: Config;
  data: Config;
  config: Config;

  isInterval: boolean = false;
  isVertical: boolean = false;
  isPanel: boolean = false;
  isTooltip: boolean = true;
  isRangeBetween: boolean = true;
  isScale: boolean = true;
  positionParameter: string = this.isVertical ? 'top' : 'left';
  lengthParameter: string = this.isVertical ? 'height' : 'width';
  isMinAndMax: boolean = true;
  minValue: number = 0;
  maxValue: number = 100;
  step: number = 0;
  from: number = 20;
  to: number = 50;
  scalePositionParameter: string = this.isVertical ? 'right' : 'top';
  scaleNumbers: number = 5;
  isStepSet: boolean = false;
  sliderPosition: number = 0;
  sliderLength: number = 0;
  buttonLength: number = 0;
  showMinValue: boolean = true;
  showMaxValue: boolean = true;
  minValuePosition: number = 0;
  maxValuePosition: number = 0;
  minValueLength: number = 0;
  maxValueLength: number = 0;
  firstTooltipLength: number = 0;
  secondTooltipLength: number = 0;
  stepLength: number = 0;
  firstButtonPosition: number = 0;
  secondButtonPosition: number = 0;
  firstButtonGlobalPosition: number = 0;
  secondButtonGlobalPosition: number = 0;
  firstTooltipPosition: number = 0;
  secondTooltipPosition: number = 0;
  firstTooltipValue: number = 0;
  secondTooltipValue: number = 0;
  rangeBetweenPosition: number = 0;
  rangeBetweenLength: number = 0;
  scaleElements: number[] = [];
  lengthBetweenScaleElements: number = 0;
  numberOfDecimalPlaces: number = 0;

  constructor(options: Config) {
    this.observer = new Observer();
    
    this.options = options;
    
    this.data = {
      isInterval: false,
      minValue: 0,
      maxValue: 100,
      from: 10,
      to: 50,
      step: 0,
      keyboard: false,
      isVertical: false,
      isTooltip: true,
      isMinAndMax: true,
      isRangeBetween: true,
      isPanel: false,
      isScale: false,
      scaleNumbers: 5
    };
    
    this.config = $.extend({}, this.data, this.options);
    
    this.isInterval = this.config.isInterval;
    this.isVertical = this.config.isVertical;
    this.isPanel = this.config.isPanel;
    this.isTooltip = this.config.isTooltip;
    this.isRangeBetween = this.config.isRangeBetween;
    this.isScale = this.config.isScale;
    this.positionParameter = this.isVertical ? 'top' : 'left';
    this.lengthParameter = this.isVertical ? 'height' : 'width';
    this.isMinAndMax = this.config.isMinAndMax;
    this.minValue = this.config.minValue;
    this.maxValue = this.config.maxValue;
    this.step = this.config.step;
    this.from = this.config.from;
    this.to = this.config.to;
    this.scalePositionParameter = this.isVertical ? 'right' : 'top';
    this.scaleNumbers = this.config.scaleNumbers;
  }

  public calculateInitialValues = () => {
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.countNumberOfDecimalPlaces();
    this.calculateMinAndMaxPositions();
    this.calculateInitialTooltipsValues();
    this.calculateTooltipsPositions();
    this.calculateStepLength();
    this.calculateScaleElementsValues();
    this.calculateLengthBetweenScaleElements();
  }

  public setElementsParameters = (elementsParameters: ElementsParameters) => {
    this.sliderPosition = elementsParameters.sliderPosition;
    this.sliderLength = elementsParameters.sliderLength;
    this.buttonLength = elementsParameters.buttonLength;
    this.firstTooltipLength = elementsParameters.firstTooltipLength;
    this.secondTooltipLength = elementsParameters.secondTooltipLength;
    this.minValueLength = elementsParameters.minValueLength;
    this.maxValueLength = elementsParameters.maxValueLength;
    this.firstButtonGlobalPosition = elementsParameters.firstButtonGlobalPosition;
    this.secondButtonGlobalPosition = elementsParameters.secondButtonGlobalPosition;
  }

  public calculateStepLength = () => {
    this.stepLength = Math.round((this.step/(this.maxValue - this.minValue)) * this.sliderLength);
  }

  public getSliderState = () => {
    const sliderState: SliderState = {
      isInterval: this.isInterval,
      isTooltip: this.isTooltip,
      isMinAndMax: this.isMinAndMax, 
      isRangeBetween: this.isRangeBetween, 
      isScale: this.isScale,
      isVertical: this.isVertical,
      isPanel: this.isPanel
    }

    return sliderState;
  }

  public getOptions = () => {
    const options: Options = {
      positionParameter: this.positionParameter,
      lengthParameter: this.lengthParameter,
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
      buttonLength: this.buttonLength,
      stepLength: this.stepLength,
      minValue: this.minValue,
      maxValue: this.maxValue,
      showMinValue: this.showMinValue,
      showMaxValue: this.showMaxValue,
      minValuePosition: this.minValuePosition,
      maxValuePosition: this.maxValuePosition,
      minValueLength: this.minValueLength,
      maxValueLength: this.maxValueLength,
      firstButtonPosition: this.firstButtonPosition,
      secondButtonPosition: this.secondButtonPosition,
      firstButtonGlobalPositon: this.firstButtonGlobalPosition,
      secondButtonGlobalPositon: this.secondButtonGlobalPosition,
      firstTooltipPosition: this.firstTooltipPosition,
      secondTooltipPosition: this.secondTooltipPosition,
      firstTooltipValue: this.firstTooltipValue,
      secondTooltipValue: this.secondTooltipValue,
      rangeBetweenPosition: this.rangeBetweenPosition,
      rangeBetweenLength: this.rangeBetweenLength,
      scalePositionParameter: this.scalePositionParameter,
      scaleNumbers: this.scaleNumbers,
      scaleElements: this.scaleElements,
      lengthBetweenScaleElements: this.lengthBetweenScaleElements
    }

    return options;
  }
  
  public validateInitialValues = () => {
    const areMinAndMaxNegative: boolean = this.minValue < 0 && this.maxValue < 0;

    if (this.minValue > this.maxValue) {
      this.minValue = this.data.minValue;
      this.maxValue = this.data.maxValue;
    }

    if (!areMinAndMaxNegative && this.step > this.maxValue - this.minValue) {
      this.step = 0;
    }

    if (areMinAndMaxNegative && this.step > -(this.minValue - this.maxValue)) {
      this.step = 0;
    }

    this.isStepSet = this.step > 0;

    if (this.from < this.minValue) {
      this.from = this.minValue;
    }

    if (this.from > this.maxValue) {
      this.from = this.maxValue;
    }

    if (this.to > this.maxValue) {
      this.to = this.maxValue;
    }

    if (this.to < this.minValue) {
      this.to = this.minValue;
    }

    if (this.from > this.to && this.isInterval) {
      this.to = this.from;
    }
  }

  public calculateInitialFirstButtonPosition = () => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const fromRatio: number = this.from/(this.maxValue - this.minValue);
    
    this.firstButtonPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.buttonLength/2);
  }

  public calculateInitialSecondButtonPosition = () => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const toRatio: number = this.to/(this.maxValue - this.minValue);

    this.secondButtonPosition = Math.round((toRatio - minRatio) * this.sliderLength - this.buttonLength/2);
  }

  public calculateFirstButtonPosition = (event: JQuery.MouseDownEvent) => {
    event.stopPropagation();

    const shiftX1: number = event.clientX - this.firstButtonGlobalPosition - this.sliderPosition;
    const shiftY1: number = event.clientY - this.firstButtonGlobalPosition - this.sliderPosition;
    const shiftAxis1: number = this.isVertical ? shiftY1 : shiftX1;

    const calculateWhileFirstButtonMoving = (event: JQuery.MouseMoveEvent) => {
      const clientX1: number = event.clientX;
      const clientY1: number = event.clientY;
      const clientAxis1: number = this.isVertical ? clientY1 : clientX1;

      if (this.isStepSet) {
        this.calculateFirstButtonPositionWidthSetStep(clientAxis1);
      }
      else {
        this.firstButtonPosition = clientAxis1 - shiftAxis1 - this.sliderPosition;
        this.calculateTooltipsValues();
        this.restrictFirstTooltipValue();
      }

      this.restrictFirstButtonPosition();
      this.calculateRangeBetweenPosition();
      this.calculateRangeBetweenLength();
      this.calculateTooltipsPositions();

      this.observer.notifyObservers(this.getOptions());
    }

    $(document).on('mousemove', calculateWhileFirstButtonMoving);
    $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileFirstButtonMoving));
  }

  private calculateFirstButtonPositionWidthSetStep = (clientAxis: number) => {
    const isCursorNearStepAhead = clientAxis - this.sliderPosition > this.firstButtonPosition + this.buttonLength/2 + this.stepLength/2;
    const isCursorNearStepBehind = clientAxis - this.sliderPosition < this.firstButtonPosition  + this.buttonLength/2 - this.stepLength/2;

    if (isCursorNearStepAhead) {
      this.firstButtonPosition += this.stepLength;
      this.calculateFirstTooltipValueWidthStepAhead();
    }
    else if (isCursorNearStepBehind) {
      this.firstButtonPosition -= this.stepLength;
      this.calculateFirstTooltipValueWidthStepBehind();
    }
  }

  public calculateFirstButtonPositionAfterSliderOnDown = (event: JQuery.MouseDownEvent) => {
    const clientX1: number = event.clientX;
    const clientY1: number = event.clientY;
    const clientAxis1: number = this.isVertical ? clientY1 : clientX1;
    const intervalForFirstButtonSteps = this.firstButtonPosition + this.buttonLength/2 - (clientAxis1 - this.sliderPosition);
    let firstButtonStepsNumber = Math.round(intervalForFirstButtonSteps/this.stepLength);

    firstButtonStepsNumber = firstButtonStepsNumber < 0 ? -firstButtonStepsNumber : firstButtonStepsNumber;

    const clickAheadOfFirstButtonWidthInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && clientAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
    const clickAheadOfFirstButtonWidthoutInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

    const clickAheadOfFirstButton = this.isInterval ? clickAheadOfFirstButtonWidthInterval : clickAheadOfFirstButtonWidthoutInterval;
    const clickBehindOfFirstButton = clientAxis1 - this.sliderPosition < this.firstButtonPosition;

    if (this.isStepSet) {
      if (clickAheadOfFirstButton) {
        this.firstButtonPosition += firstButtonStepsNumber * this.stepLength;
        this.calculateFirstTooltipValueAfterSliderOnDownAhead(firstButtonStepsNumber);
      }
      else if (clickBehindOfFirstButton) {
        this.firstButtonPosition -= firstButtonStepsNumber * this.stepLength;
        this.calculateFirstTooltipValueAfterSliderOnDownBehind(firstButtonStepsNumber);
      }
    }
    else {
      if (clickAheadOfFirstButton || clickBehindOfFirstButton) {
        this.firstButtonPosition = clientAxis1 - this.sliderPosition - this.buttonLength/2;
        this.calculateTooltipsValues();
      }
    }

    this.calculateMinFirstButtonPositionAfterSliderOnDown(clickBehindOfFirstButton, clientAxis1);
    this.calculateMaxFirstButtonPositionAfterSliderOnDown(clickAheadOfFirstButton, clientAxis1);
    this.restrictFirstButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateMinFirstButtonPositionAfterSliderOnDown = (clickBehind: boolean, clientAxis: number) => {
    if (!this.isStepSet) return;

    const clickBehindFirstButton = clickBehind && clientAxis - this.sliderPosition < this.stepLength/2;

    if (clickBehindFirstButton) {
      this.firstButtonPosition = 0 - this.buttonLength/2;
      this.calculateMinFirstTooltipValue();
    }
  }

  private calculateMaxFirstButtonPositionAfterSliderOnDown = (clickAhead: boolean, clientAxis: number) => {
    if (!this.isStepSet) return;

    const clickAheadWidthoutInterval = clickAhead && this.sliderLength - (clientAxis - this.sliderPosition) < this.stepLength/2;
    const clickAheadWidthInterval = clickAhead && this.secondButtonPosition - this.firstButtonPosition < this.stepLength/2 && this.isInterval;

    if (clickAheadWidthoutInterval) {
      this.firstButtonPosition = this.sliderLength - this.buttonLength/2;
      this.calculateMaxFirstTooltipValue(this.maxValue);
    }
    else if (clickAheadWidthInterval) {
      this.firstButtonPosition = this.secondButtonPosition;
      this.calculateMaxFirstTooltipValue(this.secondTooltipValue);
    }
  }

  public calculateFirstButtonPositionAfterMinValueOnDown = (event: JQuery.MouseDownEvent) => {
    event.stopPropagation();

    this.firstButtonPosition = 0 - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMinFirstTooltipValue();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateFirstButtonPositionAfterMaxValueOnDown = (event: JQuery.MouseDownEvent) => {
    if (this.isInterval) return;

    event.stopPropagation();

    this.firstButtonPosition = this.sliderLength - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMaxFirstTooltipValue(this.maxValue);

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateFirstButtonPositionAfterFocusing = (event: JQuery.FocusInEvent) => {
    if (!this.config.keyboard) return;

    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    const calculateFirstButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent) => {
      if (!keyCodes.includes(event.keyCode)) return;

      const movementLength = this.isStepSet ? this.stepLength : 1;

      if (keyCodeToIncrease.includes(event.keyCode)) {
        this.firstButtonPosition += movementLength;
        if (this.isStepSet) this.calculateFirstTooltipValueWidthStepAhead();
      }
      else if (keyCodeToReduce.includes(event.keyCode)) {
        this.firstButtonPosition -= movementLength;
        if (this.isStepSet) this.calculateFirstTooltipValueWidthStepBehind();
      }

      this.restrictFirstButtonPosition();
      this.calculateRangeBetweenPosition();
      this.calculateRangeBetweenLength();
      this.calculateTooltipsPositions();
      if (!this.isStepSet) this.calculateTooltipsValues();

      this.observer.notifyObservers(this.getOptions());
    }

    $(event.target).on('keydown', calculateFirstButtonPositionAfterKeydown);
    $(event.target).on('focusout', () => $(event.target).off('keydown', calculateFirstButtonPositionAfterKeydown));
  }

  private restrictFirstButtonPosition = () => {
    if (this.firstButtonPosition < 0 - this.buttonLength/2) {
      this.firstButtonPosition = 0 - this.buttonLength/2;
    }
    else if (this.firstButtonPosition > this.sliderLength - this.buttonLength/2) {
      this.firstButtonPosition = this.sliderLength - this.buttonLength/2;
    }
    if (this.isInterval && this.firstButtonPosition > this.secondButtonPosition) {
      this.firstButtonPosition = this.secondButtonPosition;
    }
  }

  public calculateSecondButtonPosition = (event: JQuery.MouseDownEvent) => {
    if (!this.isInterval) return;

    event.stopPropagation();

    const shiftX2: number = event.clientX - this.secondButtonGlobalPosition - this.sliderPosition;
    const shiftY2: number = event.clientY - this.secondButtonGlobalPosition - this.sliderPosition;
    const shiftAxis2: number = this.isVertical ? shiftY2 : shiftX2;

    const calculateWhileSecondButtonMoving = (event: JQuery.MouseMoveEvent) => {
      const clientX2: number = event.clientX;
      const clientY2: number = event.clientY;
      const clientAxis2: number = this.isVertical ? clientY2 : clientX2;

      if (this.isStepSet) {
        this.calculateSecondButtonPositionWidthSetStep(clientAxis2);
      }
      else {
        this.secondButtonPosition = clientAxis2 - shiftAxis2 - this.sliderPosition;
        this.calculateTooltipsValues();
        this.restrictSecondTooltipValue();
      }

      this.restrictSecondButtonPosition();
      this.calculateRangeBetweenPosition();
      this.calculateRangeBetweenLength();
      this.calculateTooltipsPositions();

      this.observer.notifyObservers(this.getOptions());
    }

    $(document).on('mousemove', calculateWhileSecondButtonMoving);
    $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileSecondButtonMoving));
  }

  private calculateSecondButtonPositionWidthSetStep = (clientAxis: number) => {
    if (!this.isInterval) return;

    const isCursorNearStepAhead = clientAxis - this.sliderPosition > this.secondButtonPosition + this.buttonLength/2 + this.stepLength/2;
    const isCursorNearStepBehind = clientAxis - this.sliderPosition < this.secondButtonPosition  + this.buttonLength/2 - this.stepLength/2;

    if (isCursorNearStepAhead) {
      this.secondButtonPosition += this.stepLength;
      this.calculateSecondTooltipValueWidthStepAhead();
    }
    else if (isCursorNearStepBehind) {
      this.secondButtonPosition -= this.stepLength;
      this.calculateSecondTooltipValueWidthStepBehind();
    }
  }

  public calculateSecondButtonPositionAfterSliderOnDown = (event: JQuery.MouseDownEvent) => {
    if (!this.isInterval) return;

    const clientX2: number = event.clientX;
    const clientY2: number = event.clientY;
    const clientAxis2: number = this.isVertical ? clientY2 : clientX2;
    const intervalForSecondButtonSteps = this.secondButtonPosition + this.buttonLength/2 - (clientAxis2 - this.sliderPosition);
    let secondButtonStepsNumber = Math.round(intervalForSecondButtonSteps/this.stepLength);

    secondButtonStepsNumber = secondButtonStepsNumber < 0 ? -secondButtonStepsNumber : secondButtonStepsNumber;

    const clickAheadOfSecondButton = clientAxis2 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
    const clickBehindOfSecondButton = clientAxis2 - this.sliderPosition < this.secondButtonPosition && clientAxis2 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;

    if (this.isStepSet) {
      if (clickAheadOfSecondButton) {
        this.secondButtonPosition += secondButtonStepsNumber * this.stepLength;
        this.calculateSecondTooltipValueAfterSliderOnDownAhead(secondButtonStepsNumber);
      }
      else if (clickBehindOfSecondButton) {
        this.secondButtonPosition -= secondButtonStepsNumber * this.stepLength;
        this.calculateSecondTooltipValueAfterSliderOnDownBehind(secondButtonStepsNumber);
      }
    }
    else {
      if (clickAheadOfSecondButton || clickBehindOfSecondButton) {
        this.secondButtonPosition = clientAxis2 - this.sliderPosition - this.buttonLength/2;
        this.calculateTooltipsValues();
      }
    }

    this.calculateMinSecondButtonPositionAfterSliderOnDown(clickBehindOfSecondButton);
    this.calculateMaxSecondButtonPositionAfterSliderOnDown(clickAheadOfSecondButton, clientAxis2);
    this.restrictSecondButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateMinSecondButtonPositionAfterSliderOnDown = (clickBehind: boolean) => {
    if (!this.isStepSet) return;

    if (clickBehind && this.secondButtonPosition - this.firstButtonPosition < this.stepLength/2) {
      this.secondButtonPosition = this.firstButtonPosition;
      this.calculateMinSecondTooltipValue();
    }
  }

  private calculateMaxSecondButtonPositionAfterSliderOnDown = (clickAhead: boolean, clientAxis: number) => {
    if (!this.isStepSet) return;

    if (clickAhead && this.sliderLength - (clientAxis - this.sliderPosition) < this.stepLength/2) {
        this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
        this.calculateMaxSecondTooltipValue();
    }
  }

  public calculateSecondButtonPositionAfterMaxValueOnDown = (event: JQuery.MouseDownEvent) => {
    if (!this.isInterval) return;

    event.stopPropagation();

    this.secondButtonPosition = this.sliderLength - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMaxSecondTooltipValue();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateSecondButtonPositionAfterFocusing = (event: JQuery.FocusInEvent) => {
    if (!this.config.keyboard && !this.isInterval) return;

    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    const calculateSecondButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent) => {
      if (!keyCodes.includes(event.keyCode)) return;

      const movementLength = this.isStepSet ? this.stepLength : 1;

      if (keyCodeToIncrease.includes(event.keyCode)) {
        this.secondButtonPosition += movementLength;
        if (this.isStepSet) this.calculateSecondTooltipValueWidthStepAhead();
      }
      else if (keyCodeToReduce.includes(event.keyCode)) {
        this.secondButtonPosition -= movementLength;
        if (this.isStepSet) this.calculateSecondTooltipValueWidthStepBehind();
      }

      this.restrictSecondButtonPosition();
      this.calculateRangeBetweenPosition();
      this.calculateRangeBetweenLength();
      this.calculateTooltipsPositions();
      if (!this.isStepSet) this.calculateTooltipsValues();

      this.observer.notifyObservers(this.getOptions());
    }

    $(event.target).on('keydown', calculateSecondButtonPositionAfterKeydown);
    $(event.target).on('focusout', () => $(event.target).off('keydown', calculateSecondButtonPositionAfterKeydown));
  }

  private restrictSecondButtonPosition = () => {
    if (this.secondButtonPosition < this.firstButtonPosition) {
      this.secondButtonPosition = this.firstButtonPosition;
    }
    else if (this.secondButtonPosition > this.sliderLength - this.buttonLength/2) {
      this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
    }
  }

  public calculateButtonPositionAfterScaleOnDown = (event: JQuery.MouseDownEvent) => {
    event.stopPropagation();

    const isScaleElementOnDown = $(event.target).hasClass('js-slider__scale-element');

    if (!isScaleElementOnDown) return;

    const clientX1: number = event.clientX;
    const clientY1: number = event.clientY;
    const clientAxis1: number = this.isVertical ? clientY1 : clientX1;

    const clickAheadOfFirstButtonWidthInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && clientAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
    const clickAheadOfFirstButtonWidthoutInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

    const clickAheadOfFirstButton: boolean = this.isInterval ? clickAheadOfFirstButtonWidthInterval : clickAheadOfFirstButtonWidthoutInterval;
    const clickBehindOfFirstButton: boolean = clientAxis1 - this.sliderPosition < this.firstButtonPosition;
    const clickAheadOfSecondButton: boolean = clientAxis1 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
    const clickBehindOfSecondButton: boolean = clientAxis1 - this.sliderPosition < this.secondButtonPosition && clientAxis1 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;

    if (clickAheadOfFirstButton || clickBehindOfFirstButton) {
      this.firstButtonPosition = parseInt($(event.target).css(this.positionParameter)) + parseInt($(event.target).css(this.lengthParameter))/2 - this.buttonLength/2;
      this.calculateFirstTooltipValueAfterScaleOnDown(parseFloat($(event.target).html()));
    }
    else if (clickAheadOfSecondButton || clickBehindOfSecondButton) {
      this.secondButtonPosition = parseInt($(event.target).css(this.positionParameter)) + parseInt($(event.target).css(this.lengthParameter))/2 - this.buttonLength/2;
      this.calculateSecondTooltipValueAfterScaleOnDown(parseFloat($(event.target).html()));
    }

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private countNumberOfDecimalPlaces = () => {
    const minValueParts: string[] = `${this.minValue}`.split('.');
    const maxValueParts: string[] = `${this.maxValue}`.split('.');

    let minValueNumberOfDecimalPlaces: string = minValueParts[1];
    let maxValueNumberOfDecimalPlaces: string = maxValueParts[1];
    
    if (minValueNumberOfDecimalPlaces === undefined) minValueNumberOfDecimalPlaces = '';
    if (maxValueNumberOfDecimalPlaces === undefined) maxValueNumberOfDecimalPlaces = '';

    this.numberOfDecimalPlaces = minValueNumberOfDecimalPlaces.length > maxValueNumberOfDecimalPlaces.length  ? minValueNumberOfDecimalPlaces.length  : maxValueNumberOfDecimalPlaces.length;
  }

  private calculateRangeBetweenPosition = () => {
    this.rangeBetweenPosition = 0;

    if (!this.isInterval) return;
    
    this.rangeBetweenPosition = this.firstButtonPosition + this.buttonLength/2;
  }

  private calculateRangeBetweenLength = () => {
    this.rangeBetweenLength = this.firstButtonPosition + this.buttonLength/2;

    if (!this.isInterval) return;
      
    this.rangeBetweenLength = this.secondButtonPosition - this.firstButtonPosition;
  }

  private calculateTooltipsPositions = () => {
    this.firstTooltipPosition = this.firstButtonPosition + this.buttonLength/2 - this.firstTooltipLength/2;

    if (this.isInterval) {
      this.secondTooltipPosition = this.secondButtonPosition + this.buttonLength/2 - this.secondTooltipLength/2;
    }

    this.separateTooltips();
    this.showMinAndMaxValuesAfterContactWidthTooltip();
  }

  private calculateInitialTooltipsValues = () => {
    this.firstTooltipValue = this.from;
    this.secondTooltipValue = this.to;
  }
  
  private calculateTooltipsValues = () => {
    this.from = parseFloat(((this.firstButtonPosition + this.buttonLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfDecimalPlaces));
    this.firstTooltipValue = this.from;

    if (!this.isInterval) return;
    
    this.to = parseFloat(((this.secondButtonPosition + this.buttonLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;
  }

  private calculateFirstTooltipValueAfterScaleOnDown = (value: number) => {
    this.from = value;
    this.firstTooltipValue = this.from;
  }

  private calculateSecondTooltipValueAfterScaleOnDown = (value: number) => {
    this.to = value;
    this.secondTooltipValue = this.to;
  }

  private calculateFirstTooltipValueAfterSliderOnDownAhead = (stepNumber: number) => {
    this.from = parseFloat((this.from + (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));   
    this.firstTooltipValue = this.from;
  }

  private calculateFirstTooltipValueAfterSliderOnDownBehind = (stepNumber: number) => {
    this.from = parseFloat((this.from - (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
    this.firstTooltipValue = this.from;
  }

  private calculateSecondTooltipValueAfterSliderOnDownAhead = (stepNumber: number) => {
    this.to = parseFloat((this.to + (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;
  }

  private calculateSecondTooltipValueAfterSliderOnDownBehind = (stepNumber: number) => {
    this.to = parseFloat((this.to - (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;
  }

  private calculateFirstTooltipValueWidthStepAhead = () => {
    this.from = parseFloat((this.from + this.step).toFixed(this.numberOfDecimalPlaces));
    this.firstTooltipValue = this.from;

    this.restrictFirstTooltipValue();
  }

  private calculateFirstTooltipValueWidthStepBehind = () => {
    this.from = parseFloat((this.from - this.step).toFixed(this.numberOfDecimalPlaces));
    this.firstTooltipValue = this.from;

    this.restrictFirstTooltipValue();
  }

  private calculateSecondTooltipValueWidthStepAhead = () => {
    this.to = parseFloat((this.to + this.step).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;

    this.restrictSecondTooltipValue();
  }

  private calculateSecondTooltipValueWidthStepBehind = () => {
    this.to = parseFloat((this.to - this.step).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;

    this.restrictSecondTooltipValue();
  }

  private calculateMinFirstTooltipValue = () => {
    this.from = this.minValue;
    this.firstTooltipValue = this.from;
  }

  private calculateMaxFirstTooltipValue = (value: number) => {
    this.from = value;
    this.firstTooltipValue = this.from;       
  }

  private restrictFirstTooltipValue = () => {
    if (this.from < this.minValue) {
      this.from = this.minValue;
    }
    else if (this.isInterval && this.from > this.to) {
      this.from = this.to;
    }
    else if (this.from > this.maxValue) {
      this.from = this.maxValue;
    }

    this.firstTooltipValue = this.from; 
  }

  private calculateMinSecondTooltipValue = () => {
    this.to = this.from;

    this.secondTooltipValue = this.to;
  }

  private calculateMaxSecondTooltipValue = () => {
    this.to = this.maxValue;

    this.secondTooltipValue = this.to;
  }

  private restrictSecondTooltipValue = () => {
    if (this.to < this.from) {
      this.to = this.from;
    }
    else if (this.to > this.maxValue) {
      this.to = this.maxValue;
    }

    this.secondTooltipValue = this.to;
  }

  private separateTooltips = () => {
    if (!this.isInterval) return;

    const areTooltipsClose = this.firstTooltipPosition + this.firstTooltipLength > this.secondTooltipPosition;

    if (!areTooltipsClose) return;
      
    this.firstTooltipPosition = this.firstButtonPosition - this.firstTooltipLength;
    this.secondTooltipPosition = this.secondButtonPosition + this.buttonLength;
  }

  private calculateMinAndMaxPositions = () => {
    this.minValuePosition = 0;
    this.maxValuePosition = this.sliderLength - this.maxValueLength;
  }

  private showMinAndMaxValuesAfterContactWidthTooltip = () => {
    this.showMinValue = true;
    this.showMaxValue = true;

    if (this.firstTooltipPosition < this.minValuePosition + this.minValueLength) {
      this.showMinValue = false;
    }

    if (this.isInterval && this.secondTooltipPosition + this.secondTooltipLength > this.maxValuePosition) {
      this.showMaxValue = false;
    }
    else if (this.firstTooltipPosition + this.firstTooltipLength > this.maxValuePosition) {
      this.showMaxValue = false;
    }       
  }

  private calculateScaleElementsValues = () => {
    this.scaleElements.length = 0;

    const intervalForScalesElements: number = (this.maxValue - this.minValue)/(this.scaleNumbers - 1);
    let scaleElementValue = this.minValue;

    this.scaleElements.push(parseFloat(scaleElementValue.toFixed(this.numberOfDecimalPlaces)));
    
    for (let i = 0; i < this.scaleNumbers - 1; i++) {      
      this.scaleElements.push(parseFloat((scaleElementValue += intervalForScalesElements).toFixed(this.numberOfDecimalPlaces)));
    }
  }

  private calculateLengthBetweenScaleElements = () => {
    this.lengthBetweenScaleElements = this.sliderLength/(this.scaleNumbers - 1);
  }
}
