import { Options } from '../../interfaces/interfaces';

class Tooltip {
  $tooltip: JQuery<HTMLElement> = $('<div/>');

  tooltipType = 'from';

  tooltipLength = 0;

  tooltipPosition = 0;

  tooltipValue = 0;

  constructor(tooltipType: string) {
    this.tooltipType = tooltipType;
  }

  public calculateTooltipPosition = (options: Options): void => {
    this.tooltipLength = parseInt(this.$tooltip.css(options.lengthParameter), 10);

    const runnerPosition = this.tooltipType === 'from'
      ? options.subViewOptions.runnerFromPosition : options.subViewOptions.runnerToPosition;

    this.tooltipPosition = runnerPosition
      + options.subViewOptions.runnerLength / 2
      - this.tooltipLength / 2;
  };

  public setTooltipPosition = (options: Options): void => {
    this.$tooltip.css(options.positionParameter, this.tooltipPosition);
  };

  public setTooltipValue = (options: Options): void => {
    this.tooltipValue = this.tooltipType === 'from'
      ? options.from : options.to;

    this.$tooltip.html(`${this.tooltipValue}`);
  };
}

export default Tooltip;
