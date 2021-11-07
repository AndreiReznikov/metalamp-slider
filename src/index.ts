import "./index.css";

(function($) {
  $.fn.mySlider = function(options: {}): JQuery {

    const $slider = this;
    
    class Model {
      // config = $.extend({}, options);
    }

    class View {
      config: {isInterval?: boolean} = $.extend({}, options);

      $rangeBetween = $('<div/>').appendTo($slider).addClass('slider__between');
      $secondButton = $('<button/>').appendTo($slider).addClass('slider__second-button');
      $firstButton = $('<button/>');

      addInterval = () => {
        if (this.config.isInterval) {
          const $firstButton = this.$firstButton.appendTo($slider).addClass('slider__first-button');

          const moveFirstSlider = (event: JQuery.MouseDownEvent) => {
            const shiftX1 = event.clientX - this.getCoords($firstButton).left;

            const move = (event: JQuery.MouseMoveEvent) => {
              const clientX = event.clientX;
    
              $firstButton.css('left', clientX - shiftX1);
              this.$rangeBetween.css('left', clientX - shiftX1);
              this.$rangeBetween.css('width', parseInt(this.$secondButton.css('left')) - parseInt($firstButton.css('left')));
    
              if (parseInt($firstButton.css('left')) < 0) {
                $firstButton.css('left', 0);
                this.$rangeBetween.css('left', 0);
                this.$rangeBetween.css('width', parseInt(this.$secondButton.css('left')) - parseInt($firstButton.css('left')));
              }
              else if (parseInt($firstButton.css('left')) + parseInt($firstButton.css('width')) > parseInt(this.$secondButton.css('left'))) {
                $firstButton.css('left', parseInt(this.$secondButton.css('left')) - parseInt($firstButton.css('width')));
              }
            }

            $(document).on('mousemove', move);

            $(document).on('mouseup', () => {
              $(document).off('mousemove', move);
            });
          }

          $firstButton.on('mousedown', moveFirstSlider);
        }
      }

      moveSlider = (event: JQuery.MouseDownEvent) => {
        const shiftX = event.clientX - this.getCoords(this.$secondButton).left;

        const move = (event: JQuery.MouseMoveEvent) => {
          const clientX = event.clientX;
          const secondButtonWidth = parseInt(this.$secondButton.css('width'));
          const sliderWidth = parseInt($slider.css('width'));

          if (!this.config.isInterval) {
            this.$secondButton.css('left', clientX - shiftX);
            this.$rangeBetween.css('width', clientX - shiftX);

            if (parseInt(this.$secondButton.css('left')) < 0) {
              this.$secondButton.css('left', 0);
            }
            else if (parseInt(this.$secondButton.css('left')) > sliderWidth - secondButtonWidth) {
              this.$secondButton.css('left', sliderWidth - secondButtonWidth);
              this.$rangeBetween.css('width', sliderWidth);
            }
          }
          else {
            this.$secondButton.css('left', clientX - shiftX);
            this.$rangeBetween.css('left', parseInt(this.$firstButton.css('left')));
            this.$rangeBetween.css('width', parseInt(this.$secondButton.css('left')) - parseInt(this.$firstButton.css('left')));

            if (parseInt(this.$secondButton.css('left')) < parseInt(this.$firstButton.css('left')) + parseInt(this.$firstButton.css('width'))) {
              this.$secondButton.css('left', parseInt(this.$firstButton.css('left')) + parseInt(this.$firstButton.css('width')));
            }
            else if (parseInt(this.$secondButton.css('left')) > sliderWidth - secondButtonWidth) {
              this.$secondButton.css('left', sliderWidth - secondButtonWidth);
              this.$rangeBetween.css('width', sliderWidth - parseInt(this.$firstButton.css('left')));
            }
          }
        }

        $(document).on('mousemove', move);

        $(document).on('mouseup', () => {
          $(document).off('mousemove', move);
        });

        this.$secondButton.on('dragstart', () => {
          return false;
        });
      }

      dragSlider = () => {
        this.$secondButton.on('mousedown', this.moveSlider);
      }

      getCoords = (el: JQuery) => {
        const coords = el.position();
        return {
            top: coords.top,
            left: coords.left,
        }
      }
    }

    class Presenter {
      model;
      view;

      constructor(model: {}, view: {}) {
        this.model = model;
        this.view = view;
      }
    }

    let view = new View();

    view.dragSlider();
    view.addInterval();

    return this;
  };
})(jQuery);

$('.slider').mySlider({isInterval: true});
