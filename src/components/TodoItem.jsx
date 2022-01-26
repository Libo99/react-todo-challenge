import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import {
  formatDate,
  calculateDays,
  formatDueDate,
} from '../services/dateService';

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
  .date-display {
    border: none;
  }
  .date-container {
    justify-content: space-between;
  }
  .due-date {
    flex-direction: column;
    align-items: flex-start;
    color: ${({ due }) => (due <= 2 ? 'red' : 'black')};
  }

  .due-date p:last-child {
    margin-top: -10px;
    color: black;
  }
  p {
    font-size: 13px;
  }
`;

const TodoItem = ({ deleteItem, item, editItem, completeItem }) => {
  const [value, setValue] = useState(item.todo || '');
  const [difference, setDifference] = useState(0);

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

  useEffect(() => {
    calculateDays(setDifference, item.dueDate, item.date);
  }, []);

  return (
    <StyledTodoItem completed={item.completed} due={difference}>
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
      </div>
      <div className="date-display date-container">
        <p>Added: {formatDate(item, item.date)}</p>
        <div className="date-display due-date">
          <p>Days: {formatDueDate(difference)}</p>
          <p>Due: {formatDate(item, item.dueDate)}</p>
        </div>
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
    // eslint-disable-next-line react/forbid-prop-types
    date: PropTypes.any,
    // eslint-disable-next-line react/forbid-prop-types
    dueDate: PropTypes.any,
  }).isRequired,
};

export default TodoItem;
