import { Options } from '../../interfaces/interfaces';

class Runner {
  $runner: JQuery<HTMLElement> = $('<button/>');

  runnerType = 'from';

  runnerPosition = 0;

  remainsAhead = 0;

  remainsBehind = 0;

  isCursorNearStepAhead = false;

  isCursorNearStepBehind = false;

  isMinFrom = false;

  isMaxFrom = false;

  isMaxTo = false;

  constructor(runnerType: string) {
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

    const ratio = this.runnerType === 'from' ? fromRatio : toRatio;

    this.runnerPosition = Math.round((ratio - minRatio) * sliderLength - runnerLength / 2);
  };

  public calculateMinRunnerPosition = (options: Options): void => {
    const { minRemains, step, stepLength } = options.modelOptions;
    const { runnerLength } = options.subViewOptions;

    if (minRemains !== 0) {
      this.runnerPosition = ((Math.abs(minRemains) / step) * stepLength) - runnerLength / 2;

      return;
    }

    this.runnerPosition = 0 - runnerLength / 2;

    this.isMinFrom = this.isMinFrom !== true;
  };

  public calculateMaxRunnerPosition = (options: Options): void => {
    const {
      maxRemains, step, stepLength, double,
    } = options.modelOptions;
    const { sliderLength, runnerLength } = options.subViewOptions;

    if (maxRemains !== 0) {
      this.runnerPosition = sliderLength - ((Math.abs(maxRemains) / step)
        * stepLength) - runnerLength / 2;

      return;
    }

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
    const { stepLength, positionParameter } = options.modelOptions;
    const {
      clickPosition, runnerLength, leftOrRight, upOrDown,
    } = options.subViewOptions;

    this.isCursorNearStepAhead = clickPosition
      > this.runnerPosition + runnerLength / 2
      + stepLength / 2
      && (positionParameter === 'left'
        ? leftOrRight === 'right' : upOrDown === 'down');
    this.isCursorNearStepBehind = clickPosition
      < this.runnerPosition + runnerLength / 2
      - stepLength / 2
      && (positionParameter === 'left'
        ? leftOrRight === 'left' : upOrDown === 'up');

    this.remainsAhead = (clickPosition
      - runnerLength / 2
      - this.runnerPosition)
      % stepLength;
    this.remainsBehind = (this.runnerPosition
      + runnerLength / 2
      - clickPosition)
      % stepLength;

    if (this.isCursorNearStepAhead) {
      this.runnerPosition = clickPosition
        - runnerLength / 2
        + stepLength - this.remainsAhead;
    } else if (this.isCursorNearStepBehind) {
      this.runnerPosition = clickPosition
        - runnerLength / 2
        - stepLength + this.remainsBehind;
    }
  };
}

export default Runner;
