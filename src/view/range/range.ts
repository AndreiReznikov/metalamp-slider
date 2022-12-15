import { Options } from '../../interfaces/interfaces';

class Range {
  $range: JQuery<HTMLElement> = $('<div/>');

  rangePosition = 0;

  rangeLength = 0;

  public calculateRangePosition = (options: Options): void => {
    this.rangePosition = 0;

    if (!options.modelOptions.isInterval) return;

    this.rangePosition = options.subViewOptions.runnerFromPosition
    + options.subViewOptions.runnerLength / 2;
  };

  public calculateRangeLength = (options: Options): void => {
    this.rangeLength = options.subViewOptions.runnerFromPosition
    + options.subViewOptions.runnerLength / 2;

    if (!options.modelOptions.isInterval) return;

    this.rangeLength = options.subViewOptions.runnerToPosition
    - options.subViewOptions.runnerFromPosition;
  };

  public setRangePosition = (options: Options): void => {
    this.$range.css(options.modelOptions.positionParameter, this.rangePosition);
  };

  public setRangeLength = (options: Options): void => {
    this.$range.css(options.modelOptions.lengthParameter, this.rangeLength);
  };
}

export default Range;
