import { Options } from '../../interfaces/interfaces';

class Tooltip {
  $tooltip: JQuery<HTMLElement> = $('<div/>');

  tooltipType = 'from';

  tooltipLength = 0;

  tooltipPosition = 0;

  tooltipValue: number | string = 0;

  constructor(tooltipType: string) {
    this.tooltipType = tooltipType;
  }

  public calculateTooltipPosition = (options: Options): void => {
    this.setTooltipLength(options);

    const runnerPosition = this.tooltipType === 'from'
      ? options.subViewOptions.runnerFromPosition : options.subViewOptions.runnerToPosition;

    if (options.subViewOptions.areTooltipsClose && this.tooltipType === 'from') {
      this.tooltipPosition = options.subViewOptions.runnerFromPosition + (
        options.subViewOptions.runnerToPosition - options.subViewOptions.runnerFromPosition
      ) / 2 + options.subViewOptions.runnerLength / 2 - this.tooltipLength / 2;

      return;
    }

    this.tooltipPosition = runnerPosition
      + options.subViewOptions.runnerLength / 2
      - this.tooltipLength / 2;
  };

  public setTooltipPosition = (options: Options): void => {
    this.$tooltip.css(options.modelOptions.positionParameter, this.tooltipPosition);

    this.setTooltipOpacity(options);
  };

  public setTooltipValue = (options: Options): void => {
    let fromValue: number | string = options.modelOptions.from;
    let toValue: number | string = options.modelOptions.to;

    if (options.modelOptions.localeString) {
      fromValue = fromValue.toLocaleString();
      toValue = toValue.toLocaleString();
    }

    if (options.subViewOptions.areTooltipsClose && this.tooltipType === 'from') {
      this.tooltipValue = `${fromValue}&nbsp;&#8209;&nbsp;${toValue}`;
    } else {
      this.tooltipValue = this.tooltipType === 'from'
        ? fromValue : toValue;
    }

    this.$tooltip.html(`${this.tooltipValue}`);
  };

  private setTooltipOpacity = (options: Options): void => {
    if (!options.subViewOptions.areTooltipsClose || !options.modelOptions.double) {
      this.$tooltip.css('opacity', 1);
    } else if (this.tooltipType === 'to') {
      this.$tooltip.css('opacity', 0);
    }
  };

  private setTooltipLength = (options: Options): void => {
    this.tooltipLength = parseInt(this.$tooltip.css(options.modelOptions.lengthParameter), 10);
  };
}

export default Tooltip;
