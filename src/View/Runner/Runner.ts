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
    const { sliderLength, runnerLength } = options.subViewOptions;

    const minRatio: number = min / (max - min);
    const fromRatio: number = from / (max - min);
    const toRatio: number = to / (max - min);

    const ratio = this.runnerType === RANGE.FROM ? fromRatio : toRatio;

    this.runnerPosition = Math.round((ratio - minRatio) * sliderLength - runnerLength / 2);
  };

  public calculateMinRunnerPosition = (options: Options): void => {
    const { runnerLength } = options.subViewOptions;

    this.runnerPosition = 0 - runnerLength / 2;

    this.isMinFrom = this.isMinFrom !== true;
  };

  public calculateMaxRunnerPosition = (options: Options): void => {
    const { double } = options.modelOptions;
    const { sliderLength, runnerLength } = options.subViewOptions;

    this.runnerPosition = sliderLength - runnerLength / 2;

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
    const { isStepSet } = options.modelOptions;
    const { clickPosition, shiftAxis } = options.subViewOptions;

    this.isMinFrom = false;
    this.isMaxFrom = false;
    this.isMaxTo = false;

    if (isStepSet) {
      this.calculateRunnerPositionWithSetStep(options);
    } else {
      this.runnerPosition = clickPosition - shiftAxis;
    }
  };

  public setRunnerPosition = (options: Options): void => {
    const { positionParameter } = options.modelOptions;

    this.$runner.css(positionParameter, this.runnerPosition);
  };

  private calculateRunnerPositionWithSetStep = (options: Options): void => {
    const {
      stepLength, positionParameter, minRemains, maxRemains, max, min, from, to,
    } = options.modelOptions;
    const {
      clickPosition, runnerLength, leftOrRight, upOrDown, sliderLength,
    } = options.subViewOptions;

    const stepParameterAhead: number = (this.runnerType === RANGE.FROM && from === max
      - Math.abs(maxRemains)) || (this.runnerType === RANGE.TO && to === max
      - Math.abs(maxRemains)) || (this.runnerType === RANGE.FROM && from === min)
      || (this.runnerType === RANGE.TO && to === min)
      ? Math.abs(maxRemains / (max - min)) * sliderLength : stepLength;
    const stepParameterBehind: number = (this.runnerType === RANGE.FROM && from === min
      + Math.abs(minRemains)) || (this.runnerType === RANGE.TO && to === min
      + Math.abs(minRemains)) || (this.runnerType === RANGE.FROM && from === max)
      || (this.runnerType === RANGE.TO && to === max)
      ? Math.abs(minRemains / (max - min)) * sliderLength : stepLength;

    this.isCursorNearStepAhead = clickPosition
      > this.runnerPosition + runnerLength / 2
      + stepParameterAhead / 2
      && (positionParameter === DIRECTION.LEFT
        ? leftOrRight === DIRECTION.RIGHT : upOrDown === DIRECTION.BOTTOM);
    this.isCursorNearStepBehind = clickPosition
      < this.runnerPosition + runnerLength / 2
      - stepParameterBehind / 2
      && (positionParameter === DIRECTION.LEFT
        ? leftOrRight === DIRECTION.LEFT : upOrDown === DIRECTION.TOP);

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
        - runnerLength / 2 && minRemains !== 0;

      this.runnerPosition = isMinRunnerPosition ? (
        Math.abs(minRemains / (max - min)) * sliderLength
      ) - runnerLength / 2 : clickPosition
        - runnerLength / 2
        + stepLength - this.remainsAhead;
    } else if (this.isCursorNearStepBehind) {
      const isMaxRunnerPosition: boolean = this.runnerPosition === sliderLength
        - runnerLength / 2 && maxRemains !== 0;

      this.runnerPosition = isMaxRunnerPosition ? sliderLength
        - (Math.abs(maxRemains / (max - min)) * sliderLength) - runnerLength / 2 : clickPosition
        - runnerLength / 2 - stepLength + this.remainsBehind;
    }
  };
}

export default Runner;
