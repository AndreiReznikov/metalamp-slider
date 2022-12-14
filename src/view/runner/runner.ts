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
    const minRatio: number = options.min / (options.max - options.min);
    const fromRatio: number = options.from / (options.max - options.min);
    const toRatio: number = options.to / (options.max - options.min);

    const ratio = this.runnerType === 'from' ? fromRatio : toRatio;

    this.runnerPosition = Math.round((ratio - minRatio)
      * options.subViewOptions.sliderLength - options.subViewOptions.runnerLength / 2);
  };

  public calculateMinRunnerPosition = (subViewOptions: any): void => {
    this.runnerPosition = 0 - subViewOptions.runnerLength / 2;

    this.isMinFrom = true;
  };

  public calculateMaxRunnerPosition = (subViewOptions: any): void => {
    this.runnerPosition = subViewOptions.sliderLength - subViewOptions.runnerLength / 2;

    if (subViewOptions.modelOptions.isInterval) {
      this.isMaxTo = true;
    } else {
      this.isMaxFrom = true;
    }
  };

  public calculateShiftAxis = (
    subViewOptions: {
      sliderPosition: number,
      runnerFromPosition: number,
      runnerLength: number,
      clickPosition: number,
    },
  ): number => {
    const shiftAxis = subViewOptions.clickPosition - this.runnerPosition;

    return shiftAxis;
  };

  public calculateRunnerPositionWhileMouseIsMoving = (
    subViewOptions: {
      sliderPosition: number,
      runnerFromPosition: number,
      runnerLength: number,
      clickPosition: number,
      shiftAxis: number,
      modelOptions: any,
    },
  ): void => {
    this.isMinFrom = false;
    this.isMaxFrom = false;
    this.isMaxTo = false;

    if (subViewOptions.modelOptions.isStepSet) {
      this.calculateRunnerPositionWithSetStep(subViewOptions);
    } else {
      this.runnerPosition = subViewOptions.clickPosition - subViewOptions.shiftAxis;
    }
  };

  public setRunnerPosition = (options: Options): void => {
    this.$runner.css(options.positionParameter, this.runnerPosition);
  };

  private calculateRunnerPositionWithSetStep = (subViewOptions: any): void => {
    this.isCursorNearStepAhead = subViewOptions.clickPosition
      > this.runnerPosition + subViewOptions.runnerLength / 2
      + subViewOptions.modelOptions.stepLength / 2;
    this.isCursorNearStepBehind = subViewOptions.clickPosition
      < this.runnerPosition + subViewOptions.runnerLength / 2
      - subViewOptions.modelOptions.stepLength / 2;

    if (this.isCursorNearStepAhead) {
      this.runnerPosition += subViewOptions.modelOptions.stepLength;
    } else if (this.isCursorNearStepBehind) {
      this.runnerPosition -= subViewOptions.modelOptions.stepLength;
    }
  };
}

export default Runner;
