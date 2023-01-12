# Metalamp slider

# Description

This is a jQuery plugin that implements the functionality of the numeric values slider.

When creating the slider, the MVP architecture was used, which contains three main modules - Model, View and Presenter.

- Model - a module that stores data and processes it
- View - contains DOM tree elements and their display methods
- Presenter - connects Model and View, and also contains the logic of the configuration panel

When the user interacts with the interface (View), the Model methods are called, using Observer. After that, the Model, using Observer, notifies observers about a change in its state. The observers in this case are the View methods that accept the modified state of the model.

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

# Working with the project

First you have to create a copy of the remote repository locally:

`git clone https://github.com/AndreiReznikov/metalamp-slider`

Then you have to install all the necessary packages to work with the project. Use the following command in the local repository:

`npm install`

To start the project, use the command:

`npm run server`

To test the project, use the command:

`npm run test`

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
| scaleNumber | number | 5 | number of values on the scale |

# Public methods

To use public methods, at first you must save slider instance to variable:

`$('.js-slider').pooshkaSlider({
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

# Api

To api methods, at first you must save slider instance to variable:

`$('.js-slider').pooshkaSlider();`

 `const $slider = $('.js-slider').data('pooshkaSlider');`

 Then use an object with api methods:

`$slider.data('api');`

You can access the slider's jQuery elements via Api: and $document: $document, $stripe, $runnerFrom, $runnerTo, $limitMin, $limitMax, $scaleContainer.

You can use the following Api methods:

| Method | Description | Example |
| --- | --- | --- |
| getModelOptions | Returns the current values: double, vertical, showTooltip, showLimit, showRange, show Scale, localeString, isStepSet,  positionParameter, lengthParameter, to, from, step, stepLength, min, max, scalePositionParameter, scaleNumber, scaleElements, numberOfCharactersAfterDot | $slider.data('api').getModelOptions().double |
| updateUserConfig | Update model values | $slider.data('api').updateUserConfig({'vertical': true}) |
| toggleDouble | Toggle double value | $slider.data('api').toggleDouble() |
| toggleTooltip | Toggle showTooltip value | $slider.data('api').toggleTooltip() |
| toggleRange | Toggle showRange value | $slider.data('api').toggleRange() |
| toggleScale | Toggle showScale value | $slider.data('api').toggleScale() |
| toggleVertical | Toggle vertical value | $slider.data('api').toggleVertical() |
| setFrom | Set from value | $slider.data('api').setFrom(25) |
| setTo | Set to value | $slider.data('api').setTo(50) |
| setMin | Set min value | $slider.data('api').setMin(5) |
| setMax | Set max value | $slider.data('api').setMax(100) |
| setStep | Set step value | $slider.data('api').setStep(5) |




