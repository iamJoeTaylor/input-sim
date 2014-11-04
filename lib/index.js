var $__Object$defineProperties = Object.defineProperties;
import { KEYS, keyBindingsForPlatform } from './keybindings';

/**
 * Enum for text direction affinity.
 *
 * @const
 * @enum {number}
 * @private
 */
var Affinity = {
  UPSTREAM: 0,
  DOWNSTREAM: 1,
  NONE: null
};

/**
 * Tests is string passed in is a single word.
 *
 * @param {string} chr
 * @returns {boolean}
 * @private
 */
function isWordChar(chr) {
  return chr && /^\w$/.test(chr);
}

/**
 * Checks if char to the left of {index} in {string}
 * is a break (non-char).
 *
 * @param {string} text
 * @param {number} index
 * @returns {boolean}
 * @private
 */
function hasLeftWordBreakAtIndex(text, index) {
  if (index === 0) {
    return true;
  } else {
    return !isWordChar(text[index - 1]) && isWordChar(text[index]);
  }
}

/**
 * Checks if char to the right of {index} in {string}
 * is a break (non-char).
 *
 * @param {string} text
 * @param {number} index
 * @returns {boolean}
 * @private
 */
function hasRightWordBreakAtIndex(text, index) {
  if (index === text.length - 1) {
    return true;
  } else {
    return isWordChar(text[index]) && !isWordChar(text[index + 1]);
  }
}

var Input = function() {
  "use strict";

  function Input(value, range) {
    this._value = '';
    this._selectedRange = {
      start: 0,
      length: 0
    };
    this.shouldCancelEvents = true;
    this.selectionAffinity = Affinity.NONE;

    if(value) {
      this.setText(value);
    }
    if(range) {
      this.setSelectedRange(range);
    }
    this._buildKeybindings();
  }

  $__Object$defineProperties(Input.prototype, {
    clearSelection: {
      value: function() {
        this.replaceSelection('');
      },

      enumerable: false,
      writable: true
    },

    deleteBackward: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        if (range.length === 0) {
          range.start--;
          range.length++;
          this.setSelectedRange(range);
        }
        this.clearSelection();
      },

      enumerable: false,
      writable: true
    },

    deleteWordBackward: {
      value: function(event) {
        if (this.hasSelection()) {
          this.deleteBackward(event);
        } else {
          this._handleEvent(event);
          var range = this.selectedRange();
          var start = this._lastWordBreakBeforeIndex(range.start);
          range.length += range.start - start;
          range.start = start;
          this.setSelectedRange(range);
          this.clearSelection();
        }
      },

      enumerable: false,
      writable: true
    },

    deleteBackwardByDecomposingPreviousCharacter: {
      value: function(event) {
        this.deleteBackward(event);
      },

      enumerable: false,
      writable: true
    },

    deleteBackwardToBeginningOfLine: {
      value: function(event) {
        if (this.hasSelection()) {
          this.deleteBackward(event);
        } else {
          this._handleEvent(event);
          var range = this.selectedRange();
          range.length = range.start;
          range.start = 0;
          this.setSelectedRange(range);
          this.clearSelection();
        }
      },

      enumerable: false,
      writable: true
    },

    deleteForward: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        if (range.length === 0) {
          range.length++;
          this.setSelectedRange(range);
        }
        this.clearSelection();
      },

      enumerable: false,
      writable: true
    },

    deleteWordForward: {
      value: function(event) {
        if (this.hasSelection()) {
          return this.deleteForward(event);
        } else {
          this._handleEvent(event);
          var range = this.selectedRange();
          var end = this._nextWordBreakAfterIndex(range.start + range.length);
          this.setSelectedRange({
            start: range.start,
            length: end - range.start
          });
          this.clearSelection();
        }
      },

      enumerable: false,
      writable: true
    },

    handleEvent: {
      value: function(event) {
        if(typeof event === 'undefined') {
          throw new Error('cannot handle and event that isn\'t passed');
        }
        var action = this._bindings.actionForEvent(event);
        if(action) this[action](event);
        return action;
      },

      enumerable: false,
      writable: true
    },

    hasSelection: {
      value: function() {
        return this.selectedRange().length !== 0;
      },

      enumerable: false,
      writable: true
    },

    insertBackTab: {
      value: function() {},
      enumerable: false,
      writable: true
    },

    insertNewline: {
      value: function() {},
      enumerable: false,
      writable: true
    },

    insertTab: {
      value: function() {},
      enumerable: false,
      writable: true
    },

    insertText: {
      value: function(text) {
        var range;
        if (this.hasSelection()) {
          this.clearSelection();
        }

        this.replaceSelection(text);
        range = this.selectedRange();
        range.start += range.length;
        range.length = 0;
        this.setSelectedRange(range);
      },

      enumerable: false,
      writable: true
    },

    moveUp: {
      value: function(event) {
        this._handleEvent(event);
        this.setSelectedRange({
          start: 0,
          length: 0
        });
      },

      enumerable: false,
      writable: true
    },

    moveToBeginningOfParagraph: {
      value: function(event) {
        this.moveUp(event);
      },

      enumerable: false,
      writable: true
    },

    moveUpAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        switch (this.selectionAffinity) {
          case Affinity.UPSTREAM:
          case Affinity.NONE:
            // 12<34 56|78  =>  <1234 56|78
            range.length += range.start;
            range.start = 0;
            break;
          case Affinity.DOWNSTREAM:
            // 12|34 56>78   =>   <12|34 5678
            range.length = range.start;
            range.start = 0;
            break;
        }
        this.setSelectedRangeWithAffinity(range, Affinity.UPSTREAM);
      },

      enumerable: false,
      writable: true
    },

    moveParagraphBackwardAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        switch (this.selectionAffinity) {
          case Affinity.UPSTREAM:
          case Affinity.NONE:
            // 12<34 56|78  =>  <1234 56|78
            range.length += range.start;
            range.start = 0;
            break;
          case Affinity.DOWNSTREAM:
            // 12|34 56>78  =>  12|34 5678
            range.length = 0;
            break;
        }
        this.setSelectedRangeWithAffinity(range, Affinity.UPSTREAM);
      },

      enumerable: false,
      writable: true
    },

    moveToBeginningOfDocument: {
      value: function(event) {
        // Since we only support a single line this is just an alias.
        this.moveToBeginningOfLine(event);
      },

      enumerable: false,
      writable: true
    },

    moveToBeginningOfDocumentAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        range.length += range.start;
        range.start = 0;
        this.setSelectedRangeWithAffinity(range, Affinity.UPSTREAM);
      },

      enumerable: false,
      writable: true
    },

    moveDown: {
      value: function(event) {
        this._handleEvent(event);
        // 12|34 56|78  =>  1234 5678|
        var range = {
          start: this.text().length,
          length: 0
        };
        this.setSelectedRangeWithAffinity(range, Affinity.NONE);
      },

      enumerable: false,
      writable: true
    },

    moveToEndOfParagraph: {
      value: function(event) {
        this.moveDown(event);
      },

      enumerable: false,
      writable: true
    },

    moveDownAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        var end = this.text().length;
        if (this.selectionAffinity === Affinity.UPSTREAM) {
          range.start += range.length;
        }
        range.length = end - range.start;
        this.setSelectedRangeWithAffinity(range, Affinity.DOWNSTREAM);
      },

      enumerable: false,
      writable: true
    },

    moveParagraphForwardAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        switch (this.selectionAffinity) {
          case Affinity.DOWNSTREAM:
          case Affinity.NONE:
            // 12|34 56>78  =>  12|34 5678>
            range.length = this.text().length - range.start;
            break;
          case Affinity.UPSTREAM:
            // 12<34 56|78  =>  12|34 5678
            range.start += range.length;
            range.length = 0;
            break;
        }
        this.setSelectedRangeWithAffinity(range, Affinity.DOWNSTREAM);
      },

      enumerable: false,
      writable: true
    },

    moveToEndOfDocument: {
      value: function(event) {
        // Since we only support a single line this is just an alias.
        this.moveToEndOfLine(event);
      },

      enumerable: false,
      writable: true
    },

    moveToEndOfDocumentAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        range.length = this.text().length - range.start;
        this.setSelectedRangeWithAffinity(range, Affinity.DOWNSTREAM);
      },

      enumerable: false,
      writable: true
    },

    moveLeft: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        if (range.length !== 0) {
          range.length = 0;
        } else {
          range.start--;
        }
        this.setSelectedRangeWithAffinity(range, Affinity.NONE);
      },

      enumerable: false,
      writable: true
    },

    moveLeftAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        switch (this.selectionAffinity) {
          case Affinity.UPSTREAM:
          case Affinity.NONE:
            this.selectionAffinity = Affinity.UPSTREAM;
            range.start--;
            range.length++;
            break;
          case Affinity.DOWNSTREAM:
            range.length--;
            break;
        }
        this.setSelectedRange(range);
      },

      enumerable: false,
      writable: true
    },

    moveWordLeft: {
      value: function(event) {
        this._handleEvent(event);
        var index = this._lastWordBreakBeforeIndex(this.selectedRange().start - 1);
        this.setSelectedRange({ start: index, length: 0 });
      },

      enumerable: false,
      writable: true
    },

    moveWordLeftAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        switch (this.selectionAffinity) {
          case Affinity.UPSTREAM:
          case Affinity.NONE:
            this.selectionAffinity = Affinity.UPSTREAM;
            var start = this._lastWordBreakBeforeIndex(range.start - 1);
            range.length += range.start - start;
            range.start = start;
            break;
          case Affinity.DOWNSTREAM:
            var end = this._lastWordBreakBeforeIndex(range.start + range.length);
            if (end < range.start) {
              end = range.start;
            }
            range.length -= range.start + range.length - end;
            break;
        }
        this.setSelectedRange(range);
      },

      enumerable: false,
      writable: true
    },

    moveToBeginningOfLine: {
      value: function(event) {
        this._handleEvent(event);
        this.setSelectedRange({ start: 0, length: 0 });
      },

      enumerable: false,
      writable: true
    },

    moveToBeginningOfLineAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        range.length += range.start;
        range.start = 0;
        this.setSelectedRangeWithAffinity(range, Affinity.UPSTREAM);
      },

      enumerable: false,
      writable: true
    },

    moveRight: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        if (range.length !== 0) {
          range.start += range.length;
          range.length = 0;
        } else {
          range.start++;
        }
        this.setSelectedRangeWithAffinity(range, Affinity.NONE);
      },

      enumerable: false,
      writable: true
    },

    moveRightAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        switch (this.selectionAffinity) {
          case Affinity.UPSTREAM:
            range.start++;
            range.length--;
            break;
          case Affinity.DOWNSTREAM:
          case Affinity.NONE:
            this.selectionAffinity = Affinity.DOWNSTREAM;
            range.length++;
            break;
        }
        this.setSelectedRange(range);
      },

      enumerable: false,
      writable: true
    },

    moveWordRight: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        var index = this._nextWordBreakAfterIndex(range.start + range.length);
        this.setSelectedRange({ start: index, length: 0 });
      },

      enumerable: false,
      writable: true
    },

    moveWordRightAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        var start = range.start;
        var end = range.start + range.length;
        switch (this.selectionAffinity) {
          case Affinity.UPSTREAM:
            start = Math.min(this._nextWordBreakAfterIndex(start), end);
            break;
          case Affinity.DOWNSTREAM:
          case Affinity.NONE:
            this.selectionAffinity = Affinity.DOWNSTREAM;
            end = this._nextWordBreakAfterIndex(range.start + range.length);
            break;
        }
        this.setSelectedRange({ start: start, length: end - start });
      },

      enumerable: false,
      writable: true
    },

    moveToEndOfLine: {
      value: function(event) {
        this._handleEvent(event);
        this.setSelectedRange({ start: this.text().length, length: 0 });
      },

      enumerable: false,
      writable: true
    },

    moveToEndOfLineAndModifySelection: {
      value: function(event) {
        this._handleEvent(event);
        var range = this.selectedRange();
        range.length = this.text().length - range.start;
        this.setSelectedRangeWithAffinity(range, Affinity.DOWNSTREAM);
      },

      enumerable: false,
      writable: true
    },

    replaceSelection: {
      value: function(replacement) {
        var range = this.selectedRange();
        var end = range.start + range.length;
        var text = this.text();
        text = text.substring(0, range.start) + replacement + text.substring(end);
        range.length = replacement.length;
        this.setText(text);
        this.setSelectedRangeWithAffinity(range, Affinity.NONE);
      },

      enumerable: false,
      writable: true
    },

    rightWordBreakIndexes: {
      value: function() {
        var result = [];
        var text = this.text();
        for (var i = 0, l = text.length; i < l; i++) {
          if (hasRightWordBreakAtIndex(text, i)) {
            result.push(i + 1);
          }
        }
        return result;
      },

      enumerable: false,
      writable: true
    },

    selectAll: {
      value: function(event) {
        this._handleEvent(event);
        this.setSelectedRangeWithAffinity({
          start: 0,
          length: this.text().length
        }, Affinity.NONE);
      },

      enumerable: false,
      writable: true
    },

    text: {
      value: function() {
        return this._value;
      },

      enumerable: false,
      writable: true
    },

    setText: {
      value: function(value) {
        this._value = '' + value;
        this.setSelectedRange({
          start: this._value.length,
          length: 0
        });
      },

      enumerable: false,
      writable: true
    },

    selectedRange: {
      value: function() {
        return this._selectedRange;
      },

      enumerable: false,
      writable: true
    },

    setSelectedRange: {
      value: function(range) {
        this.setSelectedRangeWithAffinity(range, this.selectionAffinity);
      },

      enumerable: false,
      writable: true
    },

    setSelectedRangeWithAffinity: {
      value: function(range, affinity) {
        var min = 0;
        var max = this.text().length;
        var caret = {
          start: Math.max(min, Math.min(max, range.start)),
          end: Math.max(min, Math.min(max, range.start + range.length))
        };
        this._selectedRange = {
          start: caret.start,
          length: caret.end - caret.start
        }
        this.selectionAffinity = range.length === 0 ? Affinity.NONE : affinity;
        return this._selectedRange;
      },

      enumerable: false,
      writable: true
    },

    selectionAnchor: {
      value: function() {
        var range = this.selectedRange();
        switch (this.selectionAffinity) {
          case Affinity.UPSTREAM:
            return range.start + range.length;
          case Affinity.DOWNSTREAM:
            return range.start;
          default:
            return Affinity.NONE;
        }
      },

      enumerable: false,
      writable: true
    },

    _buildKeybindings: {
      value: function() {
        var osx;

        if(typeof navigator !== 'undefined') {
          osx = /^Mozilla\/[\d\.]+ \(Macintosh/.test(navigator.userAgent);
        } else if(typeof process !== 'undefined') {
          osx = /darwin/.test(process.platform);
        }
        this._bindings = keyBindingsForPlatform(osx ? 'OSX' : 'Default');
      },

      enumerable: false,
      writable: true
    },

    _handleEvent: {
      value: function(event) {
        if(event && this.shouldCancelEvents) {
          event.preventDefault();
        }
      },

      enumerable: false,
      writable: true
    },

    _lastWordBreakBeforeIndex: {
      value: function(index) {
        var indexes = this._leftWordBreakIndexes();
        var result = indexes[0];
        for (var i = 0, l = indexes.length; i < l; i++) {
          var wordBreakIndex = indexes[i];
          if (index > wordBreakIndex) {
            result = wordBreakIndex;
          } else {
            break;
          }
        }
        return result;
      },

      enumerable: false,
      writable: true
    },

    _leftWordBreakIndexes: {
      value: function() {
        var result = [];
        var text = this.text();
        for (var i = 0, l = text.length; i < l; i++) {
          if (hasLeftWordBreakAtIndex(text, i)) {
            result.push(i);
          }
        }
        return result;
      },

      enumerable: false,
      writable: true
    },

    _nextWordBreakAfterIndex: {
      value: function(index) {
        var indexes = this.rightWordBreakIndexes().reverse();
        var result = indexes[0];
        for (var i = 0, l = indexes.length; i < l; i++) {
          var wordBreakIndex = indexes[i];
          if (index < wordBreakIndex) {
            result = wordBreakIndex;
          } else {
            break;
          }
        }
        return result;
      },

      enumerable: false,
      writable: true
    }
  });

  return Input;
}();

export { Input, KEYS, keyBindingsForPlatform };

