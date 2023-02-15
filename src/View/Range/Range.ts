import { Options } from '../../interfaces/interfaces';

class Range {
  $range: JQuery<HTMLElement> = $('<div/>');

  rangePosition = 0;

  rangeLength = 0;

  public calculateRangePosition = (options: Options): void => {
    const { double } = options.modelOptions;
    const { runnerFromPosition, runnerLength } = options.subViewOptions;

    this.rangePosition = 0;

    if (!double) return;

    this.rangePosition = runnerFromPosition + runnerLength / 2;
  };

  public calculateRangeLength = (options: Options): void => {
    const { double } = options.modelOptions;
    const { runnerFromPosition, runnerToPosition, runnerLength } = options.subViewOptions;

    this.rangeLength = runnerFromPosition + runnerLength / 2;

    if (!double) return;

    this.rangeLength = runnerToPosition - runnerFromPosition;
  };

  public setRangePosition = (options: Options): void => {
    const { positionParameter } = options.modelOptions;

    this.$range.css(positionParameter, this.rangePosition);
  };

  public setRangeLength = (options: Options): void => {
    const { lengthParameter } = options.modelOptions;

    this.$range.css(lengthParameter, this.rangeLength);
  };
}

export default Range;
