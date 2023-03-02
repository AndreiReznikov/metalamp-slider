import SubView from './SubView';

abstract class AbstractView {
  SubView: SubView;

  $window: JQuery<Window & typeof globalThis>;

  $container: JQuery<HTMLElement> = $('<div/>');

  $containerEnvironment: JQuery<HTMLElement> = $('<div/>');

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

  containerParameters: {
    containerWidth: number;
    containerHeight: number;
    containerRelativeWidth: number;
  };

  constructor($slider: JQuery<HTMLElement> = $('<div/>')) {
    this.SubView = new SubView();

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

    this.containerParameters = { containerWidth: 0, containerHeight: 0, containerRelativeWidth: 0 };
  }
}

export default AbstractView;
