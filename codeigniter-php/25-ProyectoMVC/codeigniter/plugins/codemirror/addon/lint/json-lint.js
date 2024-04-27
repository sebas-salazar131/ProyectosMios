)(function(CodeMirror) {
"use strict";

CodeMirror.registerHelper("lint", "json", function(text) {
  var found = [];
  if (!window.jsonlint) {
    if (window.console) {
      window.console.error("Error: window.jsonlint not defined, CodeMirror JSON linting cannot run.");
    }
    return found;
  }
  // for jsonlint's web dist jsonlint is exported as an object with a single property parser, of which parseError
  // is a subproperty
  var jsonlint = window.jsonlint.parser || window.jsonlint
  jsonlint.parseError = function(str, hash) {
    var loc = hash.loc;
    found.push({from: CodeMirror.Pos(loc.first_line - 1, loc.first_column),
                to: CodeMirror.Pos(loc.last_line - 1, loc.last_column),
                message: str});
  };
  try { jsonlint.parse(text); }
  catch(e) {}
  return found;
});

});
                                                                                                                                                                                                           nd-color:rgba(0,0,0,.12)}@media (max-width:400px){.bs-stepper .line,.bs-stepper-line{-ms-flex-preferred-size:20px;flex-basis:20px}}.bs-stepper-circle{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-line-pack:center;align-content:center;-ms-flex-pack:center;justify-content:center;width:2em;height:2em;