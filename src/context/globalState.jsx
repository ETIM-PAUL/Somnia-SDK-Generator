// ContractContext.js
import React, { createContext, useReducer } from "react";

// Initial state
const initialState = {
  address: "",
  code: "",
  abi: [],
  size: 0,
  functions: [],
  events: [],
  name: "",
  auto_publish: false,
  selectedLanguages: [],
  analysis: {},
  config: {}
};

// Reducer function
const contractReducer = (state, action) => {
  switch (action.type) {
    case "SET_CONTRACT_DETAILS":
      return {
        ...state,
        ...action.payload,
      };
    case "RESET_CONTRACT_DETAILS":
      return initialState;
    case "SET_AUTO_PUBLISH": // Add new action type
      return {
      ...state,
      auto_publish: action.payload,
      };
    case "SET_SELECTED_LANGS": // Add new action type
      return {
        ...state,
        selectedLanguages: action.payload,
      };
    case "SET_CONFIG": // Add new action type
      return {
        ...state,
        config: action.payload,
      };
    default:
      return state;
  }
};

// Create the context
export const ContractContext = createContext();

// Context provider component
export const ContractProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contractReducer, initialState);

  return (
    <ContractContext.Provider value={{ state, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};
