import { Options } from '../../interfaces/interfaces';

class Scale {
  $scaleContainer: JQuery<HTMLElement> = $('<div/>');

  lengthBetweenScaleElements = 0;

  public setScaleLength = (options: Options): void => {
    const { lengthParameter } = options.modelOptions;
    const { sliderLength } = options.subViewOptions;

    this.$scaleContainer.css(lengthParameter, sliderLength);
  };

  public setScalePosition = (options: Options): void => {
    const { scalePositionParameter } = options.modelOptions;
    const { runnerLength } = options.subViewOptions;

    const scaleElementsWidths: number[] = [];

    this.$scaleContainer.children().each(function getScaleElementWidth() {
      const scaleElementWidth: number = parseInt($(this).css('width'), 10);

      scaleElementsWidths.push(scaleElementWidth);
    });

    const maxScaleElementsWidth: number = Math.max(...scaleElementsWidths);

    this.$scaleContainer.css(
      scalePositionParameter,
      scalePositionParameter === 'right'
        ? maxScaleElementsWidth + runnerLength
        : runnerLength,
    );
  };

  public setScaleElementsValues = (options: Options): void => {
    const { scaleElements, localeString } = options.modelOptions;

    this.$scaleContainer.empty();

    scaleElements.forEach((value, index) => {
      const $scaleElement: JQuery<HTMLElement> = $('<span>').addClass(
        `slider__scale-element js-slider__scale-element js-slider__scale-element_${index}`,
      );
      const scaleElementValue: string = localeString
        ? value.toLocaleString() : `${value}`;

      $scaleElement.html(scaleElementValue);
      $scaleElement.appendTo(this.$scaleContainer);
    });
  };

  public calculateLengthBetweenScaleElements = (options: Options): void => {
    const { scaleNumber } = options.modelOptions;
    const { sliderLength } = options.subViewOptions;

    this.lengthBetweenScaleElements = sliderLength / (scaleNumber - 1);
  };

  public setScaleElementsPositions = (options: Options): void => {
    const {
      scaleElements, lengthParameter, positionParameter, min, max,
    } = options.modelOptions;
    const { sliderLength } = options.subViewOptions;

    // let scaleElementPosition = 0;

    scaleElements.forEach((value, index) => {
      const $scaleElement: JQuery<HTMLElement> = this.$scaleContainer.find(`.js-slider__scale-element_${index}`);
      const scaleElementLength: number = parseInt(`${$scaleElement.css(lengthParameter)}`, 10);

      const minRatio: number = min / (max - min);
      const scaleElementRatio: number = value / (max - min);

      const scaleElementPosition: number = Math.round(
        (scaleElementRatio - minRatio) * sliderLength,
      );

      $scaleElement.css(
        positionParameter,
        scaleElementPosition - scaleElementLength / 2,
      );

      // scaleElementPosition += this.lengthBetweenScaleElements;
    });
  };

  // public findNonMultipleScaleValues = (options: Options): void => {
  //   const {
  //     isStepSet, localeString, step, numberOfCharactersAfterDot,
  //   } = options.modelOptions;

  //   if (!isStepSet) return;

  //   this.$scaleContainer.children().each(function findValues() {
  //     const $scaleElement: JQuery<HTMLElement> = $(this);
  //     const value: number = localeString
  //       ? Number($scaleElement.html().split('&nbsp;').join('')) : Number($scaleElement.html());

  //     const isRemainsOnScaleValue: boolean = parseFloat(
  //       (Math.abs(value) % step).toFixed(numberOfCharactersAfterDot),
  //     ) !== 0 && parseFloat(
  //       (Math.abs(value) % step).toFixed(numberOfCharactersAfterDot),
  //     ) !== step;

  //     if (isRemainsOnScaleValue) {
  //       $scaleElement.css({
  //         opacity: 0.5,
  //         'pointer-events': 'none',
  //       });
  //     }
  //   });
  // };
}

export default Scale;
