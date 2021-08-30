import { gql } from '@urql/svelte';

export const createUser = gql`
	mutation createUser($username: String!, $email: String!, $password: String!) {
		createUser(userCreateInput: { username: $username, email: $email, password: $password }) {
			... on CreateUserError {
				usernameErrors
				passwordErrors
				emailErrors
				__typename
			}
		}
	}
`;

export const refreshToken = gql`
	query {
		refreshToken {
			... on RefreshTokenError {
				message
			}
			... on RefreshToken {
				token
			}
		}
	}
`;

export const loginUser = gql`
	query($username: String!, $password: String!) {
		loginUser(LoginUserInput: { username: $username, password: $password }) {
			... on LoginResult {
				user {
					id
				}
				token
			}
			... on LoginError {
				message
			}
		}
	}
`;
