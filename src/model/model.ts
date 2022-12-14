import {
  Options,
  Config,
  UserConfig,
  SubViewOptions,
  ElementsParameters,
} from '../interfaces/interfaces';
import Observer from './observer';

class Model {
  observer: Observer;

  userConfig: UserConfig;

  data: Config;

  config: Config;

  isInterval = false;

  isVertical = false;

  isPanel = false;

  isTooltip = true;

  isRange = true;

  isScale = true;

  keyboard = false;

  positionParameter: string = this.isVertical ? 'top' : 'left';

  lengthParameter: string = this.isVertical ? 'height' : 'width';

  isLimit = true;

  isWrongMouseButtonPressed = false;

  min = 0;

  max = 100;

  step = 0;

  from = 20;

  to = 50;

  scalePositionParameter: string = this.isVertical ? 'right' : 'top';

  panelPosition = 0;

  panelPositionParameter: string = this.isVertical ? 'left' : 'top';

  scaleNumber = 5;

  isStepSet = false;

  stepLength = 0;

  scaleElements: number[] = [];

  scaleElementHeight = 0;

  lengthBetweenScaleElements = 0;

  numberOfCharactersAfterDot = 0;

  subViewOptions: any;

  constructor(userConfig: UserConfig = {}) {
    this.observer = new Observer();

    this.userConfig = userConfig;
    this.data = {
      isInterval: false,
      isVertical: false,
      isTooltip: true,
      isLimit: true,
      isRange: true,
      isPanel: false,
      isScale: false,
      min: 0,
      max: 100,
      from: 10,
      to: 50,
      step: 0,
      keyboard: false,
      scaleNumber: 5,
    };

    this.config = $.extend({}, this.data, this.userConfig);

    this.setConfigParameters();
  }

  public setSubViewOptions = (subViewOptions: any) => {
    this.subViewOptions = subViewOptions;
  };

  public setElementsParameters = (elementsParameters: ElementsParameters): void => {
    this.scaleElementHeight = elementsParameters.scaleElementHeight;
  };

  public calculateStepLength = (): void => {
    this.stepLength = parseFloat(((this.step
      / (this.max - this.min))
      * this.subViewOptions.sliderLength).toFixed(this.numberOfCharactersAfterDot));
  };

  public getOptions = (): Options => {
    const options: Options = {
      isInterval: this.isInterval,
      isTooltip: this.isTooltip,
      isLimit: this.isLimit,
      isRange: this.isRange,
      isScale: this.isScale,
      isVertical: this.isVertical,
      isPanel: this.isPanel,
      isStepSet: this.isStepSet,
      positionParameter: this.positionParameter,
      lengthParameter: this.lengthParameter,
      to: this.to,
      from: this.from,
      step: this.step,
      stepLength: this.stepLength,
      min: this.min,
      max: this.max,
      scalePositionParameter: this.scalePositionParameter,
      scaleNumber: this.scaleNumber,
      scaleElements: this.scaleElements,
      lengthBetweenScaleElements: this.lengthBetweenScaleElements,
      panelPosition: this.panelPosition,
      panelPositionParameter: this.panelPositionParameter,
      numberOfCharactersAfterDot: this.numberOfCharactersAfterDot,
      subViewOptions: this.subViewOptions,
    };

    return options;
  };

  public validateInitialValues = (): void => {
    const areMinAndMaxNegative: boolean = this.min < 0 && this.max < 0;
    const isMinAndMaxPositiveAndStepMoreThanDifference: boolean = !areMinAndMaxNegative
      && this.step > this.max - this.min;
    const isMinAndMaxNegativeAndStepMoreThanDifference: boolean = areMinAndMaxNegative
      && this.step > -(this.min - this.max);

    if (this.min > this.max) {
      const { min } = this;
      const { max } = this;

      this.min = max;
      this.max = min;
    }

    if (isMinAndMaxPositiveAndStepMoreThanDifference) {
      this.step = 0;
    }

    if (isMinAndMaxNegativeAndStepMoreThanDifference) {
      this.step = 0;
    }

    if (this.step < 0) {
      this.step = 0;
    }

    this.isStepSet = this.step > 0;

    if (this.from < this.min) {
      this.from = this.min;
    }

    if (this.from > this.max) {
      this.from = this.max;
    }

    if (this.to > this.max) {
      this.to = this.max;
    }

    if (this.to < this.min) {
      this.to = this.min;
    }
  };

  public calculateFrom = (subViewOptions: SubViewOptions): void => {
    if (this.isStepSet) {
      if (subViewOptions.isCursorNearStepAheadFrom) {
        this.from = parseFloat((this.from + this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (subViewOptions.isCursorNearStepBehindFrom) {
        this.from = parseFloat((this.from - this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (subViewOptions.isClickAheadOfRunnerFrom) {
        this.from = parseFloat((this.from + (subViewOptions.runnerFromStepsNumber
          * this.step)).toFixed(this.numberOfCharactersAfterDot));
      } else if (subViewOptions.isClickBehindOfRunnerFrom) {
        this.from = parseFloat((this.from - (subViewOptions.runnerFromStepsNumber
          * this.step)).toFixed(this.numberOfCharactersAfterDot));
      }
    } else {
      this.from = parseFloat((((subViewOptions.runnerFromPosition
        + subViewOptions.runnerLength / 2) / subViewOptions.sliderLength)
        * (this.max - this.min) + this.min).toFixed(
        this.numberOfCharactersAfterDot,
      ));
    }

    if (subViewOptions.isMinFrom) {
      this.from = this.min;
    }
    if (subViewOptions.isMaxFrom) {
      this.from = this.max;
    }

    this.restrictFrom();

    this.observer.notifyObservers(this.getOptions());
  };

  public calculateRunnerFromPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    // const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    // const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    // const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    // const isKeyboardOrWrongKeyCode: boolean = !this.keyboard || !keyCodes.includes(event.keyCode);

    // if (isKeyboardOrWrongKeyCode) return;

    // const movementLength: number = this.isStepSet ? this.stepLength : 1;

    // if (keyCodeToIncrease.includes(event.keyCode)) {
    //   this.runnerFromPosition += movementLength;
    //   // if (this.isStepSet) this.calculateTooltipFromValueWithStepAhead();
    // } else if (keyCodeToReduce.includes(event.keyCode)) {
    //   this.runnerFromPosition -= movementLength;
    //   // if (this.isStepSet) this.calculateTooltipFromValueWithStepBehind();
    // }

    // // this.restrictRunnerFromPosition();
    // // this.calculateRangePosition();
    // // this.calculateRangeLength();
    // // this.calculateTooltipsPositions();
    // // if (!this.isStepSet) this.calculateTooltipsValues();

    // this.observer.notifyObservers(this.getOptions());
  };

  public calculateTo = (subViewOptions: SubViewOptions): void => {
    if (this.isStepSet) {
      if (subViewOptions.isCursorNearStepAheadTo) {
        this.to = parseFloat((this.to + this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (subViewOptions.isCursorNearStepBehindTo) {
        this.to = parseFloat((this.to - this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (subViewOptions.isClickAheadOfRunnerTo) {
        this.to = parseFloat((this.to + (subViewOptions.runnerToStepsNumber
          * this.step)).toFixed(this.numberOfCharactersAfterDot));
      } else if (subViewOptions.isClickBehindOfRunnerTo) {
        this.to = parseFloat((this.to - (subViewOptions.runnerToStepsNumber
          * this.step)).toFixed(this.numberOfCharactersAfterDot));
      }
    } else {
      this.to = parseFloat((((subViewOptions.runnerToPosition
        + subViewOptions.runnerLength / 2) / subViewOptions.sliderLength)
        * (this.max - this.min) + this.min).toFixed(
        this.numberOfCharactersAfterDot,
      ));
    }

    if (subViewOptions.isMaxTo) {
      this.to = this.max;
    }

    this.restrictTo();

    this.observer.notifyObservers(this.getOptions());
  };

  public calculateRunnerToPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    // const isKeyboardAndInterval: boolean = this.keyboard && this.isInterval;

    // const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    // const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    // const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    // const isKeyboardOrWrongKeyCode: boolean = !isKeyboardAndInterval
    //   || !keyCodes.includes(event.keyCode);

    // if (isKeyboardOrWrongKeyCode) return;

    // const movementLength: number = this.isStepSet ? this.stepLength : 1;

    // if (keyCodeToIncrease.includes(event.keyCode)) {
    //   this.runnerToPosition += movementLength;
    //   // if (this.isStepSet) this.calculateTooltipToValueWithStepAhead();
    // } else if (keyCodeToReduce.includes(event.keyCode)) {
    //   this.runnerToPosition -= movementLength;
    //   // if (this.isStepSet) this.calculateTooltipToValueWithStepBehind();
    // }

    // // this.restrictRunnerToPosition();
    // // this.calculateRangePosition();
    // // this.calculateRangeLength();
    // // this.calculateTooltipsPositions();
    // // if (!this.isStepSet) this.calculateTooltipsValues();

    // this.observer.notifyObservers(this.getOptions());
  };

  // public calculateRunnerPositionAfterScaleOnDown = (
  //   event: JQuery.TriggeredEvent,
  //   scaleOptions: {
  //     isScaleElementOnDown: boolean,
  //     scaleElementPosition: number,
  //     scaleElementLength: number,
  //     scaleElementValue: string,
  //   } = {
  //     isScaleElementOnDown: true,
  //     scaleElementPosition: 0,
  //     scaleElementLength: 0,
  //     scaleElementValue: '',
  //   },
  // ): void => {
  //   event.stopPropagation();

  //   // const isWrongMouseButtonOrWrongElement: boolean = this.checkIsWrongMouseButtonPressed(event)
  //   //   || !scaleOptions.isScaleElementOnDown;

  //   // if (isWrongMouseButtonOrWrongElement) return;

  //   let pageX1 = 0;
  //   let pageY1 = 0;

  //   if (event.pageX !== undefined) {
  //     pageX1 = event.pageX;
  //   }

  //   if (event.pageY !== undefined) {
  //     pageY1 = event.pageY;
  //   }

  //   const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

  //   const isClickAheadOfRunnerFromWithInterval: boolean = pageAxis1 - this.sliderPosition
  //     > this.runnerFromPosition + this.runnerLength
  //     && pageAxis1 - this.sliderPosition < this.runnerFromPosition + this.runnerLength
  //     + (this.runnerToPosition - this.runnerFromPosition) / 2;
  //   const isClickAheadOfRunnerFromWithoutInterval: boolean = pageAxis1 - this.sliderPosition
  //     > this.runnerFromPosition + this.runnerLength;

  //   const isClickAheadOfRunnerFrom: boolean = this.isInterval
  //     ? isClickAheadOfRunnerFromWithInterval : isClickAheadOfRunnerFromWithoutInterval;
  //   const isClickBehindOfRunnerFrom: boolean = pageAxis1 - this.sliderPosition
  //     < this.runnerFromPosition;
  //   const isClickAheadOfRunnerTo: boolean = pageAxis1 - this.sliderPosition
  //     > this.runnerToPosition + this.runnerLength;
  //   const isClickBehindOfRunnerTo: boolean = pageAxis1 - this.sliderPosition < this.runnerToPosition
  //     && pageAxis1 - this.sliderPosition >= this.runnerFromPosition + this.runnerLength
  //     + (this.runnerToPosition - this.runnerFromPosition) / 2;
  //   const isClickForRunnerFrom: boolean = isClickAheadOfRunnerFrom || isClickBehindOfRunnerFrom;
  //   const isClickForRunnerTo: boolean = isClickAheadOfRunnerTo || isClickBehindOfRunnerTo;

  //   if (isClickForRunnerFrom) {
  //     this.runnerFromPosition = scaleOptions.scaleElementPosition + scaleOptions.scaleElementLength
  //       / 2 - this.runnerLength / 2;
  //     this.calculateTooltipFromValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
  //   } else if (isClickForRunnerTo) {
  //     this.runnerToPosition = scaleOptions.scaleElementPosition + scaleOptions.scaleElementLength
  //       / 2 - this.runnerLength / 2;
  //     this.calculateTooltipToValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
  //   }

  //   // this.calculateRangePosition();
  //   // this.calculateRangeLength();
  //   // this.calculateTooltipsPositions();

  //   this.observer.notifyObservers(this.getOptions());
  // };

  public calculatePanelPosition = (): void => {
    const maxWidth: number = Math.max(30, 30);

    if (this.isVertical) {
      this.panelPosition = maxWidth + 10;
    } else {
      this.panelPosition = this.scaleElementHeight + 10;
    }
  };

  public countNumberOfCharactersAfterDot = (): void => {
    const minValuesBeforeAndAfterDot: string[] = `${this.min}`.split('.');
    const maxValuesBeforeAndAfterDot: string[] = `${this.max}`.split('.');

    let minValuesAfterDot: string = minValuesBeforeAndAfterDot[1];
    let maxValuesAfterDot: string = maxValuesBeforeAndAfterDot[1];

    if (minValuesAfterDot === undefined) minValuesAfterDot = '';
    if (maxValuesAfterDot === undefined) maxValuesAfterDot = '';

    this.numberOfCharactersAfterDot = minValuesAfterDot.length > maxValuesAfterDot.length
      ? minValuesAfterDot.length : maxValuesAfterDot.length;
  };

  // private showMinAndMaxValuesAfterContactWithTooltip = (): void => {
  //   this.isMinValueShow = true;
  //   this.isMaxValueShow = true;

  //   const isTooltipFromTouchesMinValue: boolean = this.tooltipFromPosition
  //     < this.minValuePosition + this.minValueLength;
  //   const isTooltipFromTouchesMaxValue: boolean = this.tooltipFromPosition
  //  + this.tooltipFromLength
  //     > this.maxValuePosition;
  //   const isTooltipToTouchesMaxValue: boolean = this.isInterval
  //     && this.tooltipToPosition + this.tooltipToLength > this.maxValuePosition;

  //   if (isTooltipFromTouchesMinValue) {
  //     this.isMinValueShow = false;
  //   }

  //   if (isTooltipToTouchesMaxValue) {
  //     this.isMaxValueShow = false;
  //   } else if (isTooltipFromTouchesMaxValue) {
  //     this.isMaxValueShow = false;
  //   }
  // };

  public calculateScaleElementsValues = (): void => {
    this.scaleElements.length = 0;

    let minScaleElementValue: number = parseFloat(
      this.min.toFixed(this.numberOfCharactersAfterDot),
    );
    const intervalForScaleElements: number = (this.max - this.min)
      / (this.scaleNumber - 1);

    this.scaleElements.push(minScaleElementValue);

    for (let i = 0; i < this.scaleNumber - 1; i += 1) {
      const scaleElementValue: number = parseFloat((minScaleElementValue
        += intervalForScaleElements).toFixed(this.numberOfCharactersAfterDot));

      this.scaleElements.push(scaleElementValue);
    }
  };

  public calculateScaleElementsNumber = (): void => {
    if (this.userConfig.scaleNumber) return;

    const isDifferenceBetweenMaxMinValuesLessOrEqualToOne: boolean = this.max - this.min
      <= 1 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxMinValuesLessOrEqualToTwo: boolean = this.max - this.min
      <= 2 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxMinValuesLessOrEqualToFour: boolean = this.max - this.min
      <= 4 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxMinValuesLessThanTen: boolean = this.max - this.min < 10;
    const isMinValueNegativeMaxValuePositive: boolean = this.min < 0 && this.max > 0;

    if (isDifferenceBetweenMaxMinValuesLessOrEqualToOne) {
      this.scaleNumber = 2;
    } else if (isDifferenceBetweenMaxMinValuesLessOrEqualToTwo) {
      this.scaleNumber = 3;
    } else if (isDifferenceBetweenMaxMinValuesLessOrEqualToFour) {
      this.scaleNumber = 4;
    } else if (isDifferenceBetweenMaxMinValuesLessThanTen) {
      this.scaleNumber = 5;
    } else if (isMinValueNegativeMaxValuePositive) {
      this.scaleNumber = 11;
    } else {
      this.scaleNumber = 6;
    }
  };

  // private alignRunnerFromWithRunnerToАfterApproaching = (): void => {
  //   const isRunnerFromNearRunnerTo: boolean = this.isInterval
  //   && Math.round(this.runnerToPosition
  // - this.runnerFromPosition) <= Math.round(this.stepLength);

  //   if (isRunnerFromNearRunnerTo) {
  //     this.runnerFromPosition = this.runnerToPosition;
  //     this.calculateMaxTooltipFromValue(this.tooltipToValue);
  //   }
  // };

  // private alignRunnerToWithRunnerFromАfterApproaching = (): void => {
  //   const isRunnerFromNearRunnerTo: boolean = this.isInterval
  //     && Math.round(this.runnerToPosition - this.runnerFromPosition)
  //     <= Math.round(this.stepLength);

  //   if (isRunnerFromNearRunnerTo) {
  //     this.runnerToPosition = this.runnerFromPosition;
  //     this.calculateMinTooltipToValue();
  //   }
  // };

  // private calculateMinRunnerFromPositionAfterSliderOnDown = (pageAxis = 0): void => {
  //   if (!this.isStepSet) return;

  //   const isClickNearMinimum: boolean = pageAxis - this.sliderPosition < this.stepLength / 2;

  //   if (isClickNearMinimum) {
  //     this.runnerFromPosition = 0 - this.runnerLength / 2;
  //     this.calculateMinTooltipFromValue();
  //   }
  // };

  // private calculateMaxRunnerFromPositionAfterSliderOnDown = (pageAxis = 0): void => {
  //   if (!this.isStepSet) return;

  //   const isClickNearMaximumWithoutInterval: boolean = this.sliderLength
  //   - (pageAxis - this.sliderPosition) < this.stepLength / 2
  //   && !this.isInterval;

  //   if (isClickNearMaximumWithoutInterval) {
  //     this.runnerFromPosition = this.sliderLength - this.runnerLength / 2;
  //     this.calculateMaxTooltipFromValue(this.maxValue);
  //   }
  // };

  // private calculateMaxRunnerToPositionAfterSliderOnDown = (pageAxis = 0): void => {
  //   const isIntervalAndStep: boolean = this.isInterval && this.isStepSet;

  //   if (!isIntervalAndStep) return;

  //   const isClickNearMaximum: boolean = this.sliderLength - (pageAxis - this.sliderPosition)
  //     < this.stepLength / 2;

  //   if (isClickNearMaximum) {
  //     this.runnerToPosition = this.sliderLength - this.runnerLength / 2;
  //     this.calculateMaxTooltipToValue();
  //   }
  // };

  private setConfigParameters = (): void => {
    this.isInterval = this.config.isInterval;
    this.isVertical = this.config.isVertical;
    this.isPanel = this.config.isPanel;
    this.isTooltip = this.config.isTooltip;
    this.isLimit = this.config.isLimit;
    this.isRange = this.config.isRange;
    this.isScale = this.config.isScale;
    this.keyboard = this.config.keyboard;
    this.positionParameter = this.isVertical ? 'top' : 'left';
    this.lengthParameter = this.isVertical ? 'height' : 'width';
    this.min = this.config.min;
    this.max = this.config.max;
    this.step = this.config.step;
    this.from = this.config.from;
    this.to = this.config.to;
    this.scalePositionParameter = this.isVertical ? 'right' : 'top';
    this.scaleNumber = this.config.scaleNumber;
    this.panelPositionParameter = this.isVertical ? 'left' : 'top';
  };

  // private calculateTooltipFromValueAfterScaleOnDown = (value = 0): void => {
  //   this.from = value;
  //   this.tooltipFromValue = this.from;
  // };

  // private calculateTooltipToValueAfterScaleOnDown = (value = 0): void => {
  //   this.to = value;
  //   this.tooltipToValue = this.to;
  // };

  private restrictFrom = (): void => {
    const isFromLessThanMinimum: boolean = this.from < this.min;
    const isIntervalAndFromMoreThanTo: boolean = this.isInterval && this.from > this.to;
    const isFromMoreThanMaximum: boolean = this.from > this.max;

    if (isFromLessThanMinimum) {
      this.from = this.min;
    } else if (isIntervalAndFromMoreThanTo) {
      this.from = this.to;
    } else if (isFromMoreThanMaximum) {
      this.from = this.max;
    }
  };

  private restrictTo = (): void => {
    if (!this.isStepSet) return;

    const isToLessThanFrom: boolean = this.to < this.from;
    const isToMoreThanMaximum: boolean = this.to > this.max;

    if (isToLessThanFrom) {
      this.to = this.from;
    } else if (isToMoreThanMaximum) {
      this.to = this.max;
    }
  };

  // private separateTooltips = (): void => {
  //   const areTooltipsClose: boolean = this.tooltipFromPosition + this.tooltipFromLength
  //     > this.tooltipToPosition;
  //   const areTooltipsCloseOrSingleRunner: boolean = !areTooltipsClose || !this.isInterval;

  //   if (areTooltipsCloseOrSingleRunner) return;

  //   this.tooltipFromPosition = this.runnerFromPosition - this.tooltipFromLength;
  //   this.tooltipToPosition = this.runnerToPosition + this.runnerLength;
  // };

  // private checkIsWrongMouseButtonPressed = (event: JQuery.TriggeredEvent): boolean => {
  //   this.isWrongMouseButtonPressed = event.pointerType === 'mouse' && event.buttons !== 1;

  //   return this.isWrongMouseButtonPressed;
  // };
}

export default Model;
