import { Options, DIRECTION, LENGTH } from '~/interfaces/interfaces';

class Scale {
  $scaleContainer: JQuery<HTMLElement> = $('<div/>');

  scaleElementsWidth: number[] = [];

  sumOfScaleElementsWith = 0;

  lengthBetweenScaleElements = 0;

  scaleElementsCurrentNumber = 0;

  public setScaleLength = (options: Options): void => {
    const { lengthParameter } = options.modelOptions;
    const { sliderLength } = options.subViewOptions;

    this.$scaleContainer.css(lengthParameter, sliderLength);
  };

  public setScalePosition = (options: Options): void => {
    const { scalePositionParameter } = options.modelOptions;
    const { runnerLength } = options.subViewOptions;

    const scaleElementsWidth: number[] = [];

    this.$scaleContainer.children().each(function getScaleElementWidth() {
      const scaleElementWidth: number = parseInt($(this).css(LENGTH.WIDTH), 10);

      scaleElementsWidth.push(scaleElementWidth);
    });

    this.scaleElementsWidth = scaleElementsWidth;

    this.sumOfScaleElementsWith = this.scaleElementsWidth.reduce((sum, width) => {
      let currentSum = sum;
      currentSum += width;

      return currentSum;
    }, 0);

    const maxScaleElementsWidth: number = Math.max(...this.scaleElementsWidth);

    this.$scaleContainer.css(
      scalePositionParameter,
      scalePositionParameter === DIRECTION.RIGHT
        ? maxScaleElementsWidth + runnerLength
        : runnerLength,
    );
  };

  public setScaleElementsValues = (options: Options): void => {
    const { scaleElements, localeString } = options.modelOptions;

    this.$scaleContainer.empty();

    scaleElements.forEach((value, index) => {
      const $scaleElement: JQuery<HTMLElement> = $('<span>').addClass(
        `pooshka-slider__scale-element js-pooshka-slider__scale-element js-pooshka-slider__scale-element_${index}`,
      );
      const scaleElementValue: string = localeString
        ? value.toLocaleString() : `${value}`;

      $scaleElement.html(scaleElementValue);
      $scaleElement.appendTo(this.$scaleContainer);
    });
  };

  public calculateLengthBetweenScaleElements = (options: Options): void => {
    const { scaleNumber } = options.modelOptions;
    const { sliderLength, runnerLength } = options.subViewOptions;

    this.lengthBetweenScaleElements = (sliderLength + runnerLength) / (scaleNumber - 1);
  };

  public setScaleElementsPositions = (options: Options): void => {
    const {
      scaleElements, lengthParameter, positionParameter, min, max,
    } = options.modelOptions;
    const { sliderLength } = options.subViewOptions;

    scaleElements.forEach((value, index) => {
      const $scaleElement: JQuery<HTMLElement> = this.$scaleContainer.find(`.js-pooshka-slider__scale-element_${index}`);
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
    });
  };

  public changeNumberOfScaleElementsWhenResizing = (options: Options): void => {
    const { sliderLength } = options.subViewOptions;
    const { defaultScaleNumber } = options.modelOptions;

    this.scaleElementsCurrentNumber = this.$scaleContainer.children().length;

    if (sliderLength / 2 > this.sumOfScaleElementsWith) {
      this.scaleElementsCurrentNumber *= 2;

      this.scaleElementsCurrentNumber = this.scaleElementsCurrentNumber > defaultScaleNumber
        ? defaultScaleNumber : this.scaleElementsCurrentNumber;
    }

    if (sliderLength > this.sumOfScaleElementsWith) return;

    this.$scaleContainer.children().each(function getScaleElementWidth(index) {
      const $scaleElement = $(this);

      if (index % 2 !== 0) {
        $scaleElement.remove();
      }
    });

    this.sumOfScaleElementsWith /= 2;
    this.changeNumberOfScaleElementsWhenResizing(options);
  };
}

export default Scale;
