import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import TodoItem from './TodoItem';
import AddItem from './AddItem';

const StyledTodo = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-top: 40px;

  h1 {
    font-size: 50px;
    color: ${({ theme }) => theme.darkestGrey};
    text-align: center;
    padding: 10px;
    text-shadow: 2px 4px 3px rgba(0, 0, 0, 0.3);
    margin-top: 0;
    margin-bottom: 40px;
  }
`;

const StyledTodoList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 40px;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  button {
    padding: 5px;
  }
`;

const StyledFooter = styled.div`
  margin-bottom: 40px;
  margin-top: 20px;
  text-align: center;

  p {
    font-size: 12px;
    color: ${({ theme }) => theme.lightGrey};
  }
`;

const Todo = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    // Load from storage
    if (typeof Storage !== 'undefined') {
      // localStorage supported.
      const todos = JSON.parse(localStorage.getItem('todoItems'));
      if (todos) {
        setTodoItems(todos);
      }
    } else {
      // Using cookies here :(
      let todos = document.cookie;
      if (todos !== '') {
        todos = todos.split('; ');
        const decodedTodos = [];
        todos.forEach((item) => {
          const splitItem = item.split('=');
          decodedTodos.push({
            date: splitItem[0],
            todo: splitItem[1],
          });
        });
        setTodoItems(decodedTodos);
      }
    }
  }, []);

  useEffect(() => {
    // save to storage
    if (typeof Storage !== 'undefined') {
      // localStorage supported.
      localStorage.setItem('todoItems', JSON.stringify(todoItems));
    } else {
      // Using cookies here :(
      const todos = todoItems;
      todos.forEach((item) => {
        document.cookie = `${item.date}=${item.todo}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      });
    }
  }, [todoItems]);

  useEffect(() => {
    if (!todoItems.length) {
      setShowCompleted(false);
    }
  }, [todoItems, showCompleted]);

  const addItem = (item) => {
    const todos = todoItems;
    todos.push({ todo: item, date: new Date().getTime(), completed: false });
    setTodoItems([...todos]);
  };

  const deleteItem = (item) => {
    const todos = todoItems.filter((todoItem) => item !== todoItem);
    setTodoItems(todos);
  };

  const changeItemStatus = (item) => {
    const newItem = item;
    if (newItem.completed === false) {
      newItem.completed = true;
    } else {
      newItem.completed = false;
    }
  };

  const completeItem = (item) => {
    const todos = todoItems;
    const newTodo = todos.find((todoItem) => todoItem.date === item.date);
    changeItemStatus(newTodo);
    setTodoItems([...todos]);
  };

  const editItem = (item, value) => {
    const todos = todoItems;
    const editTodo = todos.find((todoItem) => todoItem.date === item.date);
    editTodo.todo = value;
    setTodoItems([...todos]);
  };

  return (
    <StyledTodo className="wrapper">
      <h1>todos.</h1>
      <AddItem addItem={addItem} />
      <StyledButtonWrapper>
        <button type="button" onClick={() => setShowCompleted(false)}>
          Active
        </button>
        <button type="button" onClick={() => setShowCompleted(true)}>
          Completed
        </button>
      </StyledButtonWrapper>
      <StyledTodoList>
        {showCompleted ? (
          <ul>
            {todoItems
              .sort((a, b) => b.date - a.date)
              .filter((item) => item.completed)
              .map((item) => (
                <TodoItem
                  item={item}
                  key={item.date}
                  deleteItem={deleteItem}
                  editItem={editItem}
                  completeItem={completeItem}
                />
              ))}
          </ul>
        ) : (
          <ul>
            {todoItems
              .sort((a, b) => b.date - a.date)
              .filter((item) => item.completed === false)
              .map((item) => (
                <TodoItem
                  item={item}
                  key={item.date}
                  deleteItem={deleteItem}
                  editItem={editItem}
                  completeItem={completeItem}
                />
              ))}
          </ul>
        )}
      </StyledTodoList>
      <StyledFooter>
        <p>A simple Todo app made with React.</p>
        <p>
          It&#39;s ok to close the browser, all items will be saved locally.
        </p>
        <p>
          If you use Private browsing or Incognito mode, the app will be unable
          to save changes.
        </p>
      </StyledFooter>
    </StyledTodo>
  );
};

export default Todo;
