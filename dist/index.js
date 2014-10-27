(function() {
    "use strict";
    var $$keybindings$$$__Array$prototype$slice = Array.prototype.slice;
    var $$keybindings$$$__Object$defineProperties = Object.defineProperties;
    var $$keybindings$$A = 65;

    /** @private */
    var $$keybindings$$Y = 89;

    /** @private */
    var $$keybindings$$Z = 90;

    /** @private */
    var $$keybindings$$ZERO = 48;

    /** @private */
    var $$keybindings$$NINE = 57;

    /** @private */
    var $$keybindings$$LEFT = 37;

    /** @private */
    var $$keybindings$$RIGHT = 39;

    /** @private */
    var $$keybindings$$UP = 38;

    /** @private */
    var $$keybindings$$DOWN = 40;

    /** @private */
    var $$keybindings$$BACKSPACE = 8;

    /** @private */
    var $$keybindings$$DELETE = 46;

    /** @private */
    var $$keybindings$$TAB = 9;

    /** @private */
    var $$keybindings$$ENTER = 13;

    var $$keybindings$$KEYS = {
      A: $$keybindings$$A,
      Y: $$keybindings$$Y,
      Z: $$keybindings$$Z,
      ZERO: $$keybindings$$ZERO,
      NINE: $$keybindings$$NINE,
      LEFT: $$keybindings$$LEFT,
      RIGHT: $$keybindings$$RIGHT,
      UP: $$keybindings$$UP,
      DOWN: $$keybindings$$DOWN,
      BACKSPACE: $$keybindings$$BACKSPACE,
      DELETE: $$keybindings$$DELETE,
      TAB: $$keybindings$$TAB,
      ENTER: $$keybindings$$ENTER,

      /**
       * @param {number} keyCode
       * @returns {boolean}
       */
      isDigit: function(keyCode) {
        return $$keybindings$$ZERO <= keyCode && keyCode <= $$keybindings$$NINE;
      },

      /**
       * Is an arrow keyCode.
       *
       * @param {number} keyCode
       * @returns {boolean}
       */
      isDirectional: function(keyCode) {
        return keyCode === $$keybindings$$LEFT || keyCode === $$keybindings$$RIGHT || keyCode === $$keybindings$$UP || keyCode === $$keybindings$$DOWN;
      }
    };

    var $$keybindings$$CTRL  = 1 << 0;
    var $$keybindings$$META  = 1 << 1;
    var $$keybindings$$ALT   = 1 << 2;
    var $$keybindings$$SHIFT = 1 << 3;
    var $$keybindings$$cache = {};

    function $$keybindings$$keyBindingsForPlatform(platform) {
      var osx = platform === 'OSX';
      var ctrl = osx ? $$keybindings$$META : $$keybindings$$CTRL;

      if (!$$keybindings$$cache[platform]) {
        $$keybindings$$cache[platform] = $$keybindings$$build(function(bind) {
          bind($$keybindings$$A         , ctrl       , 'selectAll');
          bind($$keybindings$$LEFT      , null       , 'moveLeft');
          bind($$keybindings$$LEFT      , $$keybindings$$ALT        , 'moveWordLeft');
          bind($$keybindings$$LEFT      , $$keybindings$$SHIFT      , 'moveLeftAndModifySelection');
          bind($$keybindings$$LEFT      , $$keybindings$$ALT|$$keybindings$$SHIFT  , 'moveWordLeftAndModifySelection');
          bind($$keybindings$$RIGHT     , null       , 'moveRight');
          bind($$keybindings$$RIGHT     , $$keybindings$$ALT        , 'moveWordRight');
          bind($$keybindings$$RIGHT     , $$keybindings$$SHIFT      , 'moveRightAndModifySelection');
          bind($$keybindings$$RIGHT     , $$keybindings$$ALT|$$keybindings$$SHIFT  , 'moveWordRightAndModifySelection');
          bind($$keybindings$$UP        , null       , 'moveUp');
          bind($$keybindings$$UP        , $$keybindings$$ALT        , 'moveToBeginningOfParagraph');
          bind($$keybindings$$UP        , $$keybindings$$SHIFT      , 'moveUpAndModifySelection');
          bind($$keybindings$$UP        , $$keybindings$$ALT|$$keybindings$$SHIFT  , 'moveParagraphBackwardAndModifySelection');
          bind($$keybindings$$DOWN      , null       , 'moveDown');
          bind($$keybindings$$DOWN      , $$keybindings$$ALT        , 'moveToEndOfParagraph');
          bind($$keybindings$$DOWN      , $$keybindings$$SHIFT      , 'moveDownAndModifySelection');
          bind($$keybindings$$DOWN      , $$keybindings$$ALT|$$keybindings$$SHIFT  , 'moveParagraphForwardAndModifySelection');
          bind($$keybindings$$BACKSPACE , null       , 'deleteBackward');
          bind($$keybindings$$BACKSPACE , $$keybindings$$SHIFT      , 'deleteBackward');
          bind($$keybindings$$BACKSPACE , $$keybindings$$ALT        , 'deleteWordBackward');
          bind($$keybindings$$BACKSPACE , $$keybindings$$ALT|$$keybindings$$SHIFT  , 'deleteWordBackward');
          bind($$keybindings$$BACKSPACE , ctrl       , 'deleteBackwardToBeginningOfLine');
          bind($$keybindings$$BACKSPACE , ctrl|$$keybindings$$SHIFT , 'deleteBackwardToBeginningOfLine');
          bind($$keybindings$$DELETE    , null       , 'deleteForward');
          bind($$keybindings$$DELETE    , $$keybindings$$ALT        , 'deleteWordForward');
          bind($$keybindings$$TAB       , null       , 'insertTab');
          bind($$keybindings$$TAB       , $$keybindings$$SHIFT      , 'insertBackTab');
          bind($$keybindings$$ENTER     , null       , 'insertNewline');
          bind($$keybindings$$Z         , ctrl       , 'undo');

          if (osx) {
            bind($$keybindings$$LEFT      , $$keybindings$$META       , 'moveToBeginningOfLine');
            bind($$keybindings$$LEFT      , $$keybindings$$META|$$keybindings$$SHIFT , 'moveToBeginningOfLineAndModifySelection');
            bind($$keybindings$$RIGHT     , $$keybindings$$META       , 'moveToEndOfLine');
            bind($$keybindings$$RIGHT     , $$keybindings$$META|$$keybindings$$SHIFT , 'moveToEndOfLineAndModifySelection');
            bind($$keybindings$$UP        , $$keybindings$$META       , 'moveToBeginningOfDocument');
            bind($$keybindings$$UP        , $$keybindings$$META|$$keybindings$$SHIFT , 'moveToBeginningOfDocumentAndModifySelection');
            bind($$keybindings$$DOWN      , $$keybindings$$META       , 'moveToEndOfDocument');
            bind($$keybindings$$DOWN      , $$keybindings$$META|$$keybindings$$SHIFT , 'moveToEndOfDocumentAndModifySelection');
            bind($$keybindings$$BACKSPACE , $$keybindings$$CTRL       , 'deleteBackwardByDecomposingPreviousCharacter');
            bind($$keybindings$$BACKSPACE , $$keybindings$$CTRL|$$keybindings$$SHIFT , 'deleteBackwardByDecomposingPreviousCharacter');
            bind($$keybindings$$Z         , $$keybindings$$META|$$keybindings$$SHIFT , 'redo');
          } else {
            bind($$keybindings$$Y         , $$keybindings$$CTRL       , 'redo');
          }
        });
      }

      return $$keybindings$$cache[platform];
    }

    function $$keybindings$$build(callback) {
      var result = new $$keybindings$$BindingSet();
      callback(function() {
        var $__0;
        var $__arguments = arguments;
        var args = [].slice.call($__arguments, 0);
        return ($__0 = result).bind.apply($__0, $$keybindings$$$__Array$prototype$slice.call(args));
      });
      return result;
    }

    var $$keybindings$$BindingSet = function() {
      "use strict";

      function BindingSet() {
        this.bindings = {};
      }

      $$keybindings$$$__Object$defineProperties(BindingSet.prototype, {
        bind: {
          value: function(keyCode, modifiers, action) {
            if (!this.bindings[keyCode]) { this.bindings[keyCode] = {}; }
            this.bindings[keyCode][modifiers || 0] = action;
          },

          enumerable: false,
          writable: true
        },

        actionForEvent: {
          value: function(event) {
            var bindingsForKeyCode = this.bindings[event.keyCode];
            if (bindingsForKeyCode) {
              var modifiers = 0;
              if (event.altKey) { modifiers |= $$keybindings$$ALT; }
              if (event.ctrlKey) { modifiers |= $$keybindings$$CTRL; }
              if (event.metaKey) { modifiers |= $$keybindings$$META; }
              if (event.shiftKey) { modifiers |= $$keybindings$$SHIFT; }
              return bindingsForKeyCode[modifiers];
            }
          },

          enumerable: false,
          writable: true
        }
      });

      return BindingSet;
    }();
    var tmp$index$$$__Object$defineProperties = Object.defineProperties;

    /**
     * Enum for text direction affinity.
     *
     * @const
     * @enum {number}
     * @private
     */
    var tmp$index$$Affinity = {
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
    function tmp$index$$isWordChar(chr) {
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
    function tmp$index$$hasLeftWordBreakAtIndex(text, index) {
      if (index === 0) {
        return true;
      } else {
        return !tmp$index$$isWordChar(text[index - 1]) && tmp$index$$isWordChar(text[index]);
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
    function tmp$index$$hasRightWordBreakAtIndex(text, index) {
      if (index === text.length - 1) {
        return true;
      } else {
        return tmp$index$$isWordChar(text[index]) && !tmp$index$$isWordChar(text[index + 1]);
      }
    }

    var tmp$index$$InputSim = function() {
      "use strict";

      function InputSim(value, range) {
        this._value = '';
        this._selectedRange = {
          start: 0,
          length: 0
        };
        this.shouldCancelEvents = true;
        this.selectionAffinity = tmp$index$$Affinity.NONE;

        if(value) {
          this.setText(value);
        }
        if(range) {
          this.setSelectedRange(range);
        }
        this._buildKeybindings();
      }

      tmp$index$$$__Object$defineProperties(InputSim.prototype, {
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
            this[action](event);
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
              case tmp$index$$Affinity.UPSTREAM:
              case tmp$index$$Affinity.NONE:
                // 12<34 56|78  =>  <1234 56|78
                range.length += range.start;
                range.start = 0;
                break;
              case tmp$index$$Affinity.DOWNSTREAM:
                // 12|34 56>78   =>   <12|34 5678
                range.length = range.start;
                range.start = 0;
                break;
            }
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.UPSTREAM);
          },

          enumerable: false,
          writable: true
        },

        moveParagraphBackwardAndModifySelection: {
          value: function(event) {
            this._handleEvent(event);
            var range = this.selectedRange();
            switch (this.selectionAffinity) {
              case tmp$index$$Affinity.UPSTREAM:
              case tmp$index$$Affinity.NONE:
                // 12<34 56|78  =>  <1234 56|78
                range.length += range.start;
                range.start = 0;
                break;
              case tmp$index$$Affinity.DOWNSTREAM:
                // 12|34 56>78  =>  12|34 5678
                range.length = 0;
                break;
            }
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.UPSTREAM);
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
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.UPSTREAM);
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
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.NONE);
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
            if (this.selectionAffinity === tmp$index$$Affinity.UPSTREAM) {
              range.start += range.length;
            }
            range.length = end - range.start;
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.DOWNSTREAM);
          },

          enumerable: false,
          writable: true
        },

        moveParagraphForwardAndModifySelection: {
          value: function(event) {
            this._handleEvent(event);
            var range = this.selectedRange();
            switch (this.selectionAffinity) {
              case tmp$index$$Affinity.DOWNSTREAM:
              case tmp$index$$Affinity.NONE:
                // 12|34 56>78  =>  12|34 5678>
                range.length = this.text().length - range.start;
                break;
              case tmp$index$$Affinity.UPSTREAM:
                // 12<34 56|78  =>  12|34 5678
                range.start += range.length;
                range.length = 0;
                break;
            }
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.DOWNSTREAM);
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
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.DOWNSTREAM);
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
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.NONE);
          },

          enumerable: false,
          writable: true
        },

        moveLeftAndModifySelection: {
          value: function(event) {
            this._handleEvent(event);
            var range = this.selectedRange();
            switch (this.selectionAffinity) {
              case tmp$index$$Affinity.UPSTREAM:
              case tmp$index$$Affinity.NONE:
                this.selectionAffinity = tmp$index$$Affinity.UPSTREAM;
                range.start--;
                range.length++;
                break;
              case tmp$index$$Affinity.DOWNSTREAM:
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
              case tmp$index$$Affinity.UPSTREAM:
              case tmp$index$$Affinity.NONE:
                this.selectionAffinity = tmp$index$$Affinity.UPSTREAM;
                var start = this._lastWordBreakBeforeIndex(range.start - 1);
                range.length += range.start - start;
                range.start = start;
                break;
              case tmp$index$$Affinity.DOWNSTREAM:
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
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.UPSTREAM);
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
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.NONE);
          },

          enumerable: false,
          writable: true
        },

        moveRightAndModifySelection: {
          value: function(event) {
            this._handleEvent(event);
            var range = this.selectedRange();
            switch (this.selectionAffinity) {
              case tmp$index$$Affinity.UPSTREAM:
                range.start++;
                range.length--;
                break;
              case tmp$index$$Affinity.DOWNSTREAM:
              case tmp$index$$Affinity.NONE:
                this.selectionAffinity = tmp$index$$Affinity.DOWNSTREAM;
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
              case tmp$index$$Affinity.UPSTREAM:
                start = Math.min(this._nextWordBreakAfterIndex(start), end);
                break;
              case tmp$index$$Affinity.DOWNSTREAM:
              case tmp$index$$Affinity.NONE:
                this.selectionAffinity = tmp$index$$Affinity.DOWNSTREAM;
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
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.DOWNSTREAM);
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
            this.setSelectedRangeWithAffinity(range, tmp$index$$Affinity.NONE);
          },

          enumerable: false,
          writable: true
        },

        rightWordBreakIndexes: {
          value: function() {
            var result = [];
            var text = this.text();
            for (var i = 0, l = text.length; i < l; i++) {
              if (tmp$index$$hasRightWordBreakAtIndex(text, i)) {
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
            }, tmp$index$$Affinity.NONE);
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
            this.selectionAffinity = range.length === 0 ? tmp$index$$Affinity.NONE : affinity;
            return this._selectedRange;
          },

          enumerable: false,
          writable: true
        },

        selectionAnchor: {
          value: function() {
            var range = this.selectedRange();
            switch (this.selectionAffinity) {
              case tmp$index$$Affinity.UPSTREAM:
                return range.start + range.length;
              case tmp$index$$Affinity.DOWNSTREAM:
                return range.start;
              default:
                return tmp$index$$Affinity.NONE;
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
            this._bindings = $$keybindings$$keyBindingsForPlatform(osx ? 'OSX' : 'Default');
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
              if (tmp$index$$hasLeftWordBreakAtIndex(text, i)) {
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

      return InputSim;
    }();

    if (typeof define === 'function' && define.amd) {
      define(function() { return tmp$index$$InputSim; });
    } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = tmp$index$$InputSim;
    } else if (typeof window !== 'undefined') {
      window.InputSim = tmp$index$$InputSim;
    } else {
      this.InputSim = tmp$index$$InputSim;
    }
}).call(this);

//# sourceMappingURL=index.js.map