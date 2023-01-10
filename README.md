# Metalamp slider

# Description

This is a jQuery plugin that implements the functionality of the numeric values slider.

When creating the slider, the MVP architecture was used, which contains three main modules - Model, View and Presenter.

- Model - a module that stores data and processes it
- View - contains DOM tree elements and their display methods
- Presenter - connects Model and View, and also contains the logic of the configuration panel

When the user interacts with the interface (View), the Model methods are called. After that, the Model, using Observer, notifies observers about a change in its state. The observers in this case are the View methods that accept the modified state of the model.

All DOM elements are subscribed to events in the Presenter class. Observers are also designated in this class.

![UML](/UML-pooshkaSlider.png "UML")

# Demo https://andreireznikov.github.io/metalamp-slider-demo/

# Technologies

The project is compatible with *jQuery 3.6.0* and *node 16.13.2*

# Usage

Add the following libraries to the page:

- jQuery 3.6.0
- pooshkaSlider.min.js

Add the following stylesheets to the page:

- main.css

# Initiation

First you have to create a container for the slider and set its length and height:

`<div class="slider-container"></div>`

The container can have any class name.

The slider is created based on the div element. It needs to be placed in a container.

`<div class="slider js-slider"></div>`

To initialise the slider, call pooshkaSlider on the element:

`$('.js-slider').pooshkaSlider();`

You can initialize the slider with the following parameters:

| Option | Type | Defaults | Description |
| --- | --- | --- | --- |
| double | boolean | false | double or single slider |
| vertical | boolean | false | vertical or horizontal |
| showTooltip | boolean | true | whether to show tooltips over handles |
| showMinAndMax | boolean | true | whether to show the minimum and maximum values |
| showRange | boolean | true | whether to show the progress bar |
| showScale | boolean | false | whether to show the scale |
| localeString | boolean | false | use localString |
| min | number | 0 | minimum value |
| max | number | 100 | maximum value |
| from | number | 10 | the value of the first handle |
| to | number | 50 | the value of the second handle |
| step | number | 0 | step value |
| scaleNumber | 5 | number | number of values on the scale |

# Public methods

To use public methods, at first you must save slider instance to variable:

`$('js-slider').pooshkaSlider({
   double: true,
   min: 0,
   max: 100,
   from: 20,
   to: 80,
 });`

 `const $slider = $('.js-slider').data('pooshkaSlider');`

 `$slider.update();`

 - update - overrides the set parameters

    `$slider.update({
      double: false
    });`



