export const loginSwaggerDoc = {
    tags: ['Auth'],
    summary: 'User login',
    description: 'Login a user with username and password.',
    requestBody: {
        description: 'User login credentials',
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', example: 'kolya003' },
                        password: { type: 'string', example: 'Password@01' }
                    },
                    required: ['username', 'password']
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Login successful',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            token: { type: 'string', description: 'Authentication token' }
                        }
                    }
                }
            }
        },
        400: {
            description: 'Bad Request - Missing or invalid parameters',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Error message' }
                        }
                    }
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid credentials',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Error message' }
                        }
                    }
                }
            }
        }
    },
    headers: {
        'nodex-user-origin': { description: 'Origin of the request', schema: { type: 'string', example: 'mobile' } },
        'nodex-access-key': { description: 'Access key for authentication', schema: { type: 'string', example: 'v7pb6wylg4m0xf0kx5zzoved' } },
        'nodex-secret-key': { description: 'Secret key for authentication', schema: { type: 'string', example: 'glrvdwi46mq00fg1oqtdx3rg' } }
    }
};

export const registerSwaggerDoc = {
    tags: ['Auth'],
    summary: 'User registration',
    description: 'Register a new user with email, username, and password.',
    requestBody: {
        description: 'User registration details',
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'kolya003@gmail.com' },
                        username: { type: 'string', example: 'kolya003' },
                        password: { type: 'string', example: 'Password@123' }
                    },
                    required: ['email', 'username', 'password']
                }
            }
        }
    },
    responses: {
        201: {
            description: 'Registration successful',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string', description: 'Success message' }
                        }
                    }
                }
            }
        },
        400: {
            description: 'Bad Request - Missing or invalid parameters',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Error message' }
                        }
                    }
                }
            }
        },
        401: {
            description: 'Conflict - User already exists',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Error message' }
                        }
                    }
                }
            }
        }
    },
    headers: {
        'nodex-user-origin': { description: 'Origin of the request', schema: { type: 'string', example: 'mobile' } },
        'nodex-access-key': { description: 'Access key for authentication', schema: { type: 'string', example: 'v7pb6wylg4m0xf0kx5zzoved' } },
        'nodex-secret-key': { description: 'Secret key for authentication', schema: { type: 'string', example: 'glrvdwi46mq00fg1oqtdx3rg' } }
    }
};

export const changePasswordSwaggerDoc = {
    tags: ['Auth'],
    summary: 'Change user password',
    description: 'Change the current password of the user to a new password.',
    requestBody: {
        description: 'Password change details',
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        currentPassword: { type: 'string', example: 'Password@123' },
                        newPassword: { type: 'string', example: 'Password@01' }
                    },
                    required: ['currentPassword', 'newPassword']
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Password change successful',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string', description: 'Success message' }
                        }
                    }
                }
            }
        },
        400: {
            description: 'Bad Request - Missing or invalid parameters',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Error message' }
                        }
                    }
                }
            }
        },
        401: {
            description: 'Unauthorized - Invalid credentials or token',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Error message' }
                        }
                    }
                }
            }
        },
        403: {
            description: 'Forbidden - Insufficient permissions',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Error message' }
                        }
                    }
                }
            }
        }
    },
    headers: {
        'nodex-user-origin': { description: 'Origin of the request', schema: { type: 'string', example: 'mobile' } },
        'Authorization': { description: 'Bearer token for authorization', schema: { type: 'string', example: 'Bearer {{client-access-token}}' } },
        'nodex-access-key': { description: 'Access key for authentication', schema: { type: 'string', example: 'v7pb6wylg4m0xf0kx5zzoved' } },
        'nodex-secret-key': { description: 'Secret key for authentication', schema: { type: 'string', example: 'glrvdwi46mq00fg1oqtdx3rg' } }
    }
};
