import { Options, RANGE } from '~/interfaces/interfaces';

class Tooltip {
  $tooltip: JQuery<HTMLElement> = $('<div/>');

  tooltipType = RANGE.FROM;

  tooltipLength = 0;

  tooltipPosition = 0;

  tooltipValue: number | string = 0;

  constructor(tooltipType: RANGE) {
    this.tooltipType = tooltipType;
  }

  public calculateTooltipPosition = (options: Options): void => {
    const {
      runnerFromPosition, runnerToPosition, areTooltipsClose, runnerLength,
    } = options.subViewOptions;

    this.setTooltipLength(options);

    const runnerPosition = this.tooltipType === RANGE.FROM
      ? runnerFromPosition : runnerToPosition;

    if (areTooltipsClose && this.tooltipType === RANGE.FROM) {
      this.tooltipPosition = runnerFromPosition + (
        runnerToPosition - runnerFromPosition
      ) / 2 + runnerLength / 2 - this.tooltipLength / 2;

      return;
    }

    this.tooltipPosition = runnerPosition
      + runnerLength / 2 - this.tooltipLength / 2;
  };

  public setTooltipPosition = (options: Options): void => {
    const { positionParameter } = options.modelOptions;

    this.$tooltip.css(positionParameter, this.tooltipPosition);

    this.setTooltipOpacity(options);
  };

  public setTooltipValue = (options: Options): void => {
    const { from, to, localeString } = options.modelOptions;
    const { areTooltipsClose } = options.subViewOptions;

    let fromValue: number | string = from;
    let toValue: number | string = to;

    if (localeString) {
      fromValue = fromValue.toLocaleString();
      toValue = toValue.toLocaleString();
    }

    if (areTooltipsClose && this.tooltipType === RANGE.FROM) {
      this.tooltipValue = `${fromValue}&nbsp;&#8209;&nbsp;${toValue}`;
    } else {
      this.tooltipValue = this.tooltipType === RANGE.FROM
        ? fromValue : toValue;
    }

    this.$tooltip.html(`${this.tooltipValue}`);
  };

  private setTooltipOpacity = (options: Options): void => {
    const { areTooltipsClose } = options.subViewOptions;
    const { double } = options.modelOptions;

    if (!areTooltipsClose || !double) {
      this.$tooltip.css('opacity', 1);
    } else if (this.tooltipType === RANGE.TO) {
      this.$tooltip.css('opacity', 0);
    }
  };

  private setTooltipLength = (options: Options): void => {
    const { lengthParameter } = options.modelOptions;

    this.tooltipLength = parseInt(this.$tooltip.css(lengthParameter), 10);
  };
}

export default Tooltip;
