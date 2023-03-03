import {
  Config,
  UserConfig,
  SubViewOptions,
  DIRECTION,
  LENGTH,
} from '../interfaces/interfaces';
import Observer from '../Observer';

abstract class AbstractModel {
  observer: Observer;

  userConfig: UserConfig;

  data: Config;

  config: Config;

  min = 0;

  max = 100;

  step = 0;

  from = 10;

  to = 50;

  fromRemains = 0;

  toRemains = 0;

  minRemains = 0;

  maxRemains = 0;

  scaleNumber = 2;

  stepLength = 0;

  numberOfCharactersAfterDot = 0;

  scaleElements: number[] = [];

  double = false;

  vertical = false;

  showLimit = true;

  showTooltip = true;

  showRange = true;

  showScale = true;

  localeString = false;

  isStepSet = false;

  positionParameter = DIRECTION.LEFT;

  lengthParameter = LENGTH.WIDTH;

  scalePositionParameter = DIRECTION.TOP;

  subViewOptions: SubViewOptions;

  constructor(userConfig: UserConfig = {}) {
    this.observer = new Observer();

    this.userConfig = userConfig;
    this.data = {
      double: false,
      vertical: false,
      showTooltip: true,
      showLimit: true,
      showRange: true,
      showScale: false,
      localeString: false,
      min: 0,
      max: 100,
      from: 10,
      to: 50,
      step: 0,
      scaleNumber: 2,
    };

    this.config = $.extend({}, this.data, this.userConfig);
    this.subViewOptions = {
      sliderPosition: 0,
      sliderLength: 0,
      runnerFromPosition: 0,
      runnerToPosition: 0,
      runnerLength: 0,
      limitMinLength: 0,
      limitMaxLength: 0,
      shiftAxis: 0,
      clickPosition: 0,
      leftOrRight: '',
      upOrDown: '',
      isMinFrom: false,
      isMaxFrom: false,
      isMaxTo: false,
      isCursorNearStepAheadFrom: false,
      isCursorNearStepBehindFrom: false,
      isCursorNearStepAheadTo: false,
      isCursorNearStepBehindTo: false,
      isClickAheadOfRunnerFrom: false,
      isClickBehindOfRunnerFrom: false,
      isClickForRunnerFrom: false,
      isClickAheadOfRunnerTo: false,
      isClickBehindOfRunnerTo: false,
      isClickForRunnerTo: false,
      areTooltipsClose: false,
      isLimitMinShown: true,
      isLimitMaxShown: true,
      runnerFromStepsNumber: 0,
      runnerToStepsNumber: 0,
      isScaleElementOnDown: false,
      scaleElementPosition: 0,
      scaleElementLength: 0,
      scaleElementValue: 0,
      scaleElementsCurrentNumber: 0,
    };
  }
}

export default AbstractModel;
