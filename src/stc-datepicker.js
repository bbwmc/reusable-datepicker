
  if(typeof STC === 'undefined') {
    var STC = {}
  }
  if(!STC.hasOwnProperty('Components')) {
    STC.Components = {};
  }
  STC.Components.BookDatePicker = function(id, options) {

    var input   = document.getElementById(id)
    var $input  = $('#' + id);
    var $parent = $input.closest('form');
    $parent.append('<div class="oldengine">' +
            '<input type="hidden" class="nights" name="nights" value="">' +
            '<input type="hidden" class="startDateDay" name="startDateDay" value="">' +
            '<input type="hidden" class="startDateMonth" name="startDateMonth" value="">' +
            '<input type="hidden" class="startDateYear" name="startDateYear" value="">' +
            '</div>');

    $parent.on('submit', function() {
      var start = moment(stc_datepicker.selectedDates[0])
      var end   = moment(stc_datepicker.selectedDates[1])
      var $this = $(this);
      $this.find('.nights').val(end.diff(start, 'days'));
      $this.find('.startDateYear').val(start.format('YYYY'))
      $this.find('.startDateMonth').val(start.format('MM'))
      $this.find('.startDateDay').val(start.format('DD'))

    });


    var startDate         = moment().startOf('day');
    var endDate           = moment().add(1, 'days').startOf('day');
    var defaultDate       = [new Date(startDate.format('YYYY-MM-DD')), new Date(endDate.format('YYYY-MM-DD'))];
    var defaultDateString = (startDate.format('Do MMMM YYYY')) + " - " + (endDate.format('Do MMMM YYYY'));
    window.stc_datepicker = flatpickr(input, $.extend({
      defaultDate: defaultDate,
      locale: {
        rangeSeparator: ' - ',
        firstDayOfWeek: 1 // start week on Monday
      },
      dateFormat: 'J F Y',
      mode: "range",
      minDate:  new Date(moment().format('YYYY-MM-DD')),
      onChange: function(result, text, obj) {
        if(result.length == 1) {
          if(new Date().fp_incr(15) < new Date(result[0])) {
            stc_datepicker.set('minDate', new Date(result[0]).fp_incr(-14) )
          } else {
            stc_datepicker.set('minDate', moment().startOf('day').toDate())
          }
          stc_datepicker.set('maxDate', moment(result[0]).add(14, 'days').startOf('day').toDate())
        } else if(result.length == 2) {
          stc_datepicker.set('minDate', startDate.toDate())
          stc_datepicker.set('maxDate', null)
          obj.close();
        }
      }
    }, options));
  }
