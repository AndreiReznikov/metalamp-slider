import { Options } from '../interfaces/interfaces';
import Panel from './panel/panel';
import SubView from './SubView';

class View {
  SubView: SubView;

  panel: Panel;

  $window: JQuery<Window & typeof globalThis>;

  $container: JQuery<HTMLElement> = $('div');

  $slider: JQuery<HTMLElement>;

  $stripe: JQuery<HTMLElement>;

  $runnerFrom: JQuery<HTMLElement>;

  $runnerTo: JQuery<HTMLElement>;

  $range: JQuery<HTMLElement>;

  $limitMin: JQuery<HTMLElement>;

  $limitMax: JQuery<HTMLElement>;

  $scaleContainer: JQuery<HTMLElement>;

  $tooltipFrom: JQuery<HTMLElement>;

  $tooltipTo: JQuery<HTMLElement>;

  $panelContainer: JQuery<HTMLElement>;

  containerParameters: {
    containerWidth: number;
    containerHeight: number;
    containerRelativeWidth: number;
  };

  constructor($slider: JQuery<HTMLElement> = $('div')) {
    this.SubView = new SubView();
    this.panel = new Panel();

    this.$window = $(window);
    this.$slider = $slider;
    this.$stripe = this.SubView.$stripe;
    this.$runnerFrom = this.SubView.runnerFrom.$runner;
    this.$runnerTo = this.SubView.runnerTo.$runner;
    this.$range = this.SubView.range.$range;
    this.$limitMin = this.SubView.limitMin.$limit;
    this.$limitMax = this.SubView.limitMax.$limit;
    this.$scaleContainer = this.SubView.scale.$scaleContainer;
    this.$tooltipFrom = this.SubView.tooltipFrom.$tooltip;
    this.$tooltipTo = this.SubView.tooltipTo.$tooltip;
    this.$panelContainer = this.panel.$panelContainer;

    this.containerParameters = { containerWidth: 0, containerHeight: 0, containerRelativeWidth: 0 };

    this.setContainerParameters();
    this.renderView();
  }

  public initializeView = (options: Options): void => {
    this.$slider.css({ width: '100%', height: '100%', 'box-sizing': 'border-box' });

    if (options.modelOptions.isRange) {
      this.$range.css('display', 'block');
    } else {
      this.$range.css('display', 'none');
    }

    if (options.modelOptions.isLimit) {
      this.$limitMin.css('display', 'flex');
      this.$limitMax.css('display', 'flex');
    } else {
      this.$limitMin.css('display', 'none');
      this.$limitMax.css('display', 'none');
    }

    if (options.modelOptions.isScale) {
      this.$scaleContainer.css('display', 'flex');
    } else {
      this.$scaleContainer.css('display', 'none');
    }

    if (options.modelOptions.isInterval) {
      this.$runnerTo.css('display', 'block');
    } else {
      this.$runnerTo.css('display', 'none');
    }

    if (options.modelOptions.isTooltip) {
      this.$tooltipFrom.css('display', 'flex');

      if (options.modelOptions.isInterval) {
        this.$tooltipTo.css('display', 'flex');
      } else {
        this.$tooltipTo.css('display', 'none');
      }
    } else {
      this.$tooltipFrom.css('display', 'none');
      this.$tooltipTo.css('display', 'none');
    }

    if (options.modelOptions.isPanel) {
      this.$panelContainer.css('display', 'flex');
    } else {
      this.$panelContainer.css('display', 'none');
    }
  };

  public setPlane = (options: Options): void => {
    this.$runnerFrom.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.$runnerTo.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.$range.css({
      width: 0, height: 0, top: 0, left: 0,
    });
    this.$tooltipFrom.css({ left: 0, bottom: 0, top: 0 });
    this.$tooltipTo.css({ left: 0, bottom: 0, top: 0 });
    this.$limitMin.css({ left: 0, bottom: 0, top: 0 });
    this.$limitMax.css({ left: 0, bottom: 0, top: 0 });
    this.$scaleContainer.css({
      right: 0, top: 0, width: 0, height: 0,
    });
    this.$panelContainer.css({ right: '', top: '' });

    if (options.modelOptions.isVertical) {
      this.$slider.parent().css({
        width: this.containerParameters.containerHeight,
        height: this.containerParameters.containerWidth,
      });
      this.$runnerFrom.css({ left: '50%', transform: 'translateX(-50%)' });
      this.$runnerTo.css({ left: '50%', transform: 'translateX(-50%)' });
      this.$range.css({ width: '100%' });
      this.$tooltipFrom.css({ left: options.subViewOptions.runnerLength });
      this.$tooltipTo.css({ left: options.subViewOptions.runnerLength });
      this.$limitMin.css({ left: options.subViewOptions.runnerLength });
      this.$limitMax.css({ left: options.subViewOptions.runnerLength });
      this.$panelContainer.css({ transform: 'translateX(0)', top: 0, width: '150px' });

      return;
    }

    this.$slider.parent().css({
      width: `${this.containerParameters.containerRelativeWidth}%`,
      height: this.containerParameters.containerHeight,
    });
    this.$runnerFrom.css({ top: '50%', transform: 'translateY(-50%)' });
    this.$runnerTo.css({ top: '50%', transform: 'translateY(-50%)' });
    this.$range.css({ height: '100%' });
    this.$tooltipFrom.css({ bottom: options.subViewOptions.runnerLength, top: '' });
    this.$tooltipTo.css({ bottom: options.subViewOptions.runnerLength, top: '' });
    this.$limitMin.css({ bottom: options.subViewOptions.runnerLength, top: '' });
    this.$limitMax.css({ bottom: options.subViewOptions.runnerLength, top: '' });
    this.$panelContainer.css({ left: '50%', transform: 'translateX(-50%)', width: '650px' });
  };

  private renderView = (): void => {
    this.$stripe.appendTo(this.$slider).addClass('js-slider__stripe');
    this.$runnerFrom.appendTo(this.$stripe).addClass('js-slider__runner-from');
    this.$runnerTo.appendTo(this.$stripe).addClass('js-slider__runner-to');
    this.$range.appendTo(this.$stripe).addClass('js-slider__range');
    this.$limitMin.appendTo(this.$stripe).addClass('js-slider__min-value');
    this.$limitMax.appendTo(this.$stripe).addClass('js-slider__max-value');
    this.$scaleContainer.appendTo(this.$stripe).addClass('js-slider__scale-container');
    this.$tooltipFrom.appendTo(this.$stripe).addClass('js-slider__tooltip-from');
    this.$tooltipTo.appendTo(this.$stripe).addClass('js-slider__tooltip-to');
    this.$panelContainer.appendTo(this.$stripe).addClass('js-slider__panel-container');
  };

  private setContainerParameters = (): void => {
    this.$container = this.$slider.parent();

    const containerWidth = parseInt(this.$container.css('width'), 10);
    const containerHeight = parseInt(this.$container.css('height'), 10);
    const containerRelativeWidth = (parseInt(this.$container.css('width'), 10)
    / parseInt(this.$container.parent().css('width'), 10)) * 100;

    this.containerParameters = {
      containerWidth,
      containerHeight,
      containerRelativeWidth,
    };
  };
}

export default View;
