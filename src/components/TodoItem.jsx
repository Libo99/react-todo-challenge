import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';

const StyledTodoItem = styled.li`
  padding: 15px 0;
  list-style: none;

  button {
    background: ${({ theme }) => theme.lightGrey};
    border: 0;
    border-radius: 4px 4px 0 0;
    margin-right: 15px;
    padding: 10px;
    cursor: pointer;

    .fa-circle {
      font-size: 16px;
      color: ${({ theme }) => theme.darkerGrey};
      display: ${({ completed }) => completed && 'none'};
    }

    .fa-check-circle {
      color: ${({ theme, completed }) =>
        completed ? theme.completed : theme.darkestGrey};
      font-size: 16px;
      display: ${({ completed }) => (completed ? 'inline-block' : 'none')};
    }

    &:hover {
      background: ${({ theme }) => theme.darkerGrey};
      transition: 0.3s;

      .fa-circle {
        transition: 0.3s;
        display: none;
      }

      .fa-check-circle {
        display: inline-block;
      }
    }
  }

  input {
    font-size: 16px;
    color: ${({ theme }) => theme.darkestGrey};
    align-self: center;
    width: 100%;
    border: none;
    outline: none;
    background: ${({ theme }) => theme.backgroundColor};
    text-decoration: ${({ completed }) =>
      completed ? '2px line-through' : 'none'};
  }

  div {
    display: flex;
    flex-direction: row;
    border-bottom: 2px solid ${({ theme }) => theme.lightGrey};

    &:hover {
      border-color: ${({ theme }) => theme.darkerGrey};
      transition: 0.3s;

      button {
        background: ${({ theme }) => theme.darkerGrey};
        transition: 0.3s;
      }

      .fa-circle {
        color: ${({ theme }) => theme.lightGrey};
        transition: 0.3s;
      }
    }
  }
`;

const TodoItem = ({ deleteItem, item, editItem, completeItem }) => {
  const [value, setValue] = useState(item.todo || '');

  const editHandler = useCallback(
    debounce(async (originalItem, editedItemValue) => {
      await editItem(originalItem, editedItemValue);
    }, 500),
    []
  );

  useEffect(() => {
    if (value !== item.todo) {
      editHandler(item, value);
    }
  }, [item, value]);

  return (
    <StyledTodoItem completed={item.completed}>
      <div>
        <button type="button" onClick={() => completeItem(item)}>
          <FontAwesomeIcon className="fa-circle" icon={faCircle} />
          <FontAwesomeIcon className="fa-check-circle" icon={faCheckCircle} />
        </button>
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            editHandler();
          }}
        />
        <button
          className="delete"
          type="button"
          onClick={() => deleteItem(item)}
        >
          Delete
        </button>
        <img src={item.image} alt={item.todo} width={100} height={100} />
      </div>
    </StyledTodoItem>
  );
};

TodoItem.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired,
  item: PropTypes.shape({
    identifierKey: PropTypes.string,
    todo: PropTypes.string,
    completed: PropTypes.bool,
    image: PropTypes.string,
  }).isRequired,
};

export default TodoItem;
