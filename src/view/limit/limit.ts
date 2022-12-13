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

  // public showMinAndMax = (options: Options): void => {
  //   this.$minValue.css({ opacity: '1' });
  //   this.$maxValue.css({ opacity: '1' });

  //   if (!options.isMinValueShow) {
  //     this.$minValue.css({ opacity: '0' });
  //   }

  //   if (!options.isMaxValueShow) {
  //     this.$maxValue.css({ opacity: '0' });
  //   }
  // };
}

export default Limit;
