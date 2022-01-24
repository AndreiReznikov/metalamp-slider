import { Options } from '../../interfaces/interfaces';

class Tooltips {
  $tooltipFrom: JQuery<HTMLElement> = $('<div/>');

  $tooltipTo: JQuery<HTMLElement> = $('<div/>');

  public setTooltipFromPosition = (options: Options): void => {
    this.$tooltipFrom.css(options.positionParameter, options.tooltipFromPosition);
  };

  public setTooltipFromValue = (options: Options): void => {
    this.$tooltipFrom.html(`${options.tooltipFromValue}`);
  };

  public setTooltipToPosition = (options: Options): void => {
    this.$tooltipTo.css(options.positionParameter, options.tooltipToPosition);
  };

  public setTooltipToValue = (options: Options): void => {
    this.$tooltipTo.html(`${options.tooltipToValue}`);
  };
}

export default Tooltips;
