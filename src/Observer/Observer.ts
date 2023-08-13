import { Options } from '~/interfaces/interfaces';

class Observer {
  observers: ((options: Options) => void)[] = [];

  public addObserver = (observer: (options: Options) => void): void => {
    this.observers.push(observer);
  };

  public notifyObservers = (options: Options): void => {
    this.observers.forEach((observer) => observer(options));
  };
}

export default Observer;
