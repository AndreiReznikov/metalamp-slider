import { Options } from '../../interfaces/interfaces';

class Range {
  $range: JQuery<HTMLElement> = $('<div/>');

  public setRangePosition = (options: Options): void => {
    this.$range.css(options.positionParameter, options.rangePosition);
  };

  public setRangeLength = (options: Options): void => {
    this.$range.css(options.lengthParameter, options.rangeLength);
  };
}

export default Range;
