import { Options } from '../../interfaces/interfaces';

class Limit {
  $limit: JQuery<HTMLElement> = $('<div/>');

  limitType = 'min';

  limitPosition = 0;

  constructor(limitType: string) {
    this.limitType = limitType;
  }

  public calculateLimitPosition(options: Options) {
    this.limitPosition = 0;

    if (this.limitType === 'max') {
      this.limitPosition = options.subViewOptions.sliderLength
      - options.subViewOptions.limitMaxLength;
    }
  }

  public setLimitPosition(options: Options) {
    this.$limit.css(options.positionParameter, this.limitPosition);
  }

  public setLimitValue(options: Options) {
    if (this.limitType === 'min') {
      this.$limit.html(`${options.minValue}`);
    } else if (this.limitType === 'max') {
      this.$limit.html(`${options.maxValue}`);
    }
  }
}

export default Limit;
