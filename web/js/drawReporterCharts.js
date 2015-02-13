/**
 * @file
 */
// TODO: doc
// TODO: remove the Highcharts watermark

var _ = require('lodash');

var Reporter = require('../../src/reporter');

var highchartsOptions = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: 1,
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
    },
    column: {
      stacking: 'percent'
    }
  }
};

var setType = function(series, type) {
  series.forEach(function(s) {
    s.type = type;
  });
};

/**
 * Ways to generate the data series
 */
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

/**
 * Ways to draw specific charts
 */
var addChart = function(container) {
  var chart = $('<div class="reporter-pie-chart"></div>');
  container.append(chart);
  return chart;
};
var setupChart = function(container, title, series, options) {
  var chart = addChart(container);
  options.title = title;
  options.series = series;
  chart.highcharts(_.merge(options, highchartsOptions));
};

var addPieChart = function(question, container) {
  var series = oneNamePerQuestion(question);
  setupChart(container, question.prompt, series, {
    chart: {
      type: 'pie'
    }
  });
};

var addStackedColumns = function(question, container) {
  var series = oneNamePerToken(question);
  setupChart(container, question.prompt, series, {
    chart: {
      type: 'column'
    }
  });
};

/**
 * Each question type has an appropriate chart
 * (default: pie)
 */
var chartTypes = {};
chartTypes[Reporter.questionTypes.YES_NO] = addStackedColumns;
chartTypes[Reporter.questionTypes.MULTIPLE_CHOICE] = addStackedColumns;

/**
 * Add and draw a graph appropriate to each question type
 *
 * @param `n` Most number of answers to include for a question.
 *            Defaults to 10. Pass -1 to always include all answers.
 */
module.exports = function drawReporterCharts(data, container, n) {
  'use strict';
  n = n || 10;

  var stats = Reporter.getStats(data);

  // Log textual summary
  Reporter.printMainTokens(stats.questions, n);

  // Retain only `n` answers per questions
  // TODO: then we no longer add up to 100%, we need an 'other' category to make up for it
  stats.questions.forEach(function(q) {
    q.tokens = Reporter.getTopTokens(q, n);
  });

  stats.questions.forEach(function(question) {
    var drawer = chartTypes[question.questionType] || addPieChart;
    drawer(question, container);
  });

};
