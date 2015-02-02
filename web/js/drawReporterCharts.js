var Reporter = require('../../src/reporter');

var highchartsOptions = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: 1,//null,
    plotShadow: false
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
  }
};

var setType = function(series, type) {
  series.forEach(function(s) {
    s.type = type;
  });
};

var addChart = function(container) {
  var chart = $('<div class="reporter-pie-chart"></div>');
  container.append(chart);
  return chart;
};

var addPieChart = function(title, series, container) {
  var chart = addChart(container);

  setType(series, 'pie');
  chart.highcharts({
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
    title: {
      text: title
    },
    series: series
  });
};

var addStackedColumns = function(title, series, container) {
  var chart = addChart(container);
  // setType(series, 'column');
  chart.highcharts({
    chart: {
      type: 'column'
    },
    plotOptions: {
      column: {
        stacking: 'percent'
      }
    },
    title: {
      text: title
    },
    series: series
  });
};

/**
 * Add and draw a graph appropriate to each question type
 */
module.exports = function drawReporterCharts(data, container) {
  'use strict';

  var stats = Reporter.getStats(data);

  Reporter.printMainTokens(stats.questions, 10);

  var oneNamePerQuestion = function(question) {
    return [{
      name: question.prompt,
      data: Object.keys(question.tokens).map(function(t) {
        return [t, question.tokens[t]];
      })
    }];
  };
  var oneNamePerToken = function(question) {
    return Object.keys(question.tokens).map(function(t) {
      return {
        name: t,
        data: [ question.tokens[t] ]
      };
    });
  };

  stats.questions.forEach(function(question) {
    // var series = oneNamePerQuestion(question);
    var series = oneNamePerToken(question);
    // addPieChart(question.prompt, series, container);
    addStackedColumns(question.prompt, series, container);
  });

};
