import { Options, DIRECTION, RANGE } from '../../interfaces/interfaces';

class Runner {
  $runner: JQuery<HTMLElement> = $('<button/>');

  runnerType = RANGE.FROM;

  runnerPosition = 0;

  remainsAhead = 0;

  remainsBehind = 0;

  isCursorNearStepAhead = false;

  isCursorNearStepBehind = false;

  isMinFrom = false;

  isMaxFrom = false;

  isMaxTo = false;

  constructor(runnerType: RANGE) {
    this.runnerType = runnerType;
  }

  public calculateInitialRunnerPosition = (options: Options): void => {
    const {
      min, max, from, to,
    } = options.modelOptions;
    const { sliderLength } = options.subViewOptions;

    const minRatio: number = min / (max - min);
    const fromRatio: number = from / (max - min);
    const toRatio: number = to / (max - min);

    const ratio = this.runnerType === RANGE.FROM ? fromRatio : toRatio;

    this.runnerPosition = Math.round((ratio - minRatio) * sliderLength);
  };

  public calculateMinRunnerPosition = (options: Options): void => {
    this.runnerPosition = 0;

    this.isMinFrom = this.isMinFrom !== true;
  };

  public calculateMaxRunnerPosition = (options: Options): void => {
    const { double } = options.modelOptions;
    const { sliderLength } = options.subViewOptions;

    this.runnerPosition = sliderLength;

    if (double) {
      this.isMaxTo = this.isMaxTo !== true;
    } else {
      this.isMaxFrom = this.isMaxFrom !== true;
    }
  };

  public calculateShiftAxis = (options: Options): number => {
    const { clickPosition } = options.subViewOptions;

    const shiftAxis = clickPosition - this.runnerPosition;

    return shiftAxis;
  };

  public calculateRunnerPositionWhileMouseIsMoving = (options: Options): void => {
    const { clickPosition, shiftAxis } = options.subViewOptions;

    this.isMinFrom = false;
    this.isMaxFrom = false;
    this.isMaxTo = false;

    this.calculateRunnerPositionWithSetStep(options);
  };

  public setRunnerPosition = (options: Options): void => {
    const { positionParameter } = options.modelOptions;

    this.$runner.css(positionParameter, this.runnerPosition);
  };

  private calculateRunnerPositionWithSetStep = (options: Options): void => {
    const {
      stepLength, positionParameter, minRemains, maxRemains, max, min, from, to, vertical
    } = options.modelOptions;
    let {
      clickPosition,
      runnerLength,
      leftOrRight,
      upOrDown,
      sliderLength,
      shiftAxis,
      tooltipFromLength,
      tooltipToLength,
      isTooltipFromOnDown,
      isTooltipToOnDown,
    } = options.subViewOptions;

    let smallStepTargetLength = runnerLength;

    if (isTooltipFromOnDown) {
      smallStepTargetLength = tooltipFromLength;
    } else if (isTooltipToOnDown) {
      smallStepTargetLength = tooltipToLength;
    }

    const directionLeft = (positionParameter === DIRECTION.LEFT
      ? leftOrRight === DIRECTION.LEFT : upOrDown === DIRECTION.TOP);
    const directionRight = (positionParameter === DIRECTION.LEFT
      ? leftOrRight === DIRECTION.RIGHT : upOrDown === DIRECTION.BOTTOM);

    const isStepLessThanHalfRunnerLength: boolean = stepLength <= smallStepTargetLength / 2;
    const isClickAhead: boolean = isStepLessThanHalfRunnerLength
      && clickPosition > this.runnerPosition + runnerLength / 2;
    const isClickBehind: boolean = isStepLessThanHalfRunnerLength
      && clickPosition <= this.runnerPosition + runnerLength / 2;

    const stepParameterAheadMaxRemains: boolean = (this.runnerType === RANGE.FROM && from === max
      - Math.abs(maxRemains)) || (this.runnerType === RANGE.TO && to === max - Math.abs(maxRemains));
    const stepParameterAheadMin: boolean = (this.runnerType === RANGE.FROM && from === min && minRemains !== 0)
      || (this.runnerType === RANGE.TO && to === min && minRemains !== 0);
    const stepParameterBehindMinRemains: boolean = (this.runnerType === RANGE.FROM && from === min
      + Math.abs(minRemains)) || (this.runnerType === RANGE.TO && to === min + Math.abs(minRemains))
      && directionLeft;
    const stepParameterBehindMax: boolean = (this.runnerType === RANGE.FROM && from === max && maxRemains !== 0)
      || (this.runnerType === RANGE.TO && to === max && maxRemains !== 0);

    const getRemains = () => {
      let remains = 0;

      if (stepParameterAheadMin || stepParameterBehindMinRemains) remains = minRemains;
      else if (stepParameterAheadMaxRemains || stepParameterBehindMax) remains = maxRemains;

      return Math.abs(remains / (max - min)) * sliderLength;
    };

    const stepParameter = getRemains();

    clickPosition -= isClickAhead ? shiftAxis - runnerLength / 2 : 0;
    clickPosition += isClickBehind ? runnerLength / 2 - shiftAxis : 0;

    this.isCursorNearStepAhead = clickPosition
      > this.runnerPosition + runnerLength / 2
      + (stepParameterAheadMin || stepParameterAheadMaxRemains ? stepParameter / 2 : stepLength / 2)
      && directionRight;
    this.isCursorNearStepBehind = clickPosition
      < this.runnerPosition + runnerLength / 2
      - (stepParameterBehindMinRemains || stepParameterBehindMax ? stepParameter / 2 : stepLength /2)
      && directionLeft;

    this.remainsAhead = (clickPosition
      - runnerLength / 2
      - this.runnerPosition)
      % stepLength;
    this.remainsBehind = (this.runnerPosition
      + runnerLength / 2
      - clickPosition)
      % stepLength;

    if (this.isCursorNearStepAhead) {
      const isMinRunnerPosition: boolean = this.runnerPosition === 0
        && minRemains !== 0;

      this.runnerPosition = isMinRunnerPosition ? (
        Math.abs(minRemains / (max - min)) * sliderLength
      ) : clickPosition
        - runnerLength / 2
        + stepLength - this.remainsAhead;
    } else if (this.isCursorNearStepBehind) {
      const isMaxRunnerPosition: boolean = this.runnerPosition === sliderLength && maxRemains !== 0;

      this.runnerPosition = isMaxRunnerPosition ? sliderLength
        - (Math.abs(maxRemains / (max - min)) * sliderLength) : clickPosition
        - runnerLength / 2 - stepLength + this.remainsBehind;
    }
  };
}

export default Runner;
