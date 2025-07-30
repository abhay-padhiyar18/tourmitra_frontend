import React, { useEffect, useState, useCallback } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Reusable & memoized fetchUsers function
  const fetchUsers = useCallback(
    async (search = '') => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users?search=${search}`
        );
        setLoadedUsers(responseData.users);
      } catch (err) {}
    },
    [sendRequest] // ✅ useCallback dependency
  );

  // ✅ initial load
  useEffect(() => {
    fetchUsers(); // load all users
  }, [fetchUsers]);

  // ✅ live search
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchUsers(value); // filtered users
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="Search users by name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            width: '60%',
            maxWidth: '400px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
