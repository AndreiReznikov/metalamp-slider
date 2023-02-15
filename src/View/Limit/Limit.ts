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
    this.limitPosition = 0;

    if (this.limitType !== 'max') return;

    this.limitPosition = options.subViewOptions.sliderLength
      - options.subViewOptions.limitMaxLength;
  };

  public setLimitPosition = (options: Options): void => {
    this.$limit.css(options.modelOptions.positionParameter, this.limitPosition);
  };

  public setLimitValue = (options: Options): void => {
    let limitValue: number | string = 0;

    if (this.limitType === 'min') {
      limitValue = options.modelOptions.min;
    } else if (this.limitType === 'max') {
      limitValue = options.modelOptions.max;
    }

    if (options.modelOptions.localeString) {
      limitValue = limitValue.toLocaleString();
    }

    this.$limit.html(`${limitValue}`);

    this.setLimitLength(options);
  };

  public setLimitOpacity = (opitons: Options): void => {
    this.$limit.css('opacity', 1);

    if (!opitons.modelOptions.showTooltip) return;

    this.$limit.css('opacity', 0);

    if (opitons.subViewOptions.isLimitMaxShown && this.limitType === 'max') {
      this.$limit.css('opacity', 1);
    } else if (opitons.subViewOptions.isLimitMinShown && this.limitType === 'min') {
      this.$limit.css('opacity', 1);
    }
  };

  private setLimitLength = (options: Options): void => {
    this.limitLength = parseInt(this.$limit.css(options.modelOptions.lengthParameter), 10);
  };
}

export default Limit;
