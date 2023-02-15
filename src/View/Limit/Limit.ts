import { Options } from '../../interfaces/interfaces';

class Limit {
  $limit: JQuery<HTMLElement> = $('<div/>');

  limitType = 'min';

  limitPosition = 0;

  limitLength = 0;

  constructor(limitType: string) {
    this.limitType = limitType;
  }

  public calculateLimitPosition = (options: Options): void => {
    const { sliderLength, limitMaxLength } = options.subViewOptions;

    this.limitPosition = 0;

    if (this.limitType !== 'max') return;

    this.limitPosition = sliderLength - limitMaxLength;
  };

  public setLimitPosition = (options: Options): void => {
    const { positionParameter } = options.modelOptions;

    this.$limit.css(positionParameter, this.limitPosition);
  };

  public setLimitValue = (options: Options): void => {
    const { min, max, localeString } = options.modelOptions;

    let limitValue: number | string = 0;

    if (this.limitType === 'min') {
      limitValue = min;
    } else if (this.limitType === 'max') {
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

    if (isLimitMaxShown && this.limitType === 'max') {
      this.$limit.css('opacity', 1);
    } else if (isLimitMinShown && this.limitType === 'min') {
      this.$limit.css('opacity', 1);
    }
  };

  private setLimitLength = (options: Options): void => {
    const { lengthParameter } = options.modelOptions;

    this.limitLength = parseInt(this.$limit.css(lengthParameter), 10);
  };
}

export default Limit;
