import { Options } from '../../interfaces/interfaces';

class HandleTo {
  $handleTo: JQuery<HTMLElement> = $('<div/>');

  public setHandleToPosition = (options: Options): void => {
    this.$handleTo.css(options.positionParameter, options.handleToPosition);
  };
}

export default HandleTo;
