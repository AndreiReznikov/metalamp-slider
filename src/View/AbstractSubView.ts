import {
  ModelOptions,
  DIRECTION,
  LENGTH,
} from '../interfaces/interfaces';
import Observer from '../Observer';
import Stripe from './Stripe/Stripe';
import Range from './Range';
import Runner from './Runner';
import Tooltip from './Tooltip';
import Limit from './Limit';
import Scale from './Scale';

abstract class AbstractSubView {
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

    this.modelOptions = {
      double: false,
      vertical: false,
      showTooltip: false,
      showLimit: false,
      showRange: false,
      showScale: false,
      localeString: false,
      isStepSet: false,
      positionParameter: DIRECTION.LEFT,
      lengthParameter: LENGTH.WIDTH,
      scalePositionParameter: DIRECTION.TOP,
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
}

export default AbstractSubView;
