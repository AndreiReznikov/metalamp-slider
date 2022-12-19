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
    this.setTooltipLength(options);

    const runnerPosition = this.tooltipType === 'from'
      ? options.subViewOptions.runnerFromPosition : options.subViewOptions.runnerToPosition;

    this.tooltipPosition = runnerPosition
      + options.subViewOptions.runnerLength / 2
      - this.tooltipLength / 2;
  };

  public setTooltipPosition = (options: Options): void => {
    this.$tooltip.css(options.modelOptions.positionParameter, this.tooltipPosition);
  };

  public setTooltipValue = (options: Options): void => {
    this.tooltipValue = this.tooltipType === 'from'
      ? options.modelOptions.from : options.modelOptions.to;

    this.$tooltip.html(`${this.tooltipValue}`);
  };

  private setTooltipLength = (options: Options) => {
    this.tooltipLength = parseInt(this.$tooltip.css(options.modelOptions.lengthParameter), 10);
  };
}

export default Tooltip;
