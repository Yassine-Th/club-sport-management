// src/pages/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import instance from '../helpers/axios'; // Your axios instance
import {
    Container,
    Paper,
    Title,
    TextInput,
    PasswordInput,
    Button,
    Stack,
    Alert, // Use Alert for status/general errors
} from '@mantine/core';
import { IconAt, IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState(null); // { email?: string[], password?: string[], general?: string[] }
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailFromQuery = queryParams.get('email');
        if (emailFromQuery) {
            setEmail(decodeURIComponent(emailFromQuery));
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        setErrors(null);

        try {
            const response = await instance.post('/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setStatus(response.data.status || 'Password reset successfully!');
            // Clear form potentially
            setPassword('');
            setPasswordConfirmation('');
            // Redirect after a delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            console.error("Reset Password Error:", error.response);
            if (error.response && error.response.status === 422) {
                // Convert Laravel errors { field: ['message'] } to { field: 'message' } for Mantine
                const formattedErrors = {};
                for (const field in error.response.data.errors) {
                    formattedErrors[field] = error.response.data.errors[field][0];
                }
                setErrors(formattedErrors);
            } else {
                // Generic error
                setErrors({ general: 'Failed to reset password. The link may be invalid or expired.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}> {/* Mantine container for centering */}
            <Paper withBorder shadow="md" p={30} radius="md" pos="relative"> {/* Card-like appearance */}
                {/* Optional: Full overlay loading indicator */}
                {/* <LoadingOverlay visible={loading} overlayBlur={2} /> */}

                <Title order={2} ta="center" mb="lg">
                    Reset Your Password
                </Title>

                {/* Success Message */}
                {status && (
                    <Alert icon={<IconCheck size="1rem" />} title="Success!" color="green" radius="md" mb="md">
                        {status}
                    </Alert>
                )}

                {/* General Error Message */}
                {errors?.general && (
                     <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red" radius="md" mb="md">
                        {errors.general}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack> {/* Mantine Stack for vertical spacing */}
                        <TextInput
                            label="Email"
                            placeholder="your@email.com" // Optional placeholder
                            required
                            readOnly // Keep it read-only as it comes from the link
                            value={email}
                            icon={<IconAt size="1rem" />}
                            error={errors?.email} // Display email validation error
                            // No onChange needed as it's read-only
                        />

                        <PasswordInput
                            label="New Password"
                            placeholder="Your new password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                            icon={<IconLock size="1rem" />}
                            error={errors?.password} // Display password validation error
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            placeholder="Confirm your new password"
                            required
                            value={passwordConfirmation}
                            onChange={(event) => setPasswordConfirmation(event.currentTarget.value)}
                            icon={<IconLock size="1rem" />}
                            // Confirmation error is usually part of the 'password' field validation in Laravel
                            // error={errors?.password_confirmation} // Usually not a separate error field from backend
                        />

                        <Button type="submit" fullWidth mt="xl" loading={loading}>
                            Reset Password
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}

export default ResetPassword;