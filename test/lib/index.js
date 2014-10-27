import chai from './chai';
import InputSim from './input-sim';
import Selection from './selection';

var Input = InputSim.Input;

var expect = chai.expect;
var setInput = function(description, input) {
  var _input = input || new Input();

  var selection = Selection.parseDescription(description);
  _input.setText(selection.value);
  _input.setSelectedRangeWithAffinity({
    start: selection.caret.start,
    length: (selection.caret.end - selection.caret.start)
  }, selection.affinity);

  return _input;
};

describe('Basic Functionality', function() {
  describe('initialization', function() {
    it('initializes with nothing', function() {
      var input = new Input();
      expect(input.text()).to.equal('');
    });
    it('initializes with a value', function() {
      var input = new Input('Joe');
      expect(input.text()).to.equal('Joe');
    });
    it('initializes with a value and a range', function() {
      var input = new Input('Joe Taylor', {
        start: 3,
        length: 7
      });
      expect(input).to.be.selected('Joe| Taylor|');
    });
  });
});

describe('Public Methods', function() {
  describe('#clearSelection', function() {
    it('clears selection', function() {
      var input = setInput('Joe| Taylor|');

      input.clearSelection();

      expect(input).to.be.selected('Joe|');
    });

    it('clears selection in middle of text', function() {
      var input = setInput('Joe |Tayl|or');

      input.clearSelection();

      expect(input).to.be.selected('Joe |or');
    });

    it('clears nothing', function() {
      var input = setInput('Joe| Taylor');

      input.clearSelection();

      expect(input).to.be.selected('Joe| Taylor');
    });
  });

  /* ************ Backward ************ */
  describe('#deleteBackward', function() {
    it('does nothing', function() {
      var input = setInput('|Darth Vader');

      input.deleteBackward();

      expect(input).to.be.selected('|Darth Vader');
    });

    it('deletes one character', function() {
      var input = setInput('Darth |Vader');

      input.deleteBackward();

      expect(input).to.be.selected('Darth|Vader');
    });
    it('deletes selection', function() {
      var input = setInput('Dar|th| Vader');

      input.deleteBackward();

      expect(input).to.be.selected('Dar| Vader');
    });
  });

  describe('#deleteWordBackward', function() {
    it('does nothing', function() {
      var input = setInput('|Darth Vader');

      input.deleteWordBackward();

      expect(input).to.be.selected('|Darth Vader');
    });

    it('deletes back one word', function() {
      var input = setInput('Dart|h Vader');

      input.deleteWordBackward();

      expect(input).to.be.selected('|h Vader');
    });
    it('deletes selection', function() {
      var input = setInput('Dar|th| Vader');

      input.deleteWordBackward();

      expect(input).to.be.selected('Dar| Vader');
    });
  });

  describe('#deleteBackwardToBeginningOfLine', function() {
    it('does nothing', function() {
      var input = setInput('|Darth Vader');

      input.deleteBackwardToBeginningOfLine();

      expect(input).to.be.selected('|Darth Vader');
    });

    it('deletes back to beginning of line', function() {
      var input = setInput('Darth Va|der');

      input.deleteBackwardToBeginningOfLine();

      expect(input).to.be.selected('|der');
    });
    it('deletes selection', function() {
      var input = setInput('Dar|th| Vader');

      input.deleteBackwardToBeginningOfLine();

      expect(input).to.be.selected('Dar| Vader');
    });
  });

  /* ************ Forward ************ */
  describe('#deleteForward', function() {
    it('does nothing', function() {
      var input = setInput('Obi Wan Kenobi|');

      input.deleteForward();

      expect(input).to.be.selected('Obi Wan Kenobi|');
    });

    it('deletes forward one character', function() {
      var input = setInput('Obi Wa|n Kenobi');

      input.deleteForward();

      expect(input).to.be.selected('Obi Wa| Kenobi');
    });

    it('deletes selection', function() {
      var input = setInput('Obi Wa|n Keno|bi');

      input.deleteForward();

      expect(input).to.be.selected('Obi Wa|bi');
    });
  });

  describe('#deleteWordForward', function() {
    it('does nothing', function() {
      var input = setInput('Obi Wan Kenobi|');

      input.deleteWordForward();

      expect(input).to.be.selected('Obi Wan Kenobi|');
    });

    it('deletes forward one word', function() {
      var input = setInput('Obi W|an Kenobi');

      input.deleteWordForward();

      expect(input).to.be.selected('Obi W| Kenobi');
    });

    it('deletes selection', function() {
      var input = setInput('Obi Wa|n Keno|bi');

      input.deleteWordForward();

      expect(input).to.be.selected('Obi Wa|bi');
    });
  });


  describe('#insertText', function() {
    it('inserts with no selection', function() {
      var input = setInput('Death Star|');

      input.insertText('t');

      expect(input).to.be.selected('Death Start|');
    });
    it('inserts with selection', function() {
      var input = setInput('Dea|th| Star');

      input.insertText('d');

      expect(input).to.be.selected('Dead| Star');
    });
  });

  /* ************ Movement ************ */
  describe('#moveUp', function() {
    it('does nothing', function() {
      var input = setInput('|electrostaff');

      input.moveUp();

      expect(input).to.be.selected('|electrostaff');
    });

    it('moves up no selection', function() {
      var input = setInput('electro|staff');

      input.moveUp();

      expect(input).to.be.selected('|electrostaff');
    });

    it('moves up with selection', function() {
      var input = setInput('electro|staff|');

      input.moveUp();

      expect(input).to.be.selected('|electrostaff');
    });
  });

  describe('#moveToBeginningOfParagraph', function() {
    it('does nothing', function() {
      var input = setInput('|electrostaff');

      input.moveToBeginningOfParagraph();

      expect(input).to.be.selected('|electrostaff');
    });

    it('moves up no selection', function() {
      var input = setInput('electro|staff');

      input.moveToBeginningOfParagraph();

      expect(input).to.be.selected('|electrostaff');
    });

    it('moves up with selection', function() {
      var input = setInput('electro|staff|');

      input.moveToBeginningOfParagraph();

      expect(input).to.be.selected('|electrostaff');
    });
  });

  describe('#moveUpAndModifySelection', function() {
    it('does nothing', function() {
      var input = setInput('|Rebel Alliance X-wing');

      input.moveUpAndModifySelection();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });

    it('moves up affinity downstream', function() {
      var input = setInput('Rebel |Alliance> X-wing');

      input.moveUpAndModifySelection();

      expect(input).to.be.selected('<Rebel |Alliance X-wing');
    });

    it('moves up affinity upstream', function() {
      var input = setInput('Rebel <Alliance| X-wing');

      input.moveUpAndModifySelection();

      expect(input).to.be.selected('<Rebel Alliance| X-wing');
    });
  });

  describe('#moveParagraphBackwardAndModifySelection', function() {
    it('does nothing', function() {
      var input = setInput('|Rebel Alliance X-wing');

      input.moveParagraphBackwardAndModifySelection();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });

    it('moves up affinity downstream', function() {
      var input = setInput('Rebel |Alliance> X-wing');

      input.moveParagraphBackwardAndModifySelection();

      expect(input).to.be.selected('Rebel |Alliance X-wing');
    });

    it('moves up affinity upstream', function() {
      var input = setInput('Rebel <Alliance| X-wing');

      input.moveParagraphBackwardAndModifySelection();

      expect(input).to.be.selected('<Rebel Alliance| X-wing');
    });
  });

  describe('#moveToBeginningOfLine', function() {
    it('does nothing', function() {
      var input = setInput('|Rebel Alliance X-wing');

      input.moveToBeginningOfLine();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });

    it('moves up no selection', function() {
      var input = setInput('Rebel |Alliance X-wing');

      input.moveToBeginningOfLine();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });

    it('moves up with selection', function() {
      var input = setInput('Rebel |Alliance| X-wing');

      input.moveToBeginningOfLine();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });
  });

  describe('#moveToBeginningOfDocument', function() {
    it('does nothing', function() {
      var input = setInput('|Rebel Alliance X-wing');

      input.moveToBeginningOfDocument();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });

    it('moves up no selection', function() {
      var input = setInput('Rebel |Alliance X-wing');

      input.moveToBeginningOfDocument();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });

    it('moves up with selection', function() {
      var input = setInput('Rebel |Alliance| X-wing');

      input.moveToBeginningOfDocument();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });
  });

  describe('#moveToBeginningOfDocumentAndModifySelection', function() {
    it('does nothing', function() {
      var input = setInput('|Rebel Alliance X-wing');

      input.moveToBeginningOfDocumentAndModifySelection();

      expect(input).to.be.selected('|Rebel Alliance X-wing');
    });

    it('moves up affinity downstream', function() {
      var input = setInput('Rebel |Alliance> X-wing');

      input.moveToBeginningOfDocumentAndModifySelection();

      expect(input).to.be.selected('<Rebel Alliance| X-wing');
    });

    it('moves up affinity upstream', function() {
      var input = setInput('Rebel <Alliance| X-wing');

      input.moveToBeginningOfDocumentAndModifySelection();

      expect(input).to.be.selected('<Rebel Alliance| X-wing');
    });
  });

  describe('#moveDown', function() {
    it('does nothing', function() {
      var input = setInput('Rebel Alliance X-wing|');

      input.moveDown();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up no selection', function() {
      var input = setInput('Rebel |Alliance X-wing');

      input.moveDown();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up with selection', function() {
      var input = setInput('Rebel |Alliance| X-wing');

      input.moveDown();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });
  });

  describe('#moveToEndOfParagraph', function() {
    it('does nothing', function() {
      var input = setInput('Rebel Alliance X-wing|');

      input.moveToEndOfParagraph();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up no selection', function() {
      var input = setInput('Rebel |Alliance X-wing');

      input.moveToEndOfParagraph();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up with selection', function() {
      var input = setInput('Rebel |Alliance| X-wing');

      input.moveToEndOfParagraph();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });
  });

  describe('#moveDownAndModifySelection', function() {
    it('does nothing', function() {
      var input = setInput('Rebel Alliance X-wing|');

      input.moveDownAndModifySelection();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up affinity downstream', function() {
      var input = setInput('Rebel |Alliance> X-wing');

      input.moveDownAndModifySelection();

      expect(input).to.be.selected('Rebel |Alliance X-wing>');
    });

    it('moves up affinity upstream', function() {
      var input = setInput('Rebel <Alliance| X-wing');

      input.moveDownAndModifySelection();

      expect(input).to.be.selected('Rebel Alliance| X-wing>');
    });
  });

  describe('#moveParagraphForwardAndModifySelection', function() {
    it('does nothing', function() {
      var input = setInput('Rebel Alliance X-wing|');

      input.moveParagraphForwardAndModifySelection();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up affinity downstream', function() {
      var input = setInput('Rebel |Alliance> X-wing');

      input.moveParagraphForwardAndModifySelection();

      expect(input).to.be.selected('Rebel |Alliance X-wing>');
    });

    it('moves up affinity upstream', function() {
      var input = setInput('Rebel <Alliance| X-wing');

      input.moveParagraphForwardAndModifySelection();

      expect(input).to.be.selected('Rebel Alliance| X-wing');
    });
  });

  describe('#moveToEndOfDocument', function() {
    it('does nothing', function() {
      var input = setInput('Rebel Alliance X-wing|');

      input.moveToEndOfDocument();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up no selection', function() {
      var input = setInput('Rebel |Alliance X-wing');

      input.moveToEndOfDocument();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up with selection', function() {
      var input = setInput('Rebel |Alliance| X-wing');

      input.moveToEndOfDocument();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });
  });


  describe('#moveToEndOfDocumentAndModifySelection', function() {
    it('does nothing', function() {
      var input = setInput('Rebel Alliance X-wing|');

      input.moveToEndOfDocumentAndModifySelection();

      expect(input).to.be.selected('Rebel Alliance X-wing|');
    });

    it('moves up affinity downstream', function() {
      var input = setInput('Rebel |Alliance> X-wing');

      input.moveToEndOfDocumentAndModifySelection();

      expect(input).to.be.selected('Rebel |Alliance X-wing>');
    });

    it('moves up affinity upstream', function() {
      var input = setInput('Rebel <Alliance| X-wing');

      input.moveToEndOfDocumentAndModifySelection();

      expect(input).to.be.selected('Rebel |Alliance X-wing>');
    });
  });

  describe('#moveLeft', function() {
    it('does nothing', function() {
      var input = setInput('|Princess Leia Organa');

      input.moveLeft();

      expect(input).to.be.selected('|Princess Leia Organa');
    });

    it('moves left no selection', function() {
      var input = setInput('Princess| Leia Organa');

      input.moveLeft();

      expect(input).to.be.selected('Princes|s Leia Organa');
    });

    it('moves left with selection', function() {
      var input = setInput('Princes|s Leia| Organa');

      input.moveLeft();

      expect(input).to.be.selected('Princes|s Leia Organa');
    });
  });

  describe('#moveLeftAndModifySelection', function() {
    it('no selection', function() {
      var input = setInput('Princess Leia| Organa');

      input.moveLeftAndModifySelection();

      expect(input).to.be.selected('Princess Lei<a| Organa');
    });

    it('moves left affinity downstream', function() {
      var input = setInput('Princess| Leia >Organa');

      input.moveLeftAndModifySelection();

      expect(input).to.be.selected('Princess| Leia> Organa');
    });

    it('moves left affinity upstream', function() {
      var input = setInput('Princes<s Leia| Organa');

      input.moveLeftAndModifySelection();

      expect(input).to.be.selected('Prince<ss Leia| Organa');
    });
  });

  describe('#moveWordLeft', function() {
    it('does nothing', function() {
      var input = setInput('|Princess Leia Organa');

      input.moveWordLeft();

      expect(input).to.be.selected('|Princess Leia Organa');
    });

    it('no selection', function() {
      var input = setInput('Princess Leia| Organa');

      input.moveWordLeft();

      expect(input).to.be.selected('Princess |Leia Organa');
    });

    it('with selection', function() {
      var input = setInput('Princess| Leia |Organa');

      input.moveWordLeft();

      expect(input).to.be.selected('|Princess Leia Organa');
    });
  });

  describe('#moveWordLeftAndModifySelection', function() {
    it('no selection', function() {
      var input = setInput('Princess Leia| Organa');

      input.moveWordLeftAndModifySelection();

      expect(input).to.be.selected('Princess <Leia| Organa');
    });

    it('moves left affinity downstream', function() {
      var input = setInput('Princess| Leia >Organa');

      input.moveWordLeftAndModifySelection();

      expect(input).to.be.selected('Princess| >Leia Organa');
    });

    it('moves left affinity upstream', function() {
      var input = setInput('Princess <Leia| Organa');

      input.moveWordLeftAndModifySelection();

      expect(input).to.be.selected('<Princess Leia| Organa');
    });
  });

  describe('#moveToBeginningOfLineAndModifySelection', function() {
    it('no selection', function() {
      var input = setInput('Princess Leia| Organa');

      input.moveToBeginningOfLineAndModifySelection();

      expect(input).to.be.selected('<Princess Leia| Organa');
    });

    it('moves left affinity downstream', function() {
      var input = setInput('Princess| Leia >Organa');

      input.moveToBeginningOfLineAndModifySelection();

      expect(input).to.be.selected('<Princess Leia |Organa');
    });

    it('moves left affinity upstream', function() {
      var input = setInput('Princess <Leia| Organa');

      input.moveToBeginningOfLineAndModifySelection();

      expect(input).to.be.selected('<Princess Leia| Organa');
    });
  });

  describe('#moveRight', function() {
    it('does nothing', function() {
      var input = setInput('BlasTech DL-44|');

      input.moveRight();

      expect(input).to.be.selected('BlasTech DL-44|');
    });

    it('moves right no selection', function() {
      var input = setInput('BlasTe|ch DL-44');

      input.moveRight();

      expect(input).to.be.selected('BlasTec|h DL-44');
    });

    it('moves right selection', function() {
      var input = setInput('BlasTe|ch D|L-44');

      input.moveRight();

      expect(input).to.be.selected('BlasTech D|L-44');
    });
  });

  describe('#moveRightAndModifySelection', function() {
    it('moves right with no selection', function() {
      var input = setInput('BlasT|ech DL-44');

      input.moveRightAndModifySelection();

      expect(input).to.be.selected('BlasT|e>ch DL-44');
    });

    it('moves right with affinity downstream', function() {
      var input = setInput('BlasT|ech> DL-44');

      input.moveRightAndModifySelection();

      expect(input).to.be.selected('BlasT|ech >DL-44');
    });

    it('moves right with affinity upstream', function() {
      var input = setInput('Bl<asT|ech DL-44');

      input.moveRightAndModifySelection();

      expect(input).to.be.selected('Bla<sT|ech DL-44');
    });
  });

  describe('#moveWordRight', function() {
    it('does nothing', function() {
      var input = setInput('BlasTech DL-44|');

      input.moveWordRight();

      expect(input).to.be.selected('BlasTech DL-44|');
    });

    it('moves right no selection', function() {
      var input = setInput('BlasTe|ch DL-44');

      input.moveWordRight();

      expect(input).to.be.selected('BlasTech| DL-44');
    });

    it('moves right selection', function() {
      var input = setInput('BlasTe|ch D|L-44');

      input.moveWordRight();

      expect(input).to.be.selected('BlasTech DL|-44');
    });
  });

  describe('#moveWordRightAndModifySelection', function() {
    it('moves right with no selection', function() {
      var input = setInput('BlasT|ech DL-44');

      input.moveWordRightAndModifySelection();

      expect(input).to.be.selected('BlasT|ech> DL-44');
    });

    it('moves right with affinity downstream', function() {
      var input = setInput('BlasT|ech> DL-44');

      input.moveWordRightAndModifySelection();

      expect(input).to.be.selected('BlasT|ech DL>-44');
    });

    it('moves right with affinity upstream', function() {
      var input = setInput('Bl<asT|ech DL-44');

      input.moveWordRightAndModifySelection();

      expect(input).to.be.selected('BlasT|ech DL-44');
    });
  });

  describe('#moveToEndOfLine', function() {
    it('does nothing', function() {
      var input = setInput('BlasTech DL-44|');

      input.moveToEndOfLine();

      expect(input).to.be.selected('BlasTech DL-44|');
    });

    it('moves right no selection', function() {
      var input = setInput('BlasTe|ch DL-44');

      input.moveToEndOfLine();

      expect(input).to.be.selected('BlasTech DL-44|');
    });

    it('moves right selection', function() {
      var input = setInput('BlasTe|ch D|L-44');

      input.moveToEndOfLine();

      expect(input).to.be.selected('BlasTech DL-44|');
    });
  });

  describe('#moveToEndOfLineAndModifySelection', function() {
    it('moves right with no selection', function() {
      var input = setInput('BlasT|ech DL-44');

      input.moveToEndOfLineAndModifySelection();

      expect(input).to.be.selected('BlasT|ech DL-44>');
    });

    it('moves right with affinity downstream', function() {
      var input = setInput('BlasT|ech> DL-44');

      input.moveToEndOfLineAndModifySelection();

      expect(input).to.be.selected('BlasT|ech DL-44>');
    });

    it('moves right with affinity upstream', function() {
      var input = setInput('Bl<asT|ech DL-44');

      input.moveToEndOfLineAndModifySelection();

      expect(input).to.be.selected('Bl|asTech DL-44>');
    });
  });

  describe('#replaceSelection', function() {
    it('adds with no selection', function() {
      var input = setInput('Dark Lord of the |Sith');

      input.replaceSelection('awesome ');

      expect(input).to.be.selected('Dark Lord of the |awesome |Sith');
    });

    it('replaces with selection', function() {
      var input = setInput('Dark Lord of |the Sith| Joe');

      input.replaceSelection('Square®');

      expect(input).to.be.selected('Dark Lord of |Square®| Joe');
    });
  });

  describe('#rightWordBreakIndexes', function() {
    it('gets word breaks', function() {
      var input = setInput('|Dark-Lord of the Sith');

      expect(input.rightWordBreakIndexes()).to.be.eql([4, 9, 12, 16, 21]);
    });

    it('gets word breaks length one char', function() {
      var input = setInput('|j');

      expect(input.rightWordBreakIndexes()).to.be.eql([1]);
    });

    it('gets word breaks length one symbol', function() {
      var input = setInput('|+');

      expect(input.rightWordBreakIndexes()).to.be.eql([1]);
    });
  });

  describe('#selectAll', function() {
    it('with no selection', function() {
      var input = setInput('Dark Lord of the |Sith');

      input.selectAll();

      expect(input).to.be.selected('|Dark Lord of the Sith|');
    });

    it('with selection', function() {
      var input = setInput('Dark Lord of |the Sit|h');

      input.selectAll();

      expect(input).to.be.selected('|Dark Lord of the Sith|');
    });
  });

  describe('#setText', function() {
    it('sets the text when called with a string', function() {
      var input = setInput('|Dantooine');

      input.setText('Tatooine');

      expect(input.text()).to.equal('Tatooine');
    });

    it('sets the text when called with a number', function() {
      var input = setInput('|Dantooine');

      input.setText(5);

      expect(input.text()).to.equal('5');
    });

    it('moves the caret', function() {
      var input = setInput('Dan|tooine');

      input.setText('Tatooine');

      expect(input).to.be.selected('Tatooine|');
    });
  });

  describe('#setSelectedRange', function() {
    it('sets selectedRange with no selection', function() {
      var input = setInput('|Dantooine');

      input.setSelectedRange({
        start: 4,
        length: 0
      });

      expect(input).to.be.selected('Dant|ooine');
    });

    it('sets selectedRange with selection', function() {
      var input = setInput('Dan|too|ine');

      input.setSelectedRange({
        start: 1,
        length: 6
      });

      expect(input).to.be.selected('D|antooi|ne');
    });
  });

  describe('#selectionAnchor', function() {
    it('has no anchor no selection', function() {
      var input = setInput('|Dantooine');

      expect(input.selectionAnchor()).to.equal(null);
    });

    it('has no anchor with selection', function() {
      var input = setInput('|Da|ntooine');

      expect(input.selectionAnchor()).to.equal(null);
    });

    it('has anchor with selection affinity downstream', function() {
      var input = setInput('<Da|ntooine');

      expect(input.selectionAnchor()).to.equal(2);
    });

    it('has anchor with selection affinity upstream', function() {
      var input = setInput('Da|ntoo>ine');

      expect(input.selectionAnchor()).to.equal(2);
    });
  });
});
