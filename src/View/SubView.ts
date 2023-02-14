import { Options, ModelOptions, SubViewOptions } from '../interfaces/interfaces';
import Observer from '../Observer/Observer';
import Stripe from './Stripe/Stripe';
import Range from './Range/Range';
import Runner from './Runner/Runner';
import Tooltip from './Tooltip/Tooltip';
import Limit from './Limit/Limit';
import Scale from './Scale/Scale';

class SubView {
  observer: Observer;

  stripe: Stripe;

  limitMin: Limit;

  limitMax: Limit;

  tooltipFrom: Tooltip;

  tooltipTo: Tooltip;

  runnerFrom: Runner;

  runnerTo: Runner;

  range: Range;

  scale: Scale;

  $document: JQuery<Document>;

  $stripe: JQuery<HTMLElement>;

  shiftAxis = 0;

  clickPosition = 0;

  sliderLength = 0;

  sliderPosition = 0;

  runnerLength = 0;

  scaleElementPosition = 0;

  scaleElementLength = 0;

  scaleElementValue = 0;

  isWrongButtonPressed = false;

  isScaleElementOnDown = false;

  modelOptions: ModelOptions;

  subViewOptions: SubViewOptions;

  lastPoint: { x: number; y: number; } = { x: 0, y: 0 };

  leftOrRight = '';

  upOrDown = '';

  constructor() {
    this.observer = new Observer();

    this.stripe = new Stripe();
    this.tooltipFrom = this.stripe.tooltipFrom;
    this.tooltipTo = this.stripe.tooltipTo;
    this.runnerFrom = this.stripe.runnerFrom;
    this.runnerTo = this.stripe.runnerTo;
    this.limitMin = this.stripe.limitMin;
    this.limitMax = this.stripe.limitMax;
    this.range = this.stripe.range;
    this.scale = this.stripe.scale;

    this.$document = $(document);
    this.$stripe = this.stripe.$stripe;

    this.subViewOptions = this.getSubViewOptions();
    this.modelOptions = {
      double: false,
      vertical: false,
      showTooltip: false,
      showLimit: false,
      showRange: false,
      showScale: false,
      localeString: false,
      isStepSet: false,
      positionParameter: 'left',
      lengthParameter: 'width',
      scalePositionParameter: 'top',
      to: 0,
      from: 0,
      step: 0,
      stepLength: 0,
      min: 0,
      max: 0,
      fromRemains: 0,
      toRemains: 0,
      minRemains: 0,
      maxRemains: 0,
      scaleNumber: 0,
      scaleElements: [],
      numberOfCharactersAfterDot: 0,
    };
  }

  public getOptions = (): Options => {
    const options: Options = {
      modelOptions: this.modelOptions,
      subViewOptions: this.getSubViewOptions(),
    };

    return options;
  };

  public setModelOptions = (options: Options) => {
    this.modelOptions = options.modelOptions;
  };

  public handleRunnerFromStartPointermove = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerFrom.calculateShiftAxis(this.getOptions());

    this.attachPointermoveEvent('from');
  };

  public handleRunnerToStartPointermove = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerTo.calculateShiftAxis(this.getOptions());

    this.attachPointermoveEvent('to');
  };

  public handleLimitMinSetRunnerPosition = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.runnerFrom.calculateMinRunnerPosition(this.getOptions());
    this.stripe.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.runnerFrom.isMinFrom = false;
  };

  public handleLimitMaxSetRunnerPosition = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    if (this.getOptions().modelOptions.double) {
      this.runnerTo.calculateMaxRunnerPosition(this.getOptions());
    } else {
      this.runnerFrom.calculateMaxRunnerPosition(this.getOptions());
    }

    this.stripe.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.runnerFrom.isMaxFrom = false;
    this.runnerTo.isMaxTo = false;
  };

  public handleStripeCalculateRunnerPositionAfterOnDown = (event: JQuery.TriggeredEvent): void => {
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.calculateClickPosition(event);
    this.stripe.calculateRunnerPositionAfterSliderOnDown(this.getOptions());
    this.stripe.restrictRunnerPositionAfterSliderOnDown(this.getOptions());
    this.stripe.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.stripe.isClickAheadOfRunnerFrom = false;
    this.stripe.isClickBehindOfRunnerFrom = false;
    this.stripe.isClickForRunnerFrom = false;
    this.stripe.isClickAheadOfRunnerTo = false;
    this.stripe.isClickBehindOfRunnerTo = false;
    this.stripe.isClickForRunnerTo = false;
    this.runnerFrom.isCursorNearStepAhead = false;
    this.runnerTo.isCursorNearStepBehind = false;
    this.runnerFrom.isMinFrom = false;
    this.runnerFrom.isMaxFrom = false;
    this.runnerTo.isMaxTo = false;
  };

  public handleScaleCalculateRunnerPositionAfterOnDown = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    const $target: JQuery<EventTarget> = $(event.target);
    const targetValue: string = this.modelOptions.localeString ? $target.html().split('&nbsp;').join('') : $target.html();

    this.isScaleElementOnDown = $target.hasClass('js-slider__scale-element');
    this.scaleElementPosition = parseInt(`${$target.css(this.getOptions().modelOptions.positionParameter)}`, 10);
    this.scaleElementLength = parseInt(`${$target.css(this.getOptions().modelOptions.lengthParameter)}`, 10);
    this.scaleElementValue = Number(targetValue);

    // const isRemainsOnScaleValue: boolean = parseFloat((this.scaleElementValue
    //     % this.getOptions().modelOptions.step).toFixed(
    //   this.getOptions().modelOptions.numberOfCharactersAfterDot,
    // )) !== 0 && this.getOptions().modelOptions.isStepSet;

    // if (isRemainsOnScaleValue) {
    //   this.isScaleElementOnDown = false;
    //   this.scaleElementValue = 0;

    //   return;
    // }

    if (this.scaleElementValue === this.getOptions().modelOptions.max
          && this.getOptions().modelOptions.double) {
      this.runnerTo.calculateMaxRunnerPosition(this.getOptions());
    } else if (this.scaleElementValue === this.getOptions().modelOptions.max) {
      this.runnerFrom.calculateMaxRunnerPosition(this.getOptions());
    } else if (this.scaleElementValue === this.getOptions().modelOptions.min) {
      this.runnerFrom.calculateMinRunnerPosition(this.getOptions());
    } else {
      this.calculateClickPosition(event);
      this.stripe.calculateRunnerPositionAfterScaleOnDown(this.getOptions());
      this.stripe.showLimit(this.getOptions());
    }

    this.observer.notifyObservers(this.getOptions());

    this.isScaleElementOnDown = false;

    this.stripe.isClickAheadOfRunnerFrom = false;
    this.stripe.isClickBehindOfRunnerFrom = false;
    this.stripe.isClickForRunnerFrom = false;
    this.stripe.isClickAheadOfRunnerTo = false;
    this.stripe.isClickBehindOfRunnerTo = false;
    this.stripe.isClickForRunnerTo = false;
    this.runnerFrom.isMinFrom = false;
    this.runnerFrom.isMaxFrom = false;
    this.runnerTo.isMaxTo = false;
  };

  public getSubViewOptions = (): SubViewOptions => {
    const subViewOptions: SubViewOptions = {
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
      runnerFromPosition: this.runnerFrom.runnerPosition,
      runnerToPosition: this.runnerTo.runnerPosition,
      runnerLength: this.runnerLength,
      limitMinLength: this.limitMin.limitLength,
      limitMaxLength: this.limitMax.limitLength,
      clickPosition: this.clickPosition,
      leftOrRight: this.leftOrRight,
      upOrDown: this.upOrDown,
      shiftAxis: this.shiftAxis,
      isMinFrom: this.runnerFrom.isMinFrom,
      isMaxFrom: this.runnerFrom.isMaxFrom,
      isMaxTo: this.runnerTo.isMaxTo,
      isCursorNearStepAheadFrom: this.runnerFrom.isCursorNearStepAhead,
      isCursorNearStepBehindFrom: this.runnerFrom.isCursorNearStepBehind,
      isCursorNearStepAheadTo: this.runnerTo.isCursorNearStepAhead,
      isCursorNearStepBehindTo: this.runnerTo.isCursorNearStepBehind,
      isClickAheadOfRunnerFrom: this.stripe.isClickAheadOfRunnerFrom,
      isClickBehindOfRunnerFrom: this.stripe.isClickBehindOfRunnerFrom,
      isClickForRunnerFrom: this.stripe.isClickForRunnerFrom,
      isClickAheadOfRunnerTo: this.stripe.isClickAheadOfRunnerTo,
      isClickBehindOfRunnerTo: this.stripe.isClickBehindOfRunnerTo,
      isClickForRunnerTo: this.stripe.isClickForRunnerTo,
      areTooltipsClose: this.stripe.areTooltipsClose,
      isLimitMinShown: this.stripe.isLimitMinShown,
      isLimitMaxShown: this.stripe.isLimitMaxShown,
      runnerFromStepsNumber: this.stripe.runnerFromStepsNumber,
      runnerToStepsNumber: this.stripe.runnerToStepsNumber,
      isScaleElementOnDown: this.isScaleElementOnDown,
      scaleElementPosition: this.scaleElementPosition,
      scaleElementLength: this.scaleElementLength,
      scaleElementValue: this.scaleElementValue,
    };

    return subViewOptions;
  };

  public setElementParameters = () => {
    this.sliderPosition = this.getCoords(this.$stripe);
    this.sliderLength = parseInt(
      this.$stripe.css(this.getOptions().modelOptions.lengthParameter),
      10,
    );
    this.runnerLength = parseInt(
      this.runnerFrom.$runner.css(this.getOptions().modelOptions.lengthParameter),
      10,
    );
  };

  private handleRunnerFromPointermove = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.runnerFrom.calculateRunnerPositionWhileMouseIsMoving(this.getOptions());
    this.stripe.restrictRunnerFromPosition(this.getOptions());
    this.stripe.showLimit(this.getOptions());
    this.stripe.changeRunnerZIndex('from');

    this.observer.notifyObservers(this.getOptions());
  };

  private handleRunnerToPointermove = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.runnerTo.calculateRunnerPositionWhileMouseIsMoving(this.getOptions());
    this.stripe.restrictRunnerToPosition(this.getOptions());
    this.stripe.showLimit(this.getOptions());
    this.stripe.changeRunnerZIndex('to');

    this.observer.notifyObservers(this.getOptions());
  };

  private attachPointermoveEvent = (valueType: string) => {
    const handleRunnerPointermove = valueType === 'from' ? this.handleRunnerFromPointermove : this.handleRunnerToPointermove;
    const handleDocumentOffPointerMove = () => {
      this.$document.off('pointermove.move', handleRunnerPointermove);
    };

    this.$document.on('pointermove.move', handleRunnerPointermove);
    this.$document.on('pointerup.move', handleDocumentOffPointerMove);
  };

  private calculateClickPosition = (event: JQuery.TriggeredEvent): void => {
    let pageX1 = 0;
    let pageY1 = 0;

    if (event.pageX !== undefined) {
      pageX1 = event.pageX;
    }

    if (event.pageY !== undefined) {
      pageY1 = event.pageY;
    }

    this.leftOrRight = pageX1 > this.lastPoint.x ? 'right' : 'left';
    this.upOrDown = pageY1 > this.lastPoint.y ? 'down' : 'up';

    this.lastPoint.x = pageX1;
    this.lastPoint.y = pageY1;

    const pageAxis: number = this.getOptions().modelOptions.vertical ? pageY1 : pageX1;

    this.clickPosition = pageAxis - this.sliderPosition;
  };

  private getCoords = (element: JQuery<HTMLElement>): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = this.getOptions().modelOptions.vertical ? coords.top : coords.left;

    return coord;
  };

  private checkMouseButton = (event: JQuery.TriggeredEvent): void => {
    this.isWrongButtonPressed = event.pointerType === 'mouse' && event.buttons !== 1;
  };
}

export default SubView;
