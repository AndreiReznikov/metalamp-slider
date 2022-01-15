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
  scaleNumber: number = 5;
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
  firstTooltipPosition: number = 0;
  secondTooltipPosition: number = 0;
  firstTooltipValue: number = 0;
  secondTooltipValue: number = 0;
  rangeBetweenPosition: number = 0;
  rangeBetweenLength: number = 0;
  scaleElements: number[] = [];
  lengthBetweenScaleElements: number = 0;
  numberOfDecimalPlaces: number = 0;

  constructor(config: Config) {
    this.observer = new Observer();
    
    this.options = config;
    
    this.data = {
      isInterval: false,
      isVertical: false,
      isTooltip: true,
      isMinAndMax: true,
      isRangeBetween: true,
      isPanel: false,
      isScale: false,
      minValue: 0,
      maxValue: 100,
      from: 10,
      to: 50,
      step: 0,
      keyboard: false,
      scaleNumber: 5
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
    this.scaleNumber = this.config.scaleNumber;
  }

  public calculateInitialValues = (): void => {
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.countNumberOfDecimalPlaces();
    this.calculateMinAndMaxPositions();
    this.calculateInitialTooltipsValues();
    this.calculateTooltipsPositions();
    this.calculateStepLength();
    this.calculateScaleElementsNumber();
    this.calculateScaleElementsValues();
    this.calculateLengthBetweenScaleElements();
  }

  public setElementsParameters = (elementsParameters: ElementsParameters): void => {
    this.sliderPosition = elementsParameters.sliderPosition;
    this.sliderLength = elementsParameters.sliderLength;
    this.buttonLength = elementsParameters.buttonLength;
    this.firstTooltipLength = elementsParameters.firstTooltipLength;
    this.secondTooltipLength = elementsParameters.secondTooltipLength;
    this.minValueLength = elementsParameters.minValueLength;
    this.maxValueLength = elementsParameters.maxValueLength;
  }

  public calculateStepLength = (): void => {
    this.stepLength = parseFloat(((this.step/(this.maxValue - this.minValue)) * this.sliderLength).toFixed(this.numberOfDecimalPlaces));
  }

  public getSliderState = (): SliderState => {
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

  public getOptions = (): Options => {
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
      firstTooltipPosition: this.firstTooltipPosition,
      secondTooltipPosition: this.secondTooltipPosition,
      firstTooltipValue: this.firstTooltipValue,
      secondTooltipValue: this.secondTooltipValue,
      rangeBetweenPosition: this.rangeBetweenPosition,
      rangeBetweenLength: this.rangeBetweenLength,
      scalePositionParameter: this.scalePositionParameter,
      scaleNumber: this.scaleNumber,
      scaleElements: this.scaleElements,
      lengthBetweenScaleElements: this.lengthBetweenScaleElements
    }

    return options;
  }
  
  public validateInitialValues = (): void => {
    const areMinAndMaxNegative: boolean = this.minValue < 0 && this.maxValue < 0;

    if (this.minValue > this.maxValue) {
      const minValue = this.minValue;
      const maxValue = this.maxValue;

      this.minValue = maxValue;
      this.maxValue = minValue;
    }

    if (!areMinAndMaxNegative && this.step > this.maxValue - this.minValue) {
      this.step = 0;
    }

    if (areMinAndMaxNegative && this.step > -(this.minValue - this.maxValue)) {
      this.step = 0;
    }

    if (this.step < 0) {
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
  }

  public calculateInitialButtonsPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const fromRatio: number = this.from/(this.maxValue - this.minValue);
    const toRatio: number = this.to/(this.maxValue - this.minValue);
    
    this.firstButtonPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.buttonLength/2);
    this.secondButtonPosition = Math.round((toRatio - minRatio) * this.sliderLength - this.buttonLength/2);

    this.restrictFirstButtonPosition();
    this.restrictFirstTooltipValue();
    this.restrictSecondButtonPosition();
    this.restrictSecondTooltipValue();
  }

  public calculateInitialFirstButtonPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const fromRatio: number = this.from/(this.maxValue - this.minValue);
    
    this.firstButtonPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.buttonLength/2);

    this.restrictFirstButtonPosition();
    this.restrictFirstTooltipValue();
  }

  public calculateInitialSecondButtonPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const toRatio: number = this.to/(this.maxValue - this.minValue);

    this.secondButtonPosition = Math.round((toRatio - minRatio) * this.sliderLength - this.buttonLength/2);

    this.restrictSecondButtonPosition();
    this.restrictSecondTooltipValue();
  }

  public calculateShiftAxis1 = (event: JQuery.MouseDownEvent): number => {
    event.stopPropagation();

    const shiftX1: number = event.clientX - this.firstButtonPosition - this.sliderPosition;
    const shiftY1: number = event.clientY - this.firstButtonPosition - this.sliderPosition;
    const shiftAxis1: number = this.isVertical ? shiftY1 : shiftX1;

    return shiftAxis1;
  }

  public calculateFirstButtonPositionWhileMoving = (event: JQuery.MouseMoveEvent, shiftAxis1: number): void => {
    const clientX1: number = event.clientX;
    const clientY1: number = event.clientY;
    const clientAxis1: number = this.isVertical ? clientY1 : clientX1;

    if (this.isStepSet) {
      this.calculateFirstButtonPositionWithSetStep(clientAxis1);
    }
    else {
      this.firstButtonPosition = clientAxis1 - shiftAxis1 - this.sliderPosition;
      this.calculateTooltipsValues();
    }

    this.restrictFirstButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateFirstButtonPositionWithSetStep = (clientAxis: number): void => {
    const isCursorNearStepAhead: boolean = clientAxis - this.sliderPosition > this.firstButtonPosition + this.buttonLength/2 + this.stepLength/2;
    const isCursorNearStepBehind: boolean = clientAxis - this.sliderPosition < this.firstButtonPosition  + this.buttonLength/2 - this.stepLength/2;

    if (isCursorNearStepAhead) {
      this.firstButtonPosition += this.stepLength;
      this.calculateFirstTooltipValueWithStepAhead();
    }
    else if (isCursorNearStepBehind) {
      this.firstButtonPosition -= this.stepLength;
      this.calculateFirstTooltipValueWithStepBehind();
    }
  }

  public calculateFirstButtonPositionAfterSliderOnDown = (event: JQuery.MouseDownEvent): void => {
    const clientX1: number = event.clientX;
    const clientY1: number = event.clientY;
    const clientAxis1: number = this.isVertical ? clientY1 : clientX1;
    const intervalForFirstButtonSteps: number = this.firstButtonPosition + this.buttonLength/2 - (clientAxis1 - this.sliderPosition);
    let firstButtonStepsNumber: number = Math.round(intervalForFirstButtonSteps/this.stepLength);

    firstButtonStepsNumber = firstButtonStepsNumber < 0 ? -firstButtonStepsNumber : firstButtonStepsNumber;

    const isClickAheadOfFirstButtonWithInterval: boolean = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && clientAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
    const isClickAheadOfFirstButtonWithoutInterval: boolean = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

    const isClickAheadOfFirstButton: boolean = this.isInterval ? isClickAheadOfFirstButtonWithInterval : isClickAheadOfFirstButtonWithoutInterval;
    const isClickBehindOfFirstButton: boolean = clientAxis1 - this.sliderPosition < this.firstButtonPosition;

    if (this.isStepSet) {
      if (isClickAheadOfFirstButton) {
        //вынести
        if (this.isInterval && Math.round(this.secondButtonPosition - this.firstButtonPosition) <= Math.round(this.stepLength)) {
          this.firstButtonPosition = this.secondButtonPosition;
          this.calculateMaxFirstTooltipValue(this.secondTooltipValue);
        }
        //

        this.firstButtonPosition += firstButtonStepsNumber * this.stepLength;

        this.calculateFirstTooltipValueAfterSliderOnDownAhead(firstButtonStepsNumber);
        this.calculateMaxFirstButtonPositionAfterSliderOnDown(clientAxis1);
      }
      else if (isClickBehindOfFirstButton) {
        this.firstButtonPosition -= firstButtonStepsNumber * this.stepLength;

        this.calculateFirstTooltipValueAfterSliderOnDownBehind(firstButtonStepsNumber);
        this.calculateMinFirstButtonPositionAfterSliderOnDown(clientAxis1);
      }
    }
    else {
      if (isClickAheadOfFirstButton || isClickBehindOfFirstButton) {
        this.firstButtonPosition = clientAxis1 - this.sliderPosition - this.buttonLength/2;
        this.calculateTooltipsValues();
      }
    }

    this.restrictFirstButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateMinFirstButtonPositionAfterSliderOnDown = (clientAxis: number): void => {
    if (!this.isStepSet) return;

    const isClickBehindFirstButton: boolean = clientAxis - this.sliderPosition < this.stepLength/2;

    if (isClickBehindFirstButton) {
      this.firstButtonPosition = 0 - this.buttonLength/2;
      this.calculateMinFirstTooltipValue();
    }
  }

  private calculateMaxFirstButtonPositionAfterSliderOnDown = (clientAxis: number): void => {
    if (!this.isStepSet) return;
    
    const isClickAheadWithoutInterval: boolean = this.sliderLength - (clientAxis - this.sliderPosition) < this.stepLength/2 && !this.isInterval;
    
    if (isClickAheadWithoutInterval) {
      this.firstButtonPosition = this.sliderLength - this.buttonLength/2;
      this.calculateMaxFirstTooltipValue(this.maxValue);
    }
  }

  public calculateFirstButtonPositionAfterMinValueOnDown = (event: JQuery.MouseDownEvent): void => {
    event.stopPropagation();

    this.firstButtonPosition = 0 - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMinFirstTooltipValue();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateFirstButtonPositionAfterMaxValueOnDown = (event: JQuery.MouseDownEvent): void => {
    if (this.isInterval) return;

    event.stopPropagation();

    this.firstButtonPosition = this.sliderLength - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMaxFirstTooltipValue(this.maxValue);

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateFirstButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    if (!this.config.keyboard) return;

    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    if (!keyCodes.includes(event.keyCode)) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.firstButtonPosition += movementLength;
      if (this.isStepSet) this.calculateFirstTooltipValueWithStepAhead();
    }
    else if (keyCodeToReduce.includes(event.keyCode)) {
      this.firstButtonPosition -= movementLength;
      if (this.isStepSet) this.calculateFirstTooltipValueWithStepBehind();
    }

    this.restrictFirstButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    if (!this.isStepSet) this.calculateTooltipsValues();
    
    this.observer.notifyObservers(this.getOptions());
  }


  private restrictFirstButtonPosition = (): void => {
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

  public calculateShiftAxis2 = (event: JQuery.MouseDownEvent): number | void => {
    if (!this.isInterval) return;

    event.stopPropagation();

    const shiftX2: number = event.clientX - this.secondButtonPosition - this.sliderPosition;
    const shiftY2: number = event.clientY - this.secondButtonPosition - this.sliderPosition;
    const shiftAxis2: number = this.isVertical ? shiftY2 : shiftX2;

    return shiftAxis2;
  }

  public calculateSecondButtonPositionWhileMoving = (event: JQuery.MouseMoveEvent, shiftAxis2: number): void => {
    const clientX2: number = event.clientX;
    const clientY2: number = event.clientY;
    const clientAxis2: number = this.isVertical ? clientY2 : clientX2;

    if (this.isStepSet) {
      this.calculateSecondButtonPositionWithSetStep(clientAxis2);
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

  private calculateSecondButtonPositionWithSetStep = (clientAxis: number): void => {
    if (!this.isInterval) return;

    const isCursorNearStepAhead: boolean = clientAxis - this.sliderPosition > this.secondButtonPosition + this.buttonLength/2 + this.stepLength/2;
    const isCursorNearStepBehind: boolean = clientAxis - this.sliderPosition < this.secondButtonPosition  + this.buttonLength/2 - this.stepLength/2;

    if (isCursorNearStepAhead) {
      this.secondButtonPosition += this.stepLength;
      this.calculateSecondTooltipValueWithStepAhead();
    }
    else if (isCursorNearStepBehind) {
      this.secondButtonPosition -= this.stepLength;
      this.calculateSecondTooltipValueWithStepBehind();
    }
  }

  public calculateSecondButtonPositionAfterSliderOnDown = (event: JQuery.MouseDownEvent): void => {
    if (!this.isInterval) return;

    const clientX2: number = event.clientX;
    const clientY2: number = event.clientY;
    const clientAxis2: number = this.isVertical ? clientY2 : clientX2;
    const intervalForSecondButtonSteps: number = this.secondButtonPosition + this.buttonLength/2 - (clientAxis2 - this.sliderPosition);
    let secondButtonStepsNumber: number = Math.round(intervalForSecondButtonSteps/this.stepLength);

    secondButtonStepsNumber = secondButtonStepsNumber < 0 ? -secondButtonStepsNumber : secondButtonStepsNumber;

    const isClickAheadOfSecondButton: boolean = clientAxis2 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
    const isClickBehindOfSecondButton: boolean = clientAxis2 - this.sliderPosition < this.secondButtonPosition && clientAxis2 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;

    if (this.isStepSet) {
      if (isClickAheadOfSecondButton) {
        this.secondButtonPosition += secondButtonStepsNumber * this.stepLength;

        this.calculateSecondTooltipValueAfterSliderOnDownAhead(secondButtonStepsNumber);
        this.calculateMaxSecondButtonPositionAfterSliderOnDown(clientAxis2);
      }
      else if (isClickBehindOfSecondButton) {
        //вынести
        if (this.isInterval && Math.round(this.secondButtonPosition - this.firstButtonPosition) <= Math.round(this.stepLength)) {
          this.secondButtonPosition = this.firstButtonPosition;
          this.calculateMinSecondTooltipValue();
        }
        //

        this.secondButtonPosition -= secondButtonStepsNumber * this.stepLength;

        this.calculateSecondTooltipValueAfterSliderOnDownBehind(secondButtonStepsNumber);
      }
    }
    else {
      if (isClickAheadOfSecondButton || isClickBehindOfSecondButton) {
        this.secondButtonPosition = clientAxis2 - this.sliderPosition - this.buttonLength/2;
        this.calculateTooltipsValues();
      }
    }

    this.restrictSecondButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateMaxSecondButtonPositionAfterSliderOnDown = (clientAxis: number): void => {
    if (!this.isStepSet) return;

    if (this.sliderLength - (clientAxis - this.sliderPosition) < this.stepLength/2) {
        this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
        this.calculateMaxSecondTooltipValue();
    }
  }

  public calculateSecondButtonPositionAfterMaxValueOnDown = (event: JQuery.MouseDownEvent): void => {
    if (!this.isInterval) return;

    event.stopPropagation();

    this.secondButtonPosition = this.sliderLength - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMaxSecondTooltipValue();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateSecondButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    if (!this.config.keyboard && !this.isInterval) return;
    
    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    if (!keyCodes.includes(event.keyCode)) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.secondButtonPosition += movementLength;
      if (this.isStepSet) this.calculateSecondTooltipValueWithStepAhead();
    }
    else if (keyCodeToReduce.includes(event.keyCode)) {
      this.secondButtonPosition -= movementLength;
      if (this.isStepSet) this.calculateSecondTooltipValueWithStepBehind();
    }

    this.restrictSecondButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    if (!this.isStepSet) this.calculateTooltipsValues();

    this.observer.notifyObservers(this.getOptions());
  }

  private restrictSecondButtonPosition = (): void => {
    if (this.secondButtonPosition < this.firstButtonPosition) {
      this.secondButtonPosition = this.firstButtonPosition;
    }
    else if (this.secondButtonPosition > this.sliderLength - this.buttonLength/2) {
      this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
    }
  }

  public calculateButtonPositionAfterScaleOnDown = (event: JQuery.MouseDownEvent, scaleOptions: {isScaleElementOnDown: boolean, scaleElementPosition: string, scaleElementLength: string, scaleElementValue: string}): void => {
    event.stopPropagation();

    if (!scaleOptions.isScaleElementOnDown) return;

    const clientX1: number = event.clientX;
    const clientY1: number = event.clientY;
    const clientAxis1: number = this.isVertical ? clientY1 : clientX1;

    const isClickAheadOfFirstButtonWithInterval: boolean = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && clientAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
    const isClickAheadOfFirstButtonWithoutInterval: boolean = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

    const isClickAheadOfFirstButton: boolean = this.isInterval ? isClickAheadOfFirstButtonWithInterval : isClickAheadOfFirstButtonWithoutInterval;
    const isClickBehindOfFirstButton: boolean = clientAxis1 - this.sliderPosition < this.firstButtonPosition;
    const isClickAheadOfSecondButton: boolean = clientAxis1 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
    const isClickBehindOfSecondButton: boolean = clientAxis1 - this.sliderPosition < this.secondButtonPosition && clientAxis1 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;

    if (isClickAheadOfFirstButton || isClickBehindOfFirstButton) {
      this.firstButtonPosition = parseInt(scaleOptions.scaleElementPosition) + parseInt(scaleOptions.scaleElementLength)/2 - this.buttonLength/2;
      this.calculateFirstTooltipValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    }
    else if (isClickAheadOfSecondButton || isClickBehindOfSecondButton) {
      this.secondButtonPosition = parseInt(scaleOptions.scaleElementPosition) + parseInt(scaleOptions.scaleElementLength)/2 - this.buttonLength/2;
      this.calculateSecondTooltipValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    }

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private countNumberOfDecimalPlaces = (): void => {
    const minValueParts: string[] = `${this.minValue}`.split('.');
    const maxValueParts: string[] = `${this.maxValue}`.split('.');

    let minValueNumberOfDecimalPlaces: string = minValueParts[1];
    let maxValueNumberOfDecimalPlaces: string = maxValueParts[1];
    
    if (minValueNumberOfDecimalPlaces === undefined) minValueNumberOfDecimalPlaces = '';
    if (maxValueNumberOfDecimalPlaces === undefined) maxValueNumberOfDecimalPlaces = '';

    this.numberOfDecimalPlaces = minValueNumberOfDecimalPlaces.length > maxValueNumberOfDecimalPlaces.length  ? minValueNumberOfDecimalPlaces.length  : maxValueNumberOfDecimalPlaces.length;
  }

  private calculateRangeBetweenPosition = (): void => {
    this.rangeBetweenPosition = 0;

    if (!this.isInterval) return;
    
    this.rangeBetweenPosition = this.firstButtonPosition + this.buttonLength/2;
  }

  private calculateRangeBetweenLength = (): void => {
    this.rangeBetweenLength = this.firstButtonPosition + this.buttonLength/2;

    if (!this.isInterval) return;
      
    this.rangeBetweenLength = this.secondButtonPosition - this.firstButtonPosition;
  }

  private calculateTooltipsPositions = (): void => {
    this.firstTooltipPosition = this.firstButtonPosition + this.buttonLength/2 - this.firstTooltipLength/2;

    if (this.isInterval) {
      this.secondTooltipPosition = this.secondButtonPosition + this.buttonLength/2 - this.secondTooltipLength/2;
    }

    this.separateTooltips();
    this.showMinAndMaxValuesAfterContactWithTooltip();
  }

  private calculateInitialTooltipsValues = (): void => {
    this.firstTooltipValue = this.from;
    this.secondTooltipValue = this.to;
  }
  
  private calculateTooltipsValues = (): void => {
    this.from = parseFloat(((this.firstButtonPosition + this.buttonLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfDecimalPlaces));
    this.firstTooltipValue = this.from;

    this.restrictFirstTooltipValue();

    if (!this.isInterval) return;
    
    this.to = parseFloat(((this.secondButtonPosition + this.buttonLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;

    this.restrictSecondTooltipValue();
  }

  private calculateFirstTooltipValueAfterScaleOnDown = (value: number): void => {
    this.from = value;
    this.firstTooltipValue = this.from;
  }

  private calculateSecondTooltipValueAfterScaleOnDown = (value: number): void => {
    this.to = value;
    this.secondTooltipValue = this.to;
  }

  private calculateFirstTooltipValueAfterSliderOnDownAhead = (stepNumber: number): void => {
    this.from = parseFloat((this.from + (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));   
    this.firstTooltipValue = this.from;
  }

  private calculateFirstTooltipValueAfterSliderOnDownBehind = (stepNumber: number): void => {
    this.from = parseFloat((this.from - (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
    this.firstTooltipValue = this.from;
  }

  private calculateSecondTooltipValueAfterSliderOnDownAhead = (stepNumber: number): void => {
    this.to = parseFloat((this.to + (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;
  }

  private calculateSecondTooltipValueAfterSliderOnDownBehind = (stepNumber: number): void => {
    this.to = parseFloat((this.to - (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;
  }

  private calculateFirstTooltipValueWithStepAhead = (): void => {
    this.from = parseFloat((this.from + this.step).toFixed(this.numberOfDecimalPlaces));
    this.firstTooltipValue = this.from;

    this.restrictFirstTooltipValue();
  }

  private calculateFirstTooltipValueWithStepBehind = (): void => {
    this.from = parseFloat((this.from - this.step).toFixed(this.numberOfDecimalPlaces));
    this.firstTooltipValue = this.from;

    this.restrictFirstTooltipValue();
  }

  private calculateSecondTooltipValueWithStepAhead = (): void => {
    this.to = parseFloat((this.to + this.step).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;

    this.restrictSecondTooltipValue();
  }

  private calculateSecondTooltipValueWithStepBehind = (): void => {
    this.to = parseFloat((this.to - this.step).toFixed(this.numberOfDecimalPlaces));
    this.secondTooltipValue = this.to;

    this.restrictSecondTooltipValue();
  }

  private calculateMinFirstTooltipValue = (): void => {
    this.from = this.minValue;
    this.firstTooltipValue = this.from;
  }

  private calculateMaxFirstTooltipValue = (value: number): void => {
    this.from = value;
    this.firstTooltipValue = this.from;       
  }

  private restrictFirstTooltipValue = (): void => {
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

  private calculateMinSecondTooltipValue = (): void => {
    this.to = this.from;

    this.secondTooltipValue = this.to;
  }

  private calculateMaxSecondTooltipValue = (): void => {
    this.to = this.maxValue;

    this.secondTooltipValue = this.to;
  }

  private restrictSecondTooltipValue = (): void => {
    if (this.to < this.from) {
      this.to = this.from;
    }
    else if (this.to > this.maxValue) {
      this.to = this.maxValue;
    }

    this.secondTooltipValue = this.to;
  }

  private separateTooltips = (): void => {
    if (!this.isInterval) return;

    const areTooltipsClose = this.firstTooltipPosition + this.firstTooltipLength > this.secondTooltipPosition;

    if (!areTooltipsClose) return;
      
    this.firstTooltipPosition = this.firstButtonPosition - this.firstTooltipLength;
    this.secondTooltipPosition = this.secondButtonPosition + this.buttonLength;
  }

  private calculateMinAndMaxPositions = (): void => {
    this.minValuePosition = 0;
    this.maxValuePosition = this.sliderLength - this.maxValueLength;
  }

  private showMinAndMaxValuesAfterContactWithTooltip = (): void => {
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

  private calculateScaleElementsValues = (): void => {
    this.scaleElements.length = 0;

    const intervalForScalesElements: number = (this.maxValue - this.minValue)/(this.scaleNumber - 1);
    let minScaleElementValue: number = this.minValue;

    this.scaleElements.push(parseFloat(minScaleElementValue.toFixed(this.numberOfDecimalPlaces)));
    
    for (let i = 0; i < this.scaleNumber - 1; i++) {
      const scaleElementValue: number = minScaleElementValue += intervalForScalesElements;

      this.scaleElements.push(parseFloat((scaleElementValue).toFixed(this.numberOfDecimalPlaces)));
    }
  }

  private calculateLengthBetweenScaleElements = (): void => {
    this.lengthBetweenScaleElements = this.sliderLength/(this.scaleNumber - 1);
  }

  private calculateScaleElementsNumber = (): void => {
    if (this.options.scaleNumber) return;

    if (this.maxValue - this.minValue <= 1) {
      this.scaleNumber = 2;
    }
    else if (this.maxValue - this.minValue <= 2) {
      this.scaleNumber = 3;
    }
    else if (this.maxValue - this.minValue <= 4) {
      this.scaleNumber = 4;
    }
    else if (this.maxValue - this.minValue < 10) {
      this.scaleNumber = 5;
    }
    else if (this.minValue < 0 && this.maxValue > 0) {
      this.scaleNumber = 11;
    }
    else {
      this.scaleNumber = 6;
    }
  }
}
