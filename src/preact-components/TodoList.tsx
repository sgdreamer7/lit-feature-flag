
import { Component, JSX } from 'preact';
// import styles from '../styles.css';

type State = { todos: Array<string>, text: string };

export class TodoList extends Component {
  state: State = { todos: Array<string>(0), text: '' };

  private setText = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    this.setState({ text: (e.target as HTMLInputElement).value });
  };

  private addTodo = () => {
    let { todos, text } = this.state;
    todos.push(text);
    this.setState({ todos, text: '' });
  };

  render({ }, state: State) {
    return (
      <main>
        {/* <style>${styles}</style> */}
        <link rel="stylesheet" href="styles.css" />
        <div class="home-demo">
          <form onSubmit={this.addTodo} action="javascript:">
            <label>
              <span>Add Todo</span>
              <input value={state.text} onInput={this.setText} />
            </label>
            <button type="submit">Add</button>
            <ul>
              {state.todos.map(todo => (
                <li>{todo}</li>
              ))}
            </ul>
          </form>
        </div>
      </main>
    );
  }
}