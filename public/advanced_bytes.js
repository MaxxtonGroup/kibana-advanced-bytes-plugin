import _ from 'lodash';
require('ui/utils/lodash-mixins/oop')(_);
import 'ui/field_format_editor/numeral/numeral';
import IndexPatternsFieldFormatProvider from 'ui/index_patterns/_field_format/field_format';
import BoundToConfigObjProvider from 'ui/bound_to_config_obj';

export default function AdvancedBytesProvider(Private) {
  let FieldFormat = Private(IndexPatternsFieldFormatProvider);
  let BoundToConfigObj = Private(BoundToConfigObjProvider);
  let numeral = require('numeral')();

  _.class(AdvancedBytes).inherits(FieldFormat);
  function AdvancedBytes(params){
    AdvancedBytes.Super.call(this, params)
  }

  AdvancedBytes.id = 'advancedbytes';
  AdvancedBytes.title = 'Bytes (Advanced)';
  AdvancedBytes.fieldType = 'number';

  AdvancedBytes.prototype._convert = function (val) {
    if (val === -Infinity) return '-∞';
    if (val === +Infinity) return '+∞';
    if (typeof val !== 'number') {
      val = parseFloat(val);
    }

    if (isNaN(val)) return '';

    // Added support for using kb, mb, gb and tb.
    let multiplier = 1024;
    let original_val = val;
    let pattern = this.param('pattern').toLowerCase();

    if(pattern.indexOf('kb') !== -1){
      val = val * multiplier;
      pattern = pattern.replace('kb', 'b');
    }

    if(pattern.indexOf('mb') !== -1 ){
      val = val * Math.pow(multiplier, 2);
      pattern = pattern.replace('mb', 'b');
    }

    if(pattern.indexOf('gb') !== -1){
      val = val * Math.pow(multiplier, 3);
      pattern = pattern.replace('gb', 'b');
    }

    if(pattern.indexOf('tb') !== -1){
      val = val * Math.pow(multiplier, 4);
      pattern = pattern.replace('tb', 'b');
    }

    // Temporary fix for https://github.com/adamwdraper/Numeral-js/issues/312
    val = val * Math.pow(1.024, Math.floor(Math.log(original_val)/Math.log(1024)));

    return numeral.set(val).format(pattern);
  };

  AdvancedBytes.paramDefaults = new BoundToConfigObj({
    pattern: '=format:bytes:defaultPattern',
  });

  AdvancedBytes.editor = {
    template: require('ui/field_format_editor/numeral/numeral.html'),
    controllerAs: 'cntrl',
    controller: function () {
      this.sampleInputs = [308, 1024, 5150000, 1990000000];
    }
  };

  return AdvancedBytes;
}

require('ui/registry/field_formats').register(AdvancedBytesProvider);