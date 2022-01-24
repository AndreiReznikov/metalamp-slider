/* eslint-disable import/prefer-default-export */
import { Options } from '../interfaces/interfaces';

class Observer {
  observers: ((options: Options) => void)[] = [];

  addObserver = (observer: (options: Options) => void): void => {
    this.observers.push(observer);
  };

  notifyObservers = (options: Options): void => {
    this.observers.forEach((observer) => observer(options));
  };
}

export default Observer;
