import Observer from '../observer/observer';
import Stripe from './stripe/stripe';
import Range from './range/range';
import Runner from './runner/runner';
import Tooltip from './tooltip/tooltip';
import Limit from './limit/limit';
import Scale from './scale/scale';
import Panel from './panel/panel';
import { Options, ModelOptions, SubViewOptions } from '../interfaces/interfaces';

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

  panel: Panel;

  $document: JQuery<Document>;

  $stripe: JQuery<HTMLElement>;

  clickPosition = 0;

  sliderLength = 0;

  sliderPosition = 0;

  runnerLength = 0;

  limitMinLength = 0;

  limitMaxLength = 0;

  shiftAxis = 0;

  isClickAheadOfRunnerFrom = false;

  isClickBehindOfRunnerFrom = false;

  isClickForRunnerFrom = false;

  isClickAheadOfRunnerTo = false;

  isClickBehindOfRunnerTo = false;

  isClickForRunnerTo = false;

  runnerFromStepsNumber = 0;

  runnerToStepsNumber = 0;

  modelOptions: ModelOptions;

  subViewOptions: SubViewOptions;

  constructor() {
    this.observer = new Observer();

    this.stripe = new Stripe();
    this.tooltipFrom = new Tooltip('from');
    this.tooltipTo = new Tooltip('to');
    this.runnerFrom = new Runner('from');
    this.runnerTo = new Runner('to');
    this.limitMin = new Limit('min');
    this.limitMax = new Limit('max');
    this.range = new Range();
    this.scale = new Scale();
    this.panel = new Panel();

    this.$document = $(document);
    this.$stripe = this.stripe.$stripe;

    this.subViewOptions = this.setSubViewOptions();
    this.modelOptions = {
      isInterval: false,
      isTooltip: false,
      isLimit: false,
      isRange: false,
      isScale: false,
      isVertical: false,
      isPanel: false,
      isStepSet: false,
      positionParameter: '',
      lengthParameter: '',
      to: 0,
      from: 0,
      step: 0,
      stepLength: 0,
      min: 0,
      max: 0,
      scalePositionParameter: '',
      scaleNumber: 0,
      scaleElements: [],
      lengthBetweenScaleElements: 0,
      panelPosition: 0,
      panelPositionParameter: '',
      numberOfCharactersAfterDot: 0,
    };
  }

  public getOptions = (): Options => {
    const options: Options = {
      modelOptions: this.modelOptions,
      subViewOptions: this.setSubViewOptions(),
    };

    return options;
  };

  public setModelOptions = (options: Options) => {
    this.modelOptions = options.modelOptions;
  };

  public makeRunnerFromPointermoveHandler = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerFrom.calculateShiftAxis(this.getOptions());

    const handleRunnerFromPointermove = (event: JQuery.TriggeredEvent): void => {
      this.calculateClickPosition(event);
      this.runnerFrom.calculateRunnerPositionWhileMouseIsMoving(this.getOptions());
      this.restrictRunnerFromPosition(this.getOptions());

      this.observer.notifyObservers(this.getOptions());
    };

    this.$document.on('pointermove.move-from', handleRunnerFromPointermove);
    this.$document.on('pointerup.move-from', () => this.$document.off('pointermove.move-from', handleRunnerFromPointermove));
  };

  public makeRunnerToPointermoveHandler = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerTo.calculateShiftAxis(this.getOptions());

    const handleRunnerToPointermove = (event: JQuery.TriggeredEvent): void => {
      this.calculateClickPosition(event);
      this.runnerTo.calculateRunnerPositionWhileMouseIsMoving(this.getOptions());
      this.restrictRunnerToPosition();

      this.observer.notifyObservers(this.getOptions());
    };

    this.$document.on('pointermove.move-to', handleRunnerToPointermove);
    this.$document.on('pointerup.move-to', () => this.$document.off('pointermove.move-to', handleRunnerToPointermove));
  };

  public handleLimitMinSetRunnerPosition = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();

    this.runnerFrom.calculateMinRunnerPosition(this.getOptions());

    this.observer.notifyObservers(this.getOptions());
  };

  public handleLimitMaxSetRunnerPosition = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();

    if (this.getOptions().modelOptions.isInterval) {
      this.runnerTo.calculateMaxRunnerPosition(this.getOptions());
    } else {
      this.runnerFrom.calculateMaxRunnerPosition(this.getOptions());
    }

    this.observer.notifyObservers(this.getOptions());
  };

  public handleStripeCalculateRunnerPositionAfterOnDown = (event: JQuery.TriggeredEvent): void => {
    this.runnerFrom.isMinFrom = false;
    this.runnerFrom.isMaxFrom = false;
    this.runnerTo.isMaxTo = false;

    this.calculateClickPosition(event);
    this.calculateRunnerPositionAfterSliderOnDown(this.getOptions());

    this.observer.notifyObservers(this.getOptions());
  };

  public calculateRunnerPositionAfterSliderOnDown = (options: Options): void => {
    const intervalForRunnerFromSteps: number = this.runnerFrom.runnerPosition
      + options.subViewOptions.runnerLength
      / 2 - options.subViewOptions.clickPosition;
    this.runnerFromStepsNumber = Math.round(intervalForRunnerFromSteps
      / options.modelOptions.stepLength);

    this.runnerFromStepsNumber = this.runnerFromStepsNumber < 0
      ? -this.runnerFromStepsNumber : this.runnerFromStepsNumber;

    const intervalForRunnerToSteps: number = this.runnerTo.runnerPosition
      + options.subViewOptions.runnerLength
      / 2 - options.subViewOptions.clickPosition;
    this.runnerToStepsNumber = Math.round(intervalForRunnerToSteps
      / options.modelOptions.stepLength);

    this.runnerToStepsNumber = this.runnerToStepsNumber < 0
      ? -this.runnerToStepsNumber : this.runnerToStepsNumber;

    this.defineClickLocation(options);

    if (options.modelOptions.isStepSet) {
      if (this.isClickAheadOfRunnerFrom) {
        this.runnerFrom.runnerPosition += this.runnerFromStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickBehindOfRunnerFrom) {
        this.runnerFrom.runnerPosition -= this.runnerFromStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickAheadOfRunnerTo) {
        this.runnerTo.runnerPosition += this.runnerToStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickBehindOfRunnerTo) {
        this.runnerTo.runnerPosition -= this.runnerToStepsNumber
        * options.modelOptions.stepLength;
      }
    } else if (this.isClickForRunnerFrom) {
      this.runnerFrom.runnerPosition = options.subViewOptions.clickPosition
        - options.subViewOptions.runnerLength / 2;
    } else if (this.isClickForRunnerTo) {
      this.runnerTo.runnerPosition = options.subViewOptions.clickPosition
        - options.subViewOptions.runnerLength / 2;
    }
  };

  public setSubViewOptions = (): SubViewOptions => {
    const subViewOptions: SubViewOptions = {
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
      runnerFromPosition: this.runnerFrom.runnerPosition,
      runnerToPosition: this.runnerTo.runnerPosition,
      runnerLength: this.runnerLength,
      limitMinLength: parseInt(this.limitMin.$limit.css('width'), 10),
      limitMaxLength: parseInt(this.limitMax.$limit.css('width'), 10),
      clickPosition: this.clickPosition,
      shiftAxis: this.shiftAxis,
      isMinFrom: this.runnerFrom.isMinFrom,
      isMaxFrom: this.runnerFrom.isMaxFrom,
      isMaxTo: this.runnerTo.isMaxTo,
      isCursorNearStepAheadFrom: this.runnerFrom.isCursorNearStepAhead,
      isCursorNearStepBehindFrom: this.runnerFrom.isCursorNearStepBehind,
      isCursorNearStepAheadTo: this.runnerTo.isCursorNearStepAhead,
      isCursorNearStepBehindTo: this.runnerTo.isCursorNearStepBehind,
      isClickAheadOfRunnerFrom: this.isClickAheadOfRunnerFrom,
      isClickBehindOfRunnerFrom: this.isClickBehindOfRunnerFrom,
      isClickAheadOfRunnerTo: this.isClickAheadOfRunnerTo,
      isClickBehindOfRunnerTo: this.isClickBehindOfRunnerTo,
      runnerFromStepsNumber: this.runnerFromStepsNumber,
      runnerToStepsNumber: this.runnerToStepsNumber,
    };

    return subViewOptions;
  };

  public getElementParameters = () => {
    this.sliderPosition = this.getCoords(
      this.$stripe,
      this.getOptions().modelOptions.isVertical,
    );
    this.sliderLength = parseInt(
      this.$stripe.css('width'),
      10,
    );
    this.runnerLength = parseInt(
      this.runnerFrom.$runner.css(`${this.getOptions().modelOptions.lengthParameter}`),
      10,
    );
  };

  private restrictRunnerFromPosition = (options: Options): void => {
    const isRunnerFromPositionLessThanMinimum: boolean = this.runnerFrom.runnerPosition
      < 0 - this.runnerLength / 2;
    const isRunnerFromPositionMoreThanMaximum: boolean = this.runnerFrom.runnerPosition
      > this.sliderLength - this.runnerLength / 2;
    const
      isRunnerFromPositionMoreThanRunnerToPosition: boolean = options.modelOptions.isInterval
      && this.runnerFrom.runnerPosition > this.runnerTo.runnerPosition;

    if (isRunnerFromPositionLessThanMinimum) {
      this.runnerFrom.runnerPosition = 0 - this.runnerLength / 2;
    } else if (isRunnerFromPositionMoreThanMaximum) {
      this.runnerFrom.runnerPosition = this.sliderLength - this.runnerLength / 2;
    }

    if (isRunnerFromPositionMoreThanRunnerToPosition) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
    }
  };

  private restrictRunnerToPosition = (): void => {
    const isRunnerFromPositionLessThanRunnerToPosition: boolean = this.runnerTo.runnerPosition
      < this.runnerFrom.runnerPosition;
    const isRunnerToPositionMoreThanMaximum: boolean = this.runnerTo.runnerPosition
      > this.sliderLength - this.runnerLength / 2;

    if (isRunnerFromPositionLessThanRunnerToPosition) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
    } else if (isRunnerToPositionMoreThanMaximum) {
      this.runnerTo.runnerPosition = this.sliderLength - this.runnerLength / 2;
    }
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

    const clientAxis: number = this.getOptions().modelOptions.isVertical ? pageY1 : pageX1;

    this.clickPosition = clientAxis - this.sliderPosition;
  };

  private defineClickLocation = (options: Options) => {
    const isClickAheadOfRunnerFromWithInterval = options.subViewOptions.clickPosition
      > this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      && options.subViewOptions.clickPosition
      < this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      + (this.runnerTo.runnerPosition - this.runnerFrom.runnerPosition
        - options.subViewOptions.runnerLength) / 2;
    const isClickAheadOfRunnerFromWithoutInterval = options.subViewOptions.clickPosition
      > this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength;

    this.isClickAheadOfRunnerFrom = options.modelOptions.isInterval
      ? isClickAheadOfRunnerFromWithInterval : isClickAheadOfRunnerFromWithoutInterval;
    this.isClickBehindOfRunnerFrom = options.subViewOptions.clickPosition
      < this.runnerFrom.runnerPosition;
    this.isClickForRunnerFrom = this.isClickAheadOfRunnerFrom || this.isClickBehindOfRunnerFrom;

    this.isClickAheadOfRunnerTo = options.subViewOptions.clickPosition
      > this.runnerTo.runnerPosition + options.subViewOptions.runnerLength;
    this.isClickBehindOfRunnerTo = options.subViewOptions.clickPosition
      < this.runnerTo.runnerPosition && options.subViewOptions.clickPosition
      >= this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      + (this.runnerTo.runnerPosition - this.runnerFrom.runnerPosition
        - options.subViewOptions.runnerLength) / 2;
    this.isClickForRunnerTo = this.isClickAheadOfRunnerTo || this.isClickBehindOfRunnerTo;
  };

  private getCoords = (element: JQuery<HTMLElement> = $('div'), isVertical = false): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = isVertical ? coords.top : coords.left;

    return coord;
  };
}

export default SubView;
