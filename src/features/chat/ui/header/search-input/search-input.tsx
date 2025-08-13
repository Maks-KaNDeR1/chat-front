import React, {useState} from "react";
import {Form, InputGroup} from "react-bootstrap";
import {Search, X} from "react-bootstrap-icons";
import {SearchInputProps} from "./search-input.props";

export const SearchInput = ({onSearch}: SearchInputProps) => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <InputGroup className="mb-2">
      <Form.Control
        type="text"
        id="searchChats"
        placeholder="Search chats..."
        value={query}
        onKeyDown={handleKeyDown}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        aria-describedby="searchHelpBlock"
        className="rounded-start-pill"
      />

      {query && (
        <InputGroup.Text
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          style={{cursor: "pointer"}}
          className="rounded-0"
        >
          <X />
        </InputGroup.Text>
      )}

      <InputGroup.Text
        onClick={handleSearch}
        style={{cursor: "pointer"}}
        className="rounded-end-pill"
      >
        <Search />
      </InputGroup.Text>
    </InputGroup>
  );
};
