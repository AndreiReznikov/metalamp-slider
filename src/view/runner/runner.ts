import { Options } from '../../interfaces/interfaces';

class Runner {
  $runner: JQuery<HTMLElement> = $('<button/>');

  runnerType = 'from';

  runnerPosition = 0;

  isCursorNearStepAhead = false;

  isCursorNearStepBehind = false;

  constructor(runnerType: string) {
    this.runnerType = runnerType;
  }

  public calculateInitialRunnerPosition = (options: Options): void => {
    const minRatio: number = options.minValue / (options.maxValue - options.minValue);
    const fromRatio: number = options.from / (options.maxValue - options.minValue);
    const toRatio: number = options.to / (options.maxValue - options.minValue);

    const ratio = this.runnerType === 'from' ? fromRatio : toRatio;

    this.runnerPosition = Math.round((ratio - minRatio)
      * options.sliderLength - options.runnerLength / 2);
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

  public calculateRunnerPositionWhileMoving = (
    subViewOptions: {
      sliderPosition: number,
      runnerFromPosition: number,
      runnerLength: number,
      clickPosition: number,
      shiftAxis: number,
      modelOptions: any,
    },
  ): void => {
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
