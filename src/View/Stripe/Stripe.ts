import { Options, RANGE } from '../../interfaces/interfaces';
import AbstractStripe from './AbstractStripe';

class Stripe extends AbstractStripe {
  $stripe: JQuery<HTMLElement>;

  constructor() {
    super();

    this.$stripe = $('<div/>');
  }

  public calculateRunnerPositionAfterSliderOnDown = (options: Options): void => {
    const { runnerLength, clickPosition, sliderLength } = options.subViewOptions;
    const {
      stepLength, max, min, maxRemains, minRemains, double,
    } = options.modelOptions;

    this.defineClickLocation(options);

    const isClickBehindFromWithMaxRemains: boolean = Math.abs(maxRemains) > 0
      && this.runnerFrom.runnerPosition === sliderLength
      && clickPosition < sliderLength - ((Math.abs(maxRemains / (max - min)) * sliderLength) / 2);
    const isClickBehindToWithMaxRemains: boolean = double && Math.abs(maxRemains) > 0
      && this.runnerTo.runnerPosition === sliderLength
      && clickPosition < sliderLength - ((Math.abs(maxRemains / (max - min)) * sliderLength) / 2);
    const isClickAheadFromWithMinRemains: boolean = Math.abs(minRemains) > 0
      && this.runnerFrom.runnerPosition === 0
      && clickPosition > (Math.abs(minRemains / (max - min)) * sliderLength) / 2;
    const isClickAheadToWithMinRemains: boolean = Math.abs(minRemains) > 0
      && this.runnerTo.runnerPosition === 0
      && clickPosition > (Math.abs(minRemains / (max - min)) * sliderLength) / 2;

    let intervalForRunnerFromSteps: number = this.runnerFrom.runnerPosition
      + runnerLength / 2 - clickPosition;

    if (isClickBehindFromWithMaxRemains) {
      intervalForRunnerFromSteps -= Math.abs(maxRemains / (max - min)) * sliderLength;
    } else if (isClickAheadFromWithMinRemains) {
      intervalForRunnerFromSteps += Math.abs(minRemains / (max - min)) * sliderLength;
    }

    this.runnerFromStepsNumber = Math.abs(Math.round(intervalForRunnerFromSteps / stepLength));

    let intervalForRunnerToSteps: number = this.runnerTo.runnerPosition
      + runnerLength / 2 - clickPosition;

    if (isClickBehindToWithMaxRemains) {
      intervalForRunnerToSteps -= Math.abs(maxRemains / (max - min)) * sliderLength;
    } else if (isClickAheadToWithMinRemains) {
      intervalForRunnerToSteps += Math.abs(minRemains / (max - min)) * sliderLength;
    }

    this.runnerToStepsNumber = Math.abs(Math.round(intervalForRunnerToSteps / stepLength));

    this.alignRunners(options);

    if (this.isClickAheadOfRunnerFrom) {
      this.runnerFrom.runnerPosition += this.runnerFromStepsNumber * stepLength
        + (isClickAheadFromWithMinRemains ? Math.abs(minRemains / (max - min)) * sliderLength
          : 0);
    } else if (this.isClickBehindOfRunnerFrom) {
      this.runnerFrom.runnerPosition -= this.runnerFromStepsNumber * stepLength
        + (isClickBehindFromWithMaxRemains ? Math.abs(maxRemains / (max - min)) * sliderLength
          : 0);
    } else if (this.isClickAheadOfRunnerTo) {
      this.runnerTo.runnerPosition += this.runnerToStepsNumber * stepLength
        + (isClickAheadToWithMinRemains ? Math.abs(minRemains / (max - min)) * sliderLength
          : 0);
    } else if (this.isClickBehindOfRunnerTo) {
      this.runnerTo.runnerPosition -= this.runnerToStepsNumber * stepLength
        + (isClickBehindToWithMaxRemains ? Math.abs(maxRemains / (max - min)) * sliderLength
          : 0);
    }
  };

  public calculateRunnerPositionAfterScaleOnDown = (options: Options): void => {
    const { scaleElementPosition, scaleElementLength } = options.subViewOptions;
    this.defineClickLocation(options);

    if (this.isClickForRunnerFrom) {
      this.runnerFrom.runnerPosition = scaleElementPosition
        + scaleElementLength / 2;
    } else if (this.isClickForRunnerTo) {
      this.runnerTo.runnerPosition = scaleElementPosition
        + scaleElementLength / 2;
    }
  };

  public restrictRunnerFromPosition = (options: Options): void => {
    const { sliderLength } = options.subViewOptions;
    const { double } = options.modelOptions;

    const isRunnerFromPositionLessThanMinimum: boolean = this.runnerFrom.runnerPosition < 0;
    const
      isRunnerFromPositionMoreThanMaximum: boolean = this.runnerFrom.runnerPosition > sliderLength;
    const
      isRunnerFromPositionMoreThanRunnerToPosition: boolean = double
      && this.runnerFrom.runnerPosition > this.runnerTo.runnerPosition;

    if (isRunnerFromPositionLessThanMinimum) {
      this.runnerFrom.runnerPosition = 0;
    } else if (isRunnerFromPositionMoreThanMaximum) {
      this.runnerFrom.runnerPosition = sliderLength;
    }

    if (isRunnerFromPositionMoreThanRunnerToPosition) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
    }

    this.joinTooltips(options);
  };

  public restrictRunnerToPosition = (options: Options): void => {
    const { sliderLength } = options.subViewOptions;

    const isRunnerFromPositionLessThanRunnerToPosition: boolean = this.runnerTo.runnerPosition
      < this.runnerFrom.runnerPosition;
    const isRunnerToPositionMoreThanMaximum: boolean = this.runnerTo.runnerPosition
      > sliderLength;

    if (isRunnerFromPositionLessThanRunnerToPosition) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
    } else if (isRunnerToPositionMoreThanMaximum) {
      this.runnerTo.runnerPosition = sliderLength;
    }

    this.joinTooltips(options);
  };

  public showLimit = (options: Options): void => {
    const { showLimit, double } = options.modelOptions;
    const { runnerLength, sliderLength } = options.subViewOptions;

    if (!showLimit) return;

    this.isLimitMinShown = true;
    this.isLimitMaxShown = true;

    const isTooltipFromNearLimitMin: boolean = this.runnerFrom.runnerPosition
      <= 0;
    const isTooltipFromNearLimitMax: boolean = this.runnerFrom.runnerPosition
      + runnerLength
      > sliderLength;
    const isTooltipToNearLimitMax: boolean = double
      && this.runnerTo.runnerPosition
      + runnerLength
      > sliderLength;

    if (isTooltipFromNearLimitMin) {
      this.isLimitMinShown = false;
    }

    if (isTooltipToNearLimitMax || isTooltipFromNearLimitMax) {
      this.isLimitMaxShown = false;
    }
  };

  public restrictRunnerPositionAfterSliderOnDown = (options: Options): void => {
    const {
      stepLength, double, min, max, maxRemains, minRemains,
    } = options.modelOptions;
    const { sliderLength, clickPosition } = options.subViewOptions;

    const isClickNearMinimum: boolean = clickPosition
      < (Math.abs(minRemains) > 0
        ? (Math.abs(minRemains / (max - min)) * sliderLength) / 2 : stepLength / 2)
      && this.isClickBehindOfRunnerFrom;
    const isClickNearMaximumWithoutInterval: boolean = sliderLength
      - clickPosition < (Math.abs(maxRemains) > 0
      ? (Math.abs(maxRemains / (max - min)) * sliderLength) / 2 : stepLength / 2)
      && !double
      && this.isClickAheadOfRunnerFrom;
    const isClickNearMaximum: boolean = sliderLength
      - clickPosition < (Math.abs(maxRemains) > 0
      ? (Math.abs(maxRemains / (max - min)) * sliderLength) / 2 : stepLength / 2)
      && double
      && this.isClickAheadOfRunnerTo;

    if (isClickNearMaximumWithoutInterval) {
      this.runnerFrom.calculateMaxRunnerPosition(options);
    } else if (isClickNearMinimum) {
      this.runnerFrom.calculateMinRunnerPosition();
    } else if (isClickNearMaximum) {
      this.runnerTo.calculateMaxRunnerPosition(options);
    }

    this.joinTooltips(options);
  };

  public changeRunnerZIndex = (runnerType: RANGE): void => {
    if (runnerType === RANGE.FROM) {
      this.runnerFrom.$runner.css('z-index', 3);
      this.runnerTo.$runner.css('z-index', 2);
    } else if (runnerType === RANGE.TO) {
      this.runnerFrom.$runner.css('z-index', 2);
      this.runnerTo.$runner.css('z-index', 3);
    }
  };

  public joinTooltips = (options: Options): void => {
    const { double } = options.modelOptions;

    this.tooltipFrom.calculateTooltipPosition(options);
    this.tooltipTo.calculateTooltipPosition(options);

    this.areTooltipsClose = double
      && this.tooltipFrom.tooltipPosition
      + this.tooltipFrom.tooltipLength
      > this.tooltipTo.tooltipPosition;
  };

  private defineClickLocation = (options: Options): void => {
    const { clickPosition, runnerLength } = options.subViewOptions;
    const { double } = options.modelOptions;

    const isClickAheadOfRunnerFromWithInterval = clickPosition
      > this.runnerFrom.runnerPosition + runnerLength
      && clickPosition
      < this.runnerFrom.runnerPosition + runnerLength
      + (this.runnerTo.runnerPosition - this.runnerFrom.runnerPosition
      - runnerLength) / 2;
    const isClickAheadOfRunnerFromWithoutInterval = clickPosition
      > this.runnerFrom.runnerPosition + runnerLength;

    this.isClickAheadOfRunnerFrom = double
      ? isClickAheadOfRunnerFromWithInterval : isClickAheadOfRunnerFromWithoutInterval;
    this.isClickBehindOfRunnerFrom = clickPosition
      < this.runnerFrom.runnerPosition;
    this.isClickForRunnerFrom = this.isClickAheadOfRunnerFrom || this.isClickBehindOfRunnerFrom;

    if (!double) return;

    this.isClickAheadOfRunnerTo = clickPosition
      > this.runnerTo.runnerPosition + runnerLength;
    this.isClickBehindOfRunnerTo = clickPosition
      < this.runnerTo.runnerPosition && clickPosition
      >= this.runnerFrom.runnerPosition + runnerLength
      + (this.runnerTo.runnerPosition - this.runnerFrom.runnerPosition
      - runnerLength) / 2;
    this.isClickForRunnerTo = this.isClickAheadOfRunnerTo || this.isClickBehindOfRunnerTo;
  };

  private alignRunners = (options: Options): void => {
    const { double, stepLength } = options.modelOptions;

    const isRunnerFromNearRunnerTo: boolean = double
      && Math.floor(this.runnerTo.runnerPosition
      - this.runnerFrom.runnerPosition) <= Math.round(stepLength)
      && this.isClickAheadOfRunnerFrom;
    const isRunnerToNearRunnerFrom: boolean = double
      && Math.floor(this.runnerTo.runnerPosition
      - this.runnerFrom.runnerPosition) <= Math.round(stepLength)
      && this.isClickBehindOfRunnerTo;

    if (isRunnerToNearRunnerFrom) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
      this.runnerFrom.isCursorNearStepAhead = true;
      this.changeRunnerZIndex(RANGE.FROM);
    } else if (isRunnerFromNearRunnerTo) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
      this.runnerTo.isCursorNearStepBehind = true;
      this.changeRunnerZIndex(RANGE.TO);
    }
  };
}

export default Stripe;
