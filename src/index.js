const {Component, createElement} = require('react');
const {render} = require('react-dom');

class App extends Component {
    render() {
        return createElement('div');
    }
}

render(new App(), document.getElementById('app'));