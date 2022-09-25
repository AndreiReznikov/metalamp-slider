import { Options } from '../../interfaces/interfaces';

class RunnerTo {
  $runnerTo: JQuery<HTMLElement> = $('<button/>');

  public setRunnerToPosition = (options: Options): void => {
    this.$runnerTo.css(options.positionParameter, options.runnerToPosition);
  };
}

export default RunnerTo;
