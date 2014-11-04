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

class Input {
 /**
   * Sets up the initial properties of the TextField and
   * sets  up the event listeners
   *
   * @param {string} value
   * @param {Object} range ({start: 0, length: 0})
   */
  constructor(value, range) {
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

  /**
   * Clears all characters in the existing selection.
   *
   * @example
   *     // 12|34567|8
   *     clearSelection();
   *     // 12|8
   *
   */
  clearSelection() {
    this.replaceSelection('');
  }

  /**
   * Deletes backward one character or clears a non-empty selection.
   *
   * @example
   *
   *     // |What's up, doc?
   *     deleteBackward(event);
   *     // |What's up, doc?
   *
   *     // What'|s up, doc?
   *     deleteBackward(event);
   *     // What|s up, doc?
   *
   *     // |What's| up, doc?
   *     deleteBackward(event);
   *     // | up, doc?
   */
  deleteBackward(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    if (range.length === 0) {
      range.start--;
      range.length++;
      this.setSelectedRange(range);
    }
    this.clearSelection();
  }

  /**
   * Deletes backward one word or clears a non-empty selection.
   *
   * @example
   *     // |What's up, doc?
   *     deleteWordBackward(event);
   *     // |What's up, doc?
   *
   *     // What'|s up, doc?
   *     deleteWordBackward(event);
   *     // |s up, doc?
   *
   *     // |What's| up, doc?
   *     deleteWordBackward(event);
   *     // | up, doc?
   */
  deleteWordBackward(event) {
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
  }

  /**
   * Deletes backward one character, clears a non-empty selection, or decomposes
   * an accented character to its simple form.
   *
   * @TODO Make this work as described.
   *
   * @example
   *     // |fiancée
   *     deleteBackwardByDecomposingPreviousCharacter(event);
   *     // |What's up, doc?
   *
   *     // fianc|é|e
   *     deleteBackwardByDecomposingPreviousCharacter(event);
   *     // fianc|e
   *
   *     // fiancé|e
   *     deleteBackwardByDecomposingPreviousCharacter(event);
   *     // fiance|e
   *
   */
  deleteBackwardByDecomposingPreviousCharacter(event) {
    this.deleteBackward(event);
  }

  /**
   * Deletes all characters before the cursor or clears a non-empty selection.
   *
   * @example
   *     // The quick |brown fox.
   *     deleteBackwardToBeginningOfLine(event);
   *     // |brown fox.
   *
   *     // The |quick |brown fox.
   *     deleteBackwardToBeginningOfLine(event);
   *     // The brown fox.
   *
   */
  deleteBackwardToBeginningOfLine(event) {
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
  }

  /**
   * Deletes forward one character or clears a non-empty selection.
   *
   * @example
   *     // What's up, doc?|
   *     deleteForward(event);
   *     // What's up, doc?|
   *
   *     // What'|s up, doc?
   *     deleteForward(event);
   *     // What'| up, doc?
   *
   *     // |What's| up, doc?
   *     deleteForward(event);
   *     // | up, doc?
   *
   */
  deleteForward(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    if (range.length === 0) {
      range.length++;
      this.setSelectedRange(range);
    }
    this.clearSelection();
  }

  /**
   * Deletes forward one word or clears a non-empty selection.
   *
   * @example
   *     // What's up, doc?|
   *     deleteWordForward(event);
   *     // What's up, doc?|
   *
   *     // What's |up, doc?
   *     deleteWordForward(event);
   *     // What's |, doc?
   *
   *     // |What's| up, doc?
   *     deleteWordForward(event);
   *     // | up, doc?
   */
  deleteWordForward(event) {
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
  }

  handleEvent(event) {
    if(typeof event === 'undefined') {
      throw new Error('cannot handle and event that isn\'t passed');
    }
    var action = this._bindings.actionForEvent(event);
    if(action) this[action](event);
    return action;
  }

  /**
   * Determines whether this field has any selection.
   *
   * @returns {boolean} true if there is at least one character selected
   */
  hasSelection() {
    return this.selectedRange().length !== 0;
  }

  /**
   * Handles the back tab key.
   *
   */
  insertBackTab() {}

  /**
   * Handles a key event could be trying to end editing.
   *
   */
  insertNewline() {}

  /**
   * Handles the tab key.
   *
   */
  insertTab() {}

  /**
   * Handles a event that is trying to insert a character.
   *
   * @param {string} text
   */
  insertText(text) {
    var range;
    if (this.hasSelection()) {
      this.clearSelection();
    }

    this.replaceSelection(text);
    range = this.selectedRange();
    range.start += range.length;
    range.length = 0;
    this.setSelectedRange(range);
  }

  /**
   * Moves the cursor up, which because this is a single-line text field, means
   * moving to the beginning of the value.
   *
   * @example
   *     // Hey guys|
   *     moveUp(event);
   *     // |Hey guys
   *
   *     // Hey |guys|
   *     moveUp(event);
   *     // |Hey guys
   *
   * @param {Event} event
   */
  moveUp(event) {
    this._handleEvent(event);
    this.setSelectedRange({
      start: 0,
      length: 0
    });
  }

  /**
   * Moves the cursor up to the beginning of the current paragraph, which because
   * this is a single-line text field, means moving to the beginning of the
   * value.
   *
   * @example
   *     // Hey guys|
   *     moveToBeginningOfParagraph(event)
   *     // |Hey guys
   *
   *     // Hey |guys|
   *     moveToBeginningOfParagraph(event)
   *     // |Hey guys
   *
   * @param {Event} event
   */
  moveToBeginningOfParagraph(event) {
    this.moveUp(event);
  }

  /**
   * Moves the cursor up, keeping the current anchor point and extending the
   * selection to the beginning as moveUp would.
   *
   * @example
   *     // rightward selections are shrunk
   *     // Hey guys, |where> are you?
   *     moveUpAndModifySelection(event);
   *     // <Hey guys, |where are you?
   *
   *     // leftward selections are extended
   *     // Hey guys, <where| are you?
   *     moveUpAndModifySelection(event);
   *     // <Hey guys, where| are you?
   *
   *     // neutral selections are extended
   *     // Hey guys, |where| are you?
   *     moveUpAndModifySelection(event);
   *     // <Hey guys, where| are you?
   *
   * @param {Event} event
   */
  moveUpAndModifySelection(event) {
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
  }

  /**
   * Moves the free end of the selection to the beginning of the paragraph, or
   * since this is a single-line text field to the beginning of the line.
   *
   * @param {Event} event
   */
  moveParagraphBackwardAndModifySelection(event) {
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
  }

  /**
   * Moves the cursor to the beginning of the document.
   *
   * @param {Event} event
   */
  moveToBeginningOfDocument(event) {
    // Since we only support a single line this is just an alias.
    this.moveToBeginningOfLine(event);
  }

  /**
   * Moves the selection start to the beginning of the document.
   * @param {Event} event
   */
  moveToBeginningOfDocumentAndModifySelection(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    range.length += range.start;
    range.start = 0;
    this.setSelectedRangeWithAffinity(range, Affinity.UPSTREAM);
  }

  /**
   * Moves the cursor down, which because this is a single-line text field, means
   * moving to the end of the value.
   *
   * @example
   *     // Hey |guys
   *     moveDown(event)
   *     // Hey guys|
   *
   *     // |Hey| guys
   *     moveDown(event)
   *     // Hey guys|
   *
   * @param {Event} event
   */
  moveDown(event) {
    this._handleEvent(event);
    // 12|34 56|78  =>  1234 5678|
    var range = {
      start: this.text().length,
      length: 0
    };
    this.setSelectedRangeWithAffinity(range, Affinity.NONE);
  }

  /**
   * Moves the cursor up to the end of the current paragraph, which because this
   * is a single-line text field, means moving to the end of the value.
   *
   * @example
   *     // |Hey guys
   *     moveToEndOfParagraph(event)
   *     // Hey guys|
   *
   *     // Hey |guys|
   *     moveToEndOfParagraph(event)
   *     // Hey guys|
   *
   * @param {Event} event
   */
  moveToEndOfParagraph(event) {
    this.moveDown(event);
  }

  /**
   * Moves the cursor down, keeping the current anchor point and extending the
   * selection to the end as moveDown would.
   *
   * @example
   *     // leftward selections are shrunk
   *     // Hey guys, <where| are you?
   *     moveDownAndModifySelection(event)
   *     // Hey guys, where| are you?>
   *
   *     // rightward selections are extended
   *     // Hey guys, |where> are you?
   *     moveDownAndModifySelection(event)
   *     // Hey guys, |where are you?>
   *
   *     // neutral selections are extended
   *     // Hey guys, |where| are you?
   *     moveDownAndModifySelection(event)
   *     // Hey guys, |where are you?>
   *
   * @param {Event} event
   */
  moveDownAndModifySelection(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    var end = this.text().length;
    if (this.selectionAffinity === Affinity.UPSTREAM) {
      range.start += range.length;
    }
    range.length = end - range.start;
    this.setSelectedRangeWithAffinity(range, Affinity.DOWNSTREAM);
  }

  /**
   * Moves the free end of the selection to the end of the paragraph, or since
   * this is a single-line text field to the end of the line.
   *
   * @param {Event} event
   */
  moveParagraphForwardAndModifySelection(event) {
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
  }

  /**
   * Moves the cursor to the end of the document.
   *
   * @param {Event} event
   */
  moveToEndOfDocument(event) {
    // Since we only support a single line this is just an alias.
    this.moveToEndOfLine(event);
  }

  /**
   * Moves the selection end to the end of the document.
   * @param {Event} event
   */
  moveToEndOfDocumentAndModifySelection(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    range.length = this.text().length - range.start;
    this.setSelectedRangeWithAffinity(range, Affinity.DOWNSTREAM);
  }

  /**
   * Moves the cursor to the left, counting selections as a thing to move past.
   *
   * @example
   *     // no selection just moves the cursor left
   *     // Hey guys|
   *     moveLeft(event)
   *     // Hey guy|s
   *
   *     // selections are removed
   *     // Hey |guys|
   *     moveLeft(event)
   *     // Hey |guys
   *
   * @param {Event} event
   */
  moveLeft(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    if (range.length !== 0) {
      range.length = 0;
    } else {
      range.start--;
    }
    this.setSelectedRangeWithAffinity(range, Affinity.NONE);
  }

  /**
   * Moves the free end of the selection one to the left.
   *
   * @example
   *     // no selection just selects to the left
   *     // Hey guys|
   *     moveLeftAndModifySelection(event)
   *     // Hey guy<s|
   *
   *     // left selections are extended
   *     // Hey <guys|
   *     moveLeftAndModifySelection(event)
   *     // Hey< guys|
   *
   *     // right selections are shrunk
   *     // Hey |guys>
   *     moveLeftAndModifySelection(event)
   *     // Hey |guy>s
   *
   *     // neutral selections are extended
   *     // Hey |guys|
   *     moveLeftAndModifySelection(event)
   *     //Hey< guys|
   *
   * @param {Event} event
   */
  moveLeftAndModifySelection(event) {
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
  }

  /**
   * Moves the cursor left until the start of a word is found.
   *
   * @example
   *     // no selection just moves the cursor left
   *     // Hey guys|
   *     moveWordLeft(event)
   *     // Hey |guys
   *
   *     // selections are removed
   *     // Hey |guys|
   *     moveWordLeft(event)
   *     // |Hey guys
   *
   * @param {Event} event
   */
  moveWordLeft(event) {
    this._handleEvent(event);
    var index = this._lastWordBreakBeforeIndex(this.selectedRange().start - 1);
    this.setSelectedRange({ start: index, length: 0 });
  }

  /**
   * Moves the free end of the current selection to the beginning of the previous
   * word.
   *
   * @example
   *     // no selection just selects to the left
   *     // Hey guys|
   *     moveWordLeftAndModifySelection(event)
   *     // Hey <guys|
   *
   *     // left selections are extended
   *     // Hey <guys|
   *     moveWordLeftAndModifySelection(event)
   *     // <Hey guys|
   *
   *     // right selections are shrunk
   *     // |Hey guys>
   *     moveWordLeftAndModifySelection(event)
   *     // |Hey >guys
   *
   *     // neutral selections are extended
   *     // Hey |guys|
   *     moveWordLeftAndModifySelection(event)
   *     // <Hey guys|
   *
   * @param {Event} event
   */
  moveWordLeftAndModifySelection(event) {
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
  }

  /**
   * Moves the cursor to the beginning of the current line.
   *
   * @example
   *     // Hey guys, where| are ya?
   *     moveToBeginningOfLine(event)
   *     // |Hey guys, where are ya?
   *
   * @param {Event} event
   */
  moveToBeginningOfLine(event) {
    this._handleEvent(event);
    this.setSelectedRange({ start: 0, length: 0 });
  }

  /**
   * Select from the free end of the selection to the beginning of line.
   *
   * @example
   *     // Hey guys, where| are ya?
   *     moveToBeginningOfLineAndModifySelection(event)
   *     // <Hey guys, where| are ya?
   *
   *     // Hey guys, where| are> ya?
   *     moveToBeginningOfLineAndModifySelection(event)
   *     // <Hey guys, where are| ya?
   *
   * @param {Event} event
   */
  moveToBeginningOfLineAndModifySelection(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    range.length += range.start;
    range.start = 0;
    this.setSelectedRangeWithAffinity(range, Affinity.UPSTREAM);
  }

  /**
   * Moves the cursor to the right, counting selections as a thing to move past.
   *
   * @example
   *     // no selection just moves the cursor right
   *     // Hey guy|s
   *     moveRight(event)
   *     // Hey guys|
   *
   *     // selections are removed
   *     // Hey |guys|
   *     moveRight(event)
   *     // Hey guys|
   *
   * @param {Event} event
   */
  moveRight(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    if (range.length !== 0) {
      range.start += range.length;
      range.length = 0;
    } else {
      range.start++;
    }
    this.setSelectedRangeWithAffinity(range, Affinity.NONE);
  }

  /**
   * Moves the free end of the selection one to the right.
   *
   * @example
   *     // no selection just selects to the right
   *     // Hey |guys
   *     moveRightAndModifySelection(event)
   *     // Hey |g>uys
   *
   *     // right selections are extended
   *     // Hey |gu>ys
   *     moveRightAndModifySelection(event)
   *     // Hey |guy>s
   *
   *     // left selections are shrunk
   *     // <Hey |guys
   *     moveRightAndModifySelection(event)
   *     // H<ey |guys
   *
   *     // neutral selections are extended
   *     // |Hey| guys
   *     moveRightAndModifySelection(event)
   *     // |Hey >guys
   *
   * @param {Event} event
   */
  moveRightAndModifySelection(event) {
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
  }

  /**
   * Moves the cursor right until the end of a word is found.
   *
   * @example
   *     // no selection just moves the cursor right
   *     // Hey| guys
   *     moveWordRight(event)
   *     // Hey guys|
   *
   *     // selections are removed
   *     // |Hey| guys
   *     moveWordRight(event)
   *     // Hey guys|
   *
   * @param {Event} event
   */
  moveWordRight(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    var index = this._nextWordBreakAfterIndex(range.start + range.length);
    this.setSelectedRange({ start: index, length: 0 });
  }

  /**
   * Moves the free end of the current selection to the next end of word.
   *
   * @example
   *     // no selection just selects to the right
   *     // Hey |guys
   *     moveWordRightAndModifySelection(event)
   *     // Hey |guys|
   *
   *     // right selections are extended
   *     // Hey |g>uys
   *     moveWordRightAndModifySelection(event)
   *     // Hey |guys>
   *
   *     // left selections are shrunk
   *     // He<y |guys
   *     moveWordRightAndModifySelection(event)
   *     // Hey< |guys
   *
   *     // neutral selections are extended
   *     // He|y |guys
   *     moveWordRightAndModifySelection(event)
   *     // He|y guys>
   *
   * @param {Event} event
   */
  moveWordRightAndModifySelection(event) {
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
  }

  /**
   * Moves the cursor to the end of the current line.
   *
   * @example
   *     // Hey guys, where| are ya?
   *     moveToEndOfLine(event)
   *     // |Hey guys, where are ya?
   *
   * @param {Event} event
   */
  moveToEndOfLine(event) {
    this._handleEvent(event);
    this.setSelectedRange({ start: this.text().length, length: 0 });
  }

  /**
   * Moves the free end of the selection to the end of the current line.
   *
   * @example
   *     // Hey guys, where| are ya?
   *     moveToEndOfLineAndModifySelection(event)
   *     // Hey guys, where| are ya?>
   *
   *     // Hey guys, <where| are ya?
   *     moveToEndOfLineAndModifySelection(event)
   *     // Hey guys, |where are ya?>
   *
   * @param {Event} event
   */
  moveToEndOfLineAndModifySelection(event) {
    this._handleEvent(event);
    var range = this.selectedRange();
    range.length = this.text().length - range.start;
    this.setSelectedRangeWithAffinity(range, Affinity.DOWNSTREAM);
  }

  /**
   * Replaces the characters within the selection with given text.
   *
   * @example
   *     // 12|34567|8
   *     replaceSelection('00')
   *     // 12|00|8
   *
   * @param {string} replacement
   */
  replaceSelection(replacement) {
    var range = this.selectedRange();
    var end = range.start + range.length;
    var text = this.text();
    text = text.substring(0, range.start) + replacement + text.substring(end);
    range.length = replacement.length;
    this.setText(text);
    this.setSelectedRangeWithAffinity(range, Affinity.NONE);
  }

  /**
   * Find ends of 'words' for navigational purposes.
   *
   * @example
   *     // given value of '123456789' and text of '123-45-6789'
   *     rightWordBreakIndexes()
   *     //=> [3, 5, 9]
   *
   * @returns {number[]}
   */
  rightWordBreakIndexes() {
    var result = [];
    var text = this.text();
    for (var i = 0, l = text.length; i < l; i++) {
      if (hasRightWordBreakAtIndex(text, i)) {
        result.push(i + 1);
      }
    }
    return result;
  }

  /**
   * Expands the selection to contain all the characters in the content.
   *
   * @example
   *     // 123|45678
   *     selectAll(event)
   *     // |12345678|
   *
   * @param {Event} event
   */
  selectAll(event) {
    this._handleEvent(event);
    this.setSelectedRangeWithAffinity({
      start: 0,
      length: this.text().length
    }, Affinity.NONE);
  }

  /**
   * Gets the object value. This is the value that should be considered the
   * 'real' value of the field.
   *
   * @returns {String}
   */
  text() {
    return this._value;
  }

  /**
   * Sets the object value of the field.
   *
   * @param {string} value
   */
  setText(value) {
    this._value = '' + value;
    this.setSelectedRange({
      start: this._value.length,
      length: 0
    });
  }

  /**
   * Gets the range of the current selection.
   *
   * @returns {Object} {start: number, length: number}
   */
  selectedRange() {
    return this._selectedRange;
  }

  /**
   * Sets the range of the current selection without changing the affinity.
   * @param {Object} range ({start: 0, length: 0})
   */
  setSelectedRange(range) {
    this.setSelectedRangeWithAffinity(range, this.selectionAffinity);
  }

  /**
   * Sets the range of the current selection and the selection affinity.
   *
   * @param {Object} range {start: number, length: number}
   * @param {Affinity} affinity
   * @returns {Object} {start: 0, length: 0}
   */
  setSelectedRangeWithAffinity(range, affinity) {
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
  }

  /**
   * Gets the position of the current selection's anchor point, i.e. the point
   * that the selection extends from, if any.
   *
   * @returns {number}
   */
  selectionAnchor() {
    var range = this.selectedRange();
    switch (this.selectionAffinity) {
      case Affinity.UPSTREAM:
        return range.start + range.length;
      case Affinity.DOWNSTREAM:
        return range.start;
      default:
        return Affinity.NONE;
    }
  }




  /**
   * Builds the key bindings for platform
   *
   * @TODO: Make this better
   * @private
   */
  _buildKeybindings() {
    var osx;

    if(typeof navigator !== 'undefined') {
      osx = /^Mozilla\/[\d\.]+ \(Macintosh/.test(navigator.userAgent);
    } else if(typeof process !== 'undefined') {
      osx = /darwin/.test(process.platform);
    }
    this._bindings = keyBindingsForPlatform(osx ? 'OSX' : 'Default');
  }

  /**
   * Handles the event based on the `shouldCancelEvents` prop.
   *
   * @param {Event} event
   * @private
   */
  _handleEvent(event) {
    if(event && this.shouldCancelEvents) {
      event.preventDefault();
    }
  }

  /**
   * Finds the start of the 'word' before index.
   *
   * @param {number} index position at which to start looking
   * @returns {number} index in value less than or equal to the given index
   * @private
   */
  _lastWordBreakBeforeIndex(index) {
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
  }

  /**
   * Find starts of 'words' for navigational purposes.
   *
   * @example
   *     // given value of '123456789' and text of '123-45-6789'
   *     leftWordBreakIndexes()
   *     // => [0, 3, 5]
   *
   * @returns {number[]} indexes in value of word starts.
   * @private
   */
  _leftWordBreakIndexes() {
    var result = [];
    var text = this.text();
    for (var i = 0, l = text.length; i < l; i++) {
      if (hasLeftWordBreakAtIndex(text, i)) {
        result.push(i);
      }
    }
    return result;
  }

  /**
   * Finds the end of the 'word' after index.
   *
   * @param {number} index position in value at which to start looking.
   * @returns {number}
   * @private
   */
  _nextWordBreakAfterIndex(index) {
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
  }
}

export { Input, KEYS, keyBindingsForPlatform };

