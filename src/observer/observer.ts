import { ModelOptions, SubViewOptions } from '../interfaces/interfaces';

class Observer {
  observers: ((options: any) => void)[] = [];

  public addObserver = (observer: (options: any) => void): void => {
    this.observers.push(observer);
  };

  public notifyObservers = (options: any): void => {
    this.observers.forEach((observer) => observer(options));
  };
}

export default Observer;
