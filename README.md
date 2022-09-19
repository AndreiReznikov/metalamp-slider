# Metalamp slider

# Description

This is a jQuery plugin that implements the functionality of the numeric values slider.

When creating the slider, the MVP architecture was used, which contains three main modules - Model, View and Presenter.

- Model - a module that stores data and processes it
- View - contains DOM tree elements and their display methods
- Presenter - connects Model and View, and also contains the logic of the configuration panel

When the user interacts with the interface (View), the Model methods are called. After that, the Model, using Observer, notifies observers about a change in its state. The observers in this case are the View methods that accept the modified state of the model.

All DOM elements are subscribed to events in the Presenter class. Observers are also designated in this class.

# Technologies

The project is compatible with jQuery 3.6.0 and node 16.13.2

# Usage

Add the following libraries to the page:

jQuery 3.6.0
index.min.js

Add the following stylesheets to the page:

main.css

# Initiation

The slider is created based on the div element.

`<div class="slider js-slider"></div>`

To initialise the slider, call mySlider on the element:

`$('js-slider').mySlider();`

You can initialize the slider with the following parameters:

  - isInterval: boolean - double or single slider
  - minValue: number - minimum value
  - maxValue: number - maximum value
  - from: number - the value of the first handle
  - to: number - the value of the second handle
  - step: number - step value
  - keyboard: boolean - keyboard control
  - isVertical: boolean - vertical or horizontal
  - isTooltip: boolean - whether to show tooltips over handles
  - isMinAndMax: boolean - whether to show the minimum and maximum values
  - isRange: boolean - whether to show the progress bar
  - isScale: boolean - whether to show the scale
  - scaleNumber: number - number of values on the scale
  - isPanel: boolean - whether to show the panel

# Public methods

To use public methods, at first you must save slider instance to variable:

`$('js-slider').mySlider({ 
   isInterval: true, 
   minValue: 0,
   maxValue: 100,
   from: 20,
   to: 80,
   isPanel: true
 });`

 `const $slider = $('.js-slider').data('mySlider');`

 `$slider.destroy();`

 - update - overrides the set parameters
 
    `$slider.update({
      isInterval: false
    });`

 - destroy - destroys the slider and leaves the original div empty

    `$slider.destroy();`



