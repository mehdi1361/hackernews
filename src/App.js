import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = searchTerm => item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm:DEFAULT_QUERY,
    }
    this.helloWorld = "welcome to react js learned by mehdi";

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
  }

  onDismiss(id){
    const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState({
      result: {...this.state.result, hits: updatedHits }
    })    
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }

  setSearchTopStories(result){
    this.setState({result: result});
  }

  componentDidMount(){
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json()).then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  render() {
    const { searchTerm, result } = this.state;
    if (!result){ return null}

    return (
      <div className="App">
        <header className="App-header">
          <h2>{ this.helloWorld }</h2>
          <img src={logo} className="App-logo" alt="logo" />

          <Search value={ searchTerm } onChange={ this.onSearchChange } >
            search
          </Search>
          <Table list= { result.hits } pattern={ searchTerm } onDismiss= { this.onDismiss } />
            
        </header>
      </div>
    );
  }
}

class Search extends Component {
  render(){
    const { value, onChange, children } = this.props;

    return(
      <form>
          { children }
          <input type="text" onChange={ onChange } value={ value }/>
      </form>
  );}
}

class Table extends Component {
  render() {
    const { list, pattern , onDismiss} = this.props;

    return(
      <div>
        {   
            list.filter(isSearched(pattern)).map(item =>
              <div key={ item.objectID }>
                  <span>
                  <a href={ item.url }>{ item.title }</a>
                  </span>
                  <span>{ item.author }</span>
                  <span>{ item.num_comments }</span>
                  <span>{ item.points }</span>
                  <span>
                    <Button onClick = {() => onDismiss(item.objectID)}  className="text1">Dismiss</Button>
                  </span>
                </div>
            )
          }
      </div>
    );
  }
}

class Button extends Component {
  render(){
    const { onClick, className, children} = this.props

    return(
      <button onClick = { onClick } className= { className }  type="button">{ children }</button>
    )
  }
}
export default App;
