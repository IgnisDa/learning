import { gql } from '@urql/svelte';

export const createUser = gql`
	mutation createUser($username: String!, $email: String!, $password: String!) {
		createUser(userCreateInput: { username: $username, email: $email, password: $password }) {
			... on CreateUserError {
				usernameError
				passwordError
				emailError
				__typename
			}
		}
	}
`;
