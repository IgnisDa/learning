import { gql } from '@urql/svelte';

export const getAllCars = gql`
	query {
		cars {
			name
			year
			model
		}
	}
`;
