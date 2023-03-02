import { RANGE, LIMIT } from '../../interfaces/interfaces';
import Range from '../Range/Range';
import Runner from '../Runner/Runner';
import Tooltip from '../Tooltip/Tooltip';
import Limit from '../Limit/Limit';
import Scale from '../Scale/Scale';

abstract class AbstractStripe {
  limitMin: Limit;

  limitMax: Limit;

  tooltipFrom: Tooltip;

  tooltipTo: Tooltip;

  runnerFrom: Runner;

  runnerTo: Runner;

  range: Range;

  scale: Scale;

  runnerFromStepsNumber = 0;

  runnerToStepsNumber = 0;

  isClickAheadOfRunnerFrom = false;

  isClickBehindOfRunnerFrom = false;

  isClickForRunnerFrom = false;

  isClickAheadOfRunnerTo = false;

  isClickBehindOfRunnerTo = false;

  isClickForRunnerTo = false;

  areTooltipsClose = false;

  isLimitMinShown = true;

  isLimitMaxShown = true;

  constructor() {
    this.tooltipFrom = new Tooltip(RANGE.FROM);
    this.tooltipTo = new Tooltip(RANGE.TO);
    this.runnerFrom = new Runner(RANGE.FROM);
    this.runnerTo = new Runner(RANGE.TO);
    this.limitMin = new Limit(LIMIT.MIN);
    this.limitMax = new Limit(LIMIT.MAX);
    this.range = new Range();
    this.scale = new Scale();
  }
}

export default AbstractStripe;
