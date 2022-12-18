import { Options } from '../../interfaces/interfaces';

class Limit {
  $limit: JQuery<HTMLElement> = $('<div/>');

  limitType = 'min';

  limitPosition = 0;

  limitLength = 0;

  constructor(limitType: string) {
    this.limitType = limitType;
  }

  public calculateLimitPosition(options: Options) {
    this.limitPosition = 0;

    if (this.limitType !== 'max') return;

    this.limitPosition = options.subViewOptions.sliderLength
      - options.subViewOptions.limitMaxLength;
  }

  public setLimitPosition(options: Options) {
    this.$limit.css(options.modelOptions.positionParameter, this.limitPosition);
  }

  public setLimitValue(options: Options) {
    if (this.limitType === 'min') {
      this.$limit.html(`${options.modelOptions.min}`);
    } else if (this.limitType === 'max') {
      this.$limit.html(`${options.modelOptions.max}`);
    }

    this.setLimitLength(options);
  }

  private setLimitLength = (options: Options) => {
    this.limitLength = parseInt(this.$limit.css(options.modelOptions.lengthParameter), 10);
  };
}

export default Limit;
