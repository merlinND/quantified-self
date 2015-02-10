var drawReporterCharts = require('./drawReporterCharts.js');

module.exports = function handleFileInput(e) {
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
        console.log('Used data loaded.');

        var container = $('#reporter-charts');
        container.empty();
        drawReporterCharts(parsed, container);
     } catch(error) {
      console.err(error);
     }
  };

  var reader = new FileReader();
  reader.onload = handleFile;
  reader.readAsText(file);
};
