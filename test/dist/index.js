(function() {
    "use strict";
    var $$selection$$default = Selection;

    chai.use(function (_chai, utils) {
      utils.addMethod(chai.Assertion.prototype, 'selected', function (description) {
        var selection = $$selection$$default.parseDescription(description).caret;
        var inputText = this._obj.text();
        var inputSelectedRange = this._obj.selectedRange();
        var inputSelectedEnd = inputSelectedRange.start + inputSelectedRange.length;
        var inputDescription = $$selection$$default.printDescription({
          caret: {
            start: inputSelectedRange.start,
            end: inputSelectedEnd
          },
          value: inputText,
          affinity: this._obj.selectionAffinity
        });

        this.assert(
          inputDescription === description,
          "expected #{exp} to be '" + inputDescription + "'",
          "expected #{exp} not to be '" + inputDescription + "'",
          description
        );
      });
    });

    var $$chai$$default = chai;
    var $$input$sim$$default = InputSim;

    var tmp$index$$expect = $$chai$$default.expect;
    var tmp$index$$setInput = function(description, input) {
      var _input = input || new $$input$sim$$default();

      var selection = $$selection$$default.parseDescription(description);
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
          var input = new $$input$sim$$default();
          tmp$index$$expect(input.text()).to.equal('');
        });
        it('initializes with a value', function() {
          var input = new $$input$sim$$default('Joe');
          tmp$index$$expect(input.text()).to.equal('Joe');
        });
        it('initializes with a value and a range', function() {
          var input = new $$input$sim$$default('Joe Taylor', {
            start: 3,
            length: 7
          });
          tmp$index$$expect(input).to.be.selected('Joe| Taylor|');
        });
      });
    });

    describe('Public Methods', function() {
      describe('#clearSelection', function() {
        it('clears selection', function() {
          var input = tmp$index$$setInput('Joe| Taylor|');

          input.clearSelection();

          tmp$index$$expect(input).to.be.selected('Joe|');
        });

        it('clears selection in middle of text', function() {
          var input = tmp$index$$setInput('Joe |Tayl|or');

          input.clearSelection();

          tmp$index$$expect(input).to.be.selected('Joe |or');
        });

        it('clears nothing', function() {
          var input = tmp$index$$setInput('Joe| Taylor');

          input.clearSelection();

          tmp$index$$expect(input).to.be.selected('Joe| Taylor');
        });
      });

      /* ************ Backward ************ */
      describe('#deleteBackward', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Darth Vader');

          input.deleteBackward();

          tmp$index$$expect(input).to.be.selected('|Darth Vader');
        });

        it('deletes one character', function() {
          var input = tmp$index$$setInput('Darth |Vader');

          input.deleteBackward();

          tmp$index$$expect(input).to.be.selected('Darth|Vader');
        });
        it('deletes selection', function() {
          var input = tmp$index$$setInput('Dar|th| Vader');

          input.deleteBackward();

          tmp$index$$expect(input).to.be.selected('Dar| Vader');
        });
      });

      describe('#deleteWordBackward', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Darth Vader');

          input.deleteWordBackward();

          tmp$index$$expect(input).to.be.selected('|Darth Vader');
        });

        it('deletes back one word', function() {
          var input = tmp$index$$setInput('Dart|h Vader');

          input.deleteWordBackward();

          tmp$index$$expect(input).to.be.selected('|h Vader');
        });
        it('deletes selection', function() {
          var input = tmp$index$$setInput('Dar|th| Vader');

          input.deleteWordBackward();

          tmp$index$$expect(input).to.be.selected('Dar| Vader');
        });
      });

      describe('#deleteBackwardToBeginningOfLine', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Darth Vader');

          input.deleteBackwardToBeginningOfLine();

          tmp$index$$expect(input).to.be.selected('|Darth Vader');
        });

        it('deletes back to beginning of line', function() {
          var input = tmp$index$$setInput('Darth Va|der');

          input.deleteBackwardToBeginningOfLine();

          tmp$index$$expect(input).to.be.selected('|der');
        });
        it('deletes selection', function() {
          var input = tmp$index$$setInput('Dar|th| Vader');

          input.deleteBackwardToBeginningOfLine();

          tmp$index$$expect(input).to.be.selected('Dar| Vader');
        });
      });

      /* ************ Forward ************ */
      describe('#deleteForward', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('Obi Wan Kenobi|');

          input.deleteForward();

          tmp$index$$expect(input).to.be.selected('Obi Wan Kenobi|');
        });

        it('deletes forward one character', function() {
          var input = tmp$index$$setInput('Obi Wa|n Kenobi');

          input.deleteForward();

          tmp$index$$expect(input).to.be.selected('Obi Wa| Kenobi');
        });

        it('deletes selection', function() {
          var input = tmp$index$$setInput('Obi Wa|n Keno|bi');

          input.deleteForward();

          tmp$index$$expect(input).to.be.selected('Obi Wa|bi');
        });
      });

      describe('#deleteWordForward', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('Obi Wan Kenobi|');

          input.deleteWordForward();

          tmp$index$$expect(input).to.be.selected('Obi Wan Kenobi|');
        });

        it('deletes forward one word', function() {
          var input = tmp$index$$setInput('Obi W|an Kenobi');

          input.deleteWordForward();

          tmp$index$$expect(input).to.be.selected('Obi W| Kenobi');
        });

        it('deletes selection', function() {
          var input = tmp$index$$setInput('Obi Wa|n Keno|bi');

          input.deleteWordForward();

          tmp$index$$expect(input).to.be.selected('Obi Wa|bi');
        });
      });


      describe('#insertText', function() {
        it('inserts with no selection', function() {
          var input = tmp$index$$setInput('Death Star|');

          input.insertText('t');

          tmp$index$$expect(input).to.be.selected('Death Start|');
        });
        it('inserts with selection', function() {
          var input = tmp$index$$setInput('Dea|th| Star');

          input.insertText('d');

          tmp$index$$expect(input).to.be.selected('Dead| Star');
        });
      });

      /* ************ Movement ************ */
      describe('#moveUp', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|electrostaff');

          input.moveUp();

          tmp$index$$expect(input).to.be.selected('|electrostaff');
        });

        it('moves up no selection', function() {
          var input = tmp$index$$setInput('electro|staff');

          input.moveUp();

          tmp$index$$expect(input).to.be.selected('|electrostaff');
        });

        it('moves up with selection', function() {
          var input = tmp$index$$setInput('electro|staff|');

          input.moveUp();

          tmp$index$$expect(input).to.be.selected('|electrostaff');
        });
      });

      describe('#moveToBeginningOfParagraph', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|electrostaff');

          input.moveToBeginningOfParagraph();

          tmp$index$$expect(input).to.be.selected('|electrostaff');
        });

        it('moves up no selection', function() {
          var input = tmp$index$$setInput('electro|staff');

          input.moveToBeginningOfParagraph();

          tmp$index$$expect(input).to.be.selected('|electrostaff');
        });

        it('moves up with selection', function() {
          var input = tmp$index$$setInput('electro|staff|');

          input.moveToBeginningOfParagraph();

          tmp$index$$expect(input).to.be.selected('|electrostaff');
        });
      });

      describe('#moveUpAndModifySelection', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Rebel Alliance X-wing');

          input.moveUpAndModifySelection();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });

        it('moves up affinity downstream', function() {
          var input = tmp$index$$setInput('Rebel |Alliance> X-wing');

          input.moveUpAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Rebel |Alliance X-wing');
        });

        it('moves up affinity upstream', function() {
          var input = tmp$index$$setInput('Rebel <Alliance| X-wing');

          input.moveUpAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Rebel Alliance| X-wing');
        });
      });

      describe('#moveParagraphBackwardAndModifySelection', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Rebel Alliance X-wing');

          input.moveParagraphBackwardAndModifySelection();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });

        it('moves up affinity downstream', function() {
          var input = tmp$index$$setInput('Rebel |Alliance> X-wing');

          input.moveParagraphBackwardAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel |Alliance X-wing');
        });

        it('moves up affinity upstream', function() {
          var input = tmp$index$$setInput('Rebel <Alliance| X-wing');

          input.moveParagraphBackwardAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Rebel Alliance| X-wing');
        });
      });

      describe('#moveToBeginningOfLine', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Rebel Alliance X-wing');

          input.moveToBeginningOfLine();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });

        it('moves up no selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance X-wing');

          input.moveToBeginningOfLine();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });

        it('moves up with selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance| X-wing');

          input.moveToBeginningOfLine();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });
      });

      describe('#moveToBeginningOfDocument', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Rebel Alliance X-wing');

          input.moveToBeginningOfDocument();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });

        it('moves up no selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance X-wing');

          input.moveToBeginningOfDocument();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });

        it('moves up with selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance| X-wing');

          input.moveToBeginningOfDocument();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });
      });

      describe('#moveToBeginningOfDocumentAndModifySelection', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Rebel Alliance X-wing');

          input.moveToBeginningOfDocumentAndModifySelection();

          tmp$index$$expect(input).to.be.selected('|Rebel Alliance X-wing');
        });

        it('moves up affinity downstream', function() {
          var input = tmp$index$$setInput('Rebel |Alliance> X-wing');

          input.moveToBeginningOfDocumentAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Rebel Alliance| X-wing');
        });

        it('moves up affinity upstream', function() {
          var input = tmp$index$$setInput('Rebel <Alliance| X-wing');

          input.moveToBeginningOfDocumentAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Rebel Alliance| X-wing');
        });
      });

      describe('#moveDown', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('Rebel Alliance X-wing|');

          input.moveDown();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up no selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance X-wing');

          input.moveDown();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up with selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance| X-wing');

          input.moveDown();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });
      });

      describe('#moveToEndOfParagraph', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('Rebel Alliance X-wing|');

          input.moveToEndOfParagraph();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up no selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance X-wing');

          input.moveToEndOfParagraph();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up with selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance| X-wing');

          input.moveToEndOfParagraph();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });
      });

      describe('#moveDownAndModifySelection', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('Rebel Alliance X-wing|');

          input.moveDownAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up affinity downstream', function() {
          var input = tmp$index$$setInput('Rebel |Alliance> X-wing');

          input.moveDownAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel |Alliance X-wing>');
        });

        it('moves up affinity upstream', function() {
          var input = tmp$index$$setInput('Rebel <Alliance| X-wing');

          input.moveDownAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance| X-wing>');
        });
      });

      describe('#moveParagraphForwardAndModifySelection', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('Rebel Alliance X-wing|');

          input.moveParagraphForwardAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up affinity downstream', function() {
          var input = tmp$index$$setInput('Rebel |Alliance> X-wing');

          input.moveParagraphForwardAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel |Alliance X-wing>');
        });

        it('moves up affinity upstream', function() {
          var input = tmp$index$$setInput('Rebel <Alliance| X-wing');

          input.moveParagraphForwardAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance| X-wing');
        });
      });

      describe('#moveToEndOfDocument', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('Rebel Alliance X-wing|');

          input.moveToEndOfDocument();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up no selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance X-wing');

          input.moveToEndOfDocument();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up with selection', function() {
          var input = tmp$index$$setInput('Rebel |Alliance| X-wing');

          input.moveToEndOfDocument();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });
      });


      describe('#moveToEndOfDocumentAndModifySelection', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('Rebel Alliance X-wing|');

          input.moveToEndOfDocumentAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel Alliance X-wing|');
        });

        it('moves up affinity downstream', function() {
          var input = tmp$index$$setInput('Rebel |Alliance> X-wing');

          input.moveToEndOfDocumentAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel |Alliance X-wing>');
        });

        it('moves up affinity upstream', function() {
          var input = tmp$index$$setInput('Rebel <Alliance| X-wing');

          input.moveToEndOfDocumentAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Rebel |Alliance X-wing>');
        });
      });

      describe('#moveLeft', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Princess Leia Organa');

          input.moveLeft();

          tmp$index$$expect(input).to.be.selected('|Princess Leia Organa');
        });

        it('moves left no selection', function() {
          var input = tmp$index$$setInput('Princess| Leia Organa');

          input.moveLeft();

          tmp$index$$expect(input).to.be.selected('Princes|s Leia Organa');
        });

        it('moves left with selection', function() {
          var input = tmp$index$$setInput('Princes|s Leia| Organa');

          input.moveLeft();

          tmp$index$$expect(input).to.be.selected('Princes|s Leia Organa');
        });
      });

      describe('#moveLeftAndModifySelection', function() {
        it('no selection', function() {
          var input = tmp$index$$setInput('Princess Leia| Organa');

          input.moveLeftAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Princess Lei<a| Organa');
        });

        it('moves left affinity downstream', function() {
          var input = tmp$index$$setInput('Princess| Leia >Organa');

          input.moveLeftAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Princess| Leia> Organa');
        });

        it('moves left affinity upstream', function() {
          var input = tmp$index$$setInput('Princes<s Leia| Organa');

          input.moveLeftAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Prince<ss Leia| Organa');
        });
      });

      describe('#moveWordLeft', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('|Princess Leia Organa');

          input.moveWordLeft();

          tmp$index$$expect(input).to.be.selected('|Princess Leia Organa');
        });

        it('no selection', function() {
          var input = tmp$index$$setInput('Princess Leia| Organa');

          input.moveWordLeft();

          tmp$index$$expect(input).to.be.selected('Princess |Leia Organa');
        });

        it('with selection', function() {
          var input = tmp$index$$setInput('Princess| Leia |Organa');

          input.moveWordLeft();

          tmp$index$$expect(input).to.be.selected('|Princess Leia Organa');
        });
      });

      describe('#moveWordLeftAndModifySelection', function() {
        it('no selection', function() {
          var input = tmp$index$$setInput('Princess Leia| Organa');

          input.moveWordLeftAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Princess <Leia| Organa');
        });

        it('moves left affinity downstream', function() {
          var input = tmp$index$$setInput('Princess| Leia >Organa');

          input.moveWordLeftAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Princess| >Leia Organa');
        });

        it('moves left affinity upstream', function() {
          var input = tmp$index$$setInput('Princess <Leia| Organa');

          input.moveWordLeftAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Princess Leia| Organa');
        });
      });

      describe('#moveToBeginningOfLineAndModifySelection', function() {
        it('no selection', function() {
          var input = tmp$index$$setInput('Princess Leia| Organa');

          input.moveToBeginningOfLineAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Princess Leia| Organa');
        });

        it('moves left affinity downstream', function() {
          var input = tmp$index$$setInput('Princess| Leia >Organa');

          input.moveToBeginningOfLineAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Princess Leia |Organa');
        });

        it('moves left affinity upstream', function() {
          var input = tmp$index$$setInput('Princess <Leia| Organa');

          input.moveToBeginningOfLineAndModifySelection();

          tmp$index$$expect(input).to.be.selected('<Princess Leia| Organa');
        });
      });

      describe('#moveRight', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('BlasTech DL-44|');

          input.moveRight();

          tmp$index$$expect(input).to.be.selected('BlasTech DL-44|');
        });

        it('moves right no selection', function() {
          var input = tmp$index$$setInput('BlasTe|ch DL-44');

          input.moveRight();

          tmp$index$$expect(input).to.be.selected('BlasTec|h DL-44');
        });

        it('moves right selection', function() {
          var input = tmp$index$$setInput('BlasTe|ch D|L-44');

          input.moveRight();

          tmp$index$$expect(input).to.be.selected('BlasTech D|L-44');
        });
      });

      describe('#moveRightAndModifySelection', function() {
        it('moves right with no selection', function() {
          var input = tmp$index$$setInput('BlasT|ech DL-44');

          input.moveRightAndModifySelection();

          tmp$index$$expect(input).to.be.selected('BlasT|e>ch DL-44');
        });

        it('moves right with affinity downstream', function() {
          var input = tmp$index$$setInput('BlasT|ech> DL-44');

          input.moveRightAndModifySelection();

          tmp$index$$expect(input).to.be.selected('BlasT|ech >DL-44');
        });

        it('moves right with affinity upstream', function() {
          var input = tmp$index$$setInput('Bl<asT|ech DL-44');

          input.moveRightAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Bla<sT|ech DL-44');
        });
      });

      describe('#moveWordRight', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('BlasTech DL-44|');

          input.moveWordRight();

          tmp$index$$expect(input).to.be.selected('BlasTech DL-44|');
        });

        it('moves right no selection', function() {
          var input = tmp$index$$setInput('BlasTe|ch DL-44');

          input.moveWordRight();

          tmp$index$$expect(input).to.be.selected('BlasTech| DL-44');
        });

        it('moves right selection', function() {
          var input = tmp$index$$setInput('BlasTe|ch D|L-44');

          input.moveWordRight();

          tmp$index$$expect(input).to.be.selected('BlasTech DL|-44');
        });
      });

      describe('#moveWordRightAndModifySelection', function() {
        it('moves right with no selection', function() {
          var input = tmp$index$$setInput('BlasT|ech DL-44');

          input.moveWordRightAndModifySelection();

          tmp$index$$expect(input).to.be.selected('BlasT|ech> DL-44');
        });

        it('moves right with affinity downstream', function() {
          var input = tmp$index$$setInput('BlasT|ech> DL-44');

          input.moveWordRightAndModifySelection();

          tmp$index$$expect(input).to.be.selected('BlasT|ech DL>-44');
        });

        it('moves right with affinity upstream', function() {
          var input = tmp$index$$setInput('Bl<asT|ech DL-44');

          input.moveWordRightAndModifySelection();

          tmp$index$$expect(input).to.be.selected('BlasT|ech DL-44');
        });
      });

      describe('#moveToEndOfLine', function() {
        it('does nothing', function() {
          var input = tmp$index$$setInput('BlasTech DL-44|');

          input.moveToEndOfLine();

          tmp$index$$expect(input).to.be.selected('BlasTech DL-44|');
        });

        it('moves right no selection', function() {
          var input = tmp$index$$setInput('BlasTe|ch DL-44');

          input.moveToEndOfLine();

          tmp$index$$expect(input).to.be.selected('BlasTech DL-44|');
        });

        it('moves right selection', function() {
          var input = tmp$index$$setInput('BlasTe|ch D|L-44');

          input.moveToEndOfLine();

          tmp$index$$expect(input).to.be.selected('BlasTech DL-44|');
        });
      });

      describe('#moveToEndOfLineAndModifySelection', function() {
        it('moves right with no selection', function() {
          var input = tmp$index$$setInput('BlasT|ech DL-44');

          input.moveToEndOfLineAndModifySelection();

          tmp$index$$expect(input).to.be.selected('BlasT|ech DL-44>');
        });

        it('moves right with affinity downstream', function() {
          var input = tmp$index$$setInput('BlasT|ech> DL-44');

          input.moveToEndOfLineAndModifySelection();

          tmp$index$$expect(input).to.be.selected('BlasT|ech DL-44>');
        });

        it('moves right with affinity upstream', function() {
          var input = tmp$index$$setInput('Bl<asT|ech DL-44');

          input.moveToEndOfLineAndModifySelection();

          tmp$index$$expect(input).to.be.selected('Bl|asTech DL-44>');
        });
      });

      describe('#replaceSelection', function() {
        it('adds with no selection', function() {
          var input = tmp$index$$setInput('Dark Lord of the |Sith');

          input.replaceSelection('awesome ');

          tmp$index$$expect(input).to.be.selected('Dark Lord of the |awesome |Sith');
        });

        it('replaces with selection', function() {
          var input = tmp$index$$setInput('Dark Lord of |the Sith| Joe');

          input.replaceSelection('Square®');

          tmp$index$$expect(input).to.be.selected('Dark Lord of |Square®| Joe');
        });
      });

      describe('#rightWordBreakIndexes', function() {
        it('gets word breaks', function() {
          var input = tmp$index$$setInput('|Dark-Lord of the Sith');

          tmp$index$$expect(input.rightWordBreakIndexes()).to.be.eql([4, 9, 12, 16, 21]);
        });
      });

      describe('#selectAll', function() {
        it('with no selection', function() {
          var input = tmp$index$$setInput('Dark Lord of the |Sith');

          input.selectAll();

          tmp$index$$expect(input).to.be.selected('|Dark Lord of the Sith|');
        });

        it('with selection', function() {
          var input = tmp$index$$setInput('Dark Lord of |the Sit|h');

          input.selectAll();

          tmp$index$$expect(input).to.be.selected('|Dark Lord of the Sith|');
        });
      });

      describe('#setText', function() {
        it('sets the text when called with a string', function() {
          var input = tmp$index$$setInput('|Dantooine');

          input.setText('Tatooine');

          tmp$index$$expect(input.text()).to.equal('Tatooine');
        });

        it('sets the text when called with a number', function() {
          var input = tmp$index$$setInput('|Dantooine');

          input.setText(5);

          tmp$index$$expect(input.text()).to.equal('5');
        });

        it('moves the caret', function() {
          var input = tmp$index$$setInput('Dan|tooine');

          input.setText('Tatooine');

          tmp$index$$expect(input).to.be.selected('Tatooine|');
        });
      });

      describe('#setSelectedRange', function() {
        it('sets selectedRange with no selection', function() {
          var input = tmp$index$$setInput('|Dantooine');

          input.setSelectedRange({
            start: 4,
            length: 0
          });

          tmp$index$$expect(input).to.be.selected('Dant|ooine');
        });

        it('sets selectedRange with selection', function() {
          var input = tmp$index$$setInput('Dan|too|ine');

          input.setSelectedRange({
            start: 1,
            length: 6
          });

          tmp$index$$expect(input).to.be.selected('D|antooi|ne');
        });
      });

      describe('#selectionAnchor', function() {
        it('has no anchor no selection', function() {
          var input = tmp$index$$setInput('|Dantooine');

          tmp$index$$expect(input.selectionAnchor()).to.equal(null);
        });

        it('has no anchor with selection', function() {
          var input = tmp$index$$setInput('|Da|ntooine');

          tmp$index$$expect(input.selectionAnchor()).to.equal(null);
        });

        it('has anchor with selection affinity downstream', function() {
          var input = tmp$index$$setInput('<Da|ntooine');

          tmp$index$$expect(input.selectionAnchor()).to.equal(2);
        });

        it('has anchor with selection affinity upstream', function() {
          var input = tmp$index$$setInput('Da|ntoo>ine');

          tmp$index$$expect(input.selectionAnchor()).to.equal(2);
        });
      });
    });
}).call(this);

//# sourceMappingURL=index.js.map