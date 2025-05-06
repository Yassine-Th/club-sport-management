import React from 'react'
import { Container, Text, Title, Button } from '@mantine/core';
import { IconForbid } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Link, Navigate } from "react-router-dom";

export default function UnauthorizedPage() {
    const [redirect, setRedirect] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setRedirect(true);
      }, 5000);
      
      return () => clearTimeout(timer); // Clean up the timer
    }, []);
  return (
    <Container className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="mb-8">
        <IconForbid className="h-32 w-32 text-red-600 mx-auto" strokeWidth={1.5} />
      </div>

      <Title order={1} className="mb-4 text-3xl font-bold text-gray-900">
        403 - Unauthorized Access
      </Title>

      <Text className="mb-8 text-lg text-gray-600 max-w-xl mx-auto">
        You don't have permission to access this page. Please contact your administrator or 
        return to the homepage.
      </Text>

      {redirect ? (
        <Navigate to="/" replace />
      ) : (
        <Link to="/">
          <Button variant="default">Return to Homepage</Button>
        </Link>
      )}
    </Container>
  );
}