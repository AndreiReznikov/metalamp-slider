import { Options, ElementsParameters } from '../interfaces/interfaces';
import Stripe from './stripe/stripe';
import Range from './range/range';
import HandleFrom from './handle-from/handle-from';
import HandleTo from './handle-to/handle-to';
import Tooltips from './tooltips/tooltips';
import MinAndMaxValues from './min-and-max/min-and-max';
import Scale from './scale/scale';
import Panel from './panel/panel';

class View {
  tooltips: Tooltips;

  handleFrom: HandleFrom;

  handleTo: HandleTo;

  range: Range;

  stripe: Stripe;

  minAndMaxValues: MinAndMaxValues;

  scale: Scale;

  panel: Panel;

  $this: JQuery<HTMLElement>;

  $stripe: JQuery<HTMLElement>;

  $handleFrom: JQuery<HTMLElement>;

  $handleTo: JQuery<HTMLElement>;

  $range: JQuery<HTMLElement>;

  $minValue: JQuery<HTMLElement>;

  $maxValue: JQuery<HTMLElement>;

  $scaleContainer: JQuery<HTMLElement>;

  $tooltipFrom: JQuery<HTMLElement>;

  $tooltipTo: JQuery<HTMLElement>;

  $panelContainer: JQuery<HTMLElement>;

  sliderWidth = 0;

  sliderHeight = 0;

  constructor(slider: JQuery<HTMLElement>) {
    this.tooltips = new Tooltips();
    this.handleFrom = new HandleFrom();
    this.handleTo = new HandleTo();
    this.range = new Range();
    this.stripe = new Stripe();
    this.minAndMaxValues = new MinAndMaxValues();
    this.scale = new Scale();
    this.panel = new Panel();

    this.$this = slider;
    this.$stripe = this.stripe.$stripe;
    this.$handleFrom = this.handleFrom.$handleFrom;
    this.$handleTo = this.handleTo.$handleTo;
    this.$range = this.range.$range;
    this.$minValue = this.minAndMaxValues.$minValue;
    this.$maxValue = this.minAndMaxValues.$maxValue;
    this.$scaleContainer = this.scale.$scaleContainer;
    this.$tooltipFrom = this.tooltips.$tooltipFrom;
    this.$tooltipTo = this.tooltips.$tooltipTo;
    this.$panelContainer = this.panel.$panelContainer;

    this.renderView();
  }

  private renderView = (): void => {
    this.$stripe.appendTo(this.$this).addClass('js-slider__stripe');
    this.$handleFrom.appendTo(this.$stripe).addClass('js-slider__handle-from');
    this.$handleTo.appendTo(this.$stripe).addClass('js-slider__handle-to');
    this.$range.appendTo(this.$stripe).addClass('js-slider__range');
    this.$minValue.appendTo(this.$stripe).addClass('js-slider__min-value');
    this.$maxValue.appendTo(this.$stripe).addClass('js-slider__max-value');
    this.$scaleContainer.appendTo(this.$stripe).addClass('js-slider__scale-container');
    this.$tooltipFrom.appendTo(this.$stripe).addClass('js-slider__tooltip-from');
    this.$tooltipTo.appendTo(this.$stripe).addClass('js-slider__tooltip-to');
    this.$panelContainer.appendTo(this.$stripe).addClass('js-slider__panel-container');

    this.sliderWidth = parseInt(this.$this.parent().css('width'), 10);
    this.sliderHeight = parseInt(this.$this.parent().css('height'), 10);
  };

  public initView = (options: Options): void => {
    if (options.isRange) {
      this.$range.css('display', 'block');
    } else {
      this.$range.css('display', 'none');
    }

    if (options.isMinAndMax) {
      this.$minValue.css('display', 'flex');
      this.$maxValue.css('display', 'flex');
    } else {
      this.$minValue.css('display', 'none');
      this.$maxValue.css('display', 'none');
    }

    if (options.isScale) {
      this.$scaleContainer.css('display', 'flex');
    } else {
      this.$scaleContainer.css('display', 'none');
    }

    if (options.isInterval) {
      this.$handleTo.css('display', 'block');
    } else {
      this.$handleTo.css('display', 'none');
    }

    if (options.isTooltip) {
      this.$tooltipFrom.css('display', 'flex');

      if (options.isInterval) {
        this.$tooltipTo.css('display', 'flex');
      } else {
        this.$tooltipTo.css('display', 'none');
      }
    } else {
      this.$tooltipFrom.css('display', 'none');
      this.$tooltipTo.css('display', 'none');
    }

    if (options.isPanel) {
      this.$panelContainer.css('display', 'flex');
    } else {
      this.$panelContainer.css('display', 'none');
    }

    this.setPlane(options.isVertical);
  };

  private setPlane = (isVertical: boolean): void => {
    this.$this.parent().css({ width: 0, height: 0 });
    this.$this.css({ width: 0, height: 0 });
    this.$handleFrom.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.$handleTo.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.$range.css({
      width: 0, height: 0, top: 0, left: 0,
    });
    this.$tooltipFrom.css({ left: 0, bottom: 0, top: 0 });
    this.$tooltipTo.css({ left: 0, bottom: 0, top: 0 });
    this.$minValue.css({ left: 0, bottom: 0, top: 0 });
    this.$maxValue.css({ left: 0, bottom: 0, top: 0 });
    this.$scaleContainer.css({
      right: 0, top: 0, width: 0, height: 0,
    });
    this.$panelContainer.css({ right: '', top: '' });

    const handleFromWidth: number = parseInt(this.$handleFrom.css('width'), 10);
    const handleFromHeight: number = parseInt(this.$handleFrom.css('height'), 10);
    const handleToWidth: number = parseInt(this.$handleTo.css('width'), 10);
    const handleToHeight: number = parseInt(this.$handleTo.css('height'), 10);

    if (isVertical) {
      this.$this.parent().css({ width: this.sliderHeight, height: this.sliderWidth });
      this.$this.css({ width: this.sliderHeight, height: this.sliderWidth });
      this.$handleFrom.css({ left: '50%', transform: 'translateX(-50%)' });
      this.$handleTo.css({ left: '50%', transform: 'translateX(-50%)' });
      this.$range.css({ width: '100%' });
      this.$tooltipFrom.css({ left: handleFromWidth });
      this.$tooltipTo.css({ left: handleToWidth });
      this.$minValue.css({ left: handleFromWidth });
      this.$maxValue.css({ left: handleFromWidth });
      this.$panelContainer.css({ transform: 'translateX(0)', top: 0, width: '150px' });

      return;
    }

    this.$this.parent().css({ width: this.sliderWidth, height: this.sliderHeight });
    this.$this.css({ width: this.sliderWidth, height: this.sliderHeight });
    this.$handleFrom.css({ top: '50%', transform: 'translateY(-50%)' });
    this.$handleTo.css({ top: '50%', transform: 'translateY(-50%)' });
    this.$range.css({ height: '100%' });
    this.$tooltipFrom.css({ bottom: handleFromHeight, top: '' });
    this.$tooltipTo.css({ bottom: handleToHeight, top: '' });
    this.$minValue.css({ bottom: handleFromHeight, top: '' });
    this.$maxValue.css({ bottom: handleFromHeight, top: '' });
    this.$panelContainer.css({ left: '50%', transform: 'translateX(-50%)', width: '650px' });
  };

  public getElementsParameters = (
    isVertical: boolean,
    lengthParameter: string,
  ): ElementsParameters => {
    const elementsParameters: ElementsParameters = {
      sliderPosition: View.getCoords(this.$stripe, isVertical),
      sliderLength: parseInt(this.$stripe.css(lengthParameter), 10),
      handleLength: parseInt(this.$handleFrom.css(lengthParameter), 10),
      tooltipFromLength: parseInt(this.$tooltipFrom.css(lengthParameter), 10),
      tooltipToLength: parseInt(this.$tooltipTo.css(lengthParameter), 10),
      minValueLength: parseInt(this.$minValue.css(lengthParameter), 10),
      maxValueLength: parseInt(this.$maxValue.css(lengthParameter), 10),
      minValueWidth: parseInt(this.$minValue.css('width'), 10),
      maxValueWidth: parseInt(this.$maxValue.css('width'), 10),
      scaleElementHeight: parseInt($('.js-slider__scale-element').css('height'), 10),
    };

    return elementsParameters;
  };

  static getCoords = (element: JQuery<HTMLElement>, isVertical: boolean): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = isVertical ? coords.top : coords.left;

    return coord;
  };
}

export default View;
