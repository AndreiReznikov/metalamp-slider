import { Options, RANGE } from '../../interfaces/interfaces';
import AbstractStripe from './AbstractStripe';

class Stripe extends AbstractStripe {
  $stripe: JQuery<HTMLElement>;

  constructor() {
    super();

    this.$stripe = $('<div/>');
  }

  public calculateRunnerPositionAfterSliderOnDown = (options: Options): void => {
    const { runnerLength, clickPosition } = options.subViewOptions;
    const { stepLength, isStepSet } = options.modelOptions;

    const intervalForRunnerFromSteps: number = this.runnerFrom.runnerPosition
      + runnerLength / 2 - clickPosition;
    this.runnerFromStepsNumber = Math.round(intervalForRunnerFromSteps / stepLength);

    this.runnerFromStepsNumber = this.runnerFromStepsNumber < 0
      ? -this.runnerFromStepsNumber : this.runnerFromStepsNumber;

    const intervalForRunnerToSteps: number = this.runnerTo.runnerPosition
      + runnerLength / 2 - clickPosition;
    this.runnerToStepsNumber = Math.round(intervalForRunnerToSteps / stepLength);

    this.runnerToStepsNumber = this.runnerToStepsNumber < 0
      ? -this.runnerToStepsNumber : this.runnerToStepsNumber;

    this.defineClickLocation(options);
    this.alignRunners(options);

    if (isStepSet) {
      if (this.isClickAheadOfRunnerFrom) {
        this.runnerFrom.runnerPosition += this.runnerFromStepsNumber * stepLength;
      } else if (this.isClickBehindOfRunnerFrom) {
        this.runnerFrom.runnerPosition -= this.runnerFromStepsNumber * stepLength;
      } else if (this.isClickAheadOfRunnerTo) {
        this.runnerTo.runnerPosition += this.runnerToStepsNumber * stepLength;
      } else if (this.isClickBehindOfRunnerTo) {
        this.runnerTo.runnerPosition -= this.runnerToStepsNumber * stepLength;
      }
    } else if (this.isClickForRunnerFrom) {
      this.runnerFrom.runnerPosition = clickPosition - runnerLength / 2;
    } else if (this.isClickForRunnerTo) {
      this.runnerTo.runnerPosition = clickPosition - runnerLength / 2;
    }
  };

  public calculateRunnerPositionAfterScaleOnDown = (options: Options): void => {
    const { scaleElementPosition, scaleElementLength, runnerLength } = options.subViewOptions;
    this.defineClickLocation(options);

    if (this.isClickForRunnerFrom) {
      this.runnerFrom.runnerPosition = scaleElementPosition
        + scaleElementLength / 2 - runnerLength / 2;
    } else if (this.isClickForRunnerTo) {
      this.runnerTo.runnerPosition = scaleElementPosition
        + scaleElementLength / 2 - runnerLength / 2;
    }
  };

  public restrictRunnerFromPosition = (options: Options): void => {
    const {
      runnerLength,
      sliderLength,
      isCursorNearStepAheadFrom,
      isCursorNearStepBehindFrom,
    } = options.subViewOptions;
    const {
      double, minRemains, stepLength, maxRemains, step,
    } = options.modelOptions;

    const isRunnerFromPositionLessThanMinimum: boolean = this.runnerFrom.runnerPosition
      < 0 - runnerLength / 2;
    const isRunnerFromPositionMoreThanMaximum: boolean = this.runnerFrom.runnerPosition
      > sliderLength - runnerLength / 2;
    const
      isRunnerFromPositionMoreThanRunnerToPosition: boolean = double
      && this.runnerFrom.runnerPosition > this.runnerTo.runnerPosition;
    const isRunnerFromNearMinWithRemains: boolean = minRemains !== 0
      && isCursorNearStepBehindFrom
      && this.runnerFrom.runnerPosition + runnerLength
      / 2 < stepLength;
    const isRunnerFromNearMaxWithRemains: boolean = maxRemains !== 0
      && isCursorNearStepAheadFrom
      && sliderLength - this.runnerFrom.runnerPosition
      + runnerLength / 2 < stepLength;

    if (isRunnerFromPositionLessThanMinimum) {
      this.runnerFrom.runnerPosition = 0 - runnerLength / 2;
    } else if (isRunnerFromPositionMoreThanMaximum) {
      this.runnerFrom.runnerPosition = sliderLength - runnerLength / 2;
    }

    if (isRunnerFromNearMaxWithRemains) {
      this.runnerFrom.runnerPosition = sliderLength
        - ((Math.abs(maxRemains) / step)
        * stepLength) - runnerLength / 2;
    }

    if (isRunnerFromNearMinWithRemains) {
      this.runnerFrom.runnerPosition = ((Math.abs(minRemains)
        / step) * stepLength) - runnerLength / 2;
    }

    if (isRunnerFromPositionMoreThanRunnerToPosition) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
    }

    this.joinTooltips(options);
  };

  public restrictRunnerToPosition = (options: Options): void => {
    const { maxRemains, stepLength, step } = options.modelOptions;
    const { sliderLength, runnerLength, isCursorNearStepAheadTo } = options.subViewOptions;

    const isRunnerFromPositionLessThanRunnerToPosition: boolean = this.runnerTo.runnerPosition
      < this.runnerFrom.runnerPosition;
    const isRunnerToPositionMoreThanMaximum: boolean = this.runnerTo.runnerPosition
      > sliderLength - runnerLength / 2;

    const isRunnerToNearMaxWithRemains: boolean = maxRemains !== 0
      && isCursorNearStepAheadTo
      && sliderLength - this.runnerTo.runnerPosition
      + runnerLength / 2 < stepLength;

    if (isRunnerToNearMaxWithRemains) {
      this.runnerTo.runnerPosition = sliderLength
        - (((maxRemains) / step)
        * stepLength) - runnerLength / 2;

      return;
    }

    if (isRunnerFromPositionLessThanRunnerToPosition) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
    } else if (isRunnerToPositionMoreThanMaximum) {
      this.runnerTo.runnerPosition = sliderLength - runnerLength / 2;
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
    const { isStepSet, stepLength, double } = options.modelOptions;
    const { sliderLength, clickPosition } = options.subViewOptions;

    if (!isStepSet) return;

    const isClickNearMinimum: boolean = clickPosition
      < stepLength / 2;
    const isClickNearMaximumWithoutInterval: boolean = sliderLength
      - clickPosition < stepLength / 2
      && !double;
    const isClickNearMaximum: boolean = sliderLength
      - clickPosition < stepLength / 2
      && double;

    if (isClickNearMaximumWithoutInterval) {
      this.runnerFrom.calculateMaxRunnerPosition(options);
    } else if (isClickNearMinimum) {
      this.runnerFrom.calculateMinRunnerPosition(options);
    } else if (isClickNearMaximum) {
      this.runnerTo.calculateMaxRunnerPosition(options);
    }
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
