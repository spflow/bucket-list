import React from 'react';
import List from './List';
import 'whatwg-fetch';
import ReactDOM from 'react-dom';

class ListsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {lists:[], addListForm: false, newListTitle: ""}
    this.toggleEditAddList = this.toggleEditAddList.bind(this);
    this.addListEdit = this.addListEdit.bind(this);
    this.addListReg = this.addListReg.bind(this);
    this.titleChange = this.titleChange.bind(this);
    this.addNewListToDB = this.addNewListToDB.bind(this);
    this.addNewListToDOM = this.addNewListToDOM.bind(this);
    this.deleteListFromDOM = this.deleteListFromDOM.bind(this);
  }

  componentWillMount() {
    let bucketId = this.props.bucketId
    //using query instead of url params (see routes/lists for corresponding router)
    // fetch(`/lists?bucketId=${bucketId}`)
    fetch(`/lists/${bucketId}`)
    .then(function(res) {
      return res.json()
    }).then(function(lists) {
      this.setState({ lists })
    }.bind(this))

  }

  componentDidUpdate() {
    if(this.state.addListForm === true)
      ReactDOM.findDOMNode(this.refs.titleInput).focus()
  }

  addNewListToDB() {
    let title = this.state.newListTitle;
    let bucketId = this.props.bucketId;
    fetch('/lists', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title, bucketId})
    }).then(function(res) {
      return res.json();
    }).then(function(list) {
      this.addNewListToDOM(list);
      this.setState({newListTitle: "", addListForm: false});
    }.bind(this))
  }

  deleteListFromDOM(listId) {
    this.setState({lists: this.state.lists.filter(list => list._id !== listId)});
  }

  addNewListToDOM(list) {
    this.setState({lists: [...this.state.lists, list]});
  }

  toggleEditAddList() {
    this.setState({addListForm: !this.state.addListForm});
  }

  titleChange(e) {
    this.setState({newListTitle: e.target.value});
  }

  addListEdit(style) {
    return (
      <div className="col s12 m4 l3">
        <div style={style.card} id="addList" className="card grey lighten-4">
          <div style={style.titleInput} className="card-content">
            <input
              style={style.cardTitle}
              className="card-title grey-text text-darken-3"
              placeholder="List name..."
              onChange={this.titleChange}
              value={this.state.newListTitle}
              ref="titleInput"
            />
          </div>
          <div>
            <a style={style.editButtons} className="waves-effect btn-flat right-align" onClick={this.toggleEditAddList}>Cancel</a>
            <a style={style.editButtons} className="waves-effect btn-flat right-align" onClick={this.addNewListToDB}>Add</a>
          </div>
        </div>
      </div>
    )
  };

  addListReg(style) {
    return (
      <div className="col s12 m4 l3">
        <div style={style.card} id="addList" className="card" onClick={this.toggleEditAddList}>
          <div style={style.cardcontent} className="card-content">
            <p style={style.cardTitle} className="card-title amber-text text-lighten-2">Add a list...</p>
          </div>
        </div>
      </div>
    )
  };


  render() {
    let style = {
      card: {borderRadius: "5px", boxShadow: "none"},
      cardcontent: {padding: "10px 10px 0 10px"},
      titleInput: {padding: "5px 10px 0 10px"},
      cardTitle: {lineHeight: "1", fontSize: "18px", fontWeight: "400", height: "2rem"},
      bucketTitle: {margin: "10px 10px 0", fontSize: "24px"},
      editButtons: {padding: "0 .5rem"}
    };

    let lists = this.state.lists.map(list => (
      <List key={list._id} deleteListFromDOM={this.deleteListFromDOM} {...list} />
    ))

    return (
      <div className="row">
        <h2 style={style.bucketTitle} className="white-text">Travel</h2>

        {lists}

        {this.state.addListForm ? this.addListEdit(style) : this.addListReg(style)}

      </div>
    )
  }
}

export default ListsPage;
