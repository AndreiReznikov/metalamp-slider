import {
  ModelOptions,
  Config,
  UserConfig,
  SubViewOptions,
  Options,
  DIRECTION,
  LENGTH,
} from '../interfaces/interfaces';
import Observer from '../Observer';

class Model {
  observer: Observer;

  userConfig: UserConfig;

  data: Config;

  config: Config;

  min = 0;

  max = 100;

  step = 0;

  from = 10;

  to = 50;

  fromRemains = 0;

  toRemains = 0;

  minRemains = 0;

  maxRemains = 0;

  scaleNumber = 2;

  stepLength = 0;

  numberOfCharactersAfterDot = 0;

  scaleElements: number[] = [];

  double = false;

  vertical = false;

  showLimit = true;

  showTooltip = true;

  showRange = true;

  showScale = true;

  localeString = false;

  isStepSet = false;

  positionParameter = DIRECTION.LEFT;

  lengthParameter = LENGTH.WIDTH;

  scalePositionParameter = DIRECTION.TOP;

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
      localeString: false,
      min: 0,
      max: 100,
      from: 10,
      to: 50,
      step: 0,
      scaleNumber: 2,
    };

    this.config = $.extend({}, this.data, this.userConfig);
    this.setConfig();
    this.setPositionParameters();

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
      leftOrRight: '',
      upOrDown: '',
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
      areTooltipsClose: false,
      isLimitMinShown: true,
      isLimitMaxShown: true,
      runnerFromStepsNumber: 0,
      runnerToStepsNumber: 0,
      isScaleElementOnDown: false,
      scaleElementPosition: 0,
      scaleElementLength: 0,
      scaleElementValue: 0,
      scaleElementsCurrentNumber: 0,
    };
  }

  public validateInitialValues = (): void => {
    const areLimitsNegative: boolean = this.min < 0 && this.max < 0;
    const isLimitsPositiveAndStepMoreThanDifference: boolean = !areLimitsNegative
      && this.step > this.max - this.min;
    const isLimitsNegativeAndStepMoreThanDifference: boolean = areLimitsNegative
      && this.step > -(this.min - this.max);
    const isStepIncorrect: boolean = isLimitsPositiveAndStepMoreThanDifference
      || isLimitsNegativeAndStepMoreThanDifference
      || this.step < 0
      || (this.step > Math.abs(this.min) && this.step > Math.abs(this.max))
      || Math.floor(Math.abs(this.max - this.min) / this.step) <= 1;

    if (this.min > this.max) {
      const { min } = this;
      const { max } = this;

      this.min = max;
      this.max = min;
    }

    if (this.min === this.max) {
      this.min = 0;
      this.max = 100;
    }

    if (isStepIncorrect) {
      this.step = 0;
    }

    if (this.scaleNumber < 0) {
      this.scaleNumber = 0;
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

    if (this.to < this.from) {
      this.to = this.from;
    }
  };

  public calculateRemains = (): void => {
    this.fromRemains = 0;
    this.toRemains = 0;
    this.minRemains = 0;
    this.maxRemains = 0;

    if (!this.isStepSet) return;

    this.fromRemains = parseFloat((this.from % this.step).toFixed(this.numberOfCharactersAfterDot));
    this.toRemains = parseFloat((this.to % this.step).toFixed(this.numberOfCharactersAfterDot));
    this.minRemains = parseFloat((this.min % this.step).toFixed(this.numberOfCharactersAfterDot));
    this.maxRemains = parseFloat((this.max % this.step).toFixed(this.numberOfCharactersAfterDot));

    if (this.min > 0) {
      this.minRemains = this.step - this.minRemains;
    }

    if (Math.abs(this.fromRemains) === Math.abs(this.step)) this.fromRemains = 0;
    if (Math.abs(this.toRemains) === Math.abs(this.step)) this.toRemains = 0;

    const fromCharactersAfterDot: number = `${this.from}`.split('.')[1]?.length;
    const toCharactersAfterDot: number = `${this.to}`.split('.')[1]?.length;
    const stepCharactersAfterDot: number = `${this.step}`.split('.')[1]?.length;

    const isFromMatchWithStep: boolean = (fromCharactersAfterDot || 0)
      !== (stepCharactersAfterDot || 0)
      && this.fromRemains !== 0;
    const isToMatchWithStep: boolean = (toCharactersAfterDot || 0)
      !== (stepCharactersAfterDot || 0)
      && this.toRemains !== 0;

    if (isFromMatchWithStep) {
      this.fromRemains = this.from % this.step;
    }

    if (isToMatchWithStep) {
      this.toRemains = this.to % this.step;
    }

    if (Math.abs(this.minRemains) === Math.abs(this.step)) {
      this.minRemains = 0;
    } else if (Math.abs(this.min) < Math.abs(this.step) && this.min < 0) {
      this.minRemains = this.step - (Math.abs(this.step) - Math.abs(this.min));
    }

    const isNegativeMaxLessThanStep: boolean = Math.abs(this.max) < Math.abs(this.step)
      && this.max < 0 && this.maxRemains !== 0;
    const isNegativeMaxMoreThanStep: boolean = Math.abs(this.max) > Math.abs(this.step)
      && this.max < 0 && this.maxRemains !== 0;

    if (Math.abs(this.maxRemains) === Math.abs(this.step)) {
      this.maxRemains = 0;
    } else if (isNegativeMaxLessThanStep) {
      this.maxRemains = Math.abs(this.step) - Math.abs(this.max);
    } else if (isNegativeMaxMoreThanStep) {
      this.maxRemains = (Math.trunc(Math.abs(this.max) / Math.abs(this.step))
        * this.step + this.step) - Math.abs(this.max);
    }

    this.from -= this.fromRemains;
    this.to -= this.toRemains;

    const isFromEqualZeroWithNegativeLimins: boolean = this.from === 0
      && this.min < 0 && this.max < 0;
    const isFromEqualZeroWithPositiveLimins: boolean = this.from === 0
      && this.min > 0 && this.max > 0;
    const isToEqualZeroWithNegativeLimins: boolean = this.to === 0
      && this.min < 0 && this.max < 0;
    const isToEqualZeroWithPositiveLimins: boolean = this.to === 0
      && this.min > 0 && this.max > 0;

    if (isFromEqualZeroWithNegativeLimins) {
      this.from -= this.step;
    }
    if (isFromEqualZeroWithPositiveLimins) {
      this.from += this.step;
    }
    if (isToEqualZeroWithNegativeLimins) {
      this.to -= this.step;
    }
    if (isToEqualZeroWithPositiveLimins) {
      this.to += this.step;
    }
  };

  public setPositionParameters = (): void => {
    this.positionParameter = this.vertical ? DIRECTION.TOP : DIRECTION.LEFT;
    this.lengthParameter = this.vertical ? LENGTH.HEIGHT : LENGTH.WIDTH;
    this.scalePositionParameter = this.vertical ? DIRECTION.RIGHT : DIRECTION.TOP;
  };

  public setSubViewOptions = (options: Options): void => {
    this.subViewOptions = options.subViewOptions;
  };

  public getModelOptions = (): ModelOptions => {
    const modelOptions: ModelOptions = {
      double: this.double,
      vertical: this.vertical,
      showTooltip: this.showTooltip,
      showLimit: this.showLimit,
      showRange: this.showRange,
      showScale: this.showScale,
      localeString: this.localeString,
      isStepSet: this.isStepSet,
      positionParameter: this.positionParameter,
      lengthParameter: this.lengthParameter,
      to: this.to,
      from: this.from,
      step: this.step,
      stepLength: this.stepLength,
      min: this.min,
      max: this.max,
      fromRemains: this.fromRemains,
      toRemains: this.toRemains,
      minRemains: this.minRemains,
      maxRemains: this.maxRemains,
      scalePositionParameter: this.scalePositionParameter,
      scaleNumber: this.scaleNumber,
      scaleElements: this.scaleElements,
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

  public calculateFrom = (options: Options): void => {
    const {
      runnerFromPosition,
      runnerLength,
      sliderLength,
      isMinFrom,
      isMaxFrom,
      isScaleElementOnDown,
      isClickForRunnerFrom,
      scaleElementValue,
    } = options.subViewOptions;

    const from = parseFloat((((runnerFromPosition
      + runnerLength / 2) / sliderLength)
      * (this.max - this.min) + this.min).toFixed(this.numberOfCharactersAfterDot));

    if (this.isStepSet) {
      const currentFromRemains: number = parseFloat(
        (from % this.step).toFixed(this.numberOfCharactersAfterDot),
      );

      if (currentFromRemains !== 0 && Math.abs(currentFromRemains) !== this.step) {
        this.from = parseFloat(
          (from - currentFromRemains).toFixed(this.numberOfCharactersAfterDot),
        );
      } else {
        this.from = from;
      }
    } else {
      this.from = from;
    }

    if (isMinFrom) {
      this.from = this.min;
    }
    if (isMaxFrom) {
      this.from = this.max;
    }
    if (isScaleElementOnDown
        && isClickForRunnerFrom) {
      this.from = Number(scaleElementValue);
    }

    this.restrictFrom();

    this.observer.notifyObservers(this.getOptions());
  };

  public restrictFrom = (): void => {
    const isFromLessThanMinimum: boolean = this.from < this.min;
    const isIntervalAndFromMoreThanTo: boolean = this.double && this.from > this.to;
    const isFromMoreThanMaximum: boolean = this.from > this.max;
    const isFromMoreThanMaxRemains: boolean = this.from > this.max - this.maxRemains
      && this.isStepSet;
    const isFromLessThanMinRemains: boolean = this.from < this.min + this.minRemains
      && this.isStepSet;

    if (isFromLessThanMinimum) {
      this.from = this.min;
    } else if (isIntervalAndFromMoreThanTo) {
      this.from = this.to;
    } else if (isFromMoreThanMaximum) {
      this.from = this.max;
    }

    if (isFromMoreThanMaxRemains) {
      this.from = this.max - this.maxRemains;
    } else if (isFromLessThanMinRemains) {
      this.from = this.min + this.minRemains;
    }
  };

  public calculateTo = (options: Options): void => {
    if (!this.double) return;

    const {
      runnerToPosition,
      runnerLength,
      sliderLength,
      isMaxTo,
      isScaleElementOnDown,
      isClickForRunnerTo,
      scaleElementValue,
    } = options.subViewOptions;

    const to = parseFloat((((runnerToPosition
      + runnerLength / 2) / sliderLength)
      * (this.max - this.min) + this.min).toFixed(this.numberOfCharactersAfterDot));

    if (this.isStepSet) {
      const currentToRemains: number = parseFloat(
        (to % this.step).toFixed(this.numberOfCharactersAfterDot),
      );

      if (currentToRemains !== 0 && Math.abs(currentToRemains) !== this.step) {
        this.to = parseFloat(
          (to - currentToRemains).toFixed(this.numberOfCharactersAfterDot),
        );
      } else {
        this.to = to;
      }
    } else {
      this.to = to;
    }

    if (isMaxTo) {
      this.to = this.max;
    }
    if (isScaleElementOnDown
      && isClickForRunnerTo) {
      this.to = Number(scaleElementValue);
    }

    this.restrictTo();

    this.observer.notifyObservers(this.getOptions());
  };

  public restrictTo = (): void => {
    const isToLessThanFrom: boolean = this.to < this.from;
    const isToMoreThanMaximum: boolean = this.to > this.max;
    const isToMoreThanMaxRemains: boolean = this.to > this.max - this.maxRemains && this.isStepSet;

    if (isToLessThanFrom) {
      this.to = this.from;
    } else if (isToMoreThanMaximum) {
      this.to = this.max;
    }

    if (isToMoreThanMaxRemains) {
      this.to = this.max - this.maxRemains;
    }
  };

  public countNumberOfCharactersAfterDot = (): void => {
    const minValuesBeforeAndAfterDot: string[] = `${this.min}`.split('.');
    const maxValuesBeforeAndAfterDot: string[] = `${this.max}`.split('.');
    const stepValuesBeforeAndAfterDot: string[] = `${this.step}`.split('.');

    const minValuesAfterDot: string = minValuesBeforeAndAfterDot[1] || '';
    const maxValuesAfterDot: string = maxValuesBeforeAndAfterDot[1] || '';
    const stepValuesAfterDot: string = stepValuesBeforeAndAfterDot[1] || '';

    this.numberOfCharactersAfterDot = Math.max(
      minValuesAfterDot.length,
      maxValuesAfterDot.length,
      stepValuesAfterDot.length,
    );
  };

  public calculateScaleElementsValues = (): void => {
    this.scaleElements = [];

    let minScaleElementValue: number = parseFloat(
      this.min.toFixed(this.numberOfCharactersAfterDot),
    );
    let scaleElements: number[] = [];
    const intervalForScaleElements: number = (this.max - this.min)
      / (this.scaleNumber - 1);

    scaleElements = new Array(this.scaleNumber).fill(0);

    scaleElements = scaleElements.map((item, index) => {
      let scaleElement = 0;

      if (index === 0) {
        scaleElement = minScaleElementValue;
      } else {
        scaleElement = parseFloat((minScaleElementValue
          += intervalForScaleElements).toFixed(this.numberOfCharactersAfterDot));
      }

      const isScaleElementIncorrect = this.isStepSet && parseFloat(
        (Math.abs(scaleElement) % this.step).toFixed(this.numberOfCharactersAfterDot),
      ) !== 0 && parseFloat(
        (Math.abs(scaleElement) % this.step).toFixed(this.numberOfCharactersAfterDot),
      ) !== this.step;

      if (isScaleElementIncorrect) {
        scaleElement = parseFloat(
          (scaleElement - (scaleElement % this.step)
          ).toFixed(this.numberOfCharactersAfterDot),
        );

        scaleElement = scaleElement > this.max ? this.max - this.maxRemains : scaleElement;
        scaleElement = scaleElement < this.min ? this.min - this.minRemains : scaleElement;
      }

      return scaleElement;
    });

    scaleElements = scaleElements.filter((scaleElement, index) => scaleElements.indexOf(
      scaleElement,
    ) === index);

    this.scaleElements = [...scaleElements];
  };

  public calculateScaleElementsNumber = (options: Options): void => {
    this.scaleNumber = options.subViewOptions.scaleElementsCurrentNumber;
  };

  public calculateStepLength = (): void => {
    this.stepLength = ((this.step
      / (this.max - this.min))
      * this.subViewOptions.sliderLength);
  };

  public setConfig = (): void => {
    this.double = this.config.double;
    this.vertical = this.config.vertical;
    this.showTooltip = this.config.showTooltip;
    this.showLimit = this.config.showLimit;
    this.showRange = this.config.showRange;
    this.showScale = this.config.showScale;
    this.localeString = this.config.localeString;
    this.min = this.config.min;
    this.max = this.config.max;
    this.step = this.config.step;
    this.from = this.config.from;
    this.to = this.config.to;
    this.scaleNumber = this.config.scaleNumber;
  };
}

export default Model;
