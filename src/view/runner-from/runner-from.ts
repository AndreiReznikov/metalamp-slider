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

  public calculateRunnerFromPositionWhileMoving = (options: Options): void => {
    if (options.isStepSet) {
      // this.calculateRunnerFromPositionWithSetStep(pageAxis1);
    } else {
      this.runnerFromPosition = options.pageAxis1 - options.sliderPosition;
    }
  };

  public setRunnerFromPosition = (options: Options): void => {
    this.$runnerFrom.css(options.positionParameter, this.runnerFromPosition);
  };
}

export default RunnerFrom;
