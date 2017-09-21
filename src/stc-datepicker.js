
if(typeof STC === 'undefined') {
  var STC = {};
}
if(!STC.hasOwnProperty('Components')) {
  STC.Components = {};
}
STC.Components.BookDatePicker = function(selector, displayTitles, options, onChangeCallback) {

  var options = typeof options !== 'object' ? {} : options;
  var momentLoaded    = false;
  var flatpickrLoaded = false;
  window.flatpickrAttempt = false;
  window.momentAttempt = false;
  if(!window.jQuery) {
    throw "jQuery required for BookDatePicker to work"
  }
  if(!window.moment && window.momentAttempt == false) {
    window.momentAttempt = true;
    var script  = document.createElement('script');
    script.type = "text/javascript";
    script.src  = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js";
    script.onload = function() {
      momentLoaded = true;
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  } else {
    momentLoaded = true;
  }

  if(!$.fn.flatpickr && window.flatpickrAttempt == false) {
    window.flatpickrAttempt = true;
      var scripttwo  = document.createElement('script');
      scripttwo.type = "text/javascript";
      scripttwo.src  = "https://unpkg.com/flatpickr";
      scripttwo.onload = function() {
        flatpickrLoaded = true;
      }
      document.getElementsByTagName('head')[0].appendChild(scripttwo);
  } else {
    flatpickrLoaded = true;
  }

  if(!momentLoaded || !flatpickrLoaded) {
    setTimeout(function() {
      STC.Components.BookDatePicker(selector, displayTitles, options, onChangeCallback)
    }, 700);

    return false;
  }

  var $input  = $(selector);

  $input.each(function(index) {

    var startDate = moment(options.startDate)
    var endDate   = moment(options.endDate)

    if(!startDate.isValid()) {
      startDate = moment()
    }
    startDate = startDate.startOf('day');

    if(!endDate.isValid()) {
      endDate = moment().add(1, 'days')
    }
    endDate = endDate.startOf('day');

    var defaultDate       = [new Date(startDate.format('YYYY-MM-DD')), new Date(endDate.format('YYYY-MM-DD'))];
    var defaultDateString = (startDate.format('Do MMMM YYYY')) + " - " + (endDate.format('Do MMMM YYYY'));
    var $this             = $(this);
    var $start = $('<span class="stc-datepicker__start stc-datepicker__date">'+ startDate.format('Do MMMM YYYY') +'</span>');
    var $end   = $('<span class="stc-datepicker__end stc-datepicker__date">'+ endDate.format('Do MMMM YYYY') +'</span>');
    var $form  = $('<div class="stc-datepicker"></div>');

    $form.on('click', function() {
      stc_datepicker.toggle();
    })
    $this.css({
      width: '100%', height: 0,
      border: 0, margin: 0,
      padding: 0, display: 'block',
      visibility: 'hidden'
    });
    $this.wrap($form);
    var $wrapper = $this.closest('.stc-datepicker');
    if(displayTitles === false) {
      $wrapper.addClass('stc-datepicker--notitles')
    }
    $start.insertBefore($this);
    $end.insertAfter($start);

    var input   = $this.eq(0);
    var $parent = $this.closest('form');
    $parent.append('<div class="oldengine">' +
            '<input type="hidden" class="nights" name="nights" value="">' +
            '<input type="hidden" class="startDateDay" name="startDateDay" value="">' +
            '<input type="hidden" class="startDateMonth" name="startDateMonth" value="">' +
            '<input type="hidden" class="startDateYear" name="startDateYear" value="">' +
            '<input type="hidden" class="endDateDay" name="endDateDay" value="">' +
            '<input type="hidden" class="endDateMonth" name="endDateMonth" value="">' +
            '<input type="hidden" class="endDateYear" name="endDateYear" value="">' +
            '<input type="hidden" class="startDateFull" name="startDateFull" value="">' +
            '<input type="hidden" class="endDateFull" name="endDateFull" value="">' +
            '</div>');

    $parent.on('submit', function() {
      var start = moment(stc_datepicker.selectedDates[0]);
      var end   = moment(stc_datepicker.selectedDates[1]);
      var $this = $(this);
      $this.find('.nights').val(end.diff(start, 'days'));
      $this.find('.startDateYear').val(start.format('YYYY'));
      $this.find('.startDateMonth').val(start.format('MM'));
      $this.find('.startDateDay').val(start.format('DD'));
      // Start
      $this.find('.endDateYear').val(end.format('YYYY'));
      $this.find('.endDateMonth').val(end.format('MM'));
      $this.find('.endDateDay').val(end.format('DD'));

      $this.find('.startDateFull').val(start.format('YYYY-MM-DD'));
      $this.find('.endDateFull').val(end.format('YYYY-MM-DD'));

    });


    var stc_datepicker = $this.flatpickr($.extend({
      defaultDate: defaultDate,
      locale: {
        rangeSeparator: ' - ',
        firstDayOfWeek: 1 // start week on Monday
      },
      dateFormat: 'J F Y',
      mode: "range",
      minDate:  new Date(moment().format('YYYY-MM-DD')),
      onChange: function(result, text, obj) {
        if(result.length == 0) {
          $start.html("");
          $end.html("");
        } else if(result.length == 1) {
          $start.html(moment(result[0]).format('Do MMMM YYYY'));
          $end.html("");

          $wrapper.addClass('stc-datepicker--oneoftwo');
          if(new Date().fp_incr(15) < new Date(result[0])) {
            stc_datepicker.set('minDate', new Date(result[0]).fp_incr(-14) );
          } else {
            stc_datepicker.set('minDate', moment().startOf('day').toDate());
          }
          stc_datepicker.set('maxDate', moment(result[0]).add(14, 'days').startOf('day').toDate());
        } else if(result.length == 2) {
          $wrapper.removeClass('stc-datepicker--oneoftwo');
          $start.html(moment(result[0]).format('Do MMMM YYYY'));
          $end.html(moment(result[1]).format('Do MMMM YYYY'));
          stc_datepicker.set('minDate', moment().startOf('day').toDate());
          stc_datepicker.set('maxDate', null);
          obj.close();
        }
        if(typeof onChangeCallback == "function") {
          onChangeCallback.call(this, $parent, result);
        }
      }
    }, options));

  })
}
