import {
  Options,
  SubViewOptions,
  DIRECTION,
  RANGE,
} from '../interfaces/interfaces';
import AbstractSubView from './AbstractSubView';

class SubView extends AbstractSubView {
  subViewOptions: SubViewOptions;

  constructor() {
    super();

    this.subViewOptions = this.getSubViewOptions();
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

    this.attachPointermoveEvent(RANGE.FROM);

    this.onChange(this.getOptions(), event);
  };

  public handleRunnerToStartPointermove = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerTo.calculateShiftAxis(this.getOptions());

    this.attachPointermoveEvent(RANGE.TO);

    this.onChange(this.getOptions(), event);
  };

  public handleLimitMinSetRunnerPosition = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.runnerFrom.calculateMinRunnerPosition(this.getOptions());
    this.stripe.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.onChange(this.getOptions(), event);

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

    this.onChange(this.getOptions(), event);

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

    this.onChange(this.getOptions(), event);

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

    const {
      positionParameter, lengthParameter, max, min, double,
    } = this.getOptions().modelOptions;

    const $target: JQuery<EventTarget> = $(event.target);
    const targetValue: string = this.modelOptions.localeString ? $target.html().split('&nbsp;').join('') : $target.html();

    this.isScaleElementOnDown = $target.hasClass('js-slider__scale-element');
    this.scaleElementPosition = parseInt(`${$target.css(positionParameter)}`, 10);
    this.scaleElementLength = parseInt(`${$target.css(lengthParameter)}`, 10);
    this.scaleElementValue = Number(targetValue);

    if (this.scaleElementValue === max && double) {
      this.runnerTo.calculateMaxRunnerPosition(this.getOptions());
    } else if (this.scaleElementValue === max) {
      this.runnerFrom.calculateMaxRunnerPosition(this.getOptions());
    } else if (this.scaleElementValue === min) {
      this.runnerFrom.calculateMinRunnerPosition(this.getOptions());
    } else {
      this.calculateClickPosition(event);
      this.stripe.calculateRunnerPositionAfterScaleOnDown(this.getOptions());
    }

    this.stripe.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.onChange(this.getOptions(), event);

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
      scaleElementsCurrentNumber: this.scale.scaleElementsCurrentNumber,
    };

    return subViewOptions;
  };

  public setElementParameters = () => {
    const { lengthParameter } = this.getOptions().modelOptions;

    this.sliderPosition = this.getCoords(this.$stripe);
    this.sliderLength = parseInt(this.$stripe.css(lengthParameter), 10);
    this.runnerLength = parseInt(this.runnerFrom.$runner.css(lengthParameter), 10);
  };

  private handleRunnerFromPointermove = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.runnerFrom.calculateRunnerPositionWhileMouseIsMoving(this.getOptions());
    this.stripe.restrictRunnerFromPosition(this.getOptions());
    this.stripe.showLimit(this.getOptions());
    this.stripe.changeRunnerZIndex(RANGE.FROM);

    this.observer.notifyObservers(this.getOptions());

    this.onChange(this.getOptions(), event);
  };

  private handleRunnerToPointermove = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.runnerTo.calculateRunnerPositionWhileMouseIsMoving(this.getOptions());
    this.stripe.restrictRunnerToPosition(this.getOptions());
    this.stripe.showLimit(this.getOptions());
    this.stripe.changeRunnerZIndex(RANGE.TO);

    this.observer.notifyObservers(this.getOptions());

    this.onChange(this.getOptions(), event);
  };

  private attachPointermoveEvent = (valueType: string) => {
    const handleRunnerPointermove = valueType === RANGE.FROM
      ? this.handleRunnerFromPointermove : this.handleRunnerToPointermove;
    const handleDocumentOffPointerMove = () => {
      this.$document.off('pointermove.move', handleRunnerPointermove);
    };

    this.$document.on('pointermove.move', handleRunnerPointermove);
    this.$document.on('pointerup.move', handleDocumentOffPointerMove);
  };

  private calculateClickPosition = (event: JQuery.TriggeredEvent): void => {
    this.setElementParameters();

    const { vertical } = this.getOptions().modelOptions;

    const pageX1 = event.pageX || 0;
    const pageY1 = event.pageY || 0;

    this.leftOrRight = pageX1 > this.lastPoint.x ? DIRECTION.RIGHT : DIRECTION.LEFT;
    this.upOrDown = pageY1 > this.lastPoint.y ? DIRECTION.BOTTOM : DIRECTION.TOP;

    this.lastPoint.x = pageX1;
    this.lastPoint.y = pageY1;

    const pageAxis: number = vertical ? pageY1 : pageX1;

    this.clickPosition = pageAxis - this.sliderPosition;
  };

  private onChange = (options: Options, event: JQuery.TriggeredEvent): void => {
    const { onChange } = options.modelOptions;

    if (!onChange) return;

    onChange(event);
  };

  private getCoords = (element: JQuery<HTMLElement>): number => {
    const { vertical } = this.getOptions().modelOptions;

    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = vertical ? coords.top : coords.left;

    return coord;
  };

  private checkMouseButton = (event: JQuery.TriggeredEvent): void => {
    this.isWrongButtonPressed = event.pointerType === 'mouse' && event.buttons !== 1;
  };
}

export default SubView;
