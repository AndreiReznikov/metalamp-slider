import {
  ModelOptions,
  Config,
  UserConfig,
  SubViewOptions,
  Options,
} from '../interfaces/interfaces';
import Observer from '../observer/observer';

class Model {
  observer: Observer;

  userConfig: UserConfig;

  data: Config;

  config: Config;

  min = 0;

  max = 100;

  step = 0;

  from = 20;

  to = 50;

  panelPosition = 0;

  scaleNumber = 5;

  stepLength = 0;

  scaleElementHeight = 0;

  lengthBetweenScaleElements = 0;

  numberOfCharactersAfterDot = 0;

  scaleElements: number[] = [];

  double = false;

  vertical = false;

  showLimit = true;

  showTooltip = true;

  showRange = true;

  showScale = true;

  useKeyboard = false;

  isStepSet = false;

  positionParameter = this.vertical ? 'top' : 'left';

  lengthParameter = this.vertical ? 'height' : 'width';

  scalePositionParameter = this.vertical ? 'right' : 'top';

  modelOptions: ModelOptions;

  subViewOptions: SubViewOptions;

  constructor(userConfig: UserConfig = {}) {
    this.observer = new Observer();

    this.userConfig = userConfig;
    this.data = {
      double: false,
      vertical: false,
      showTooltip: true,
      showLimit: true,
      showRange: true,
      showScale: false,
      useKeyboard: false,
      min: 0,
      max: 100,
      from: 10,
      to: 50,
      step: 0,
      scaleNumber: 5,
    };

    this.config = $.extend({}, this.data, this.userConfig);

    this.setConfigParameters();

    this.modelOptions = this.getModelOptions();
    this.subViewOptions = {
      sliderPosition: 0,
      sliderLength: 0,
      runnerFromPosition: 0,
      runnerToPosition: 0,
      runnerLength: 0,
      limitMinLength: 0,
      limitMaxLength: 0,
      shiftAxis: 0,
      clickPosition: 0,
      isMinFrom: false,
      isMaxFrom: false,
      isMaxTo: false,
      isCursorNearStepAheadFrom: false,
      isCursorNearStepBehindFrom: false,
      isCursorNearStepAheadTo: false,
      isCursorNearStepBehindTo: false,
      isClickAheadOfRunnerFrom: false,
      isClickBehindOfRunnerFrom: false,
      isClickForRunnerFrom: false,
      isClickAheadOfRunnerTo: false,
      isClickBehindOfRunnerTo: false,
      isClickForRunnerTo: false,
      runnerFromStepsNumber: 0,
      runnerToStepsNumber: 0,
      isScaleElementOnDown: false,
      scaleElementPosition: 0,
      scaleElementLength: 0,
      scaleElementValue: '',
    };
  }

  public setSubViewOptions = (options: Options): void => {
    this.subViewOptions = options.subViewOptions;
  };

  public calculateStepLength = (): void => {
    this.stepLength = parseFloat(((this.step
      / (this.max - this.min))
      * this.subViewOptions.sliderLength).toFixed(this.numberOfCharactersAfterDot));
  };

  public getModelOptions = (): ModelOptions => {
    const modelOptions: ModelOptions = {
      double: this.double,
      vertical: this.vertical,
      showTooltip: this.showTooltip,
      showLimit: this.showLimit,
      showRange: this.showRange,
      showScale: this.showScale,
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
      numberOfCharactersAfterDot: this.numberOfCharactersAfterDot,
    };

    return modelOptions;
  };

  public getOptions = (): Options => {
    const options: Options = {
      modelOptions: this.getModelOptions(),
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

  public calculateFrom = (options: Options): void => {
    if (this.isStepSet) {
      if (options.subViewOptions.isCursorNearStepAheadFrom) {
        this.from = parseFloat((this.from + this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (options.subViewOptions.isCursorNearStepBehindFrom) {
        this.from = parseFloat((this.from - this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (options.subViewOptions.isClickAheadOfRunnerFrom) {
        this.from = parseFloat((this.from + (options.subViewOptions.runnerFromStepsNumber
          * this.step)).toFixed(this.numberOfCharactersAfterDot));
      } else if (options.subViewOptions.isClickBehindOfRunnerFrom) {
        this.from = parseFloat((this.from - (options.subViewOptions.runnerFromStepsNumber
          * this.step)).toFixed(this.numberOfCharactersAfterDot));
      }
    } else {
      this.from = parseFloat((((options.subViewOptions.runnerFromPosition
        + options.subViewOptions.runnerLength / 2) / options.subViewOptions.sliderLength)
        * (this.max - this.min) + this.min).toFixed(
        this.numberOfCharactersAfterDot,
      ));
    }

    if (options.subViewOptions.isMinFrom) {
      this.from = this.min;
    }
    if (options.subViewOptions.isMaxFrom) {
      this.from = this.max;
    }
    if (options.subViewOptions.isScaleElementOnDown
        && options.subViewOptions.isClickForRunnerFrom) {
      this.from = Number(options.subViewOptions.scaleElementValue);
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

  public calculateTo = (options: Options): void => {
    if (this.isStepSet) {
      if (options.subViewOptions.isCursorNearStepAheadTo) {
        this.to = parseFloat((this.to + this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (options.subViewOptions.isCursorNearStepBehindTo) {
        this.to = parseFloat((this.to - this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (options.subViewOptions.isClickAheadOfRunnerTo) {
        this.to = parseFloat((this.to + (options.subViewOptions.runnerToStepsNumber
          * this.step)).toFixed(this.numberOfCharactersAfterDot));
      } else if (options.subViewOptions.isClickBehindOfRunnerTo) {
        this.to = parseFloat((this.to - (options.subViewOptions.runnerToStepsNumber
          * this.step)).toFixed(this.numberOfCharactersAfterDot));
      }
    } else {
      this.to = parseFloat((((options.subViewOptions.runnerToPosition
        + options.subViewOptions.runnerLength / 2) / options.subViewOptions.sliderLength)
        * (this.max - this.min) + this.min).toFixed(
        this.numberOfCharactersAfterDot,
      ));
    }

    if (options.subViewOptions.isMaxTo) {
      this.to = this.max;
    }
    if (options.subViewOptions.isScaleElementOnDown
      && options.subViewOptions.isClickForRunnerTo) {
      this.to = Number(options.subViewOptions.scaleElementValue);
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

  // public calculatePanelPosition = (): void => {
  //   const maxWidth: number = Math.max(30, 30);

  //   if (this.isVertical) {
  //     this.panelPosition = maxWidth + 10;
  //   } else {
  //     this.panelPosition = this.scaleElementHeight + 10;
  //   }
  // };

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
    this.double = this.config.double;
    this.vertical = this.config.vertical;
    this.showTooltip = this.config.showTooltip;
    this.showLimit = this.config.showLimit;
    this.showRange = this.config.showRange;
    this.showScale = this.config.showScale;
    this.useKeyboard = this.config.useKeyboard;
    this.positionParameter = this.vertical ? 'top' : 'left';
    this.lengthParameter = this.vertical ? 'height' : 'width';
    this.scalePositionParameter = this.vertical ? 'right' : 'top';
    this.min = this.config.min;
    this.max = this.config.max;
    this.step = this.config.step;
    this.from = this.config.from;
    this.to = this.config.to;
    this.scaleNumber = this.config.scaleNumber;
  };

  private restrictFrom = (): void => {
    const isFromLessThanMinimum: boolean = this.from < this.min;
    const isIntervalAndFromMoreThanTo: boolean = this.double && this.from > this.to;
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
}

export default Model;
