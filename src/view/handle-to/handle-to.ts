import { Options } from '../../interfaces/interfaces';

class HandleTo {
  $handleTo: JQuery<HTMLElement> = $('<button/>');

  public setHandleToPosition = (options: Options): void => {
    this.$handleTo.css(options.positionParameter, options.handleToPosition);
  };
}

export default HandleTo;
