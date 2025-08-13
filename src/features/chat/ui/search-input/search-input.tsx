import React, {useRef, useState} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
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
    <div>
      <InputGroup className="mb-2">
        <Form.Control
          type="text"
          id="searchChats"
          placeholder="Search chats..."
          value={query}
          onKeyDown={handleKeyDown}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          aria-describedby="searchHelpBlock"
        />

        {query && (
          <Button
            variant="outline-secondary"
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
          >
            <X />
          </Button>
        )}

        <Button variant="outline-secondary" onClick={handleSearch}>
          <Search />
        </Button>
      </InputGroup>
    </div>
  );
};
