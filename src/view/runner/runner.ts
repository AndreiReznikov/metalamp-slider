import { Options } from '../../interfaces/interfaces';

class Runner {
  $runner: JQuery<HTMLElement> = $('<button/>');

  runnerPosition = 0;

  runnerType = 'from';

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
    },
  ): void => {
    this.runnerPosition = subViewOptions.clickPosition - subViewOptions.shiftAxis;
  };

  public setRunnerPosition = (options: Options): void => {
    this.$runner.css(options.positionParameter, this.runnerPosition);
  };
}

export default Runner;
