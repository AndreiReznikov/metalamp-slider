import { Options } from '../../interfaces/interfaces';

class RunnerFrom {
  $runnerFrom: JQuery<HTMLElement> = $('<button/>');

  runnerFromPosition = 0;

  public calculateInitialRunnerFromPosition = (options: Options): void => {
    const minRatio: number = options.minValue / (options.maxValue - options.minValue);
    const fromRatio: number = options.from / (options.maxValue - options.minValue);

    this.runnerFromPosition = Math.round((fromRatio - minRatio)
      * options.sliderLength - options.runnerLength / 2);
  };

  public calculateRunnerFromPositionWhileMoving = (
    subViewOptions: {
      sliderPosition: number,
      runnerFromPosition: number,
      runnerLength: number,
      clickPosition: number,
      shiftAxis: number,
    },
  ): void => {
    this.runnerFromPosition = subViewOptions.clickPosition - subViewOptions.shiftAxis;
  };

  public setRunnerFromPosition = (
    subViewOptions: {
      sliderPosition: number,
      runnerFromPosition: number,
      runnerLength: number,
      clickPosition: number,
      shiftAxis: number,
    },
  ): void => {
    this.$runnerFrom.css('left', subViewOptions.runnerFromPosition);
  };

  public calculateShiftAxis1 = (
    subViewOptions: {
      sliderPosition: number,
      runnerFromPosition: number,
      runnerLength: number,
      clickPosition: number,
    },
  ): number => {
    const shiftAxis = subViewOptions.clickPosition - this.runnerFromPosition;

    return shiftAxis;
  };
}

export default RunnerFrom;
