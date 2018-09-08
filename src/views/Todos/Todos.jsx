import React from "react";

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";

const Todos = ({ firestore, firebase, todos }) => {
  return (
    <div>
      <button // <GoogleButton/> button can be used instead</div>
        onClick={() => firebase.login({ provider: "google", type: "popup" })}
      >
        Login With Google
      </button>
      <button onClick={() => firestore.get("todos")}>Get Todos</button>
      {!isLoaded(todos)
        ? "Loading"
        : isEmpty(todos)
          ? "Todo list is empty"
          : todos.map(todo => <div>{todo.a}</div>)}
    </div>
  );
};

export default compose(
  firestoreConnect(["todos"]), // or { collection: 'todos' }
  connect((state, props) => ({
    todos: state.firestore.ordered.todos
  }))
)(Todos);

// export default compose(
//   withFirestore,
//   connect(state => ({
//     todos: state.firestore.ordered.todos
//   }))
// )(Todos);
