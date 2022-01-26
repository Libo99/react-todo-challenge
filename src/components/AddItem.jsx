import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import { newDate } from '../services/dateService';
import 'react-datepicker/dist/react-datepicker.css';

const StyledAddItem = styled.form`
  display: flex;
  margin-bottom: 40px;

  button {
    margin: 0;
    flex-basis: 0;
    flex-grow: 1;
    padding: 10px 15px;
    background: ${({ theme }) => theme.lightGrey};
    border: 0;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    outline: none;
    transition: 0.5s;

    .fa-plus {
      color: ${({ theme }) => theme.darkestGrey};
      font-size: 18px;
    }
  }

  input {
    transition: 0.5s;
    margin: 0;
    flex-basis: 0;
    flex-grow: 9;
    padding: 10px 15px;
    font-size: 16px;
    outline: none;
    border: 3px solid ${({ theme }) => theme.lightGrey};
    border-radius: 4px 0 0 4px;

    &:focus {
      border: 3px solid ${({ theme }) => theme.darkerGrey};

      & ~ button {
        background-color: ${({ theme }) => theme.darkerGrey};
      }
    }
  }
  .react-datepicker-popper {
    z-index: 2;
  }
`;

const AddItem = ({ addItem }) => {
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState(newDate());

  return (
    <StyledAddItem
      onSubmit={(event) => {
        event.preventDefault();
        addItem(value, startDate);
        setValue('');
        setStartDate(newDate());
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        placeholder="New todo..."
        required
      />
      <DatePicker
        onChange={(e) => setStartDate(e)}
        minDate={newDate()}
        selected={startDate}
      />
      <button type="submit">
        <FontAwesomeIcon className="fa-plus" icon={faPlus} />
      </button>
    </StyledAddItem>
  );
};

AddItem.propTypes = {
  addItem: PropTypes.func.isRequired,
};

export default AddItem;
