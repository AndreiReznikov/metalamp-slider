import { Options } from '../../interfaces/interfaces';

class MinAndMaxValues {
  $minValue: JQuery<HTMLElement> = $('<div/>');

  $maxValue: JQuery<HTMLElement> = $('<div/>');

  public setMinAndMaxPosition = (options: Options): void => {
    this.$minValue.css(options.positionParameter, options.minValuePosition);
    this.$maxValue.css(options.positionParameter, options.maxValuePosition);
  };

  public setMinAndMaxValues = (options: Options): void => {
    this.$minValue.html(`${options.minValue}`);
    this.$maxValue.html(`${options.maxValue}`);
  };

  public showMinAndMax = (options: Options): void => {
    this.$minValue.css({ opacity: '1' });
    this.$maxValue.css({ opacity: '1' });

    if (!options.isMinValueShow) {
      this.$minValue.css({ opacity: '0' });
    }

    if (!options.isMaxValueShow) {
      this.$maxValue.css({ opacity: '0' });
    }
  };
}

export default MinAndMaxValues;
