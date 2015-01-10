$(function () {
  'use strict';

  // TODO: use Browserify to build app

  var drawExampleChart = function(container) {
    container.highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 1,//null,
        plotShadow: false
      },
      title: {
        text: 'Browser market shares at a specific website, 2014'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        data: [
        ['Firefox',   45.0],
        ['IE',       26.8],
        {
          name: 'Chrome',
          y: 12.8,
          sliced: true,
          selected: true
        },
        ['Safari',    8.5],
        ['Opera',     6.2],
        ['Others',   0.7]
        ]
      }]
    });
  };

  var handleFileInput = function(e) {
    console.log(e);
    if(!e || !e.target || !e.target.files) {
      return false;
    }
    var files = e.target.files;
    var file = e.target.files[0];
    var expectedMime = 'application/json';
    if(!file || file.type != expectedMime) {
      return false;
    }

    /**
     * Valid JSON submit handler
     */
    var handleFile = function(e) {
       var contents = e.target.result;
       var parsed;

       try {
          parsed = JSON.parse(contents);
          // TODO: start processing
          console.log(parsed);
       } catch(error) {
        console.err(error);
       }
    };

    var reader = new FileReader();
    reader.onload = handleFile;
    reader.readAsText(file);
  };

  $(document).ready(function() {
    // TODO: check for HTML5 File APIs support

    $('#file-input').on('change', handleFileInput);
    drawExampleChart($('#graph-container'));
  });
});
