import { Input, KEYS, keyBindingsForPlatform } from './index';

var InputSim = {
  Input: Input,
  KEYS: KEYS,
  keyBindingsForPlatform: keyBindingsForPlatform
};

if (typeof define === 'function' && define.amd) {
  define(function() { return InputSim; });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputSim;
} else if (typeof window !== 'undefined') {
  window.InputSim = InputSim;
} else {
  this.InputSim = InputSim;
}
