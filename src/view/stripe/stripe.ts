import Range from '../Range/Range';
import Runner from '../Runner/Runner';
import Tooltip from '../Tooltip/Tooltip';
import Limit from '../Limit/Limit';
import Scale from '../Scale/Scale';
import { Options } from '../../interfaces/interfaces';

class Stripe {
  $stripe: JQuery<HTMLElement> = $('<div/>');

  limitMin: Limit;

  limitMax: Limit;

  tooltipFrom: Tooltip;

  tooltipTo: Tooltip;

  runnerFrom: Runner;

  runnerTo: Runner;

  range: Range;

  scale: Scale;

  runnerFromStepsNumber = 0;

  runnerToStepsNumber = 0;

  isClickAheadOfRunnerFrom = false;

  isClickBehindOfRunnerFrom = false;

  isClickForRunnerFrom = false;

  isClickAheadOfRunnerTo = false;

  isClickBehindOfRunnerTo = false;

  isClickForRunnerTo = false;

  areTooltipsClose = false;

  isLimitMinShown = true;

  isLimitMaxShown = true;

  constructor() {
    this.tooltipFrom = new Tooltip('from');
    this.tooltipTo = new Tooltip('to');
    this.runnerFrom = new Runner('from');
    this.runnerTo = new Runner('to');
    this.limitMin = new Limit('min');
    this.limitMax = new Limit('max');
    this.range = new Range();
    this.scale = new Scale();
  }

  public calculateRunnerPositionAfterSliderOnDown = (options: Options): void => {
    const intervalForRunnerFromSteps: number = this.runnerFrom.runnerPosition
      + options.subViewOptions.runnerLength
      / 2 - options.subViewOptions.clickPosition;
    this.runnerFromStepsNumber = Math.round(intervalForRunnerFromSteps
      / options.modelOptions.stepLength);

    this.runnerFromStepsNumber = this.runnerFromStepsNumber < 0
      ? -this.runnerFromStepsNumber : this.runnerFromStepsNumber;

    const intervalForRunnerToSteps: number = this.runnerTo.runnerPosition
      + options.subViewOptions.runnerLength
      / 2 - options.subViewOptions.clickPosition;
    this.runnerToStepsNumber = Math.round(intervalForRunnerToSteps
      / options.modelOptions.stepLength);

    this.runnerToStepsNumber = this.runnerToStepsNumber < 0
      ? -this.runnerToStepsNumber : this.runnerToStepsNumber;

    this.defineClickLocation(options);
    this.alignRunners(options);

    if (options.modelOptions.isStepSet) {
      if (this.isClickAheadOfRunnerFrom) {
        this.runnerFrom.runnerPosition += this.runnerFromStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickBehindOfRunnerFrom) {
        this.runnerFrom.runnerPosition -= this.runnerFromStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickAheadOfRunnerTo) {
        this.runnerTo.runnerPosition += this.runnerToStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickBehindOfRunnerTo) {
        this.runnerTo.runnerPosition -= this.runnerToStepsNumber
        * options.modelOptions.stepLength;
      }
    } else if (this.isClickForRunnerFrom) {
      this.runnerFrom.runnerPosition = options.subViewOptions.clickPosition
        - options.subViewOptions.runnerLength / 2;
    } else if (this.isClickForRunnerTo) {
      this.runnerTo.runnerPosition = options.subViewOptions.clickPosition
        - options.subViewOptions.runnerLength / 2;
    }
  };

  public calculateRunnerPositionAfterScaleOnDown = (options: Options): void => {
    this.defineClickLocation(options);

    if (this.isClickForRunnerFrom) {
      this.runnerFrom.runnerPosition = options.subViewOptions.scaleElementPosition
        + options.subViewOptions.scaleElementLength
        / 2 - options.subViewOptions.runnerLength / 2;
    } else if (this.isClickForRunnerTo) {
      this.runnerTo.runnerPosition = options.subViewOptions.scaleElementPosition
        + options.subViewOptions.scaleElementLength
        / 2 - options.subViewOptions.runnerLength / 2;
    }
  };

  public restrictRunnerFromPosition = (options: Options): void => {
    const isRunnerFromPositionLessThanMinimum: boolean = this.runnerFrom.runnerPosition
      < 0 - options.subViewOptions.runnerLength / 2;
    const isRunnerFromPositionMoreThanMaximum: boolean = this.runnerFrom.runnerPosition
      > options.subViewOptions.sliderLength - options.subViewOptions.runnerLength / 2;
    const
      isRunnerFromPositionMoreThanRunnerToPosition: boolean = options.modelOptions.double
      && this.runnerFrom.runnerPosition > this.runnerTo.runnerPosition;

    if (isRunnerFromPositionLessThanMinimum) {
      this.runnerFrom.runnerPosition = 0 - options.subViewOptions.runnerLength / 2;
    } else if (isRunnerFromPositionMoreThanMaximum) {
      this.runnerFrom.runnerPosition = options.subViewOptions.sliderLength
        - options.subViewOptions.runnerLength / 2;
    }

    if (isRunnerFromPositionMoreThanRunnerToPosition) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
    }

    this.joinTooltips(options);
  };

  public restrictRunnerToPosition = (options: Options): void => {
    const isRunnerFromPositionLessThanRunnerToPosition: boolean = this.runnerTo.runnerPosition
      < this.runnerFrom.runnerPosition;
    const isRunnerToPositionMoreThanMaximum: boolean = this.runnerTo.runnerPosition
      > options.subViewOptions.sliderLength - options.subViewOptions.runnerLength / 2;

    if (isRunnerFromPositionLessThanRunnerToPosition) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
    } else if (isRunnerToPositionMoreThanMaximum) {
      this.runnerTo.runnerPosition = options.subViewOptions.sliderLength
        - options.subViewOptions.runnerLength / 2;
    }

    this.joinTooltips(options);
  };

  public showLimit = (options: Options): void => {
    if (!options.modelOptions.showLimit) return;

    this.isLimitMinShown = true;
    this.isLimitMaxShown = true;

    const isTooltipFromNearLimitMin: boolean = this.runnerFrom.runnerPosition
      <= 0;
    const isTooltipFromNearLimitMax: boolean = this.runnerFrom.runnerPosition
      + options.subViewOptions.runnerLength
      > options.subViewOptions.sliderLength;
    const isTooltipToNearLimitMax: boolean = options.modelOptions.double
      && this.runnerTo.runnerPosition
      + options.subViewOptions.runnerLength
      > options.subViewOptions.sliderLength;

    if (isTooltipFromNearLimitMin) {
      this.isLimitMinShown = false;
    }

    if (isTooltipToNearLimitMax || isTooltipFromNearLimitMax) {
      this.isLimitMaxShown = false;
    }
  };

  public restrictRunnerPositionAfterSliderOnDown = (options: Options): void => {
    if (!options.modelOptions.isStepSet) return;

    const isClickNearMinimum: boolean = options.subViewOptions.clickPosition
      < options.modelOptions.stepLength / 2;
    const isClickNearMaximumWithoutInterval: boolean = options.subViewOptions.sliderLength
    - options.subViewOptions.clickPosition < options.modelOptions.stepLength / 2
    && !options.modelOptions.double;
    const isClickNearMaximum: boolean = options.subViewOptions.sliderLength
      - options.subViewOptions.clickPosition < options.modelOptions.stepLength / 2
      && options.modelOptions.double;

    if (isClickNearMaximumWithoutInterval) {
      this.runnerFrom.calculateMaxRunnerPosition(options);
    } else if (isClickNearMinimum) {
      this.runnerFrom.calculateMinRunnerPosition(options);
    } else if (isClickNearMaximum) {
      this.runnerTo.calculateMaxRunnerPosition(options);
    }
  };

  public changeRunnerZIndex = (runnerType: string) => {
    if (runnerType === 'from') {
      this.runnerFrom.$runner.css('z-index', 3);
      this.runnerTo.$runner.css('z-index', 2);
    } else if (runnerType === 'to') {
      this.runnerFrom.$runner.css('z-index', 2);
      this.runnerTo.$runner.css('z-index', 3);
    }
  };

  private joinTooltips = (options: Options): void => {
    this.areTooltipsClose = options.modelOptions.double
      && this.tooltipFrom.tooltipPosition
      + this.tooltipFrom.tooltipLength
      > this.tooltipTo.tooltipPosition;
  };

  private defineClickLocation = (options: Options) => {
    const isClickAheadOfRunnerFromWithInterval = options.subViewOptions.clickPosition
      > this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      && options.subViewOptions.clickPosition
      < this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      + (this.runnerTo.runnerPosition - this.runnerFrom.runnerPosition
        - options.subViewOptions.runnerLength) / 2;
    const isClickAheadOfRunnerFromWithoutInterval = options.subViewOptions.clickPosition
      > this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength;

    this.isClickAheadOfRunnerFrom = options.modelOptions.double
      ? isClickAheadOfRunnerFromWithInterval : isClickAheadOfRunnerFromWithoutInterval;
    this.isClickBehindOfRunnerFrom = options.subViewOptions.clickPosition
      < this.runnerFrom.runnerPosition;
    this.isClickForRunnerFrom = this.isClickAheadOfRunnerFrom || this.isClickBehindOfRunnerFrom;

    if (!options.modelOptions.double) return;

    this.isClickAheadOfRunnerTo = options.subViewOptions.clickPosition
      > this.runnerTo.runnerPosition + options.subViewOptions.runnerLength;
    this.isClickBehindOfRunnerTo = options.subViewOptions.clickPosition
      < this.runnerTo.runnerPosition && options.subViewOptions.clickPosition
      >= this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      + (this.runnerTo.runnerPosition - this.runnerFrom.runnerPosition
        - options.subViewOptions.runnerLength) / 2;
    this.isClickForRunnerTo = this.isClickAheadOfRunnerTo || this.isClickBehindOfRunnerTo;
  };

  private alignRunners = (options: Options): void => {
    const isRunnerFromNearRunnerTo: boolean = options.modelOptions.double
      && Math.floor(this.runnerTo.runnerPosition
      - this.runnerFrom.runnerPosition) <= Math.round(options.modelOptions.stepLength)
      && this.isClickAheadOfRunnerFrom;
    const isRunnerToNearRunnerFrom: boolean = options.modelOptions.double
      && Math.floor(this.runnerTo.runnerPosition
      - this.runnerFrom.runnerPosition) <= Math.round(options.modelOptions.stepLength)
      && this.isClickBehindOfRunnerTo;

    if (isRunnerToNearRunnerFrom) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
      this.runnerFrom.isCursorNearStepAhead = true;
      this.changeRunnerZIndex('from');
    } else if (isRunnerFromNearRunnerTo) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
      this.runnerTo.isCursorNearStepBehind = true;
      this.changeRunnerZIndex('to');
    }
  };
}

export default Stripe;
