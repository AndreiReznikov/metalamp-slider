import { Options } from '../../interfaces/interfaces';

class Scale {
  $scaleContainer: JQuery<HTMLElement> = $('<div>');

  public setScaleLength = (options: Options): void => {
    this.$scaleContainer.css(options.lengthParameter, options.sliderLength);
  };

  public setScalePosition = (options: Options): void => {
    const scaleElementsWidths: number[] = [];

    this.$scaleContainer.find('.js-slider__scale-element').each(function () {
      const scaleElementWidth: number = parseInt($(this).css('width'), 10);

      scaleElementsWidths.push(scaleElementWidth);
    });

    const maxScaleElementsWidth: number = Math.max(...scaleElementsWidths);

    this.$scaleContainer.css(options.scalePositionParameter, options.scalePositionParameter === 'right' ? maxScaleElementsWidth + options.runnerLength : options.runnerLength);
  };

  public setScaleElementsValues = (options: Options): void => {
    this.$scaleContainer.empty();

    for (let i = 0; i < options.scaleElements.length; i += 1) {
      const $scaleElement: JQuery<HTMLElement> = $('<span>').addClass(`js-slider__scale-element js-slider__scale-element_${i}`);
      $scaleElement.html(`${options.scaleElements[i]}`);
      $scaleElement.appendTo(this.$scaleContainer);
    }
  };

  public setScaleElementsPositions = (options: Options): void => {
    let scaleElementPosition = 0;

    for (let i = 0; i < options.scaleElements.length; i += 1) {
      const $scaleElement: JQuery<HTMLElement> = this.$scaleContainer.find(`.js-slider__scale-element_${i}`);
      const scaleElementLength: number = parseInt(`${$scaleElement.css(options.lengthParameter)}`, 10);

      $scaleElement.css(options.positionParameter, scaleElementPosition - scaleElementLength / 2);

      scaleElementPosition += options.lengthBetweenScaleElements;
    }
  };
}

export default Scale;
