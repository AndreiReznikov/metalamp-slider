import { Options } from '../../interfaces/interfaces';

class RunnerFrom {
  $runnerFrom: JQuery<HTMLElement> = $('<button/>');

  public setRunnerFromPosition = (options: Options): void => {
    this.$runnerFrom.css(options.positionParameter, options.runnerFromPosition);
  };
}

export default RunnerFrom;
