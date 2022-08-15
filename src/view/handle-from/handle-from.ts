import { Options } from '../../interfaces/interfaces';

class HandleFrom {
  $handleFrom: JQuery<HTMLElement> = $('<button/>');

  public setHandleFromPosition = (options: Options): void => {
    this.$handleFrom.css(options.positionParameter, options.handleFromPosition);
  };
}

export default HandleFrom;
