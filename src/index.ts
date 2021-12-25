import { mode } from "../webpack.config";
import "./index.css";

(function($) {
  const mySlider = (slider: JQuery<HTMLElement>, options: {}): JQuery => {

    const $this = slider;

    interface Config {
      isInterval: boolean;
      minValue: number;
      maxValue: number;
      from: number;
      to: number;
      step: number;
      keyboard: boolean;
      isVertical: boolean;
      isTooltip: boolean;
      isMinAndMax: boolean;
      isRangeBetween: boolean;
      isScale: boolean;
      scaleNumbers: number;
      isPanel: boolean;
    }

    interface InitialOptions {
      isInterval: boolean;
      isTooltip: boolean;
      isMinAndMax: boolean;
      isRangeBetween: boolean;
      isScale: boolean;
      isVertical: boolean;
      isPanel: boolean;
    }

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

    interface ElementsParameters {
      sliderPosition: number;
      sliderLength: number;
      buttonLength: number;
      firstTooltipLength: number;
      secondTooltipLength: number;
      minValueLength: number;
      maxValueLength: number;
      firstButtonGlobalPosition: number;
      secondButtonGlobalPosition: number;
    }

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
    
    class Model {

      observer;

      constructor() {
        this.observer = new Observer();
      }
      
      data: Config = {
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

      config: Config = $.extend({}, this.data, options);

      isInterval: boolean = this.config.isInterval;
      isVertical: boolean = this.config.isVertical;
      isPanel: boolean = this.config.isPanel;
      isTooltip: boolean = this.config.isTooltip;
      isRangeBetween: boolean = this.config.isRangeBetween;
      isScale: boolean = this.config.isScale;
      positionParameter: string = this.isVertical ? 'top' : 'left';
      lengthParameter: string = this.isVertical ? 'height' : 'width';
      isStepSet: boolean = false;
      sliderPosition: number = 0;
      sliderLength: number = 0;
      buttonLength: number = 0;
      minValue = this.config.minValue;
      maxValue = this.config.maxValue;
      showMinValue: boolean = true;
      showMaxValue: boolean = true;
      minValuePosition = 0;
      maxValuePosition = 0;
      minValueLength = 0;
      maxValueLength = 0;
      firstTooltipLength: number = 0;
      secondTooltipLength: number = 0;
      step: number = this.config.step;
      stepLength: number = 0;
      from: number = this.config.from;
      to: number = this.config.to;
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
      scaleNumbers: number = this.config.scaleNumbers;
      scaleElements: number[] = [];
      lengthBetweenScaleElements: number = 0;
      numberOfDecimalPlaces: number = 0;

      validateInitialValues = () => {
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

        if (this.from < this.minValue || this.from > this.maxValue) {
          this.from = this.minValue;
          this.firstTooltipValue = this.minValue;
        }

        if (this.to < this.minValue || this.to > this.maxValue) {
          this.to = this.maxValue;
          this.secondTooltipValue = this.maxValue;
        }

        if (this.from > this.to && this.isInterval) {
          this.from = this.to;
          this.firstTooltipValue = this.secondTooltipValue;
        }
      }

      countNumberOfDecimalPlaces = () => {
        const minValueParts: string[] = `${this.minValue}`.split('.');
        const maxValueParts: string[] = `${this.maxValue}`.split('.');

        let minValueNumberOfDecimalPlaces: string = minValueParts[1];
        let maxValueNumberOfDecimalPlaces: string = maxValueParts[1];
        
        if (minValueNumberOfDecimalPlaces === undefined) minValueNumberOfDecimalPlaces = '';
        if (maxValueNumberOfDecimalPlaces === undefined) maxValueNumberOfDecimalPlaces = '';

        this.numberOfDecimalPlaces = minValueNumberOfDecimalPlaces.length > maxValueNumberOfDecimalPlaces.length  ? minValueNumberOfDecimalPlaces.length  : maxValueNumberOfDecimalPlaces.length;
      }

      setElementsParameters = (elementsParameters: ElementsParameters) => {
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

      calculateInitialButtonsPosition = () => {
        const minRatio: number = this.minValue/(this.maxValue - this.minValue);
        const fromRatio: number = this.from/(this.maxValue - this.minValue);
        const toRatio: number = this.to/(this.maxValue - this.minValue);
        
        this.firstButtonPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.buttonLength/2);

        if (!this.isInterval) return;
        
        this.secondButtonPosition = Math.round((toRatio - minRatio) * this.sliderLength - this.buttonLength/2);
      }

      calculateFirstButtonPosition = (event: JQuery.MouseDownEvent) => {
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

      calculateFirstButtonPositionWidthSetStep = (clientAxis: number) => {
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

      calculateFirstButtonPositionAfterSliderOnDown = (event: JQuery.MouseDownEvent) => {
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

      calculateMinFirstButtonPositionAfterSliderOnDown = (clickBehind: boolean, clientAxis: number) => {
        if (!this.isStepSet) return;

        if (clickBehind && clientAxis - this.sliderPosition < this.stepLength) {
          this.firstButtonPosition = 0 - this.buttonLength/2;
          this.calculateMinFirstTooltipValue();
        }
      }

      calculateMaxFirstButtonPositionAfterSliderOnDown = (clickAhead: boolean, clientAxis: number) => {
        if (!this.isStepSet) return;

        if (clickAhead && this.sliderLength - (clientAxis - this.sliderPosition) < this.stepLength) {
          this.firstButtonPosition = this.sliderLength - this.buttonLength/2;
          this.calculateMaxFirstTooltipValue(this.maxValue);
        }
        else if (clickAhead && this.secondButtonPosition - this.firstButtonPosition < this.stepLength && this.isInterval) {
          this.firstButtonPosition = this.secondButtonPosition;
          this.calculateMaxFirstTooltipValue(this.secondTooltipValue);
        }
      }

      calculateButtonPositionAfterScaleOnDown = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        const isScaleElementOnDown = $(event.target).hasClass('js-slider__scale-element');

        if (!isScaleElementOnDown) return;

        const clientX1: number = event.clientX;
        const clientY1: number = event.clientY;
        const clientAxis1: number = this.isVertical ? clientY1 : clientX1;

        const minRatio: number = this.minValue/(this.maxValue - this.minValue);
        const scaleElementValue: number = parseFloat($(event.target).html());
        const scaleElementRatio: number = scaleElementValue/(this.maxValue - this.minValue);

        const clickAheadOfFirstButtonWidthInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && clientAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
        const clickAheadOfFirstButtonWidthoutInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

        const clickAheadOfFirstButton: boolean = this.isInterval ? clickAheadOfFirstButtonWidthInterval : clickAheadOfFirstButtonWidthoutInterval;
        const clickBehindOfFirstButton: boolean = clientAxis1 - this.sliderPosition < this.firstButtonPosition;
        const clickAheadOfSecondButton: boolean = clientAxis1 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
        const clickBehindOfSecondButton: boolean = clientAxis1 - this.sliderPosition < this.secondButtonPosition && clientAxis1 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;

        if (clickAheadOfFirstButton || clickBehindOfFirstButton) {
          this.firstButtonPosition = Math.round((scaleElementRatio - minRatio) * this.sliderLength - this.buttonLength/2);
        }
        else if (clickAheadOfSecondButton || clickBehindOfSecondButton) {
          this.secondButtonPosition = Math.round((scaleElementRatio - minRatio) * this.sliderLength - this.buttonLength/2);
        }

        this.restrictFirstButtonPosition();
        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();
        this.calculateTooltipsValues();

        this.observer.notifyObservers(this.getOptions());
      }

      calculateFirstButtonPositionAfterMinValueOnDown = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        this.firstButtonPosition = 0 - this.buttonLength/2;

        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();
        this.calculateMinFirstTooltipValue();

        this.observer.notifyObservers(this.getOptions());
      }

      calculateFirstButtonPositionAfterMaxValueOnDown = (event: JQuery.MouseDownEvent) => {
        if (this.isInterval) return;

        event.stopPropagation();

        this.firstButtonPosition = this.sliderLength - this.buttonLength/2;

        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();
        this.calculateMaxFirstTooltipValue(this.maxValue);

        this.observer.notifyObservers(this.getOptions());
      }

      calculateFirstButtonPositionAfterFocusing = (event: JQuery.FocusInEvent) => {
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

      restrictFirstButtonPosition = () => {
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

      calculateSecondButtonPosition = (event: JQuery.MouseDownEvent) => {
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

      calculateSecondButtonPositionWidthSetStep = (clientAxis: number) => {
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

      calculateSecondButtonPositionAfterSliderOnDown = (event: JQuery.MouseDownEvent) => {
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

        this.calculateMinSecondButtonPositionAfterSliderOnDown(clickBehindOfSecondButton, clientAxis2);
        this.calculateMaxSecondButtonPositionAfterSliderOnDown(clickAheadOfSecondButton, clientAxis2);
        this.restrictSecondButtonPosition();
        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();

        this.observer.notifyObservers(this.getOptions());
      }

      calculateMinSecondButtonPositionAfterSliderOnDown = (clickBehind: boolean, clientAxis: number) => {
        if (!this.isStepSet) return;

        if (clickBehind && this.secondButtonPosition - this.firstButtonPosition < this.stepLength) {
          this.secondButtonPosition = this.firstButtonPosition;
          this.calculateMinSecondTooltipValue();
        }
      }

      calculateMaxSecondButtonPositionAfterSliderOnDown = (clickAhead: boolean, clientAxis: number) => {
        if (!this.isStepSet) return;

        if (clickAhead && this.sliderLength - (clientAxis - this.sliderPosition) < this.stepLength) {
            this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
            this.calculateMaxSecondTooltipValue();
        }
      }

      calculateSecondButtonPositionAfterMaxValueOnDown = (event: JQuery.MouseDownEvent) => {
        if (!this.isInterval) return;

        event.stopPropagation();

        this.secondButtonPosition = this.sliderLength - this.buttonLength/2;

        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();
        this.calculateMaxSecondTooltipValue();

        this.observer.notifyObservers(this.getOptions());
      }

      calculateSecondButtonPositionAfterFocusing = (event: JQuery.FocusInEvent) => {
        if (!this.config.keyboard || !this.isInterval) return;

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

      restrictSecondButtonPosition = () => {
        if (this.secondButtonPosition < this.firstButtonPosition) {
          this.secondButtonPosition = this.firstButtonPosition;
        }
        else if (this.secondButtonPosition > this.sliderLength - this.buttonLength/2) {
          this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
        }
      }

      calculateRangeBetweenPosition = () => {
        this.rangeBetweenPosition = 0;

        if (!this.isInterval) return;
        
        this.rangeBetweenPosition = this.firstButtonPosition + this.buttonLength/2;
      }

      calculateRangeBetweenLength = () => {
        this.rangeBetweenLength = this.firstButtonPosition + this.buttonLength/2;

        if (!this.isInterval) return;
          
        this.rangeBetweenLength = this.secondButtonPosition - this.firstButtonPosition;
      }

      calculateTooltipsPositions = () => {
        this.firstTooltipPosition = (this.firstButtonPosition + this.buttonLength/2) - this.firstTooltipLength/2;
        this.secondTooltipPosition = (this.secondButtonPosition + this.buttonLength/2) - this.secondTooltipLength/2;


        this.separateTooltips();
        this.showMinAndMaxValues();
      }
      
      calculateTooltipsValues = () => {
        this.from = parseFloat(((this.firstButtonPosition + this.buttonLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfDecimalPlaces));
        this.firstTooltipValue = this.from;

        if (!this.isInterval) return;
        
        this.to = parseFloat(((this.secondButtonPosition + this.buttonLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfDecimalPlaces));
        this.secondTooltipValue = this.to;
      }

      calculateFirstTooltipValueAfterSliderOnDownAhead = (stepNumber: number) => {
        this.from = parseFloat((this.from + (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));   
        this.firstTooltipValue = this.from;
      }

      calculateFirstTooltipValueAfterSliderOnDownBehind = (stepNumber: number) => {
        this.from = parseFloat((this.from - (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
        this.firstTooltipValue = this.from;
      }

      calculateSecondTooltipValueAfterSliderOnDownAhead = (stepNumber: number) => {
        this.to = parseFloat((this.to + (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
        this.secondTooltipValue = this.to;
      }

      calculateSecondTooltipValueAfterSliderOnDownBehind = (stepNumber: number) => {
        this.to = parseFloat((this.to - (stepNumber * this.step)).toFixed(this.numberOfDecimalPlaces));
        this.secondTooltipValue = this.to;
      }

      calculateFirstTooltipValueWidthStepAhead = () => {
        this.from = parseFloat((this.from + this.step).toFixed(this.numberOfDecimalPlaces));
        this.firstTooltipValue = this.from;

        this.restrictFirstTooltipValue();
      }

      calculateFirstTooltipValueWidthStepBehind = () => {
        this.from = parseFloat((this.from - this.step).toFixed(this.numberOfDecimalPlaces));
        this.firstTooltipValue = this.from;

        this.restrictFirstTooltipValue();
      }

      calculateSecondTooltipValueWidthStepAhead = () => {
        this.to = parseFloat((this.to + this.step).toFixed(this.numberOfDecimalPlaces));
        this.secondTooltipValue = this.to;

        this.restrictSecondTooltipValue();
      }

      calculateSecondTooltipValueWidthStepBehind = () => {
        this.to = parseFloat((this.to - this.step).toFixed(this.numberOfDecimalPlaces));
        this.secondTooltipValue = this.to;

        this.restrictSecondTooltipValue();
      }

      calculateMinFirstTooltipValue = () => {
        this.from = this.minValue;
        this.firstTooltipValue = this.from;
      }

      calculateMaxFirstTooltipValue = (value: number) => {
        this.from = value;
        this.firstTooltipValue = this.from;       
      }

      restrictFirstTooltipValue = () => {
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

      calculateMinSecondTooltipValue = () => {
        this.to = this.from;

        this.secondTooltipValue = this.to;
      }

      calculateMaxSecondTooltipValue = () => {
        this.to = this.maxValue;

        this.secondTooltipValue = this.to;
      }

      restrictSecondTooltipValue = () => {
        if (this.to < this.from) {
          this.to = this.from;
        }
        else if (this.to > this.maxValue) {
          this.to = this.maxValue;
        }

        this.secondTooltipValue = this.to;
      }

      separateTooltips = () => {
        if (!this.isInterval) return;

        const areTooltipsClose = this.firstTooltipPosition + this.firstTooltipLength > this.secondTooltipPosition;

        if (!areTooltipsClose) return;
          
        this.firstTooltipPosition = this.firstButtonPosition - this.firstTooltipLength;
        this.secondTooltipPosition = this.secondButtonPosition + this.buttonLength;
      }

      caclulateMinAndMaxPositions = () => {
        this.minValuePosition = 0;
        this.maxValuePosition = this.sliderLength - this.maxValueLength;
      }

      showMinAndMaxValues = () => {
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

      calculateScaleElementsValues = () => {
        this.scaleElements.length = 0;

        const intervalForScalesElements: number = (this.maxValue - this.minValue)/(this.scaleNumbers - 1);
        let scaleElementValue = this.minValue;

        this.scaleElements.push(parseFloat(scaleElementValue.toFixed(this.numberOfDecimalPlaces)));
        
        for (let i = 0; i < this.scaleNumbers - 1; i++) {      
          this.scaleElements.push(parseFloat((scaleElementValue += intervalForScalesElements).toFixed(this.numberOfDecimalPlaces)));
        }
      }

      calculateLengthBetweenScaleElements = () => {
        this.lengthBetweenScaleElements = this.sliderLength/(this.scaleNumbers - 1);
      }

      calculateStepLength = () => {
        this.stepLength = Math.round((this.step/(this.maxValue - this.minValue)) * this.sliderLength);
      }

      calculateInitialValues = () => {
        this.validateInitialValues();
        this.calculateInitialButtonsPosition();
        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.countNumberOfDecimalPlaces();
        this.calculateStepLength();
        this.caclulateMinAndMaxPositions();
        this.calculateTooltipsPositions();
        this.calculateTooltipsValues();
        this.calculateScaleElementsValues();
        this.calculateLengthBetweenScaleElements();
      }

      getSliderState = () => {
        const sliderState = {
          isInterval: this.isInterval,
          isTooltip: this.isTooltip,
          isMinAndMax: this.config.isMinAndMax, 
          isRangeBetween: this.isRangeBetween, 
          isScale: this.isScale,
          isVertical: this.isVertical,
          isPanel: this.isPanel
        }

        return sliderState;
      }

      getOptions = () => {
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
          scaleNumbers: this.scaleNumbers,
          scaleElements: this.scaleElements,
          lengthBetweenScaleElements: this.lengthBetweenScaleElements
        }

        return options;
      }
    }

    class View {

      tooltips;
      firstButton;
      secondButton;
      rangeBetween;
      slider;
      minAndMaxValues;
      scale;
      panel;
      $slider: JQuery<HTMLElement>;
      $firstButton: JQuery<HTMLElement>;
      $secondButton: JQuery<HTMLElement>;
      $rangeBetween: JQuery<HTMLElement>;
      $minValue: JQuery<HTMLElement>;
      $maxValue: JQuery<HTMLElement>;
      $scaleContainer: JQuery<HTMLElement>;
      $firstTooltip: JQuery<HTMLElement>;
      $secondTooltip: JQuery<HTMLElement>;
      $panelContainer: JQuery<HTMLElement>;
      
      constructor () {
        this.tooltips = new Tooltips();
        this.firstButton = new FirstButton();
        this.secondButton = new SecondButton();
        this.rangeBetween = new RangeBetween();
        this.slider = new Slider();
        this.minAndMaxValues = new MinAndMaxValues();
        this.scale = new Scale();
        this.panel = new Panel();

        this.$slider = this.slider.$slider;
        this.$firstButton = this.firstButton.$firstButton;
        this.$secondButton = this.secondButton.$secondButton;
        this.$rangeBetween = this.rangeBetween.$rangeBetween;
        this.$minValue = this.minAndMaxValues.$minValue;
        this.$maxValue = this.minAndMaxValues.$maxValue;
        this.$scaleContainer = this.scale.$scaleContainer;
        this.$firstTooltip = this.tooltips.$firstTooltip;
        this.$secondTooltip = this.tooltips.$secondTooltip;
        this.$panelContainer = this.panel.$panelContainer;
      }

      public initView = (initialOptions: InitialOptions) => {
        this.$slider.appendTo($this).addClass('js-slider__stripe');
        this.$rangeBetween.appendTo(this.$slider).addClass('js-slider__between');
        this.$firstButton.appendTo(this.$slider).addClass('js-slider__first-button');
        this.$secondButton.appendTo(this.$slider).addClass('js-slider__second-button');
        this.$panelContainer.appendTo(this.$slider).addClass('js-slider__panel-container');
        this.$firstTooltip.appendTo(this.$slider).addClass('js-slider__first-tooltip');
        this.$secondTooltip.appendTo(this.$slider).addClass('js-slider__second-tooltip');
        this.$minValue.appendTo(this.$slider).addClass('js-slider__min-value');
        this.$maxValue.appendTo(this.$slider).addClass('js-slider__max-value');
        this.$scaleContainer.appendTo(this.$slider).addClass('js-slider__scale-container');

        if (initialOptions.isRangeBetween) {
          this.$rangeBetween.css('display', 'block');
        }
        else {
          this.$rangeBetween.css('display', 'none');
        }

        if (initialOptions.isMinAndMax) {
          this.$minValue.css('display', 'flex');
          this.$maxValue.css('display', 'flex');
        }
        else {
          this.$minValue.css('display', 'none');
          this.$maxValue.css('display', 'none');
        }

        if (initialOptions.isScale) {
          this.$scaleContainer.css('display', 'flex');
        }
        else {
          this.$scaleContainer.css('display', 'none');
        }       

        if (initialOptions.isInterval) {
          this.$secondButton.css('display', 'block');
        }
        else {
          this.$secondButton.css('display', 'none');
        }

        if (initialOptions.isTooltip) {
          this.$firstTooltip.css('display', 'flex');

          if (initialOptions.isInterval) {
            this.$secondTooltip.css('display', 'flex');
          }
          else {
            this.$secondTooltip.css('display', 'none');
          }
        }
        else {
          this.$firstTooltip.css('display', 'none');
          this.$secondTooltip.css('display', 'none');
        }

        if (initialOptions.isPanel) {
          this.$panelContainer.css('display', 'flex');
        }
        else {
          this.$panelContainer.css('display', 'none');
        }
        
        this.setPlane(initialOptions.isVertical);
      }

      private setPlane = (isVertical: boolean) => {
        const width: number = parseInt($this.css('width'));
        const height: number = parseInt($this.css('height'));

        $this.css({'width': 0, 'height': 0});
        this.$firstButton.css({'top': 0, 'left': 0, 'transform': 'translate(0, 0)'});
        this.$secondButton.css({'top': 0, 'left': 0, 'transform': 'translate(0, 0)'}); 
        this.$rangeBetween.css({'width': 0, 'height': 0, 'top': 0, 'left': 0});
        this.$firstTooltip.css({'left': 0, 'bottom': 0, 'top': 0});
        this.$secondTooltip.css({'left': 0, 'bottom': 0, 'top': 0});
        this.$minValue.css({'left': 0, 'bottom': 0, 'top': 0});
        this.$maxValue.css({'left': 0, 'bottom': 0, 'top': 0});
        this.$scaleContainer.css({'right': 0, 'top': 0, 'width': 0, 'height': 0});
        this.panel.$panelContainer.css({'top': 0, 'right': 0, 'width': 'auto', 'height': 'auto'});

        if (isVertical) {
          $this.css({'width': 8, 'height': 500});
          this.$firstButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          this.$secondButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          this.$rangeBetween.css({'width': '100%'});
          this.$firstTooltip.css({'left': this.$firstButton.css('width')});
          this.$secondTooltip.css({'left': this.$secondButton.css('width')}); 
          this.$minValue.css({'left': this.$firstButton.css('width')});
          this.$maxValue.css({'left': this.$firstButton.css('width')});
          this.$scaleContainer.css({'right': 2 * parseInt($this.css('width')) + parseInt(this.$firstButton.css('width'))});
          this.panel.$panelContainer.css({'right': 2 * (parseInt($this.css('width')) + parseInt(this.$firstButton.css('width')) + parseInt(this.$scaleContainer.css('width'))), 'height': '100%'});
          return;
        }

        $this.css({'width': 500, 'height': 8});
        this.$firstButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
        this.$secondButton.css({'top': '50%', 'transform': 'translateY(-50%)'}); 
        this.$rangeBetween.css({'height': '100%'});  
        this.$firstTooltip.css({'bottom': this.$firstButton.css('height'), 'top': ''});
        this.$secondTooltip.css({'bottom': this.$secondButton.css('height'), 'top': ''});
        this.$minValue.css({'bottom': this.$firstButton.css('height'), 'top': ''});
        this.$maxValue.css({'bottom': this.$firstButton.css('height'), 'top': ''});
        this.$scaleContainer.css({'top': parseInt($this.css('height')) + parseInt(this.$firstButton.css('height'))});
        this.panel.$panelContainer.css({'top': 2 * (parseInt($this.css('height')) + parseInt(this.$firstButton.css('height'))), 'width': '100%'});
      }

      private getCoords = (element: JQuery<HTMLElement>, isVertical: boolean) => {
          const coords = element.position();
        
          return isVertical ? coords.top : coords.left;
      }

      public getElementsParameters = (isVertical: boolean, options: Options) => {
        const elementsParameters: ElementsParameters = {
          sliderPosition: this.getCoords(this.$slider, isVertical), 
          firstButtonGlobalPosition: this.getCoords(this.$firstButton, isVertical),
          secondButtonGlobalPosition: this.getCoords(this.$secondButton, isVertical),
          sliderLength: parseInt(this.$slider.css(options.lengthParameter)), 
          buttonLength: parseInt(this.$firstButton.css(options.lengthParameter)),
          firstTooltipLength: parseInt(this.$firstTooltip.css(options.lengthParameter)),
          secondTooltipLength: parseInt(this.$secondTooltip.css(options.lengthParameter)),
          minValueLength: parseInt(this.$minValue.css(options.lengthParameter)),
          maxValueLength: parseInt(this.$maxValue.css(options.lengthParameter)),
        }

        return elementsParameters;
      }
    }

    class Slider {
      $slider: JQuery<HTMLElement> = $('<div/>');
    }

    class RangeBetween {
      $rangeBetween: JQuery<HTMLElement> = $('<div/>');

      setRangeBetweenPosition = (options: Options) => {
        this.$rangeBetween.css(options.positionParameter, options.rangeBetweenPosition);
      }

      setRangeBetweenLength = (options: Options) => {
        this.$rangeBetween.css(options.lengthParameter, options.rangeBetweenLength);
      }
    }

    class FirstButton {
      $firstButton: JQuery<HTMLElement> = $('<button/>');

      setFirstButtonPosition = (options: Options) => {
        this.$firstButton.css(options.positionParameter, options.firstButtonPosition);
      }
    }

    class SecondButton {
      $secondButton: JQuery<HTMLElement> = $('<button/>');

      setSecondButtonPosition = (options: Options) => {
        this.$secondButton.css(options.positionParameter, options.secondButtonPosition);
      }
    }

    class Tooltips {
      $firstTooltip: JQuery<HTMLElement> = $('<div/>');
      $secondTooltip: JQuery<HTMLElement> = $('<div/>');

      setFirstTooltipPosition = (options: Options) => {
        this.$firstTooltip.css(options.positionParameter, options.firstTooltipPosition);
      }

      setFirstTooltipValue = (options: Options) => {
        this.$firstTooltip.html(`${options.firstTooltipValue}`)
      }

      setSecondTooltipPosition = (options: Options) => {
        this.$secondTooltip.css(options.positionParameter, options.secondTooltipPosition);
      }

      setSecondTooltipValue = (options: Options) => {
        this.$secondTooltip.html(`${options.secondTooltipValue}`)
      }
    }

    class MinAndMaxValues {
      $minValue: JQuery<HTMLElement> = $('<div/>');
      $maxValue: JQuery<HTMLElement> = $('<div/>');

      setMinAndMaxPosition = (options: Options) => {
        this.$minValue.css(options.positionParameter, options.minValuePosition);
        this.$maxValue.css(options.positionParameter, options.maxValuePosition);
      }

      setMinAndMaxValues = (options: Options) => {
        this.$minValue.html(`${options.minValue}`);
        this.$maxValue.html(`${options.maxValue}`);
      }

      showMinAndMax = (options: Options) => {
        this.$minValue.css({'opacity': '1'});
        this.$maxValue.css({'opacity': '1'});
        
        if (!options.showMinValue) {
          this.$minValue.css({'opacity': '0'});
        }
        
        if (!options.showMaxValue) {
          this.$maxValue.css({'opacity': '0'});
        }
      }
    }

    class Scale {

      $scaleContainer: JQuery<HTMLElement> = $('<div>');

      setScaleElementsValues = (options: Options) => {
        this.$scaleContainer.empty();

        for (let i = 0; i < options.scaleElements.length; i++) {
          const $scaleElement: JQuery<HTMLElement> = $('<span>').addClass(`js-slider__scale-element js-slider__scale-element_${i}`);
          $scaleElement.html(`${options.scaleElements[i]}`);
          $scaleElement.appendTo(this.$scaleContainer);
        }
      }

      setScaleElementsPositions = (options: Options) => {
        let scaleElementPosition: number = 0;

        for (let i = 0; i < options.scaleElements.length; i++) {
          const $scaleElement: JQuery<HTMLElement> = this.$scaleContainer.find(`.js-slider__scale-element_${i}`);
          const scaleElementLength: number = parseInt($scaleElement.css(options.lengthParameter));

          $scaleElement.css(options.positionParameter, scaleElementPosition - scaleElementLength/2);

          scaleElementPosition += options.lengthBetweenScaleElements
        }
      }

      setScaleLength = (options: Options) => {
        this.$scaleContainer.css(options.lengthParameter, options.sliderLength);
      }
    }

    class Panel {
      $panelContainer: JQuery<HTMLElement> = $('<div/>');
      $minInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__min-input').attr('type', 'number').appendTo(this.$panelContainer);
      $maxInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__max-input').attr('type', 'number').appendTo(this.$panelContainer);
      $fromInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__from-input').attr('type', 'number').appendTo(this.$panelContainer);
      $toInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__to-input').attr('type', 'number').appendTo(this.$panelContainer);
      $stepInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__step-input').attr('type', 'number').appendTo(this.$panelContainer);
      $intervalToggle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__interval-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
      $verticalToggle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__vertical-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
      $tooltipsToggle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__tooltip-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
      $rangeBetweenToggle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__range-between-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
      $scaleToogle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__scale-input').attr('type', 'checkbox').appendTo(this.$panelContainer);

      setInitialPanelValues = () => {
        this.$minInput.val(`${model.minValue}`);
        this.$maxInput.val(`${model.maxValue}`);
        this.$toInput.val(`${model.to}`);
        this.$fromInput.val(`${model.from}`);
        this.$stepInput.val(`${model.step}`);
        this.$intervalToggle.prop('checked', model.isInterval ? true : false);
        this.$verticalToggle.prop('checked', model.isVertical ? true : false);
        this.$tooltipsToggle.prop('checked', model.isTooltip ? true : false);
        this.$rangeBetweenToggle.prop('checked', model.isRangeBetween ? true : false);
        this.$scaleToogle.prop('checked', model.isScale ? true : false);
      }

      toggleOnDown = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();
      }

      setMin = (event: JQuery.ChangeEvent) => {
        const minValue = $(event.target).val();
        
        model.minValue = parseFloat(`${minValue}`);

        model.calculateInitialValues();

        model.observer.notifyObservers(model.getOptions());
      }

      setMax = (event: JQuery.ChangeEvent) => {
        const maxValue = $(event.target).val();
        
        model.maxValue = parseFloat(`${maxValue}`);

        model.calculateInitialValues();

        model.observer.notifyObservers(model.getOptions());
      }

      setFrom = (event: JQuery.ChangeEvent) => {
        const from = $(event.target).val();
        
        model.from = parseFloat(`${from}`);

        model.calculateInitialValues();

        model.observer.notifyObservers(model.getOptions());
      }

      setTo = (event: JQuery.ChangeEvent) => {
        const to = $(event.target).val();
        
        model.to = parseFloat(`${to}`);

        model.calculateInitialValues();

        model.observer.notifyObservers(model.getOptions());
      }

      setStep = (event: JQuery.ChangeEvent) => {
        const step = $(event.target).val();
        
        model.step = parseFloat(`${step}`);

        model.validateInitialValues();
        model.calculateStepLength();

        model.observer.notifyObservers(model.getOptions());
      }

      toggleInterval = (event: JQuery.ClickEvent) => {
        if ($(event.target).is(':checked')) {
          model.isInterval = true;
        }
        else {
          model.isInterval = false;
        }

        view.initView(model.getSliderState());
        model.calculateInitialValues();

        model.observer.notifyObservers(model.getOptions());
      }

      toggleTooltip = (event: JQuery.ClickEvent) => {
        if ($(event.target).is(':checked')) {
          model.isTooltip = true;
        }
        else {
          model.isTooltip = false;
        }

        view.initView(model.getSliderState());
        model.calculateInitialValues();

        model.observer.notifyObservers(model.getOptions());
      }

      toggleRangeBetween = (event: JQuery.ClickEvent) => {
        if ($(event.target).is(':checked')) {
          model.isRangeBetween = true;
        }
        else {
          model.isRangeBetween  = false;
        }

        view.initView(model.getSliderState());
        model.calculateInitialValues();

        model.observer.notifyObservers(model.getOptions());
      }

      toggleScale = (event: JQuery.ClickEvent) => {
        if ($(event.target).is(':checked')) {
          model.isScale = true;
        }
        else {
          model.isScale  = false;
        }

        view.initView(model.getSliderState());
        model.calculateInitialValues();

        model.observer.notifyObservers(model.getOptions());
      }

      toggleVertical = (event: JQuery.ClickEvent) => {
        if ($(event.target).is(':checked')) {
          model.isVertical = true;

          model.positionParameter = model.isVertical ? 'top' : 'left';
          model.lengthParameter = model.isVertical ? 'height' : 'width';
        }
        else {
          model.isVertical = false;

          model.positionParameter = model.isVertical ? 'top' : 'left';
          model.lengthParameter = model.isVertical ? 'height' : 'width';
        }
        
        view.initView(model.getSliderState());
        model.setElementsParameters(view.getElementsParameters(model.isVertical, model.getOptions()));
        model.calculateInitialValues();
        presenter.updateView(model.getOptions());

        model.observer.notifyObservers(model.getOptions());
      }
    }
    

    class Presenter {

      constructor() {
        this.init();

        model.observer.addObserver(this.updateView);  

        view.$panelContainer.on('mousedown', view.panel.toggleOnDown);
        view.panel.setInitialPanelValues();
        view.panel.$minInput.on('change', view.panel.setMin);
        view.panel.$maxInput.on('change', view.panel.setMax);
        view.panel.$fromInput.on('change', view.panel.setFrom);
        view.panel.$toInput.on('change', view.panel.setTo);
        view.panel.$stepInput.on('change', view.panel.setStep);
        view.panel.$intervalToggle.on('click', view.panel.toggleInterval);
        view.panel.$verticalToggle.on('click', view.panel.toggleVertical);
        view.panel.$tooltipsToggle.on('click', view.panel.toggleTooltip);
        view.panel.$rangeBetweenToggle.on('click', view.panel.toggleRangeBetween);
        view.panel.$scaleToogle.on('click', view.panel.toggleScale);

        view.$firstButton.on('mousedown', model.calculateFirstButtonPosition);
        view.$secondButton.on('mousedown', model.calculateSecondButtonPosition);
        view.$firstButton.on('focusin', model.calculateFirstButtonPositionAfterFocusing);
        view.$secondButton.on('focusin', model.calculateSecondButtonPositionAfterFocusing);
        view.$slider.on('mousedown', model.calculateFirstButtonPositionAfterSliderOnDown);
        view.$slider.on('mousedown', model.calculateSecondButtonPositionAfterSliderOnDown);
        view.$minValue.on('mousedown', model.calculateFirstButtonPositionAfterMinValueOnDown);
        view.$maxValue.on('mousedown', model.calculateFirstButtonPositionAfterMaxValueOnDown);
        view.$maxValue.on('mousedown', model.calculateSecondButtonPositionAfterMaxValueOnDown);
        view.$scaleContainer.on('mousedown', model.calculateButtonPositionAfterScaleOnDown);
      }

      private init = () => {
        view.initView(model.getSliderState());
        model.setElementsParameters(view.getElementsParameters(model.isVertical, model.getOptions()));
        model.calculateInitialValues();
        this.updateView(model.getOptions());
      }

      updateView = (options: Options) => {
        view.firstButton.setFirstButtonPosition(options);
        view.secondButton.setSecondButtonPosition(options);
        view.tooltips.setFirstTooltipPosition(options);
        view.tooltips.setSecondTooltipPosition(options);
        view.tooltips.setFirstTooltipValue(options);
        view.tooltips.setSecondTooltipValue(options);
        view.rangeBetween.setRangeBetweenPosition(options);
        view.rangeBetween.setRangeBetweenLength(options);
        view.minAndMaxValues.setMinAndMaxValues(options);
        view.minAndMaxValues.setMinAndMaxPosition(options);
        view.minAndMaxValues.showMinAndMax(options);
        view.scale.setScaleElementsValues(options);
        view.scale.setScaleLength(options);
        view.scale.setScaleElementsPositions(options);
        model.setElementsParameters(view.getElementsParameters(model.isVertical, model.getOptions()));
      }
    }

    const model = new Model();
    const view = new View();
    const presenter = new Presenter();

    return slider;
  };

  $.fn.mySlider = function(options: {}) {
    return this.each(function() {
      mySlider($(this), options);
    });
  }
})(jQuery);

$('.js-slider').mySlider({
  isInterval: false,
  minValue: -4.5,
  maxValue: 4.5,
  step: 0,
  from: -2.5,
  to: 2.5,
  keyboard: true,
  isTooltip: true,
  isVertical: false,
  isMinAndMax: true,
  isRangeBetween: true,
  isPanel: true,
  isScale: true,
  scaleNumbers: 8
});