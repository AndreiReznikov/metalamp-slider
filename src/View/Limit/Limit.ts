import { Options, LIMIT } from '~/interfaces/interfaces';

class Limit {
  $limit: JQuery<HTMLElement> = $('<div/>');

  limitType = LIMIT.MIN;

  limitPosition = 0;

  limitLength = 0;

  constructor(limitType: LIMIT) {
    this.limitType = limitType;
  }

  public calculateLimitPosition = (options: Options): void => {
    const { sliderLength, limitMaxLength, runnerLength } = options.subViewOptions;

    this.limitPosition = 0;

    if (this.limitType !== LIMIT.MAX) return;

    this.limitPosition = sliderLength - limitMaxLength + runnerLength;
  };

  public setLimitPosition = (options: Options): void => {
    const { positionParameter } = options.modelOptions;

    this.$limit.css(positionParameter, this.limitPosition);
  };

  public setLimitValue = (options: Options): void => {
    const { min, max, localeString } = options.modelOptions;

    let limitValue: number | string = 0;

    if (this.limitType === LIMIT.MIN) {
      limitValue = min;
    } else if (this.limitType === LIMIT.MAX) {
      limitValue = max;
    }

    if (localeString) {
      limitValue = limitValue.toLocaleString();
    }

    this.$limit.html(`${limitValue}`);

    this.setLimitLength(options);
  };

  public setLimitOpacity = (options: Options): void => {
    const { isLimitMaxShown, isLimitMinShown } = options.subViewOptions;
    const { showTooltip } = options.modelOptions;

    this.$limit.css('opacity', 1);

    if (!showTooltip) return;

    this.$limit.css('opacity', 0);

    if (isLimitMaxShown && this.limitType === LIMIT.MAX) {
      this.$limit.css('opacity', 1);
    } else if (isLimitMinShown && this.limitType === LIMIT.MIN) {
      this.$limit.css('opacity', 1);
    }
  };

  private setLimitLength = (options: Options): void => {
    const { lengthParameter } = options.modelOptions;

    this.limitLength = parseInt(this.$limit.css(lengthParameter), 10);
  };
}

export default Limit;
