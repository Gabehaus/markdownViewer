import React, { componentDidMount, forceUpdate } from "react";
import logo from "./logo.svg";
import "./App.css";
import marked from "marked";
import hljs from "highlight.js";
import Automator from "./Components/Automator";

import Draggable, { DraggableCore } from "react-draggable";

//Markdown version attempting to correct CSS nightmare

marked.setOptions({
  breaks: true
});

// sets a default input variable with an initial markdown example
const markText = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: markText,
      preInput: "",
      lastEnteredText: "",
      headerType: "H1",
      dropdownOpen: "false",
      dropBopen: "false",
      columns: 1,
      rows: 1,
      activeDrags: 0,
      deltaPosition: {
        x: 0,
        y: 0
      },
      controlledPosition: {
        x: -400,
        y: 200
      }
    };

    this.getMarkdownText = this.getMarkdownText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.autoBoxChange = this.autoBoxChange.bind(this);
    this.findCursorPosition = this.findCursorPosition.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.boldButtonClick = this.boldButtonClick.bind(this);
    this.italicButtonClick = this.italicButtonClick.bind(this);
    this.strikeButtonClick = this.strikeButtonClick.bind(this);
    this.linkButtonClick = this.linkButtonClick.bind(this);
    this.handleChangeHeader = this.handleChangeHeader.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.headerEnter = this.headerEnter.bind(this);
    this.quoteButtonClick = this.quoteButtonClick.bind(this);
    this.imageButtonClick = this.imageButtonClick.bind(this);
    this.ulButtonClick = this.ulButtonClick.bind(this);
    this.olButtonClick = this.olButtonClick.bind(this);
    this.dropBtoggleOpen = this.dropBtoggleOpen.bind(this);
    this.columnsChange = this.columnsChange.bind(this);
    this.rowsChange = this.rowsChange.bind(this);
    this.tableEnter = this.tableEnter.bind(this);
    this.eventLogger = this.eventLogger.bind(this);
  }

  eventLogger(e: MouseEvent, data: Object) {
    console.log("Event: ", e);
    console.log("Data: ", data);
  }

  //renders raw markup as html using the marked.js library
  getMarkdownText() {
    var rawMarkup = marked(this.state.input, { sanitize: true, gfm: true });
    return { __html: rawMarkup };
  }

  //finds cursor position in text field

  componentDidMount() {
    this.setState({
      textBeforeCursorPosition: this.state.input.substring(
        0,
        this.state.cursorPosition
      )
    });
    this.setState({
      textAfterCursorPosition: this.state.input.substring(
        this.state.cursorPosition,
        this.state.input.length
      )
    });
  }

  findCursorPosition(e) {
    let cursorPosition = e.target.selectionStart;

    //this.setState({ cursorPosition: e.target.selectionStart });

    this.setState({
      textBeforeCursorPosition: e.target.value.substring(0, cursorPosition)
    });
    this.setState({
      textAfterCursorPosition: e.target.value.substring(
        cursorPosition,
        e.target.value.length
      )
    });
    console.log(cursorPosition);
  }

  //sets this.state.input when the input of the editor is changed
  handleChange(event) {
    this.setState({
      input: event.target.value
    });
    this.findCursorPosition(event);
  }
  //updates text-area after inserting new text at cursor
  /*handleChange(event) {
    this.setState({ newText: event.target.value });
    console.log(this.state.newText);
  } */

  autoBoxChange(event) {
    event.persist();
    this.setState({ lastEnteredText: event.target.value });
    this.setState(state => ({
      preInput:
        state.textBeforeCursorPosition +
        this.state.lastEnteredText +
        state.textAfterCursorPosition
    }));
    //console.log(this.state.preInput);

    //console.log(this.state.lastEnteredText);
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState(state => ({
      preInput:
        state.textBeforeCursorPosition +
        this.state.lastEnteredText +
        state.textAfterCursorPosition
    }));

    this.setState(state => ({ input: state.preInput }));
    this.setState(state => ({
      textAfterCursorPosition:
        state.lastEnteredText + state.textAfterCursorPosition
    }));
    this.setState(state => ({ lastEnteredText: "" }));

    console.log(this.state.lastEnteredText);
    console.log(this.state.preInput);

    document.getElementById("text-box").value = "";
  }

  //the below functions handle clicks of the buttons in the markown automator

  boldButtonClick() {
    this.setState(state => ({
      lastEnteredText: "**" + state.lastEnteredText + "**"
    }));
  }

  italicButtonClick() {
    this.setState(state => ({
      lastEnteredText: "_" + state.lastEnteredText + "_"
    }));
  }

  strikeButtonClick() {
    this.setState(state => ({
      lastEnteredText: "~~" + state.lastEnteredText + "~~"
    }));
  }

  linkButtonClick() {
    this.setState(state => ({
      lastEnteredText: "[link name here](https://(link address here))"
    }));
  }

  handleChangeHeader(event) {
    event.persist();
    this.setState(state => ({
      headerType: event.target.value
    }));
  }

  toggleOpen() {
    this.setState(state => ({
      dropdownOpen: !state.dropdownOpen
    }));
  }

  dropBtoggleOpen() {
    this.setState(state => ({
      dropBopen: !state.dropBopen
    }));
  }

  headerEnter() {
    if (this.state.headerType == "H1") {
      this.setState(state => ({
        lastEnteredText: "# " + state.lastEnteredText
      }));
    } else if (this.state.headerType == "H2") {
      this.setState(state => ({
        lastEnteredText: "## " + state.lastEnteredText
      }));
    } else if (this.state.headerType == "H3") {
      this.setState(state => ({
        lastEnteredText: "### " + state.lastEnteredText
      }));
    }
  }

  quoteButtonClick() {
    this.setState(state => ({
      lastEnteredText: "> " + state.lastEnteredText
    }));
  }

  imageButtonClick() {
    this.setState(state => ({
      lastEnteredText: "![file name here](https://image address)"
    }));
  }

  ulButtonClick() {
    this.setState(state => ({
      lastEnteredText: "- " + state.lastEnteredText
    }));
  }

  olButtonClick() {
    this.setState(state => ({
      lastEnteredText: "1. " + state.lastEnteredText
    }));
  }

  columnsChange(event) {
    event.persist();
    this.setState(state => ({
      columns: event.target.value
    }));
  }

  rowsChange(event) {
    event.persist();
    this.setState(state => ({
      rows: event.target.value
    }));
  }

  tableEnter() {
    const headerUnit = "|some text";
    const dividerUnit = "|-";
    const cellUnit = "|cell data";

    this.setState(state => ({
      lastEnteredText:
        headerUnit.repeat(this.state.columns) +
        "\n" +
        dividerUnit.repeat(this.state.columns) +
        "\n" +
        (cellUnit.repeat(this.state.columns) + "\n").repeat(this.state.rows - 1)
    }));
  }

  //methods for draggable

  handleDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY
      }
    });
  };

  onStart = () => {
    this.setState({ activeDrags: ++this.state.activeDrags });
  };

  onStop = () => {
    this.setState({ activeDrags: --this.state.activeDrags });
  };

  // For controlled component
  adjustXPos = e => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = this.state.controlledPosition;
    this.setState({ controlledPosition: { x: x - 10, y } });
  };

  adjustYPos = e => {
    e.preventDefault();
    e.stopPropagation();
    const { controlledPosition } = this.state;
    const { x, y } = controlledPosition;
    this.setState({ controlledPosition: { x, y: y - 10 } });
  };

  onControlledDrag = (e, position) => {
    const { x, y } = position;
    this.setState({ controlledPosition: { x, y } });
  };

  onControlledDragStop = (e, position) => {
    this.onControlledDrag(e, position);
    this.onStop();
  };

  render() {
    //sets options within marked.js such as telling marked.js to highlight code blocks
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function(code) {
        return require("highlight.js").highlightAuto(code).value;
      },
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    });

    return (
      <div id="app">
        <div id="nav-bar">
          <img
            id="logo"
            src="https://freecodecampassets.s3.us-east-2.amazonaws.com/MarkupAssets/SVG+Blue+Markdown+Lucid+LogoAsset+9.svg"
          />
          <img
            id="lucid-title"
            src="https://freecodecampassets.s3.us-east-2.amazonaws.com/MarkupAssets/SVG+Blue+Markdown+Lucid+NameAsset+8.svg"
          />
        </div>
        <div id="instructions-wrapper">
          <div id="instructions-title">Instructions</div>
          <textarea id="instructions">
            Click inside the editor and type your markdown text or enter text in
            the markdown automator below and style with buttons - then click
            ENTER to insert text in the editor. (Make sure you set the cursor in
            the editor to the position where you want to insert your text)
          </textarea>
        </div>
        <img
          id="scroll-down"
          src="https://freecodecampassets.s3.us-east-2.amazonaws.com/Portfolio+Assets+1/2smaller+blue+black+mouseAsset+5.svg"
        ></img>
        <div id="edit-and-preview-wrapper">
          <div id="editor-wrapper">
            <div id="editor-title">Editor</div>
            <textarea
              id="editor"
              onChange={this.handleChange}
              value={this.state.input}
              onClick={this.findCursorPosition}
            ></textarea>
          </div>
          <div id="preview-wrapper">
            <div id="preview-title">Preview</div>
            <div
              id="preview"
              dangerouslySetInnerHTML={this.getMarkdownText()}
            ></div>
          </div>
        </div>
        <footer>
          <Automator
            autoBoxChange={this.autoBoxChange}
            onSubmit={this.onSubmit}
            lastEnteredText={this.state.lastEnteredText}
            boldButtonClick={this.boldButtonClick}
            italicButtonClick={this.italicButtonClick}
            strikeButtonClick={this.strikeButtonClick}
            linkButtonClick={this.linkButtonClick}
            headerValue={this.state.headerValue}
            handleChangeHeader={this.handleChangeHeader}
            dropdownOpen={this.state.dropdownOpen}
            toggleOpen={this.toggleOpen}
            headerEnter={this.headerEnter}
            quoteButtonClick={this.quoteButtonClick}
            imageButtonClick={this.imageButtonClick}
            ulButtonClick={this.ulButtonClick}
            olButtonClick={this.olButtonClick}
            dropBopen={this.state.dropBopen}
            dropBtoggleOpen={this.dropBtoggleOpen}
            columnsChange={this.columnsChange}
            rowsChange={this.rowsChange}
            columns={this.state.columns}
            rows={this.state.rows}
            tableEnter={this.tableEnter}
          />
          <img
            id="arrow"
            src="https://freecodecampassets.s3.us-east-2.amazonaws.com/MarkupAssets/Asset+11.svg"
          />
          <div id="drag-me">
            Drag up the page <br />
            for easier use
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
