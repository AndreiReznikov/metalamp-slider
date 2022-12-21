import { Options } from '../../interfaces/interfaces';

class Scale {
  $scaleContainer: JQuery<HTMLElement> = $('<div>');

  lengthBetweenScaleElements = 0;

  public setScaleLength = (options: Options): void => {
    this.$scaleContainer.css(
      options.modelOptions.lengthParameter,
      options.subViewOptions.sliderLength,
    );
  };

  public setScalePosition = (options: Options): void => {
    const scaleElementsWidths: number[] = [];

    this.$scaleContainer.find('.js-slider__scale-element').each(function getScaleElementWidth() {
      const scaleElementWidth: number = parseInt($(this).css('width'), 10);

      scaleElementsWidths.push(scaleElementWidth);
    });

    const maxScaleElementsWidth: number = Math.max(...scaleElementsWidths);

    this.$scaleContainer.css(
      options.modelOptions.scalePositionParameter,
      options.modelOptions.scalePositionParameter === 'right'
        ? maxScaleElementsWidth + options.subViewOptions.runnerLength
        : options.subViewOptions.runnerLength,
    );
  };

  public setScaleElementsValues = (options: Options): void => {
    this.$scaleContainer.empty();

    const { scaleElements } = options.modelOptions;

    for (let i = 0; i < scaleElements.length; i += 1) {
      const $scaleElement: JQuery<HTMLElement> = $('<span>').addClass(
        `slider__scale-element js-slider__scale-element js-slider__scale-element_${i}`,
      );
      $scaleElement.html(`${scaleElements[i]}`);
      $scaleElement.appendTo(this.$scaleContainer);
    }
  };

  public calculateLengthBetweenScaleElements = (options: Options): void => {
    this.lengthBetweenScaleElements = options.subViewOptions.sliderLength
      / (options.modelOptions.scaleNumber - 1);
  };

  public setScaleElementsPositions = (options: Options): void => {
    let scaleElementPosition = 0;

    for (let i = 0; i < options.modelOptions.scaleElements.length; i += 1) {
      const $scaleElement: JQuery<HTMLElement> = this.$scaleContainer.find(`.js-slider__scale-element_${i}`);
      const scaleElementLength: number = parseInt(`${$scaleElement.css(options.modelOptions.lengthParameter)}`, 10);

      $scaleElement.css(
        options.modelOptions.positionParameter,
        scaleElementPosition - scaleElementLength / 2,
      );

      scaleElementPosition += this.lengthBetweenScaleElements;
    }
  };
}

export default Scale;
