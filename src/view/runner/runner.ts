import { Options } from '../../interfaces/interfaces';

class Runner {
  $runner: JQuery<HTMLElement> = $('<button/>');

  runnerType = 'from';

  runnerPosition = 0;

  isCursorNearStepAhead = false;

  isCursorNearStepBehind = false;

  isMinFrom = false;

  isMaxFrom = false;

  isMaxTo = false;

  constructor(runnerType: string) {
    this.runnerType = runnerType;
  }

  public calculateInitialRunnerPosition = (options: Options): void => {
    const minRatio: number = options.modelOptions.min
      / (options.modelOptions.max - options.modelOptions.min);
    const fromRatio: number = options.modelOptions.from
      / (options.modelOptions.max - options.modelOptions.min);
    const toRatio: number = options.modelOptions.to
      / (options.modelOptions.max - options.modelOptions.min);

    const ratio = this.runnerType === 'from' ? fromRatio : toRatio;

    this.runnerPosition = Math.round((ratio - minRatio)
      * options.subViewOptions.sliderLength - options.subViewOptions.runnerLength / 2);
  };

  public calculateMinRunnerPosition = (options: Options): void => {
    this.runnerPosition = 0 - options.subViewOptions.runnerLength / 2;

    this.isMinFrom = this.isMinFrom !== true;
  };

  public calculateMaxRunnerPosition = (options: Options): void => {
    this.runnerPosition = options.subViewOptions.sliderLength
      - options.subViewOptions.runnerLength / 2;

    if (options.modelOptions.double) {
      this.isMaxTo = this.isMaxTo !== true;
    } else {
      this.isMaxFrom = this.isMaxFrom !== true;
    }
  };

  public calculateShiftAxis = (options: Options): number => {
    const shiftAxis = options.subViewOptions.clickPosition - this.runnerPosition;

    return shiftAxis;
  };

  public calculateRunnerPositionWhileMouseIsMoving = (options: Options): void => {
    this.isMinFrom = false;
    this.isMaxFrom = false;
    this.isMaxTo = false;

    if (options.modelOptions.isStepSet) {
      this.calculateRunnerPositionWithSetStep(options);
    } else {
      this.runnerPosition = options.subViewOptions.clickPosition - options.subViewOptions.shiftAxis;
    }
  };

  public setRunnerPosition = (options: Options): void => {
    this.$runner.css(options.modelOptions.positionParameter, this.runnerPosition);
  };

  private calculateRunnerPositionWithSetStep = (options: Options): void => {
    this.isCursorNearStepAhead = options.subViewOptions.clickPosition
      > this.runnerPosition + options.subViewOptions.runnerLength / 2
      + options.modelOptions.stepLength / 2;
    this.isCursorNearStepBehind = options.subViewOptions.clickPosition
      < this.runnerPosition + options.subViewOptions.runnerLength / 2
      - options.modelOptions.stepLength / 2;

    if (this.isCursorNearStepAhead) {
      this.runnerPosition += options.modelOptions.stepLength;
    } else if (this.isCursorNearStepBehind) {
      this.runnerPosition -= options.modelOptions.stepLength;
    }
  };
}

export default Runner;
